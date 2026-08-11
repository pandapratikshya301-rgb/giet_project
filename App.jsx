import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './src/components/Navbar.jsx';
import Home from './src/pages/Home.jsx';
import About from './src/pages/About.jsx';
import Contact from './src/pages/Contact.jsx';
import Library from './library.jsx';
import Shop from './src/pages/Shop/Shop.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
        {/* Navigation Bar */}
        <Navbar />

        {/* Page Content area with responsive constraints */}
        <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 justify-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/library" element={<Library />} />
            <Route path="/shop/*" element={<Shop />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
