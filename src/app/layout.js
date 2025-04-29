import './globals.css';

export const metadata = {
  title: 'LavaControl',
  description: 'Sistema de procesamiento de pagos de LavaControl',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}