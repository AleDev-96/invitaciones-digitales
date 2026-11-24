import { describe, expect, it } from 'vitest';
import { readBabyShowerContent } from '../../src/templates/baby-shower/content';

describe('readBabyShowerContent', () => {
  it('reads every field of the template', () => {
    expect(
      readBabyShowerContent({
        babyName: 'Bebé Demo',
        hosts: 'Ana y Juan',
        message: 'Te esperamos',
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
      closing: 'Gracias',
      location: {
        address: 'Calle Falsa 123',
        mapsUrl: 'https://maps.app.goo.gl/abc',
        notes: ['Hay estacionamiento'],
      },
    });
  });

  it('returns empty values when the content is empty', () => {
    expect(readBabyShowerContent({})).toEqual({
      babyName: null,
      hosts: null,
      message: null,
      closing: null,
      location: { address: null, mapsUrl: null, notes: [] },
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

  it('ignores a location that is not an object', () => {
    expect(readBabyShowerContent({ location: 'Salta' }).location.address).toBeNull();
  });
});
