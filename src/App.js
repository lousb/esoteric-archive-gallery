import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllPosts from "./components/Archive/Archive.js";
import OnePost from "./components/Album/Album.js";
import { createClient } from "@sanity/client"
import Album from "./components/Image.js";

function App() {


  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<AllPosts />} exact/>
          <Route path="/album/:slug" element={<OnePost />} />
          <Route path="/album/:slug/:index" element={<Album />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
