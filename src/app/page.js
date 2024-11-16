// src/app/page.js
import ArbitrageForm from '@/components/ArbitrageForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Sports Arbitrage Calculator
        </h1>
        <ArbitrageForm />
      </div>
    </main>
  );
}
