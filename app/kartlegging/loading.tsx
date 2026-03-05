export default function KartleggingLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      color: '#f0f0f0',
      fontFamily: "'DM Sans', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
    }}>
      <div style={{
        maxWidth: 560,
        width: '100%',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 700,
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          Gratis AI-kartlegging
        </h1>
        <p style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 40,
          lineHeight: 1.6,
        }}>
          Fyll inn kontaktinformasjon for å starte en gratis kartlegging av hvordan AI kan effektivisere din bedrift.
        </p>

        {/* Skeleton form */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: '32px 28px',
          textAlign: 'left',
        }}>
          {['Bedriftsnavn', 'Kontaktperson', 'E-post', 'Telefon'].map((label) => (
            <div key={label} style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                marginBottom: 6,
                fontWeight: 500,
              }}>{label}</div>
              <div style={{
                height: 44,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }} />
            </div>
          ))}
          <div style={{
            height: 48,
            borderRadius: 12,
            background: 'rgba(201,169,110,0.15)',
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(201,169,110,0.6)',
            fontSize: 14,
            fontWeight: 600,
          }}>
            Laster kartlegging...
          </div>
        </div>

        <noscript>
          <div style={{
            marginTop: 24,
            padding: '16px 20px',
            background: 'rgba(255,100,100,0.1)',
            border: '1px solid rgba(255,100,100,0.2)',
            borderRadius: 12,
            fontSize: 14,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
          }}>
            Kartleggingen krever JavaScript for å fungere. Vennligst aktiver JavaScript i nettleseren din, eller ta kontakt med oss direkte på <a href="mailto:kontakt@arxon.no" style={{ color: '#c9a96e' }}>kontakt@arxon.no</a>.
          </div>
        </noscript>
      </div>
    </div>
  )
}
