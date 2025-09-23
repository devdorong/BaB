import { RiStarFill, RiStarLine } from 'react-icons/ri';

export function StarScore({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[15px]">{label}</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const n = i + 1;
          const Active = n <= value;
          const Icon = Active ? RiStarFill : RiStarLine;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="p-1"
              aria-label={`${label} ${n}점`}
            >
              <Icon
                className={Active ? 'text-yellow-400 text-[20px]' : 'text-babgray-300 text-[20px]'}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
