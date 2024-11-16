import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../client";

export default function Album() {
  const { slug, index } = useParams(); // Destructure params directly here
  const [albumData, setAlbumData] = useState(null);
  const navigate = useNavigate();

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
        } else {
          console.log('No album found');
        }
      })
      .catch(console.error);
  }, [slug]);

  // Ensure that the index exists and parse it to an integer
  const currentImageIndex = parseInt(index, 10);
  const currentImage = albumData ? albumData.images[currentImageIndex] : null;

  if (!albumData || !currentImage) return <div>Loading...</div>;

  const handleNavigate = (direction) => {
    const currentIndex = currentImageIndex;
    let newIndex = currentIndex + direction;

    // Wrap around the image indices if necessary
    if (newIndex < 0) newIndex = albumData.images.length - 1;
    if (newIndex >= albumData.images.length) newIndex = 0;

    // Navigate to the new image
    navigate(`/album/${slug}/${newIndex}`);
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

  return (
    <div onClick={handleClick} className="lightbox" style={{ cursor: 'pointer' }}>
      <h2>{albumData.title}</h2>
      <div className="image-container">
        <img src={currentImage.image.asset.url} alt={`Image ${currentImage.index + 1}`} />
        <p>{currentImage.description || "No description"}</p>
      </div>
    </div>
  );
}
