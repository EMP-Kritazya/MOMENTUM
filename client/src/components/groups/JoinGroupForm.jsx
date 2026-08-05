import { useState } from "react";
import { Users } from "lucide-react";

export default function JoinGroupForm({ onJoin, isSubmitting }) {
  const [inviteCode, setInviteCode] = useState("");

  function handlePaste(event) {
    const pastedCode = event.clipboardData.getData("text");
    if (!pastedCode) return;

    event.preventDefault();
    setInviteCode(pastedCode.trim().toUpperCase().slice(0, 12));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedCode = inviteCode.trim().toUpperCase();
    if (!normalizedCode || isSubmitting) return;

    const joined = await onJoin(normalizedCode);
    if (joined) setInviteCode("");
  }

  return (
    <section className="rounded-2xl border border-dashed border-momentum-border p-8 text-center">
      <Users className="mx-auto text-momentum-muted" aria-hidden="true" />
      <h2 className="mt-3 font-bold text-white">Join another group</h2>
      <p className="mt-1 text-sm text-momentum-muted">
        Enter an invite code to join a group with friends or coworkers.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-5 flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <label className="sr-only" htmlFor="invite-code">
          Invite code
        </label>
        <input
          id="invite-code"
          name="inviteCode"
          type="text"
          value={inviteCode}
          onChange={(event) =>
            setInviteCode(event.target.value.toUpperCase())
          }
          onPaste={handlePaste}
          placeholder="Invite code..."
          maxLength={12}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="min-h-11 flex-1 rounded-xl border border-momentum-border bg-momentum-panel px-4 text-white outline-none focus:ring-2 focus:ring-momentum-lime"
        />
        <button
          type="submit"
          disabled={!inviteCode.trim() || isSubmitting}
          className="min-h-11 rounded-xl bg-momentum-lime px-5 font-bold text-[#11130d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Joining..." : "Join"}
        </button>
      </form>
    </section>
  );
}
