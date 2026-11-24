export type EventDateParts = {
  weekday: string;
  month: string;
  day: string;
  year: string;
  time: string;
};

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
};

function formatParts(eventAt: Date, options: Intl.DateTimeFormatOptions): EventDateParts {
  const parts = new Intl.DateTimeFormat('es-AR', options).formatToParts(eventAt);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';
  const zone = part('timeZoneName');
  const time = `${part('hour')}:${part('minute')} h`;
  return {
    weekday: part('weekday'),
    month: part('month'),
    day: part('day'),
    year: part('year'),
    time: zone ? `${time} (${zone})` : time,
  };
}

export function getEventDateParts(eventAt: string, timezone: string): EventDateParts {
  const date = new Date(eventAt);
  try {
    return formatParts(date, { ...DATE_OPTIONS, timeZone: timezone });
  } catch {
    return formatParts(date, { ...DATE_OPTIONS, timeZoneName: 'short' });
  }
}
