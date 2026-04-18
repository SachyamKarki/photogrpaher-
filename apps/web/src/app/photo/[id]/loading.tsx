export default function PhotoLoading() {
  return (
    <div className="relative flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="relative h-[72vh] w-[92vw] max-w-6xl animate-pulse rounded-2xl bg-white/10 shadow-[0_0_120px_rgba(255,255,255,0.06)]" />
    </div>
  );
}
