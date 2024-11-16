// src/app/layout.js
import '@/app/globals.css'  // Using the @/ alias to reference from root

export const metadata = {
  title: 'Sports Arbitrage Calculator',
  description: 'Calculate arbitrage opportunities across different sportsbooks',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}