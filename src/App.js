import React, { useEffect, useRef } from "react";
import './App.css';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllPosts from "./components/Archive/Archive.js";
import OnePost from "./components/Album/Album.js";
import { createClient } from "@sanity/client"
import Album from "./components/Image.js";
import Header from './components/molecules/header/simple/header';
import Footer from './components/molecules/footer/small/footer.js';
import Lenis from "@studio-freight/lenis";


function App() {

  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // Adjust duration for smoother scroll
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // RAF for smooth scroll handling
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy(); // Ensure to clean up Lenis instance on unmount
    };
  }, []);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header/>
      <div className="app-wrap">
        <Routes>
          <Route path="/" element={<AllPosts />} exact/>
          <Route path="/album/:slug" element={<OnePost />} />
          <Route path="/album/:slug/:index" element={<Album />} />

        </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
