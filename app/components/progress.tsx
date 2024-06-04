export default function Progress({ percentage }: { percentage: number }) {
  return (
    <div className="w-full rounded bg-gray-200">
      <div
        className="rounded bg-indigo-500 p-0.5 text-center text-xs leading-none"
        style={{ width: `${percentage}%` }}
      >
        {percentage}%
      </div>
    </div>
  );
}
