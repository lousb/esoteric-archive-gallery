import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import client from "../client";
import Reveal from "./atoms/text-reveal";
import RevealDiv from "./atoms/reveal-div";
import DelayLink from "../utils/delayLink";

export default function Album() {
  const { slug, index } = useParams(); // Destructure params directly here
  const [albumData, setAlbumData] = useState(null);
  const navigate = useNavigate();
  const [cursorStyle, setCursorStyle] = useState("default");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "album" && slug.current == $slug]{
          title,
          "images": images[]{
            image{
              asset->{
                _id,
                url
              }
            },
            description
          }
        }`,
        { slug }
      )
      .then((data) => {
        console.log('Fetched data:', data);
        if (data && data.length > 0) {
          const imagesWithIndex = data[0].images.map((image, index) => ({
            ...image,
            index,
          }));
          setAlbumData({ ...data[0], images: imagesWithIndex });
          window.scrollTo(0, 0);
        } else {
          console.log('No album found');
        }
      })
      .catch(console.error);
  }, [slug]);


  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
    };
  }, []); 

  // Ensure that the index exists and parse it directly without subtracting 1
  const currentImageIndex = parseInt(index, 10) - 1; // Adjust index by 1 for 0-based array indexing
  const currentImage = albumData ? albumData.images[currentImageIndex] : null;

  if (!albumData || !currentImage) return <div>Loading...</div>;

  const handleNavigate = (direction) => {
    let newIndex = currentImageIndex + direction;

    // Wrap around the image indices if necessary
    if (newIndex < 0) newIndex = albumData.images.length - 1;
    if (newIndex >= albumData.images.length) newIndex = 0;

    // Navigate to the new image
    navigate(`/album/${slug}/${newIndex + 1}`); // Add 1 to make it 1-based index
  };

  // Handle click on the left and right of the screen to navigate
  const handleClick = (event) => {
    const windowWidth = window.innerWidth;
    if (event.clientX < windowWidth / 2) {
      handleNavigate(-1); // Clicked on the left side, go to the previous image
    } else {
      handleNavigate(1); // Clicked on the right side, go to the next image
    }
  };

  const handleMouseMove = (event) => {
    const windowWidth = window.innerWidth;
    if (event.clientX < windowWidth / 2) {
      setCursorStyle("w-resize"); // Cursor on the left side
    } else {
      setCursorStyle("e-resize"); // Cursor on the right side
    }
  };

  const formattedIndex = (currentImageIndex + 1).toString().padStart(2, "0");

  return (
    <div className="lightbox" 
      onMouseMove={handleMouseMove} // Track mouse movement
      style={{ cursor: cursorStyle }}>
        <div className="lightbox-details-container-top">
        <DelayLink to={`/album/${albumData.title.replace(/\s+/g, '-').toLowerCase()}`} delay={800}>
            <Reveal textContent={albumData.title} element="h2"/>
          </DelayLink>
        </div>
        <div className="lightbox-image-container" onClick={handleClick}>
            <RevealDiv>
                <img src={currentImage.image.asset.url} alt={`Image ${currentImage.index}`} />
            </RevealDiv>
        </div>
        <div className="lightbox-details-container-bottom">
            <Reveal textContent={currentImage.description || ""} element="p"/>
          <p></p>
          <Reveal textContent={formattedIndex} element="p"/>
        </div>
    </div>
  );
}
