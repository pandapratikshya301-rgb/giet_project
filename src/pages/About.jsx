import React from 'react';

export default function About() {
  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12 md:py-24 animate-fade-in">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-fuchsia-500/10 dark:bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent mb-6">
        About Our Project
      </h1>

      <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl text-center mb-16 leading-relaxed">
        We strive to create user interfaces that are not only performant and clean but also delightful to interact with. Here is what drives us forward.
      </p>

      {/* Grid of details */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/30 backdrop-blur hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Our Mission</h3>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
            To build fast, responsive, and aesthetically pleasing web applications that offer a top-tier user experience. We leverage modern web tools like React and Tailwind to make development clean and output outstanding.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/30 backdrop-blur hover:shadow-lg hover:shadow-fuchsia-500/5 transition-all duration-300">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Our Core Values</h3>
          <ul className="space-y-2 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
            <li className="flex items-center gap-2">
              <span className="text-violet-600">✓</span> <b>User-Centric Design:</b> We prioritize visual comfort and interaction depth.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-600">✓</span> <b>High Performance:</b> Optimized code execution and zero layout shifts.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-violet-600">✓</span> <b>Clean Development:</b> Well-structured codebase with robust patterns.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
