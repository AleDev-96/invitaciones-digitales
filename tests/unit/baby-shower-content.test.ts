import { describe, expect, it } from 'vitest';
import { readBabyShowerContent } from '../../src/templates/baby-shower/content';

describe('readBabyShowerContent', () => {
  it('reads every field of the template', () => {
    expect(
      readBabyShowerContent({
        babyName: 'Bebé Demo',
        hosts: 'Ana y Juan',
        message: 'Te esperamos',
        endTime: '18:30',
        closing: 'Gracias',
        location: {
          address: 'Calle Falsa 123',
          mapsUrl: 'https://maps.app.goo.gl/abc',
          notes: ['Hay estacionamiento'],
        },
      }),
    ).toEqual({
      babyName: 'Bebé Demo',
      hosts: 'Ana y Juan',
      message: 'Te esperamos',
      endTime: '18:30',
      closing: 'Gracias',
      location: {
        address: 'Calle Falsa 123',
        mapsUrl: 'https://maps.app.goo.gl/abc',
        notes: ['Hay estacionamiento'],
      },
      rsvp: { closedMessage: null, contactMessage: null },
      gifts: { intro: null },
    });
  });

  it('returns empty values when the content is empty', () => {
    expect(readBabyShowerContent({})).toEqual({
      babyName: null,
      hosts: null,
      message: null,
      endTime: null,
      closing: null,
      location: { address: null, mapsUrl: null, notes: [] },
      rsvp: { closedMessage: null, contactMessage: null },
      gifts: { intro: null },
    });
  });

  it('ignores values with the wrong type or only spaces', () => {
    const content = readBabyShowerContent({
      babyName: 42,
      hosts: '   ',
      message: ['no'],
      location: { address: { street: 'x' }, notes: ['  ', 7, ' Traer abrigo '] },
    });
    expect(content.babyName).toBeNull();
    expect(content.hosts).toBeNull();
    expect(content.message).toBeNull();
    expect(content.location.address).toBeNull();
    expect(content.location.notes).toEqual(['Traer abrigo']);
  });

  it('reads the rsvp messages', () => {
    const content = readBabyShowerContent({
      rsvp: { closedMessage: ' Cerramos el 4. ', contactMessage: 'Escribile a Ana.' },
    });
    expect(content.rsvp).toEqual({
      closedMessage: 'Cerramos el 4.',
      contactMessage: 'Escribile a Ana.',
    });
  });

  it('reads the gifts intro', () => {
    expect(readBabyShowerContent({ gifts: { intro: ' Te dejamos ideas. ' } }).gifts).toEqual({
      intro: 'Te dejamos ideas.',
    });
    expect(readBabyShowerContent({ gifts: { intro: 3 } }).gifts.intro).toBeNull();
  });

  it('ignores a location that is not an object', () => {
    expect(readBabyShowerContent({ location: 'Salta' }).location.address).toBeNull();
  });
});
