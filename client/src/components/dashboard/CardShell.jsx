// Shared card wrapper so loading/error/ready states keep the same frame.
export function CardShell({ children }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#3B4627] bg-[#12151E] p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-82 w-92 rounded-full bg-[#273410] blur-3xl"
      />
      <div className="relative">{children}</div>
    </section>
  );
}
