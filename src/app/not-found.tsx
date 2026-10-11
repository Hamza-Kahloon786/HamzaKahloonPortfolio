import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

export default function NotFound() {
  return (
    <main className="container-x relative grid min-h-svh place-items-center py-32 text-center">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-[120px]" />
      <div className="relative">
        <p className="text-outline font-display text-[clamp(7rem,24vw,18rem)] leading-none">404</p>
        <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
          This page drifted <span className="italic text-gradient">out of the network.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-mist">The link may be broken or the page may have moved. Let&apos;s get you back to something real.</p>
        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-paper"
        >
          <LuArrowLeft className="transition-transform group-hover:-translate-x-1" /> Back home
        </Link>
      </div>
    </main>
  );
}
