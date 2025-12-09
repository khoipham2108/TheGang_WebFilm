// src/Componets/Series/SeriesGrid.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlobalApi from "../../services/GlobalApi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

type TV = {
    id: number;
    name?: string;
    poster_path?: string | null;
    first_air_date?: string;
    vote_average?: number;
};

const IMG = (p?: string | null, w = 342) =>
    p ? `https://image.tmdb.org/t/p/w${w}${p}` : null;

const UI_PAGE_SIZE = 18;     // ✅ mỗi trang 15 phim
const TMDB_PAGE_SIZE = 20;   // cố định của TMDB

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const SeriesGrid: React.FC = () => {
    const q = useQuery();
    const nav = useNavigate();
    
    const genreId = Number(q.get("genre")) || 18;
    const genreName = q.get("name") || "Series";

    const [uiPage, setUiPage] = useState<number>(Number(q.get("page")) || 1);

    const [totalResults, setTotalResults] = useState<number>(0);
    const [items, setItems] = useState<TV[]>([]);
    const totalUiPages = Math.max(1, Math.ceil(totalResults / UI_PAGE_SIZE));

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set("seriesGenre", String(genreId));
        params.set("seriesName", String(genreName));
        params.set("page", String(uiPage));
        nav(`/series?${params.toString()}`, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uiPage, genreId, genreName]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            // Tính dải index cần cho trang UI (15 items)
            const startIndex = (uiPage - 1) * UI_PAGE_SIZE;            // 0-based
            const startApiPage = Math.floor(startIndex / TMDB_PAGE_SIZE) + 1;
            const startOffset = startIndex % TMDB_PAGE_SIZE;
            const need = UI_PAGE_SIZE;

            // Fetch trang TMDB bắt đầu
            const r1 = await GlobalApi.discoverTvByGenre(genreId, startApiPage);
            const list1: TV[] = r1.data?.results || [];
            const total = r1.data?.total_results ?? 0;
            if (!cancelled) setTotalResults(total);

            let pool = list1;

            // Nếu không đủ 15 item trong trang đầu => load thêm trang kế tiếp
            if (startOffset + need > TMDB_PAGE_SIZE) {
                const r2 = await GlobalApi.discoverTvByGenre(genreId, startApiPage + 1);
                const list2: TV[] = r2.data?.results || [];
                pool = [...list1, ...list2];
            }

            const slice = pool.slice(startOffset, startOffset + need);
            if (!cancelled) setItems(slice);
        }

        load().catch(() => {
            if (!cancelled) {
                setItems([]);
                setTotalResults(0);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [genreId, uiPage]);

    const go = (p: number) =>
        setUiPage(Math.min(Math.max(1, p), totalUiPages));

    // render dãy số trang ngắn gọn (current ±2)
    const pageWindow = useMemo(() => {
        const from = Math.max(1, uiPage - 2);
        const to = Math.min(totalUiPages, uiPage + 2);
        return Array.from({ length: to - from + 1 }, (_, i) => from + i);
    }, [uiPage, totalUiPages]);

    return (
        <section className="px-6 pb-10">
            <div className="flex items-end justify-between mb-3">
                <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "var(--text)" }}>
                    {genreName}
                </h2>
                <button
                    onClick={() => nav("/series")}
                    className="text-sm px-3 py-1 rounded-md"
                    style={{
                        color: "var(--text)",
                        background: "rgba(255,255,255,.06)",
                        border: "1px solid var(--border)",
                    }}
                >
                    Clear
                </button>
            </div>

            {/* grid phim */}
            {items.length === 0 ? (
                <div className="card rounded-xl p-4 text-center" style={{ color: "var(--muted)" }}>
                    No series found.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                    {items.map((m) => {
                        const poster = IMG(m.poster_path, 342);
                        return (
                            <button
                                key={m.id}
                                onClick={() => nav(`/tv/${m.id}`)}
                                className="card overflow-hidden rounded-xl text-left group"
                                title={m.name}
                            >
                                {poster ? (
                                    <img
                                        src={poster}
                                        alt={m.name}
                                        className="w-full aspect-[2/3] object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <div className="w-full aspect-[2/3] poster-thumb" />
                                )}
                                <div className="p-3">
                                    <div className="font-semibold truncate" style={{ color: "var(--text)" }}>
                                        {m.name}
                                    </div>
                                    <div className="text-xs mt-1 flex items-center gap-2" style={{ color: "var(--muted)" }}>
                                        {m.first_air_date?.slice(0, 4) ?? "—"}
                                        <span aria-hidden>•</span>
                                        ⭐ {m.vote_average?.toFixed(1) ?? "0.0"}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* pagination */}
            <div className="mt-6 flex items-center justify-center gap-2">
                <button
                    onClick={() => go(uiPage - 1)}
                    disabled={uiPage <= 1}
                    className="px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
                    style={{ border: "1px solid var(--border)", color: "var(--text)", background: "rgba(255,255,255,.04)" }}
                >
                    <HiChevronLeft /> Prev
                </button>

                {pageWindow[0] > 1 && (
                    <>
                        <button
                            onClick={() => go(1)}
                            className="px-3 py-2 rounded-lg"
                            style={{ border: "1px solid var(--border)", color: "var(--text)", background: "rgba(255,255,255,.04)" }}
                        >
                            1
                        </button>
                        {pageWindow[0] > 2 && <span style={{ color: "var(--muted)" }}>…</span>}
                    </>
                )}

                {pageWindow.map((p) => (
                    <button
                        key={p}
                        onClick={() => go(p)}
                        className="px-3 py-2 rounded-lg"
                        style={
                            p === uiPage
                                ? { background: "var(--accent)", color: "#111", fontWeight: 800 }
                                : { border: "1px solid var(--border)", color: "var(--text)", background: "rgba(255,255,255,.04)" }
                        }
                    >
                        {p}
                    </button>
                ))}

                {pageWindow.at(-1)! < totalUiPages && (
                    <>
                        {pageWindow.at(-1)! < totalUiPages - 1 && <span style={{ color: "var(--muted)" }}>…</span>}
                        <button
                            onClick={() => go(totalUiPages)}
                            className="px-3 py-2 rounded-lg"
                            style={{ border: "1px solid var(--border)", color: "var(--text)", background: "rgba(255,255,255,.04)" }}
                        >
                            {totalUiPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => go(uiPage + 1)}
                    disabled={uiPage >= totalUiPages}
                    className="px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
                    style={{ border: "1px solid var(--border)", color: "var(--text)", background: "rgba(255,255,255,.04)" }}
                >
                    Next <HiChevronRight />
                </button>
            </div>
        </section>
    );
};

export default SeriesGrid;
