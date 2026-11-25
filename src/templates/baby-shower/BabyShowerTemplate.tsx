import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import type { Invitation } from '../../domain/invitation';
import { hasOpenedEnvelope, markEnvelopeOpened } from '../../infra/envelopeStorage';
import './baby-shower.css';
import { readBabyShowerContent } from './content';
import { Cover } from './Cover';
import { Closing } from './sections/Closing';
import { CountdownSection } from './sections/CountdownSection';
import { EventDate } from './sections/EventDate';
import { Gifts } from './sections/Gifts';
import { Location } from './sections/Location';
import { Presentation } from './sections/Presentation';
import { Rsvp } from './sections/Rsvp';
import { babyShowerTheme } from './themes';

export function BabyShowerTemplate({ invitation }: { invitation: Invitation }) {
  const [opened, setOpened] = useState(() => hasOpenedEnvelope(invitation.slug));
  const content = readBabyShowerContent(invitation.content);
  const theme = babyShowerTheme(invitation.themeKey);
  const has = (feature: string) => invitation.features.includes(feature);
  const { hash } = useLocation();

  // Al volver de la lista de regalos o ir a confirmar desde ella, se muestra esa sección.
  useEffect(() => {
    if (opened && hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [opened, hash]);

  function handleOpened() {
    markEnvelopeOpened(invitation.slug);
    window.scrollTo(0, 0);
    setOpened(true);
  }

  return (
    <div className="min-h-dvh bg-(--color-background)">
      <div className="baby-shower-frame mx-auto min-h-dvh max-w-[454px] px-3">
        {!opened && <Cover onOpened={handleOpened} />}
        <main
          inert={!opened}
          className="mx-auto min-h-dvh max-w-[430px] bg-(--color-background) font-(family-name:--font-body) text-(--color-ink)"
        >
          <Presentation content={content} art={theme.presentationArt} />
          {has('countdown') && <CountdownSection eventAt={invitation.eventAt} />}
          <EventDate eventAt={invitation.eventAt} timezone={invitation.timezone} />
          {has('map') && <Location location={content.location} />}
          {has('gifts') && (
            <Gifts slug={invitation.slug} intro={content.gifts.intro} art={theme.giftsArt} />
          )}
          {has('rsvp') && (
            <Rsvp slug={invitation.slug} open={invitation.rsvpOpen} texts={content.rsvp} />
          )}
          <Closing closing={content.closing} art={theme.closingArt} />
        </main>
      </div>
    </div>
  );
}
