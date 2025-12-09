export default function Perks() {
  return (
    <section className="perks container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center', padding: '64px 0' }}>
      <div>
        <h2 style={{ fontSize: 'clamp(32px,5vw,48px)', margin: '0 0 12px' }}>
          You have the key to subscriber-only perks*
        </h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
          Unlock exclusive discounts, invite-only events and limited perks as a member of The Gangs+.
        </p>
        <div style={{ marginTop: 16 }}>
          <a className="btn btn-neon">Sign up now</a>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
          *Perks may change without notice. Subscription required.
        </p>
      </div>

      <div className="perks-img">
        <img
          src="/public/images/perk1.png"
          alt="Subscriber perks collage"
          style={{
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,.4), 0 0 20px rgba(var(--accent-rgb),.28)',
            objectFit: 'cover',
          }}
        />
      </div>
    </section>
  );
}
