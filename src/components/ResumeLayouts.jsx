export function ModernResume({ data, colors }) {
  const [c1, c2, c3] = colors || ['#1e1b4b', '#312e81', '#4f46e5'];
  const headerBg = `linear-gradient(135deg, ${c1}, ${c2})`;

  return (
    <div className="resume-modern">
      <div className="resume-header" style={{ background: headerBg, padding: '40px', color: 'white' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>{data.name || 'Your Name'}</div>
        <div style={{ fontSize: '1.2rem', opacity: 0.9, fontWeight: 500 }}>{data.title || 'Professional Title'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px', fontSize: '0.9rem' }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
        </div>
      </div>
      <div className="resume-body" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', padding: '40px', gap: '40px', background: 'white', color: '#333' }}>
        <div className="resume-sidebar">
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ borderBottom: `2px solid ${c3}`, color: c3, paddingBottom: '5px', marginBottom: '15px', fontSize: '1.1rem', textTransform: 'uppercase' }}>Skills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.skills?.map((s, i) => <div key={i} style={{ fontSize: '0.9rem' }}>• {s}</div>)}
            </div>
          </div>
        </div>
        <div className="resume-main">
          {data.summary && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ borderBottom: `2px solid ${c3}`, color: c3, paddingBottom: '5px', marginBottom: '15px', fontSize: '1.1rem', textTransform: 'uppercase' }}>Summary</h3>
              <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>{data.summary}</p>
            </div>
          )}
          {data.experience?.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ borderBottom: `2px solid ${c3}`, color: c3, paddingBottom: '5px', marginBottom: '15px', fontSize: '1.1rem', textTransform: 'uppercase' }}>Experience</h3>
              {data.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '20px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{exp.role}</div>
                  <div style={{ color: c3, fontWeight: 600 }}>{exp.company} | {exp.start} - {exp.end || 'Present'}</div>
                  <p style={{ fontSize: '0.95rem', marginTop: '8px', whiteSpace: 'pre-wrap' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function MinimalResume({ data, colors }) {
  const [c1, c2, c3] = colors || ['#111', '#555', '#222'];
  
  return (
    <div className="resume-minimal" style={{ padding: '50px', background: 'white', color: '#222', fontFamily: 'serif' }}>
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${c1}`, paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.8rem', margin: 0, color: c1 }}>{data.name}</h1>
        <div style={{ fontSize: '1.1rem', marginTop: '5px', color: c2 }}>{data.title}</div>
        <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
          {data.email} | {data.phone} | {data.location}
        </div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: c1, borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>Profile</h3>
        <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>{data.summary}</p>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: c1, borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>Experience</h3>
        {data.experience?.map((exp, i) => (
          <div key={i} style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>{exp.role}</span>
              <span>{exp.start} - {exp.end || 'Present'}</span>
            </div>
            <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>{exp.company}</div>
            <p style={{ fontSize: '0.95rem' }}>{exp.description}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: c1, borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>Education</h3>
        {data.education?.map((edu, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>{edu.degree}</span>
              <span>{edu.start} - {edu.end || 'Present'}</span>
            </div>
            <div>{edu.institution}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: c1, borderBottom: '1px solid #ddd', paddingBottom: '3px' }}>Skills</h3>
        <p style={{ fontSize: '1rem' }}>{data.skills?.join(', ')}</p>
      </div>
    </div>
  )
}

export function CreativeResume({ data, colors }) {
  const [c1, c2, c3] = colors || ['#0f172a', '#1e1b4b', '#6366f1'];
  return (
    <div className="resume-creative" style={{ background: 'white', minHeight: '1000px' }}>
      <div style={{ background: c1, color: 'white', padding: '50px' }}>
        <h1 style={{ margin: 0, fontSize: '3rem' }}>{data.name}</h1>
        <div style={{ color: c3, fontSize: '1.2rem', fontWeight: 600 }}>{data.title}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '40px', gap: '40px' }}>
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: c1 }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
            <div>Email: {data.email}</div>
            <div>Phone: {data.phone}</div>
            <div>Location: {data.location}</div>
          </div>
          <h3 style={{ color: c1, marginTop: '30px' }}>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {data.skills?.map(s => <span key={s} style={{ background: c1, color: 'white', padding: '3px 8px', borderRadius: '5px', fontSize: '0.8rem' }}>{s}</span>)}
          </div>
        </div>
        <div>
          <h3 style={{ color: c1 }}>Experience</h3>
          {data.experience?.map(exp => (
            <div key={exp.role} style={{ marginBottom: '20px' }}>
              <div style={{ fontWeight: 800 }}>{exp.role}</div>
              <div style={{ color: c3 }}>{exp.company}</div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
