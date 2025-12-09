import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Row({
  id,
  title,
  media = "movie",
  category = "popular",
  trending = false,
  discoverQuery,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hoveringRow, setHoveringRow] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [items, setItems] = useState<TMDBItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.9), behavior: "smooth" });
  };

  useEffect(() => {
    const t = window.setInterval(() => {
      if (!hoveringRow) scroll(1);
    }, 5000);
    return () => clearInterval(t);
  }, [hoveringRow]);

  useEffect(() => {
    async function fetchData() {
      try {
        const base = import.meta.env.VITE_APP_API_ENDPOINT_URL as string;
        const key = import.meta.env.VITE_APP_TMDB_V3_API_KEY as string;

        if (!base || !key) {
          setErr("Missing TMDB env vars");
          console.error("TMDB env missing:", { base, key });
          return;
        }

        let url = "";
        if (trending) {
          url = `${base}/trending/${media}/week?api_key=${key}&language=en-US`;
        } else if (discoverQuery) {
          url = `${base}/discover/${media}?api_key=${key}&language=en-US&${discoverQuery}`;
        } else {
          url = `${base}/${media}/${category}?api_key=${key}&language=en-US&page=1`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HTTP ${res.status}: ${txt}`);
        }
        const data = await res.json();
        const results: TMDBItem[] = data.results || [];
        setItems(results.slice(0, 20));
        setErr(null);
      } catch (e: any) {
        console.error("TMDB fetch error:", e);
        setErr(e?.message || "Fetch error");
      }
    }
    fetchData();
  }, [media, category, trending, discoverQuery]);

  const IMG = "https://image.tmdb.org/t/p/w500";

  return (
    <section
      id={id}
      style={{
        padding: "32px 0 0", 
      }}
    >
      <div
        style={{
          maxWidth: 1580,
          margin: "0 auto",
          padding: "0 8px",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <h3
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: 24,
              color: "var(--silver, #b0a9a0)",
              fontWeight: 600,
            }}
          >
            {title}
          </h3>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => scroll(-1)}
              style={{
                height: 32,
                minWidth: 32,
                padding: "0 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(13,9,6,0.7)",
                color: "#f5f2ea",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              ‹
            </button>
            <button
              onClick={() => scroll(1)}
              style={{
                height: 32,
                minWidth: 32,
                padding: "0 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(13,9,6,0.7)",
                color: "#f5f2ea",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              ›
            </button>
          </div>
        </div>

        {/* scroller */}
        <div
          ref={ref}
          onMouseEnter={() => setHoveringRow(true)}
          onMouseLeave={() => {
            setHoveringRow(false);
            setHoveredId(null);
          }}
          className="row-scroller"
          style={{
            position: "relative",
            overflowX: "auto",
            overflowY: "visible",
            paddingBottom: 4,
            scrollBehavior: "smooth",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 22,
            }}
          >
            {items.map((m) => {
              const titleText = m.title || m.name || "Untitled";
              const poster = m.poster_path || m.backdrop_path;
              const bg = poster
                ? `url(${IMG}${poster})`
                : `linear-gradient(135deg,#2a2323,#120e0e)`;

              const year =
                (m.release_date || m.first_air_date || "").slice(0, 4) || "";
              const rating =
                typeof m.vote_average === "number"
                  ? m.vote_average.toFixed(1)
                  : null;

              const isHovered = hoveredId === m.id;

              return (
                <article
                  key={m.id}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() =>
                    setHoveredId((cur) => (cur === m.id ? null : cur))
                  }
                  style={{
                    flex: "0 0 250px",
                    borderRadius: 22,
                    padding: 1.5,
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,204,51,0.12) 40%, rgba(0,0,0,0.7))",
                    boxShadow: isHovered
                      ? "0 24px 54px rgba(0,0,0,0.78)"
                      : "0 10px 26px rgba(0,0,0,0.65)",
                    transform: isHovered
                      ? "translateY(-10px) scale(1.06)"
                      : "translateY(0) scale(1)",
                    transition:
                      "transform .22s ease, box-shadow .22s ease, background .22s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate(`/movie/${m.id}`);
                  }}
                >
                  <div
                    style={{
                      borderRadius: 20,
                      overflow: "hidden",
                      position: "relative",
                      background: "rgba(8,6,4,0.96)",
                    }}
                  >
                    {/* poster */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        paddingTop: "165%",
                        backgroundImage: bg,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(3,2,1,0.95) 4%, rgba(3,2,1,0.4) 55%, rgba(3,2,1,0) 72%)",
                        }}
                      />

                      {/* chip type */}
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 10,
                          background: "rgba(0,0,0,0.55)",
                          color: "#f4e9d5",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          backdropFilter: "blur(8px)",
                        }}
                      ></div>

                      {/* rating */}
                      {rating && (
                        <div
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            padding: "2px 7px",
                            borderRadius: 999,
                            fontSize: 14,
                            background: "rgba(0,0,0,0.7)",
                            color: "#ffdd71",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          ★ {rating}
                        </div>
                      )}

                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: isHovered ? 1 : 0,
                          transition: "opacity .25s ease",
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "999px",
                            background: "rgba(0,0,0,0.55)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffcc33",
                            fontSize: 20,
                            backdropFilter: "blur(5px)",
                          }}
                        >
                          ▶
                        </div>
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          left: 12,
                          right: 12,
                          bottom: 12,
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 4px",
                            fontSize: 18,
                            color: "#f5f2ea",
                            fontWeight: 700,
                          }}
                        >
                          {titleText}
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: 14,
                            color: "rgba(244,233,213,0.75)",
                          }}
                        >
                          <span>{year}</span>
                          <span
                            style={{
                              fontSize: 14,
                              padding: "2px 6px",
                              borderRadius: 999,
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            Film
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {err && (
            <div
              style={{
                color: "salmon",
                padding: 12,
                fontSize: 12,
              }}
            >
              TMDB: {err}
            </div>
          )}
          {!err && items.length === 0 && (
            <div
              style={{
                color: "var(--muted, #a39b90)",
                padding: 12,
                fontSize: 12,
              }}
            >
              No results.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

