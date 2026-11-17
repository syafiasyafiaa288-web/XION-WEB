import './globals.css';

export const metadata = {
  title: '✨ Ai Hoshino Deploy',
  description: 'Deploy HTML, CSS, JS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="stars" aria-hidden="true"></div>
        {children}
      </body>
    </html>
  );
}