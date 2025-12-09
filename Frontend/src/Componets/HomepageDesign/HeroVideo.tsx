import { useEffect, useMemo, useRef, useState } from "react";

const DURATION_MS = 45_000;
const MAX_ITEMS = 5;
const ANIMATION_GENRE_ID = 16;
export default function HeroVideo() {
  const [embeds, setEmbeds] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<number | null>(null);

  const base = import.meta.env.VITE_APP_API_ENDPOINT_URL as string;
  const apiKey = import.meta.env.VITE_APP_TMDB_V3_API_KEY as string;

  const buildSrc = (v: TMDBVideo, isMuted: boolean) => {
    if (v.site === "Vimeo") {
      return `https://player.vimeo.com/video/${v.key}?background=1&autoplay=1&loop=1&muted=${isMuted ? 1 : 0}&controls=0`;
    }
    return `https://www.youtube.com/embed/${v.key}?autoplay=1&mute=${isMuted ? 1 : 0
      }&loop=1&playlist=${v.key}&controls=0&modestbranding=1&rel=0&fs=0&iv_load_policy=3&playsinline=1&enablejsapi=1`;
  };

  useEffect(() => {
    async function load() {
      try {
        if (!base || !apiKey) return;

        const listUrl = `${base}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=${ANIMATION_GENRE_ID}&include_adult=false&sort_by=popularity.desc&page=1`;
        const res = await fetch(listUrl);
        const data = await res.json();

        const movies: { id: number; adult?: boolean }[] = (data.results || [])
          .filter((m: { adult: any; }) => !m.adult)
          .slice(0, 12);

        const urls: string[] = [];
        for (const it of movies) {
          if (urls.length >= MAX_ITEMS) break;
          try {
            const vRes = await fetch(
              `${base}/movie/${it.id}/videos?api_key=${apiKey}&language=en-US`
            );
            const vData = await vRes.json();
            const vids: TMDBVideo[] = vData?.results || [];

            const pick =
              vids.find(
                (v) =>
                  v.site === "Vimeo" &&
                  (v.type === "Trailer" || v.type === "Teaser")
              ) ||
              vids.find(
                (v) =>
                  v.site === "YouTube" &&
                  (v.type === "Trailer" || v.type === "Teaser")
              ) ||
              vids[0];

            if (pick) urls.push(buildSrc(pick, true));
          } catch (e) {

          }
        }

        setEmbeds(urls);
        setIdx(0);
        setMuted(true);
      } catch (e) {
        console.error("HeroVideo (animation) load error", e);
      }
    }
    load();
  }, [base, apiKey]);

  useEffect(() => {
    if (!embeds.length) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIdx((p) => (p + 1) % embeds.length);
    }, DURATION_MS) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [embeds]);

  const currentSrc = useMemo(() => {
    if (!embeds.length) return "";
    const url = new URL(embeds[idx]);
    if (url.hostname.includes("vimeo.com")) {
      url.searchParams.set("muted", muted ? "1" : "0");
    } else {
      url.searchParams.set("mute", muted ? "1" : "0");
      const vid = url.pathname.split("/").pop();
      if (vid) url.searchParams.set("playlist", vid);
    }
    return url.toString();
  }, [embeds, idx, muted]);

  const next = () => setIdx((p) => (p + 1) % embeds.length);
  const prev = () => setIdx((p) => (p - 1 + embeds.length) % embeds.length);

  if (!embeds.length) {
    return (
      <section className="hero" style={{ minHeight: "70vh", position: "relative" }}>
        <div className="overlay1" />
        <div className="overlay2" />
        <div className="container hero-inner">
          <div style={{ maxWidth: 640 }}>
            <h1>Loading animation trailers…</h1>
            <p style={{ color: "var(--muted)" }}>
              Fetching the latest non-adult animated movies from TMDB.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero" style={{ position: "relative", overflow: "hidden" }}>
      <iframe
        key={currentSrc}
        ref={iframeRef}
        src={currentSrc}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          pointerEvents: "none",
        }}
        title="Hero Trailer"
      />

      <div className="overlay1" />
      <div className="overlay2" />

      <div className="container hero-inner" style={{ position: "relative" }}>
        <div style={{ maxWidth: 640 }} className="gold-shimmer">
          {/* <h1>Now Playing</h1> */}
          {/* <p style={{ color: "var(--muted)" }}>
            Curated non-adult animated trailers. 45s each, auto-rotate, clean like Netflix.
          </p> */}
          {/* <div className="btns" style={{ display: "flex", gap: 12 }}>
            <a className="btn btn-neon">Watch Now</a>
            <a className="btn">More Info</a>
          </div> */}
        </div>

        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 24,
            display: "flex",
            gap: 8,
            zIndex: 5,
          }}
        >
          <button
            onClick={() => setMuted((m) => !m)}
            style={{
              borderRadius: 24,
              padding: "10px 14px",
              border: "1px solid var(--border)",
              background: "rgba(0,0,0,.45)",
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            {muted ? "🔇 Sound off" : "🔊 Sound on"}
          </button>
          <button
            onClick={prev}
            style={{
              borderRadius: 24,
              padding: "10px 12px",
              border: "1px solid var(--border)",
              background: "rgba(0,0,0,.45)",
              color: "var(--text)",
              cursor: "pointer",
            }}
            aria-label="Previous trailer"
          >
            ‹
          </button>
          <button
            onClick={next}
            style={{
              borderRadius: 24,
              padding: "10px 12px",
              border: "1px solid var(--border)",
              background: "rgba(0,0,0,.45)",
              color: "var(--text)",
              cursor: "pointer",
            }}
            aria-label="Next trailer"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
