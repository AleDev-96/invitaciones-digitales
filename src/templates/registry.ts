import { createElement, type ComponentType, type ReactElement } from 'react';
import type { Invitation } from '../domain/invitation';
import { BabyShowerTemplate } from './baby-shower/BabyShowerTemplate';

export type TemplateProps = { invitation: Invitation };

type TemplateEntry = {
  component: ComponentType<TemplateProps>;
  themes: readonly string[];
};

export const templates: Record<string, TemplateEntry> = {
  'baby-shower': { component: BabyShowerTemplate, themes: ['sage-geese'] },
};

export function resolveTemplate(
  templateKey: string,
  themeKey: string,
): ComponentType<TemplateProps> | null {
  const entry = Object.hasOwn(templates, templateKey) ? templates[templateKey] : undefined;
  if (!entry || !entry.themes.includes(themeKey)) return null;
  return entry.component;
}

export function renderTemplate(invitation: Invitation): ReactElement | null {
  const component = resolveTemplate(invitation.templateKey, invitation.themeKey);
  return component ? createElement(component, { invitation }) : null;
}
