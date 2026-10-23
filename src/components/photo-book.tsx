import Image from "next/image";
import photosData from "@/data/photos.json";
import { cn } from "@/lib/utils";

const photos = photosData as string[];

// Prefix van de bestandsnaam bepaalt welk clublogo erbij hoort
const clubLogos: Record<string, { name: string; logo: string }> = {
  riv: { name: "KV Rivalen", logo: "/club-logos/logo-rivalen.png" },
  duk: { name: "Duko", logo: "/club-logos/logo-duko.png" },
  wes: { name: "Wesstar", logo: "/club-logos/logo-wesstar.png" },
  zwa: { name: "KV de Zwaluwen", logo: "/club-logos/logo-zwaluwen.svg" },
  tri: { name: "Triominos", logo: "/club-logos/logo-triominos.svg" },
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

type PhotoBookProps = {
  id?: string;
};

const clubKey = (file: string) => file.slice(0, 3).toLowerCase();

// Willekeurige volgorde waarin twee foto's van dezelfde club nooit naast elkaar staan
function spreadClubs(files: string[]): string[] {
  const groups = new Map<string, string[]>();
  for (const file of shuffle(files)) {
    groups.set(clubKey(file), [...(groups.get(clubKey(file)) ?? []), file]);
  }

  const result: string[] = [];
  let previous: string | undefined;
  for (let left = files.length; left > 0; left--) {
    const candidates = [...groups].filter(([key, list]) => key !== previous && list.length > 0);
    // Club met meer foto's dan alle andere samen moet nu, anders lukt het niet meer
    const forced = candidates.find(([, list]) => list.length > left - list.length);
    const pool = forced ? [forced] : candidates.flatMap((entry) => entry[1].map(() => entry));
    const [key, list] = pool[Math.floor(Math.random() * pool.length)];
    result.push(list.pop()!);
    previous = key;
  }
  return result;
}

// Volgorde en schuinstand worden één keer per build bepaald
const ordered = spreadClubs(photos);
const rotations = new Map(photos.map((file) => [file, Math.round((Math.random() * 8 - 4) * 10) / 10]));

export function clubPhotos(prefix: string): string[] {
  return ordered.filter((file) => clubKey(file) === prefix);
}

export function PhotoGrid({ files, className }: { files: string[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:gap-8", className)}>
      {files.map((file) => {
        const club = clubLogos[clubKey(file)];
        return (
          <figure
            key={file}
            className="relative m-0 bg-white p-2 pb-10 shadow-[0_12px_28px_-14px_rgb(15_26_23/0.45)] ring-1 ring-[#0F1A17]/[0.06] transition duration-300 ease-(--ease-out-quint) hover:z-10 hover:rotate-0! hover:scale-105 sm:p-3 sm:pb-12"
            style={{ rotate: `${rotations.get(file)}deg` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#EEF2EF]">
              <Image
                src={`/photos/${file}`}
                alt={club ? `Foto van ${club.name}` : ""}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
            {club && (
              <span className="absolute bottom-1.5 right-2 h-8 w-8 overflow-hidden rounded-full bg-white ring-2 ring-white sm:bottom-2 sm:right-3 sm:h-10 sm:w-10">
                <Image src={club.logo} alt={`${club.name} logo`} fill sizes="40px" className="object-contain p-0.5" />
              </span>
            )}
          </figure>
        );
      })}
    </div>
  );
}

export function PhotoBook({ id }: PhotoBookProps) {
  return (
    <section id={id} className="surface-light bg-white">
      <div className="container py-16 sm:py-24">
        <h2 className="reveal-heading font-heading mb-10 text-4xl font-bold leading-[1.05] sm:text-[44px]">
          Korfbal in de Liemers
        </h2>
        <PhotoGrid files={ordered} className="sm:grid-cols-3 lg:grid-cols-4" />
      </div>
    </section>
  );
}
