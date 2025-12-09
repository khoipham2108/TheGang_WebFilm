import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GlobalApi from "../../services/GlobalApi";
import { HiArrowLeft, HiClock, HiFire, HiLanguage, HiCalendarDays } from "react-icons/hi2";
import { FaStar } from "react-icons/fa";
import { useModal } from "../MainPageDesign/ModalContext";
import TheGangsLoader from "../Loading/loading";

type MovieDetails = {
    id: number;
    title: string;
    original_title?: string;
    overview?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    runtime?: number;
    release_date?: string;
    vote_average?: number;
    genres?: { id: number; name: string }[];
    spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
};

type Cast = {
    id: number;
    name: string;
    character?: string;
    profile_path?: string | null;
};

type Video = {
    id: string;
    key: string;          
    name: string;
    site: "YouTube" | string;
    type: "Trailer" | "Teaser" | string;
    official?: boolean;
    published_at?: string;
};

const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const isTvContent = location.pathname.startsWith('/tv/');

    const nav = useNavigate();
    const { myList, addToList, removeFromList } = useModal();

    const idNum = Number(id);
    const isInList = Number.isFinite(idNum) && myList.includes(idNum);

    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [reco, setReco] = useState<MovieDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState<number>(0);
    const [hover, setHover] = useState<number | null>(null);

    const [videos, setVideos] = useState<Video[]>([]);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [showTrailer, setShowTrailer] = useState(false);

    const pickBestTrailer = (vs: Video[]): string | null => {
        const youtube = vs.filter(v => v.site === "YouTube");
        if (youtube.length === 0) return null;

        const officialTrailer = youtube.find(v => v.type === "Trailer" && v.official);
        if (officialTrailer) return officialTrailer.key;

        const anyTrailer = youtube.find(v => v.type === "Trailer");
        if (anyTrailer) return anyTrailer.key;

        const officialTeaser = youtube.find(v => v.type === "Teaser" && v.official);
        if (officialTeaser) return officialTeaser.key;

        return youtube[0]?.key || null;
    };

    useEffect(() => {
        if (!idNum) return;
        setLoading(true);
        const apiCalls = isTvContent ? [
            GlobalApi.getTvDetails(idNum).then((r: any) => r.data),
            GlobalApi.getTvCredits(idNum).then((r: any) => r.data?.cast || []),
            GlobalApi.getTvRecommendations(idNum).then((r: any) => r.data?.results || []),
            GlobalApi.getTvVideos(idNum).then((r: any) => r.data?.results || []),
        ] : [
            GlobalApi.getMovieDetails(idNum).then((r: any) => r.data),
            GlobalApi.getMovieCredits(idNum).then((r: any) => r.data?.cast || []),
            GlobalApi.getMovieRecommendations(idNum).then((r: any) => r.data?.results || []),
            GlobalApi.getMovieVideos(idNum).then((r: any) => r.data?.results || []),
        ];

        Promise.all(apiCalls)
            .then(([d, c, rec, vids]) => {
                setMovie(d);
                setCast((c || []).slice(0, 12));
                setReco((rec || []).slice(0, 12));
                setVideos(vids || []);
                setTrailerKey(pickBestTrailer(vids || []));
            })
            .finally(() => setLoading(false));
    }, [idNum, isTvContent]);

    if (loading) {
        return (
            <div>
                <TheGangsLoader />
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="container" style={{ padding: "24px 0" }}>
                <div className="card p-4 rounded-xl">Movie not found.</div>
            </div>
        );
    }

    const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
    const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null;

    return (
        <div
            style={{
                backgroundImage: backdrop
                    ? `linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,.85)), url(${backdrop})`
                    : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="container" style={{ padding: "24px 0 40px" }}>
                <button
                    onClick={() => nav(-1)}
                    className="btn"
                    style={{ background: "rgba(255,255,255,.08)", color: "var(--text)" }}
                >
                    <HiArrowLeft /> Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 items-start">
                    <div className="card overflow-hidden rounded-xl">
                        {poster ? (
                            <img src={poster} alt={movie.title} className="w-full object-cover" />
                        ) : (
                            <div className="poster-thumb w-full aspect-[2/3]" />
                        )}
                    </div>

                    <div className="md:col-span-2 card rounded-xl p-5">
                        <h1 className="text-2xl md:text-4xl font-extrabold m-0">{movie.title}</h1>

                        <div className="flex flex-wrap gap-4 mt-3" style={{ color: "var(--muted)" }}>
                            {movie.release_date && (
                                <div className="flex items-center gap-2">
                                    <HiCalendarDays /> {movie.release_date.slice(0, 4)}
                                </div>
                            )}
                            {typeof movie.runtime === "number" && movie.runtime > 0 && (
                                <div className="flex items-center gap-2">
                                    <HiClock /> {movie.runtime} min
                                </div>
                            )}
                            {movie.vote_average ? (
                                <div className="flex items-center gap-2">
                                    <HiFire /> {movie.vote_average.toFixed(1)}
                                </div>
                            ) : null}
                            {movie.spoken_languages?.length ? (
                                <div className="flex items-center gap-2">
                                    <HiLanguage />
                                    {movie.spoken_languages[0].english_name}
                                </div>
                            ) : null}
                        </div>

                        {movie.genres?.length ? (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {movie.genres.map((g) => (
                                    <span
                                        key={g.id}
                                        className="text-xs px-2 py-1 rounded-full"
                                        style={{
                                            border: "1px solid var(--border)",
                                            background: "rgba(255,255,255,.04)",
                                            color: "var(--text)",
                                        }}
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        {movie.overview ? (
                            <p className="mt-4" style={{ color: "var(--silver)", lineHeight: 1.7 }}>
                                {movie.overview}
                            </p>
                        ) : null}

                        <div className="mt-4 flex flex-wrap gap-3">
                            <button className="btn">Watch now</button>

                            {trailerKey && (
                                <button
                                    onClick={() => setShowTrailer(true)}
                                    className="btn"
                                    style={{ background: "#EAE6DF", color: "#111" }}
                                >
                                    Play trailer
                                </button>
                            )}

                            {isInList ? (
                                <button
                                    onClick={() => removeFromList(idNum)}
                                    className="btn"
                                    style={{ background: "rgba(255,255,255,.12)", color: "var(--text)" }}
                                >
                                    ✓ In My List (Remove)
                                </button>
                            ) : (
                                <button
                                    onClick={() => addToList(idNum)}
                                    className="btn"
                                    style={{ background: "rgba(255,255,255,.12)", color: "var(--text)" }}
                                >
                                    + Add to My List
                                </button>
                            )}
                            <div className="flex gap-2 mt-2">
                                {/* <span style={{ color: "var(--text)" }}>Rate this movie:</span> */}
                                <div className="flex items-top">
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <label key={index}>
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    value={ratingValue}
                                                    style={{ display: "none" }}
                                                    onClick={() => setRating(ratingValue)}
                                                />
                                                <FaStar
                                                    size={24}
                                                    color={
                                                        (hover || rating) >= ratingValue
                                                            ? "#ffc107"
                                                            : "#e4e5e9"
                                                    }
                                                    onMouseEnter={() => setHover(ratingValue)}
                                                    onMouseLeave={() => setHover(null)}
                                                    style={{
                                                        cursor: "pointer",
                                                        transition: "color 0.2s ease-in-out",
                                                    }}
                                                />
                                            </label>
                                        );
                                    })}
                                </div>
                                <span style={{ color: "var(--text)" }}>{rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {cast.length > 0 && (
                    <section className="mt-8">
                        <h3 className="text-xl font-bold mb-3">Top Cast</h3>
                        <div className="row-scroller">
                            <div className="row-grid" style={{ gridAutoColumns: "160px" as any }}>
                                {cast.map((p) => {
                                    const avatar = p.profile_path ? `https://image.tmdb.org/t/p/w185${p.profile_path}` : null;
                                    return (
                                        <div key={p.id} className="card rounded-lg p-3">
                                            <div className="w-full h-[180px] overflow-hidden rounded-md poster-thumb">
                                                {avatar && <img src={avatar} alt={p.name} className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="mt-2 font-semibold">{p.name}</div>
                                            {p.character && (
                                                <div className="text-xs" style={{ color: "var(--muted)" }}>
                                                    as {p.character}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {reco.length > 0 && (
                    <section className="mt-8">
                        <h3 className="text-xl font-bold mb-3">You may also like</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {reco.map((m) => {
                                const t = (m as any).title || (m as any).name;
                                const p = (m as any).poster_path ? `https://image.tmdb.org/t/p/w342${(m as any).poster_path}` : null;
                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => nav(`/movie/${m.id}`)}
                                        className="card overflow-hidden rounded-lg text-left search-result-item"
                                    >
                                        {p ? (
                                            <img src={p} alt={t} className="w-full aspect-[2/3] object-cover" />
                                        ) : (
                                            <div className="w-full aspect-[2/3] poster-thumb" />
                                        )}
                                        <div className="p-2">
                                            <div className="text-sm font-semibold">{t}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>

            {showTrailer && trailerKey && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                    onClick={() => setShowTrailer(false)}
                >
                    <div
                        className="w-full max-w-4xl mx-4 rounded-xl overflow-hidden"
                        style={{ border: "1px solid var(--border)", background: "rgba(0,0,0,.85)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative pt-[56.25%]"> {/* 16:9 */}
                            <iframe
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                                title="Trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            />
                        </div>
                        <div className="p-3 flex justify-end">
                            <button
                                onClick={() => setShowTrailer(false)}
                                className="text-sm px-3 py-1 rounded-md"
                                style={{ color: "var(--text)", background: "rgba(255,255,255,.06)", border: "1px solid var(--border)" }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetails;
