export default function App() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">ARJUNA TMS</p>
        <h1>Deployment-ready frontend shell</h1>
        <p className="lede">
          The original frontend source tree is currently incomplete in this workspace.
          This Vite entry restores a working deploy target for Vercel while the full UI
          files are recovered.
        </p>
        <div className="pill-row">
          <span className="pill">Vite</span>
          <span className="pill">React</span>
          <span className="pill">Vercel</span>
        </div>
      </section>

      <section className="info-grid">
        <article className="info-card">
          <h2>Frontend</h2>
          <p>Build command: <code>npm run build</code></p>
          <p>Output directory: <code>dist</code></p>
          <p>API URL: set <code>VITE_API_URL</code> in Vercel.</p>
        </article>

        <article className="info-card">
          <h2>Backend</h2>
          <p>Serverless entrypoint: <code>backend/src/server.js</code></p>
          <p>Uses <code>@vercel/node</code> with Express.</p>
          <p>Mongo URI fallback: <code>MONGO_URI</code> or <code>MONGODB_URI</code>.</p>
        </article>
      </section>
    </main>
  );
}
