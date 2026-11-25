import { messages } from '../../../../content/messages';
import envelopeUrl from '../../../../../assets/images/templates/baby-shower/sage-geese/envelope-olive-gingham.webp';
import gooseFamilyUrl from '../../../../../assets/images/templates/baby-shower/sage-geese/goose-family.webp';
import gooseGiftBoxUrl from '../../../../../assets/images/templates/baby-shower/sage-geese/goose-gift-box.webp';
import piggyBankUrl from '../../../../../assets/images/templates/baby-shower/sage-geese/piggy-bank.webp';
import gooseHotAirBalloonUrl from '../../../../../assets/images/templates/baby-shower/sage-geese/goose-hot-air-balloon.webp';

type ArtProps = { className?: string };

const text = messages.babyShower.art;

function Illustration({
  src,
  alt,
  width,
  height,
  className,
}: ArtProps & { src: string; alt: string; width: number; height: number }) {
  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="mx-auto h-auto max-h-56 w-auto"
      />
    </div>
  );
}

export function GooseFamily({ className }: ArtProps) {
  return (
    <Illustration
      src={gooseFamilyUrl}
      alt={text.gooseFamily}
      width={900}
      height={510}
      className={className}
    />
  );
}

export function HotAirBalloon({ className }: ArtProps) {
  return (
    <Illustration
      src={gooseHotAirBalloonUrl}
      alt={text.hotAirBalloon}
      width={457}
      height={712}
      className={className}
    />
  );
}

export function GiftBox({ className }: ArtProps) {
  return (
    <Illustration
      src={gooseGiftBoxUrl}
      alt={text.giftBox}
      width={800}
      height={473}
      className={className}
    />
  );
}

export function PiggyBank({ className }: ArtProps) {
  return (
    <Illustration
      src={piggyBankUrl}
      alt={text.piggyBank}
      width={600}
      height={533}
      className={className}
    />
  );
}

export function Envelope({ className }: ArtProps) {
  return <Illustration src={envelopeUrl} alt="" width={700} height={528} className={className} />;
}
