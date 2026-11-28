const styles = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-600",
  gray: "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ color = "gray", children }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${styles[color]}`}
    >
      {children}
    </span>
  );
}