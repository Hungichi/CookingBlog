export default function StatCard({ title, value, change, icon: Icon, iconClass }) {
  const positive = change >= 0;

  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon />
        </div>
      </div>

      <p className="mt-3 text-3xl font-semibold">{value.toLocaleString("en-US")}</p>

      <p className={`mt-2 text-xs ${positive ? "text-green-700" : "text-red-600"}`}>
        {positive ? "+" : ""}
        {change}% from last month
      </p>
    </div>
  );
}