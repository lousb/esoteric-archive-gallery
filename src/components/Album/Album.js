import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../../client.js";

export default function Album() {
  const [albumData, setAlbumData] = useState(null);
  const { slug } = useParams();

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

  if (!albumData) return <div>Loading...</div>;

  return (
    <div>
      <h2>{albumData.title}</h2>
      <div>
        {albumData.images.map((img) => (
          <div key={img.index}>
            <Link to={`/album/${slug}/${img.index}`}>
              <img src={img.image.asset.url} alt={`Image ${img.index + 1}`} />
            </Link>
            <p>{img.index + 1}</p> {/* Display 1-based index */}
            <p>{img.description || "No description"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
