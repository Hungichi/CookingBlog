export default function FilterTabs({ options, value, onChange }) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
              active
                ? "border-[#222] bg-[#222] text-white"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}