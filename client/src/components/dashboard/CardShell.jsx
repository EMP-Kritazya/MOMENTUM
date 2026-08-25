// Shared card wrapper so loading/error/ready states keep the same frame.
export function CardShell({ children }) {
  return (
    <section className="relative overflow-hidden border rounded-3xl border-[#3B4627] bg-[#12151E] px-3 py-4 sm:p-8">
      <div className="relative">{children}</div>
    </section>
  );
}
