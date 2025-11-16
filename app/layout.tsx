export const metadata = {
  title: "Graphique Param?trable",
  description: "Tracer des fonctions param?trables avec Python (matplotlib)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, Arial, sans-serif', color: '#0f172a', background: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
