"use client";

import { useEffect, useMemo, useState } from "react";

type LineStyle = "solid" | "dashed" | "dotted";

const defaultParams = {
  expr: "sin(x)",
  xmin: -10,
  xmax: 10,
  samples: 1000,
  title: "y = sin(x)",
  color: "#2563eb",
  linewidth: 2,
  linestyle: "solid" as LineStyle,
};

export default function Page() {
  const [expr, setExpr] = useState(defaultParams.expr);
  const [xmin, setXmin] = useState<number>(defaultParams.xmin);
  const [xmax, setXmax] = useState<number>(defaultParams.xmax);
  const [samples, setSamples] = useState<number>(defaultParams.samples);
  const [title, setTitle] = useState(defaultParams.title);
  const [color, setColor] = useState(defaultParams.color);
  const [linewidth, setLinewidth] = useState<number>(defaultParams.linewidth);
  const [linestyle, setLinestyle] = useState<LineStyle>(defaultParams.linestyle);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const qs = useMemo(() => {
    const params = new URLSearchParams();
    params.set("expr", expr);
    params.set("xmin", String(xmin));
    params.set("xmax", String(xmax));
    params.set("samples", String(samples));
    params.set("title", title);
    params.set("color", color);
    params.set("linewidth", String(linewidth));
    params.set("linestyle", linestyle);
    // cache-busting
    params.set("_", String(Date.now()));
    return params.toString();
  }, [expr, xmin, xmax, samples, title, color, linewidth, linestyle]);

  const endpoint = useMemo(() => `/api/plot.py?${qs}`, [qs]);

  const renderPlot = async () => {
    setLoading(true);
    setError("");
    try {
      // Just set the URL; the <img> will fetch it
      setImgUrl(endpoint);
    } catch (e: any) {
      setError(e?.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-render on initial load
    renderPlot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Graphique param?trable</h1>
      <p style={{ color: "#475569", marginBottom: 24 }}>
        Entrez une expression en fonction de <code>x</code> (ex: <code>sin(x)</code>, <code>exp(-x**2)</code>, <code>sin(2*x) * cos(x/3)</code>), choisissez le domaine et le style.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, alignItems: "start" }}>
        <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Expression y(x)</div>
              <input
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                placeholder="sin(x)"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8 }}
              />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>x min</div>
              <input
                type="number"
                value={xmin}
                onChange={(e) => setXmin(Number(e.target.value))}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8 }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>x max</div>
              <input
                type="number"
                value={xmax}
                onChange={(e) => setXmax(Number(e.target.value))}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8 }}
              />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>?chantillons</div>
              <input
                type="number"
                min={50}
                max={20000}
                value={samples}
                onChange={(e) => setSamples(Number(e.target.value))}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8 }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Titre</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du graphique"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8 }}
              />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Couleur</div>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", height: 42, border: "1px solid #cbd5e1", borderRadius: 8 }}
              />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>?paisseur</div>
              <input
                type="number"
                min={1}
                max={10}
                value={linewidth}
                onChange={(e) => setLinewidth(Number(e.target.value))}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8 }}
              />
            </label>

            <label>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Style</div>
              <select
                value={linestyle}
                onChange={(e) => setLinestyle(e.target.value as LineStyle)}
                style={{ width: "100%,", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8 }}
              >
                <option value="solid">Plein</option>
                <option value="dashed">Tirets</option>
                <option value="dotted">Pointill?s</option>
              </select>
            </label>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button onClick={renderPlot} disabled={loading} style={{ background: "#0ea5e9", color: "white", border: 0, borderRadius: 8, padding: "10px 14px", fontWeight: 600 }}>
              {loading ? "Rendu..." : "Tracer"}
            </button>
            {imgUrl && (
              <a href={imgUrl} download="plot.png" style={{ background: "#e2e8f0", color: "#0f172a", textDecoration: "none", borderRadius: 8, padding: "10px 14px", fontWeight: 600 }}>
                T?l?charger PNG
              </a>
            )}
          </div>

          {error && <div style={{ color: "#b91c1c", marginTop: 12 }}>{error}</div>}
        </section>

        <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {imgUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgUrl} alt="Graphique" style={{ maxWidth: "100%", maxHeight: 480, borderRadius: 8, border: "1px solid #e2e8f0" }} />
          ) : (
            <div style={{ color: "#64748b" }}>Cliquez sur Tracer pour g?n?rer l'image.</div>
          )}
        </section>
      </div>

      <footer style={{ marginTop: 24, color: "#64748b" }}>
        Python c?t? serveur (matplotlib) via une fonction serverless.
      </footer>
    </main>
  );
}
