import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../../../client";
import Reveal from "../../../atoms/text-reveal";
import RevealDiv from "../../../atoms/reveal-div";
import DelayLink from "../../../../utils/delayLink";
import './stack.css'

export default function Album() {
  const { slug } = useParams(); // Destructure params directly here
  const [albumData, setAlbumData] = useState(null);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [imagesToShow, setImagesToShow] = useState(1); // State to control how many images to show initially

  useEffect(() => {
    window.scrollTo(0, 0);
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

  if (!albumData) return <Reveal element="p" textContent={'Loading...'}/>;

  const handleMouseMove = (event) => {
    const windowWidth = window.innerWidth;
    if (event.clientX < windowWidth / 2) {
      setCursorStyle("w-resize"); // Cursor on the left side
    } else {
      setCursorStyle("e-resize"); // Cursor on the right side
    }
  };

  const handleClick = () => {
    // Add one more image to the stack when clicked
    if (imagesToShow < albumData.images.length) {
      setImagesToShow(imagesToShow + 1);
    }
  };

  return (
    <div className="lightbox stack" 
      onMouseMove={handleMouseMove} // Track mouse movement
      style={{ cursor: cursorStyle }} 
      onClick={handleClick}> {/* Add click handler to show one more image */}
        
        {/* Stack all images vertically */}
        <div className="lightbox-images-stack">
          {albumData.images.slice(0, imagesToShow).map((currentImage) => (
            <div key={currentImage.index} className="lightbox-image-item">
              <img src={currentImage.image.asset.url} alt={`Image ${currentImage.index}`} />
            </div>
          ))}
        </div>
    </div>
  );
}
