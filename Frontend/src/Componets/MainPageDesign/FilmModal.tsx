import React, { useEffect, useRef, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import { useModal } from "./ModalContext";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const FilmModal: React.FC = () => {
  const { openId, close, myList, addToList, removeFromList, open } = useModal();
  const [details, setDetails] = useState<any | null>(null);
  const [recs, setRecs] = useState<any[]>([]);
  const [credits, setCredits] = useState<any | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (openId) {
      GlobalApi.getMovieDetails(openId).then((r: any) => setDetails(r.data));
      GlobalApi.getMovieRecommendations(openId).then((r: any) =>
        setRecs(r.data.results || [])
      );
      GlobalApi.getMovieCredits(openId).then((r: any) => setCredits(r.data));
      setTimeout(() => {
        if (contentRef.current) contentRef.current.scrollTop = 0;
      }, 0);
    } else {
      setDetails(null);
      setRecs([]);
      setCredits(null);
    }
  }, [openId]);

  if (!openId || !details) return null;

  const isInList = myList.includes(openId);

  const goToDetailsPage = () => {
    close(); 
    navigate(`/movie/${openId}`); 
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={close}
    >
      <div
        className="bg-[#0b0b0b] text-white max-w-6xl w-full mx-4 rounded-lg overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[220px] md:h-[320px] flex-shrink-0">
          <img
            src={IMAGE_BASE_URL + details.backdrop_path}
            className="w-full h-full object-cover"
            alt={details.title}
          />
          <button
            className="absolute right-4 top-4 bg-black/50 px-3 py-1 rounded"
            onClick={close}
          >
            Close
          </button>
        </div>

        <div
          ref={contentRef}
          style={{ maxHeight: "calc(90vh - 220px)" }}
          className="p-6 overflow-y-auto scrollbar-none"
        >
          <div className="flex items-start gap-6">
            <img
              src={IMAGE_BASE_URL + details.poster_path}
              className="w-[120px] rounded"
              alt={details.title}
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold">
                {details.title}{" "}
                <span className="text-sm text-gray-300">
                  ({details.release_date?.slice(0, 4)})
                </span>
              </h2>

              <div className="mt-2 text-sm text-gray-300 flex gap-3 items-center">
                <div>{details.runtime}m</div>
                <div>{details.genres?.map((g: any) => g.name).join(", ")}</div>
                <div>{details.adult ? "18+" : "PG-13"}</div>
              </div>

              <p className="text-sm text-gray-300 mt-4">{details.overview}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={goToDetailsPage}
                  className="bg-[#F2C46A] text-black font-semibold px-4 py-2 rounded hover:opacity-90"
                >
                  Details
                </button>

                {isInList ? (
                  <button
                    onClick={() => removeFromList(openId)}
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Remove from My List
                  </button>
                ) : (
                  <button
                    onClick={() => addToList(openId)}
                    className="bg-green-600 px-4 py-2 rounded"
                  >
                    Add to My List
                  </button>
                )}

                <button
                  onClick={() => {
                  }}
                  className="bg-white text-black px-4 py-2 rounded"
                >
                  Play
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold">Top cast</h3>
                <div className="flex gap-3 mt-2">
                  {credits?.cast?.slice(0, 6).map((c: any) => (
                    <div key={c.cast_id} className="text-sm">
                      <div className="w-[80px] h-[100px] bg-gray-800 rounded overflow-hidden">
                        <img
                          src={IMAGE_BASE_URL + c.profile_path}
                          className="w-full h-full object-cover"
                          alt={c.name}
                        />
                      </div>
                      <div className="mt-1">{c.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Recommendations</h3>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
              {recs.slice(0, 20).map((r) => (
                <div
                  key={r.id}
                  className="w-full cursor-pointer"
                  onClick={() => open(r.id)}
                >
                  <img
                    src={IMAGE_BASE_URL + r.poster_path}
                    className="w-full h-[220px] object-cover rounded"
                    alt={r.title}
                  />
                  <div className="text-sm text-white truncate mt-2">
                    {r.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmModal;
