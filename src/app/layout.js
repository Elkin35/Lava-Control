import './globals.css';

export const metadata = {
  title: 'Payment System - MicroSEL',
  description: 'Payment processing system',
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