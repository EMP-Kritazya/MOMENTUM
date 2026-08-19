import { randomBytes } from "node:crypto";
import { pool } from "../config/database.js";
import { todayInTimeZone, toISODate } from "./workoutSessions.js";

function createInviteCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}

function parseGroupId(value) {
  const groupId = Number.parseInt(value, 10);
  return Number.isInteger(groupId) && groupId > 0 ? groupId : null;
}

async function findMembership(groupId, userId) {
  const result = await pool.query(
    `SELECT is_admin
     FROM groupmembers
     WHERE group_id = $1 AND user_id = $2
     LIMIT 1`,
    [groupId, userId],
  );
  return result.rows[0] ?? null;
}

// Group ownership is based only on the original creator, never Users.role.
async function findGroupOwnership(groupId, userId) {
  const result = await pool.query(
    `SELECT created_by_user_id,
            (created_by_user_id = $2) AS is_creator
       FROM accountabilitygroups
      WHERE group_id = $1
      LIMIT 1`,
    [groupId, userId],
  );

  return result.rows[0] ?? null;
}

// GET /api/groups
export async function getGroups(req, res) {
  const userId = req.auth.userId;

  try {
    const result = await pool.query(
      `SELECT g.group_id,
              g.group_name,
              g.description,
              g.invite_code,
              g.created_by_user_id,
              g.current_streak,
              (g.created_by_user_id = $1) AS current_user_is_creator
       FROM groupmembers gm
       JOIN accountabilitygroups g
         ON g.group_id = gm.group_id
       WHERE gm.user_id = $1
       ORDER BY g.group_id`,
      [userId],
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Unable to load groups:", error);
    return res.status(500).json({ message: "Unable to load groups" });
  }
}

// GET /api/groups/:groupId
export async function getIndividualGroup(req, res) {
  const groupId = parseGroupId(req.params.groupId);
  if (!groupId) {
    return res.status(400).json({ message: "A valid group ID is required" });
  }

  try {
    const membership = await findMembership(groupId, req.auth.userId);
    if (!membership) {
      return res.status(403).json({ message: "Group membership required" });
    }

    const result = await pool.query(
      `SELECT group_id, group_name, description, invite_code,
              created_by_user_id, current_streak,
              (created_by_user_id = $2) AS current_user_is_creator
       FROM accountabilitygroups
       WHERE group_id = $1`,
      [groupId, req.auth.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Unable to load group:", error);
    return res.status(500).json({ message: "Unable to load group" });
  }
}

// GET /api/groups/:groupId/members
export async function getGroupMembers(req, res) {
  const groupId = parseGroupId(req.params.groupId);
  if (!groupId) {
    return res.status(400).json({ message: "A valid group ID is required" });
  }

  try {
    const membership = await findMembership(groupId, req.auth.userId);
    if (!membership) {
      return res.status(403).json({ message: "Group membership required" });
    }

    const todayISO = toISODate(todayInTimeZone(req.timeZone));

    const result = await pool.query(
      `SELECT u.user_id,
              u.username,
              u.firstname,
              u.lastname,
              gm.is_admin,
              u.current_streak,
              gm.joined_at,
              CASE
                WHEN EXISTS (
                  SELECT 1
                  FROM workoutsessions ws
                  WHERE ws.user_id = u.user_id
                    AND ws.date = $2
                    AND ws.completed = TRUE
                ) THEN 'done'
                ELSE 'pending'
              END AS daily_status
       FROM groupmembers gm
       JOIN users u ON u.user_id = gm.user_id
       WHERE gm.group_id = $1
       ORDER BY gm.joined_at, gm.member_id`,
      [groupId, todayISO],
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Unable to load group members:", error);
    return res.status(500).json({ message: "Unable to load group members" });
  }
}

// POST /api/groups
export async function createGroup(req, res) {
  const groupName = req.body.group_name?.trim();
  const description = req.body.description?.trim() || null;
  const creatorId = req.auth.userId;

  if (!groupName) {
    return res.status(400).json({ message: "group_name is required" });
  }
  if (groupName.length > 100) {
    return res.status(400).json({
      message: "Group name must be 100 characters or fewer",
    });
  }
  if (description && description.length > 500) {
    return res.status(400).json({
      message: "Description must be 500 characters or fewer",
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const inviteCode = createInviteCode();
    const groupResult = await client.query(
      `INSERT INTO accountabilitygroups
        (group_name, description, invite_code, created_by_user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [groupName, description, inviteCode, creatorId],
    );
    const group = groupResult.rows[0];

    await client.query(
      `INSERT INTO groupmembers (group_id, user_id, is_admin)
       VALUES ($1, $2, TRUE)`,
      [group.group_id, creatorId],
    );
    await client.query("COMMIT");
    return res.status(201).json(group);
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ message: "Please try creating the group again" });
    }
    console.error("Unable to create group:", error);
    return res.status(500).json({ message: "Unable to create group" });
  } finally {
    client.release();
  }
}

// POST /api/groups/join
export async function joinGroupByInviteCode(req, res) {
  const inviteCode = req.body.invite_code?.trim().toUpperCase();
  if (!inviteCode) {
    return res.status(400).json({ message: "invite_code is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO groupmembers (group_id, user_id)
       SELECT group_id, $2
       FROM accountabilitygroups
       WHERE invite_code = $1
       RETURNING *`,
      [inviteCode, req.auth.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Invite code not found" });
    }
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ message: "You are already a member of this group" });
    }
    console.error("Unable to join group:", error);
    return res.status(500).json({ message: "Unable to join group" });
  }
}

// PATCH /api/groups/:groupId
export async function updateGroup(req, res) {
  const groupId = parseGroupId(req.params.groupId);
  if (!groupId) {
    return res.status(400).json({ message: "A valid group ID is required" });
  }

  const hasGroupName = Object.prototype.hasOwnProperty.call(
    req.body,
    "group_name",
  );
  const hasDescription = Object.prototype.hasOwnProperty.call(
    req.body,
    "description",
  );
  if (!hasGroupName && !hasDescription) {
    return res.status(400).json({
      message: "Provide group_name or description",
    });
  }

  const groupName = hasGroupName
    ? String(req.body.group_name ?? "").trim()
    : null;
  const description = hasDescription
    ? String(req.body.description ?? "").trim() || null
    : null;

  if (hasGroupName && !groupName) {
    return res.status(400).json({ message: "Group name is required" });
  }
  if (groupName && groupName.length > 100) {
    return res.status(400).json({
      message: "Group name must be 100 characters or fewer",
    });
  }
  if (description && description.length > 500) {
    return res.status(400).json({
      message: "Description must be 500 characters or fewer",
    });
  }

  try {
    const ownership = await findGroupOwnership(groupId, req.auth.userId);
    if (!ownership) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!ownership.is_creator) {
      return res.status(403).json({
        message: "Only the group creator can edit this group",
      });
    }

    const result = await pool.query(
      `UPDATE accountabilitygroups
          SET group_name = CASE
                WHEN $1::boolean THEN $2
                ELSE group_name
              END,
              description = CASE
                WHEN $3::boolean THEN $4
                ELSE description
              END
        WHERE group_id = $5
          AND created_by_user_id = $6
        RETURNING *`,
      [
        hasGroupName,
        groupName,
        hasDescription,
        description,
        groupId,
        req.auth.userId,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Unable to update group:", error);
    return res.status(500).json({ message: "Unable to update group" });
  }
}

// DELETE /api/groups/:groupId
export async function deleteGroup(req, res) {
  const groupId = parseGroupId(req.params.groupId);
  if (!groupId) {
    return res.status(400).json({ message: "A valid group ID is required" });
  }

  try {
    const ownership = await findGroupOwnership(groupId, req.auth.userId);
    if (!ownership) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!ownership.is_creator) {
      return res.status(403).json({
        message: "Only the group creator can delete this group",
      });
    }

    const result = await pool.query(
      `DELETE FROM accountabilitygroups
        WHERE group_id = $1
          AND created_by_user_id = $2
        RETURNING *`,
      [groupId, req.auth.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res
      .status(200)
      .json({ message: "Group deleted", group: result.rows[0] });
  } catch (error) {
    console.error("Unable to delete group:", error);
    return res.status(500).json({ message: "Unable to delete group" });
  }
}

// DELETE /api/groups/:groupId/members/me
export async function leaveGroup(req, res) {
  const groupId = parseGroupId(req.params.groupId);
  if (!groupId) {
    return res.status(400).json({ message: "A valid group ID is required" });
  }

  try {
    const ownership = await findGroupOwnership(groupId, req.auth.userId);
    if (!ownership) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (ownership.is_creator) {
      return res.status(409).json({
        message: "The group creator cannot leave. Delete the group instead.",
      });
    }

    const result = await pool.query(
      `DELETE FROM groupmembers
       WHERE group_id = $1 AND user_id = $2
       RETURNING *`,
      [groupId, req.auth.userId],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "You are not a member of this group" });
    }
    return res
      .status(200)
      .json({ message: "Left group", membership: result.rows[0] });
  } catch (error) {
    console.error("Unable to leave group:", error);
    return res.status(500).json({ message: "Unable to leave group" });
  }
}
