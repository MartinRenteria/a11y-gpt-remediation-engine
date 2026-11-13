import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { RemediationWorkspace } from '../components/RemediationWorkspace';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-orange-500/30">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <RemediationWorkspace />
      </main>

      <Footer />
    </div>
  );
}