import { pool } from "../config/database.js";

// GET /api/groups
export const getGroups = async (req, res) => {
  const { user_id } = req.query;
  try {
    let results;
    if (user_id) {
      results = await pool.query(
        `SELECT g.*
         FROM groupmembers gm
         JOIN accountabilitygroups g ON g.group_id = gm.group_id
         WHERE gm.user_id = $1
         ORDER BY g.group_id`,
        [user_id],
      );
    } else {
      results = await pool.query(
        "SELECT * FROM accountabilitygroups ORDER BY group_id",
      );
    }
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/groups/:groupId
export const getIndividualGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM accountabilitygroups WHERE group_id = $1",
      [groupId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/groups/:groupId/members
export const getGroupMembers = async (req, res) => {
  const { groupId } = req.params;
  try {
    const results = await pool.query(
      `SELECT u.user_id,
              u.username,
              u.first_name,
              u.last_name,
              gm.is_admin,
              gm.current_streak,
              gm.joined_at
       FROM groupmembers gm
       JOIN users u ON u.user_id = gm.user_id
       WHERE gm.group_id = $1
       ORDER BY gm.joined_at ASC`,
      [groupId],
    );
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/groups
// Creating a group is basically TWO writes:
//   1. insert the group
//   2. add the creator as its first member (and admin)
export const createGroup = async (req, res) => {
  const { group_name, description, created_by_user_id } = req.body;

  if (!group_name || !created_by_user_id) {
    return res
      .status(400)
      .json({ message: "group_name and created_by_user_id are required" });
  }

  const client = await pool.connect(); // we create one dedicated connection for the txn
  try {
    await client.query("BEGIN");

    const groupResult = await client.query(
      `INSERT INTO accountabilitygroups (group_name, description, created_by_user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [group_name, description, created_by_user_id],
    );
    const group = groupResult.rows[0];

    // Creator joins their own group as admin.
    await client.query(
      `INSERT INTO groupmembers (group_id, user_id, is_admin)
       VALUES ($1, $2, TRUE)`,
      [group.group_id, created_by_user_id],
    );

    await client.query("COMMIT");
    res.status(201).json(group);
  } catch (error) {
    await client.query("ROLLBACK"); // undo both writes on any failure
    if (error.code === "23503") {
      return res
        .status(400)
        .json({ message: "created_by_user_id does not exist" });
    }
    res.status(500).json({ error: error.message });
  } finally {
    client.release(); // ALWAYS return the connection to the pool
  }
};

// PATCH /api/groups/:groupId
export const updateGroup = async (req, res) => {
  const { groupId } = req.params;
  const { group_name, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE accountabilitygroups
       SET group_name  = COALESCE($1, group_name),
           description = COALESCE($2, description)
       WHERE group_id = $3
       RETURNING *`,
      [group_name, description, groupId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/groups/:groupId
export const deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM accountabilitygroups WHERE group_id = $1 RETURNING *",
      [groupId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.status(200).json({ message: "Group deleted", group: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/groups/:groupId/members   body: { user_id }
export const joinGroup = async (req, res) => {
  const { groupId } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO groupmembers (group_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [groupId, user_id],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // FK: group or user doesn't exist.
    if (error.code === "23503") {
      return res.status(400).json({ message: "group or user does not exist" });
    }
    // UNIQUE(group_id, user_id): already a member.
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ message: "User is already a member of this group" });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/groups/:groupId/members/:userId
export const leaveGroup = async (req, res) => {
  const { groupId, userId } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM groupmembers
       WHERE group_id = $1 AND user_id = $2
       RETURNING *`,
      [groupId, userId],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not a member of this group" });
    }
    res.status(200).json({ message: "Left group", membership: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
