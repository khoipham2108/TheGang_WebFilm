import React, { useEffect, useMemo, useRef, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import {
  HiChevronLeft,
  HiChevronRight,
  HiPlay,
  HiOutlineInformationCircle,
  HiStar,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

type MovieItem = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

const AUTOPLAY_INTERVAL_MS = 4500;

const Slider: React.FC = () => {
  const [movieList, setMovieList] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await GlobalApi.getTrendingVideos();
        setMovieList(resp?.data?.results ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const slides = useMemo(
    () =>
      movieList.map((m) => {
        const title =
          m.title || m.name || m.original_title || m.original_name || "Untitled";
        const year = (m.release_date || m.first_air_date || "").slice(0, 4);
        const rating =
          typeof m.vote_average === "number"
            ? Math.round(m.vote_average * 10) / 10
            : undefined;

        const imgPath = m.backdrop_path || m.poster_path;
        const bgUrl = imgPath ? `${IMAGE_BASE_URL}${imgPath}` : undefined;

        return { ...m, _title: title, _year: year, _rating: rating, _bgUrl: bgUrl };
      }),
    [movieList]
  );

  const scrollByViewport = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = el.clientWidth - 120;
    el.scrollTo({
      left: el.scrollLeft + (dir === "right" ? delta : -delta),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!trackRef.current) return;
    if (paused) return;

    const el = trackRef.current;
    const id = setInterval(() => {
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByViewport("right");
      }
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <div className="relative -mt-8">
      <HiChevronLeft
        className="hidden md:block text-white text-[40px] absolute left-0 z-20 mx-4 mt-[20vh] cursor-pointer drop-shadow"
        onClick={() => scrollByViewport("left")}
        aria-label="Scroll left"
        role="button"
        tabIndex={0}
      />
      <HiChevronRight
        className="hidden md:block text-white text-[40px] absolute right-0 z-20 mx-4 mt-[20vh] cursor-pointer drop-shadow"
        onClick={() => scrollByViewport("right")}
        aria-label="Scroll right"
        role="button"
        tabIndex={0}
      />

      <div
        ref={trackRef}
        className="flex overflow-x-auto w-full px-4 md:px-12 lg:px-16 py-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="min-w-full aspect-[16/9] md:aspect-[16/8] lg:aspect-[16/7] mr-5 rounded-2xl bg-gradient-to-b from-neutral-800/60 to-neutral-900/80 animate-pulse"
            />
          ))
          : slides.map((item) => (
            <article
              key={item.id}
              className={
                "relative min-w-full aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5] " +
                "mr-5 rounded-2xl overflow-hidden snap-start group"
              }
            >
              <div
                className="absolute inset-0 bg-black"
                aria-hidden
              >
                <div
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{
                    backgroundImage: item._bgUrl
                      ? `url("${item._bgUrl}")`
                      : "linear-gradient(135deg,#1f1f1f,#111)",
                    backgroundPosition: "center top",
                  }}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10 rounded-2xl" />

              <div className="relative z-10 h-full flex items-end">
                <div className="w-full p-5 md:p-10 lg:p-14">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow">
                      {item._title}
                    </h2>
                    {item._year && (
                      <span className="text-white/85 text-xs md:text-sm rounded-full border border-white/30 px-2 py-0.5">
                        {item._year}
                      </span>
                    )}
                    {typeof item._rating !== "undefined" && (
                      <span className="inline-flex items-center gap-1 text-white/90 text-xs md:text-sm">
                        <HiStar className="inline-block -mt-[2px]" />
                        {item._rating}
                      </span>
                    )}
                  </div>

                  {item.overview && (
                    <p className="mt-3 max-w-4xl text-white/90 text-sm md:text-base lg:text-lg line-clamp-3 md:line-clamp-4">
                      {item.overview}
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      className="inline-flex items-center gap-2 rounded-lg bg-white text-black font-semibold px-4 py-2 md:px-5 md:py-2.5 hover:bg-white/90 active:scale-[0.98] transition"
                      onClick={() => navigate(`/movie/${item.id}`)}
                    >
                      <HiPlay className="text-lg" />
                      Play
                    </button>
                    <button
                      className="inline-flex items-center gap-2 rounded-lg bg-white/10 text-white font-semibold px-4 py-2 md:px-5 md:py-2.5 backdrop-blur hover:bg-white/20 border border-white/20 active:scale-[0.98] transition"
                      onClick={() => navigate(`/movie/${item.id}`)}
                    >
                      <HiOutlineInformationCircle className="text-lg" />
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
};

export default Slider;
