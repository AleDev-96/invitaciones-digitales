import { getCountdown } from '../domain/countdown';
import { useNow } from './useNow';

export type CountdownLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  arrived: string;
};

export function Countdown({ eventAt, labels }: { eventAt: string; labels: CountdownLabels }) {
  const now = useNow(1000);
  const remaining = getCountdown(eventAt, now);

  if (!remaining) {
    return (
      <p className="font-(family-name:--font-script) text-4xl text-(--color-dusty-blue)">
        {labels.arrived}
      </p>
    );
  }

  const units = [
    [remaining.days, labels.days],
    [remaining.hours, labels.hours],
    [remaining.minutes, labels.minutes],
    [remaining.seconds, labels.seconds],
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-2" role="timer" aria-live="off">
      {units.map(([value, label]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-(family-name:--font-display) text-4xl text-(--color-sage-dark) lining-nums tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-xs tracking-wide text-(--color-muted) uppercase">{label}</span>
        </div>
      ))}
    </div>
  );
}
