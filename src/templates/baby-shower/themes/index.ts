import type { ComponentType } from 'react';
import './sage-geese/fonts';
import './sage-geese/theme.css';
import { Envelope, GiftBox, GooseFamily, HotAirBalloon } from './sage-geese/illustrations';

type Art = ComponentType<{ className?: string }>;

export type BabyShowerTheme = {
  coverArt: Art;
  presentationArt: Art;
  giftsArt: Art;
  closingArt: Art;
};

const themes: Record<string, BabyShowerTheme> = {
  'sage-geese': {
    coverArt: Envelope,
    presentationArt: GooseFamily,
    giftsArt: GiftBox,
    closingArt: HotAirBalloon,
  },
};

export function babyShowerTheme(themeKey: string): BabyShowerTheme {
  return themes[themeKey] ?? themes['sage-geese'];
}
