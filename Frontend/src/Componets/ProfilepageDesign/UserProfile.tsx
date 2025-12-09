import React, { useEffect, useState } from "react";
import {
  FiEdit2, FiMoon, FiSun, FiLogOut, FiKey, FiSettings, FiUser, FiHeart, FiHome
} from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import Logo from "../../assets/Images/LogoTest.png";
import BackendApi from "../../services/BackendApi";
import { useModal } from "../MainPageDesign/ModalContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Recommendation, MovieLite, UserProfileData } from "../../@type";
import AvatarDefault from "../../assets/Images/avt-default.png";
import { useAuth } from "../../auth/AuthContext";
import { moviePoster } from "../../constant/GenresList";
import TheGangsLoader from "../Loading/loading";
import Header from "../MainPageDesign/Header";


/* ======================= Fake data ======================= */
const mockUserData: UserProfileData = {
  fullName: "John Anderson",
  username: "john.inventory",
  email: "john.anderson@example.com",
  birthday: "2000-01-01",
  created_at: "2023-01-15", 
  phone: "+1 (555) 123-4567",
  role: "VIP",
  lastLogin: "2024-01-20",
  totalItems: 1234,
  recentInteractions: [
    { id: 1, action: "Watched", item: "Spider-Man: No Way Home", date: "2025-10-10" },
    { id: 2, action: "Added to My List", item: "Encanto", date: "2025-10-09" },
  ],
  assignedEquipment: [
    { id: 1, name: "My List", status: "3 movies" },
    { id: 2, name: "Recommendations", status: "12 movies" },
  ],
};

/* ======================= Demo fallback data ======================= */
const DEMO_RECS: Recommendation[] = [
  {
    id: 634649,
    title: "Spider-Man: No Way Home",
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
  },
  {
    id: 497698,
    title: "Black Widow",
    poster: "https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg",
  },
  {
    id: 569094,
    title: "Spirited Away",
    poster: "https://image.tmdb.org/t/p/w500/oRvMaJOmapypFUcQqpgHMZA6qL9.jpg",
  },
  {
    id: 667538,
    title: "Transformers: Rise of the Beasts",
    poster: "https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg",
  },
  {
    id: 361743,
    title: "Top Gun: Maverick",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
  },
];


/* ======================= UI Section Wrapper ======================= */
export const ProfileSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="card rounded-lg p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

/* ======================= My List Section ======================= */
const MyListSection: React.FC<{
  items: MovieLite[];
  onRemove: (id: number) => void;
  onOpen: (m: MovieLite) => void;
  posterFit?: "cover" | "contain";
}> = ({ items, onRemove, onOpen, posterFit = "cover" }) => {
  return (
    <div className="card rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">My List</h2>

      {items.length === 0 ? (
        <div style={{ color: "var(--muted)" }}>
          You don't have any saved movies yet.
          <br />
          {/* <span style={{ fontSize: 13 }}>(*Showing demo movies instead*)</span> */}
        </div>
      ) : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-8">
      {items.map((m) => (
        <div
          key={m.id}
          onClick={() => onOpen(m)}
          className="card overflow-hidden rounded-xl hover:shadow-2xl hover:-translate-y-1 transition cursor-pointer"
          style={{ border: "1px solid var(--border)" }}
        >
          <div className="relative w-full aspect-[2/3] bg-black/40">
            <img
              src={m.poster_url}
              alt={m.title}
              className={`absolute inset-0 w-full h-full object-${posterFit}`}
            />
          </div>
          <div className="p-4 text-center">
            <h4 className="font-semibold text-sm line-clamp-2">{m.title}</h4>
          </div>
        </div>
      ))}
    </div>}

      
    </div>
  );
};

