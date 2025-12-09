function Stars({ score }: { score: number }) {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            color: i < score ? "#F5C542" : "#666",
            marginRight: 2,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const items = [
    {
      name: "Alex Nguyen",
      score: 5,
      text: "Stunning UI, buttery-smooth scrolling and the neon vibe is perfect.",
      avatar: "/public/images/User1.jpg",
    },
    {
      name: "Mia Tran",
      score: 4,
      text: "Love the hero trailer and auto carousels. Clean and elegant.",
      avatar: "/public/images/User2.jpg",
    },
    {
      name: "Ken Vo",
      score: 5,
      text: "Feels premium. Hover effects and glow make it pop.",
      avatar: "/public/images/User3.jpg",
    },
  ];

  return (
    <section className="container" style={{ padding: '28px 0 64px', marginTop: '-12px' }}>
      <h2 style={{ marginBottom: 22, fontSize: 30, }}>What users are saying</h2>
      <div
        className="grid-3"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        {items.map((r, i) => (
          <article
            key={i}
            className="card"
            style={{
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "center",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              boxShadow: "0 0 15px rgba(var(--accent-rgb),0.18)",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 12px",
                boxShadow: "0 0 12px rgba(var(--accent-rgb),0.32)",
              }}
            >
              <img
                src={r.avatar}
                alt={r.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Stars */}
            <Stars score={r.score} />

            {/* Text */}
            <p
              style={{
                marginTop: 12,
                color: "var(--muted)",
                fontSize: 14,
                lineHeight: 1.5,
                flexGrow: 1,
              }}
            >
              {r.text}
            </p>

            {/* Name */}
            <div
              style={{
                marginTop: 16,
                fontSize: 13,
                fontWeight: 700,
                color: "#EAE6DF",
              }}
            >
              {r.name}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
