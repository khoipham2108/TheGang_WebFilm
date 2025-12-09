export default function MegaFooter() {
  const Col = ({ title, items }: { title: string; items: string[] }) => (
    <div>
      <h4>{title}</h4>
      <ul>
        {items.map((t, i) => (
          <li key={i}>
            <a href="#">{t}</a>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <footer className="mega">
      <div className="container">
        <div className="cols">
          <Col
            title="Learn More"
            items={[
              "Subscriber Agreement",
              "Privacy Policy",
              "Supplemental Privacy Policy",
              "Interest‑Based Ads",
            ]}
          />
          <Col
            title="Help"
            items={["Help Center", "Supported Devices", "About Us"]}
          />
          <Col
            title="Brands"
            items={[
              "Disney",
              "Pixar",
              "Marvel",
              "Star Wars",
              "National Geographic",
              "Star",
            ]}
          />
          <Col
            title="Collections"
            items={[
              "All Collections",
              "Binge‑worthy Series",
              "Action & Adventure",
              "Comedies",
              "Drama",
              "Horror",
            ]}
          />
        </div>
        <div className="social">
          <span>𝕏</span>
          <span>Facebook</span>
          <span>Instagram</span>
          <span>TikTok</span>
          <span>YouTube</span>
        </div>
        <div className="copy">
          © {new Date().getFullYear()} Pham Quynh Nhu and related entities. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
