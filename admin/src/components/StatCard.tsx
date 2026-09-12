export default function StatCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-navy-800/25 bg-white px-6 py-5">
      <p className="text-4xl font-extrabold text-navy-800">{value}</p>
      <p className="mt-1 text-sm font-medium text-navy-800/70">{label}</p>
    </div>
  );
}
