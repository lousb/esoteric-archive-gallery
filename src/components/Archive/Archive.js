import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../client.js";
import Reveal from "../atoms/text-reveal/index.js";
import DelayLink from "../../utils/delayLink.js";
import './Archive.css';
import RevealDiv from "../atoms/reveal-div/index.js";

export default function LookbookAlbums() {
  const [albums, setAlbums] = useState([]);

  const fetchAlbums = () => {
    window.scrollTo(0, 0);
    client
      .fetch(
        `*[_type == "lookbook" && title == "Lookbook"]{
          albums[]->{
            _id,
            title,
            slug,
            images[] {
              image {
                asset->{
                  _id,
                  url
                }
              },
              description
            }
          }
        }`
      )
      .then((data) => {
        console.log("Fetched lookbook data:", data);
        if (data.length > 0) {
          const albums = data[0].albums || [];
          setAlbums(albums); // Set the albums only if images are fetched
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="archive-page">
      <RevealDiv>
        <h2>
          The gallery archive of Esoteric Art Studio ⸺ A quiet curation of high quality, low quantity accessories.
        </h2>
      </RevealDiv>
      <Reveal element={'p'} textContent={'(Hover to view album)'}/>
      <div className="album-items">
      {albums.length > 0 ? (
          albums.map((album) => {
            const firstImage =
              album.images && album.images.length > 0
                ? album.images[0].image.asset.url
                : null;

            return (
              <div className="album-item-wrap">
              <DelayLink delay={800} to={"/album/" + album.slug.current} key={album._id}>
                <div className="album-item">
                  <Reveal textContent={album.title} element={"h2"} />
                </div>
              </DelayLink>

              <div className="album-image-wrap">

                {firstImage ? (
                  <RevealDiv onLoad={true}>
                    <img src={firstImage} alt={album.title} className="album-image" style={{display:'none'}}/>
                  </RevealDiv>
                ) : (
                  <Reveal element={'p'} textContent={'No image available'}/>
                )}
              </div>

              </div>


            );
          })
        ) : (
          <Reveal element={'p'} textContent={'No albums available'}/>
        )}
      </div>
     
    </div>
  );
}
