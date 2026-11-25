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

const CLOCK = /^([01]\d|2[0-3]):[0-5]\d$/;

function formatParts(
  eventAt: Date,
  options: Intl.DateTimeFormatOptions,
  endTime: string | null,
): EventDateParts {
  const parts = new Intl.DateTimeFormat('es-AR', options).formatToParts(eventAt);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';
  const zone = part('timeZoneName');
  const start = `${part('hour')}:${part('minute')}`;
  const time = endTime && CLOCK.test(endTime) ? `De ${start} a ${endTime} h` : `${start} h`;
  return {
    weekday: part('weekday'),
    month: part('month'),
    day: part('day'),
    year: part('year'),
    time: zone ? `${time} (${zone})` : time,
  };
}

export function getEventDateParts(
  eventAt: string,
  timezone: string,
  endTime: string | null = null,
): EventDateParts {
  const date = new Date(eventAt);
  try {
    return formatParts(date, { ...DATE_OPTIONS, timeZone: timezone }, endTime);
  } catch {
    return formatParts(date, { ...DATE_OPTIONS, timeZoneName: 'short' }, endTime);
  }
}
