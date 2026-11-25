import type { ComponentType } from 'react';
import './sage-geese/fonts';
import './sage-geese/theme.css';
import { GiftBox, GooseWithBow, HotAirBalloon } from './sage-geese/illustrations';

type Art = ComponentType<{ className?: string }>;

export type BabyShowerTheme = {
  presentationArt: Art;
  giftsArt: Art;
  closingArt: Art;
};

const themes: Record<string, BabyShowerTheme> = {
  'sage-geese': { presentationArt: GooseWithBow, giftsArt: HotAirBalloon, closingArt: GiftBox },
};

export function babyShowerTheme(themeKey: string): BabyShowerTheme {
  return themes[themeKey] ?? themes['sage-geese'];
}
