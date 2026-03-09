import Generator from "@/components/generator";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8 md:p-24 selection:bg-primary/30">

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-5xl items-center justify-between flex flex-col font-mono text-sm relative">
        <Generator />
      </div>

      <footer className="absolute bottom-4 text-slate-400 text-sm opacity-70">

      </footer>
    </main>
  );
}
