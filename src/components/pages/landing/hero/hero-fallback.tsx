export default function HeroFallback() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content skeleton */}
          <div className="space-y-6">
            {/* Available badge */}
            <div className="h-6 w-48 rounded-full bg-muted animate-pulse" />

            {/* Main heading */}
            <div className="h-12 w-full max-w-md rounded-lg bg-muted animate-pulse" />

            {/* Subtitle */}
            <div className="h-6 w-64 rounded-lg bg-muted animate-pulse" />

            {/* Description lines */}
            <div className="space-y-3 pt-2">
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
              <div className="h-4 w-4/6 rounded bg-muted animate-pulse" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <div className="h-11 w-36 rounded-full bg-muted animate-pulse" />
              <div className="h-11 w-32 rounded-full bg-muted animate-pulse" />
            </div>
          </div>

          {/* Right image skeleton */}
          <div className="flex justify-center lg:justify-end">
            <div className="h-[380px] w-[280px] rounded-2xl bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
