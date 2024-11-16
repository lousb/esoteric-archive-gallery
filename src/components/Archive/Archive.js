import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../client.js";

export default function LookbookAlbums() {
  const [albums, setAlbums] = useState([]);

  // Function to fetch the album data
  const fetchAlbums = () => {
    client
      .fetch(
        `*[_type == "album"]{
          _id,
          title,
          slug
        }`
      )
      .then((data) => {
        setAlbums(data); // Set the state with the fetched album data
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchAlbums();

    return () => {
      // Add cleanup logic if needed in the future
    };
  }, []);

  return (
    <div>
      <h2>Lookbook Albums</h2>
      <h3>Explore our collection of lookbook albums!</h3>
      <div>
        {albums.length > 0 ? (
          albums.map((album) => (
            <Link to={"/album/" + album.slug.current} key={album._id}>
              <span>
                <h2>{album.title}</h2>
              </span>
            </Link>
          ))
        ) : (
          <p>No albums available</p>
        )}
      </div>
    </div>
  );
}
