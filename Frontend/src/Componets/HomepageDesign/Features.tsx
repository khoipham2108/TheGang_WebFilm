export default function Features() {
  return (
    <section className="features container">
      <div style={{ position: 'relative' }}>
        <img
          src="/public/images/Feature2.png"
          alt="Devices mockup"
          style={{
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        />
        {/* <video
          src="/devices.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        ></video> */}
      </div>

      <div>
        <h2 style={{ fontSize: 'clamp(32px,5vw,48px)', margin: '0 0 12px' }}>
          Watch the way you want.
        </h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
          Enjoy an ever-growing selection of Originals and blockbusters. Download select
          titles, create up to 7 profiles, and use parental controls. Cancel anytime.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <a className="btn btn-neon">Start Watching</a>
          <a className="btn">Learn More</a>
        </div>
      </div>
    </section>
  );
}