/* ======================= Main Component ======================= */
const UserProfile: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab =
    (searchParams.get("tab") as "profile" | "settings" | "my-list") || "profile";

  const [activeTab, setActiveTab] = useState<"profile" | "settings" | "my-list">(initialTab);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [myListMovies, setMyListMovies] = useState<MovieLite[]>([]);
  const { myList, removeFromList } = useModal();
  const navigate = useNavigate();
  const [isLight, setIsLight] = useState(false);

  const [userData, setUserData] = useState<UserProfileData | null>(null);

  const { user, logout } = useAuth()
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  useEffect(() => {
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      setUserData(mockUserData);
    }
  }, []);

  const goDetail = (m: { id: number }) => navigate(`/movie/${m.id}`);

  const toggleTheme = () => {
    document.body.classList.toggle("theme-light");
    setIsLight((x) => !x);
  };

  const changeTab = (t: "profile" | "settings" | "my-list") => {
    setActiveTab(t);
    const sp = new URLSearchParams(searchParams);
    sp.set("tab", t);
    setSearchParams(sp);
  };

  /* ======================= Fetch Recommendations ======================= */
  useEffect(() => {
    BackendApi.getUserRecommendations()
      .then((resp: { data?: { results?: MovieLite[] } }) => {
        const results = resp?.data?.results ?? [];
        if (!results.length) {
          setRecommendations([]);
          return;
        }
        const mapped = results.slice(0, 12).map((r) => ({
          id: r.id,
          title: r.title || r.name || "Untitled",
          poster_url: r.poster_url ? r.poster_url : moviePoster,
        }));
        setRecommendations(mapped);
      })
      .catch((e) => {
        console.error("getUserRecommendations failed:", e);
        setRecommendations(DEMO_RECS);
      });
  }, []);

  /* ======================= Fetch My List ======================= */
  useEffect(() => {
    BackendApi.getUserFavoriteMovies()
      .then((resp: { data?: { results?: MovieLite[] } }) => {
        const results = resp?.data?.results ?? [];
        if (!results.length) {
          setMyListMovies([]);
          return;
        }
        const mapped = results.slice(0, 12).map((r) => ({
          id: r.id,
          title: r.title || r.name || "Untitled",
          poster_url: r.poster_url || moviePoster,
        }));
        setMyListMovies(mapped);
      })
      .catch((e) => {
        console.error("getTrendingVideos failed:", e);
        setMyListMovies(DEMO_RECS);
      });
  }, [myList]);

  /* ======================= Render ======================= */
  if (!userData) {
    return <div><TheGangsLoader /></div>;
  }

  return (
    <div style={{ color: "var(--text)" }}>
      <Header />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="card flex justify-between items-center mb-8 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <img
                src={Logo}
                alt="Logo"
                className="w-10 h-10 object-contain cursor-pointer"
                onClick={() => navigate("/main")}
              />
              <h1 className="text-2xl md:text-3xl font-bold">User Profile</h1>
              
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors"
                aria-label="Toggle theme"
                title="Toggle theme"
                style={{
                  color: isLight ? "var(--accent)" : "var(--muted)",
                  background: "transparent",
                }}
              >
                {isLight ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
              </button>

              <div className="relative">
                <button
                  className="p-2 rounded-full transition-colors"
                  aria-label="Notifications"
                  style={{ color: "var(--muted)", background: "transparent" }}
                >
                  <IoMdNotifications className="w-6 h-6" />
                </button>
                <span
                  className="absolute top-0 right-0 h-4 w-4 rounded-full flex items-center justify-center text-xs"
                  style={{ background: "var(--accent)", color: "#111" }}
                >
                  3
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6" style={{ borderBottom: "1px solid var(--border)" }}>
            {["profile", "my-list", "settings"].map((tab) => {
              const icons: Record<string, JSX.Element> = {
                profile: <FiUser />,
                "my-list": <FiHeart />,
                settings: <FiSettings />,
              };
              return (
                <button
                  key={tab}
                  onClick={() => changeTab(tab as any)}
                  className="px-4 py-2 -mb-px"
                  style={
                    activeTab === tab
                      ? { borderBottom: "2px solid var(--accent)", color: "var(--accent)" }
                      : { color: "var(--muted)" }
                  }
                >
                  <div className="flex items-center gap-2">
                    {icons[tab]}
                    <span>{tab === "my-list" ? "My List" : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                    {tab === "my-list" && myListMovies.length > 0 && (
                      <span
                        className="ml-1 text-xs px-2 py-[2px] rounded-full"
                        style={{
                          background: "rgba(255,255,255,.06)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                        }}
                      >
                        {myListMovies.length}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tabs content */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfileSection title="Personal Information">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover bg-[#d8dee9]"
                        style={{
                          border: "4px solid rgba(255,255,255,.06)",
                          boxShadow: "0 10px 22px rgba(0,0,0,.35)",
                        }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://static-00.iconduck.com/assets.00/user-avatar-default-icon-2048x2048-nq8v9x2i.png";
                        }}
                      />
                      <button
                        className="absolute bottom-0 right-0 p-2 rounded-full"
                        aria-label="Edit profile picture"
                        style={{ background: "var(--accent)", color: "#151111" }}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </div>


                    <h3 className="mt-4 text-xl font-semibold">{user?.username}</h3>
                    <p style={{ color: "var(--muted)" }}>{mockUserData.role}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="mt-6 space-y-4">
                      <p><strong>Email:</strong> {user?.email}</p>
                      <p><strong>Birthday:</strong> {user?.birthday || "Not provided"}</p>
                      <p><strong>Created At:</strong> {user?.created_at}</p>
                    </div>
                  </div>
                </ProfileSection>

                <div className="space-y-4">
                  <button onClick={() => navigate('/preferences')} className="w-full btn">
                    <FiEdit2 /> Edit Preferences
                  </button>
                  <button className="w-full btn" style={{ background: "#EAE6DF", color: "#111" }}>
                    <FiKey /> Change Password
                  </button>
                  <button onClick={() => handleLogout()} className="w-full btn" style={{ background: "#ef4444", color: "#fff" }}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                <ProfileSection title="Account Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <p><strong>Last Login:</strong> {mockUserData.lastLogin}</p>
                    <p><strong>Total Items Managed:</strong> {mockUserData.totalItems}</p>
                  </div>
                </ProfileSection>

                <ProfileSection title="Recommended For You">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-12">
                    {(recommendations.length > 0 ? recommendations : []).map((m) => (
                      <div
                        key={m.id}
                        className="card overflow-hidden rounded-2xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:-translate-y-3 transition-all cursor-pointer"
                        style={{
                          border: "1px solid var(--border)",
                          background: "rgba(255,255,255,0.03)",
                        }}
                        onClick={() => goDetail(m)}
                      >
                        <div className="relative w-full aspect-[2/2.5] bg-black/40">
                          <img
                            src={m.poster_url}
                            alt={m.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{
                              borderRadius: "0.75rem",
                            }}
                          />
                        </div>
                        <div className="p-6 text-center">
                          <h4
                            className="font-semibold text-lg leading-snug line-clamp-2"
                            style={{ color: "var(--text)" }}
                          >
                            {m.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </ProfileSection>

              </div>
            </div>
          )}

          {activeTab === "my-list" && (
            <MyListSection
              items={myListMovies}
              onRemove={(id) => removeFromList(id)}
              onOpen={goDetail}
              posterFit="cover"
            />
          )}

          {activeTab === "settings" && (
            <div className="card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              <p style={{ color: "var(--muted)" }}>No settings yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
