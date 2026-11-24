import { useState } from 'react';
import { messages } from '../../content/messages';
import type { Invitation } from '../../domain/invitation';
import { hasOpenedEnvelope, markEnvelopeOpened } from '../../infra/envelopeStorage';
import './baby-shower.css';
import { readBabyShowerContent } from './content';
import { Cover } from './Cover';
import { Closing } from './sections/Closing';
import { ComingSoon } from './sections/ComingSoon';
import { CountdownSection } from './sections/CountdownSection';
import { EventDate } from './sections/EventDate';
import { Location } from './sections/Location';
import { Presentation } from './sections/Presentation';
import { babyShowerTheme } from './themes';

export function BabyShowerTemplate({ invitation }: { invitation: Invitation }) {
  const [opened, setOpened] = useState(() => hasOpenedEnvelope(invitation.slug));
  const content = readBabyShowerContent(invitation.content);
  const theme = babyShowerTheme(invitation.themeKey);
  const has = (feature: string) => invitation.features.includes(feature);

  function handleOpened() {
    markEnvelopeOpened(invitation.slug);
    window.scrollTo(0, 0);
    setOpened(true);
  }

  return (
    <div className="baby-shower-frame min-h-dvh px-3 sm:px-8">
      {!opened && <Cover onOpened={handleOpened} />}
      <main
        aria-hidden={!opened}
        className="mx-auto min-h-dvh max-w-[430px] bg-(--color-background) font-(family-name:--font-body) text-(--color-ink)"
      >
        <Presentation content={content} art={theme.presentationArt} />
        {has('countdown') && <CountdownSection eventAt={invitation.eventAt} />}
        <EventDate eventAt={invitation.eventAt} timezone={invitation.timezone} />
        {has('map') && <Location location={content.location} />}
        {has('gifts') && (
          <ComingSoon title={messages.babyShower.gifts.title} art={theme.giftsArt} />
        )}
        {has('rsvp') && <ComingSoon title={messages.babyShower.rsvp.title} />}
        <Closing closing={content.closing} art={theme.closingArt} />
      </main>
    </div>
  );
}
