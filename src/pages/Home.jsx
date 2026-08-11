import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-24 text-center animate-fade-in">
      {/* Visual Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Header */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent leading-tight max-w-3xl">
        Welcome to the home page
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl font-normal leading-relaxed">
        Discover a modern, fast, and interactive application design using React Router and Tailwind CSS. Seamlessly navigate across pages with zero reload.
      </p>

      {/* Interactive Call to Action buttons */}
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          to="/about"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35 hover:-translate-y-0.5 transition-all duration-300"
        >
          Learn More About Us
        </Link>
        <Link
          to="/contact"
          className="px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold bg-white/50 dark:bg-zinc-900/50 backdrop-blur hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:-translate-y-0.5 transition-all duration-300"
        >
          Get in Touch
        </Link>
      </div>

      {/* Feature highlight grids */}
      <div className="mt-20 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-850 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-sm hover:border-violet-500/30 transition-colors duration-300">
          <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold mb-4">
            ⚡
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Vite Speed</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Powered by Vite for sub-millisecond hot module replacement and lightning fast developer server.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-850 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-sm hover:border-fuchsia-500/30 transition-colors duration-300">
          <div className="h-10 w-10 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center font-bold mb-4">
            🛣️
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">React Router</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Declarative client-side routing allowing seamless single page navigation transitions.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-850 bg-white/40 dark:bg-zinc-900/30 backdrop-blur-sm hover:border-pink-500/30 transition-colors duration-300">
          <div className="h-10 w-10 rounded-xl bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold mb-4">
            🎨
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Tailwind CSS</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Aesthetic modern components utility-styled for pixel-perfect presentation on all devices.
          </p>
        </div>
      </div>
    </div>
  );
}
