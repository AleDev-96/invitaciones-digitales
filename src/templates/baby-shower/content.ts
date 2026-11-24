import { readSection, readText, readTextList, type Content } from '../../domain/content';

export type BabyShowerContent = {
  babyName: string | null;
  hosts: string | null;
  message: string | null;
  closing: string | null;
  location: {
    address: string | null;
    mapsUrl: string | null;
    notes: string[];
  };
  rsvp: {
    closedMessage: string | null;
    contactMessage: string | null;
  };
};

export function readBabyShowerContent(content: Content): BabyShowerContent {
  const location = readSection(content, 'location');
  const rsvp = readSection(content, 'rsvp');
  return {
    babyName: readText(content, 'babyName'),
    hosts: readText(content, 'hosts'),
    message: readText(content, 'message'),
    closing: readText(content, 'closing'),
    location: {
      address: readText(location, 'address'),
      mapsUrl: readText(location, 'mapsUrl'),
      notes: readTextList(location, 'notes'),
    },
    rsvp: {
      closedMessage: readText(rsvp, 'closedMessage'),
      contactMessage: readText(rsvp, 'contactMessage'),
    },
  };
}
