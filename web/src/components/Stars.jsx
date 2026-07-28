import { StarIcon } from "@heroicons/react/24/solid";

// Read-only display, or interactive when onChange is passed.
export default function Stars({ value = 0, onChange, size = "h-5 w-5" }) {
  const interactive = typeof onChange === "function";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const star = (
          <StarIcon className={`${size} ${filled ? "text-warning" : "text-line"}`} />
        );
        return interactive ? (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            className="rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
