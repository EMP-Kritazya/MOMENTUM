import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  createGroup,
  getGroupMembers,
  getUserGroups,
  joinGroup,
  leaveGroup,
} from "../api/groupsApi.js";
import CreateGroupModal from "../components/groups/CreateGroupModal.jsx";
import GroupCard from "../components/groups/GroupCard.jsx";
import JoinGroupForm from "../components/groups/JoinGroupForm.jsx";
import { useAuth } from "../context/authContext.js";

export default function WorkoutGroups() {
  const { user, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadGroups = useCallback(
    async (signal) => {
      if (!user?.user_id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const groupRows = await getUserGroups(signal);
        const groupsWithMembers = await Promise.all(
          groupRows.map(async (group) => ({
            ...group,
            members: await getGroupMembers(group.group_id, signal),
          })),
        );

        setGroups(groupsWithMembers);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [user?.user_id],
  );

  useEffect(() => {
    const controller = new AbortController();
    loadGroups(controller.signal);
    return () => controller.abort();
  }, [loadGroups]);

  async function handleCreate(values) {
    if (!user || isCreating) return false;

    setIsCreating(true);
    setError("");

    try {
      await createGroup(values);
      await loadGroups();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsCreating(false);
    }
  }

  async function handleJoin(inviteCode) {
    if (!user || isJoining) return false;

    setIsJoining(true);
    setError("");

    try {
      await joinGroup({ invite_code: inviteCode });
      await loadGroups();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsJoining(false);
    }
  }

  async function handleLeave(groupId) {
    if (!user) return;

    const confirmed = window.confirm("Leave this accountability group?");
    if (!confirmed) return;

    try {
      await leaveGroup(groupId);
      await loadGroups();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (authLoading) {
    return <p className="p-6 text-momentum-muted">Loading account...</p>;
  }

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-4xl text-white">
          Accountability Groups
        </h1>
        <p className="mt-6 rounded-2xl border border-momentum-border bg-momentum-panel p-6 text-momentum-muted">
          Complete onboarding before joining accountability groups.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-4xl text-white sm:text-5xl">
            Accountability Groups
          </h1>
          <p className="mt-2 text-momentum-muted">
            Small groups. Big commitment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-momentum-lime px-5 font-bold text-[#11130d]"
        >
          <Plus size={18} aria-hidden="true" />
          New Group
        </button>
      </header>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-red-300"
        >
          {error}
        </p>
      )}

      {loading && (
        <p className="mt-8 text-momentum-muted" role="status">
          Loading accountability groups…
        </p>
      )}

      {!loading && (
        <div className="mt-8 space-y-5">
          {groups.map((group) => (
            <GroupCard
              key={group.group_id}
              group={group}
              currentUserId={user.user_id}
              onLeave={handleLeave}
            />
          ))}

          {groups.length === 0 && (
            <div className="rounded-2xl border border-momentum-border bg-momentum-panel p-8 text-center">
              <h2 className="font-display text-2xl text-white">
                No groups yet
              </h2>
              <p className="mt-2 text-momentum-muted">
                Create a group or join one with an invite code.
              </p>
            </div>
          )}

          <JoinGroupForm onJoin={handleJoin} isSubmitting={isJoining} />
        </div>
      )}

      <CreateGroupModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
        isSubmitting={isCreating}
      />
    </section>
  );
}
