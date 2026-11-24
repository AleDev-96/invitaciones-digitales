import { createElement, type ComponentType, type ReactElement } from 'react';
import type { Invitation } from '../domain/invitation';
import { BabyShowerTemplate } from './baby-shower/BabyShowerTemplate';
import { GiftList } from './baby-shower/GiftList';

export type TemplateProps = { invitation: Invitation };

type TemplateEntry = {
  component: ComponentType<TemplateProps>;
  giftsPage?: ComponentType<TemplateProps>;
  themes: readonly string[];
};

export const templates: Record<string, TemplateEntry> = {
  'baby-shower': {
    component: BabyShowerTemplate,
    giftsPage: GiftList,
    themes: ['sage-geese'],
  },
};

export function resolveTemplate(
  templateKey: string,
  themeKey: string,
): ComponentType<TemplateProps> | null {
  return resolveEntry(templateKey, themeKey)?.component ?? null;
}

function resolveEntry(templateKey: string, themeKey: string): TemplateEntry | null {
  const entry = Object.hasOwn(templates, templateKey) ? templates[templateKey] : undefined;
  if (!entry || !entry.themes.includes(themeKey)) return null;
  return entry;
}

export function renderTemplate(invitation: Invitation): ReactElement | null {
  const component = resolveTemplate(invitation.templateKey, invitation.themeKey);
  return component ? createElement(component, { invitation }) : null;
}

export function renderGiftsPage(invitation: Invitation): ReactElement | null {
  const component = resolveEntry(invitation.templateKey, invitation.themeKey)?.giftsPage;
  return component ? createElement(component, { invitation }) : null;
}
