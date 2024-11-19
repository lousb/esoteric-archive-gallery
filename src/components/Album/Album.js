import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../client.js";
import "./Album.css";
import ParallaxImage from "../atoms/parralax-image";
import RevealDiv from "../atoms/reveal-div";
import DelayLink from "../../utils/delayLink.js";
import Reveal from "../atoms/text-reveal/index.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function Album() {
  const [albumData, setAlbumData] = useState(null);
  const { slug } = useParams();
  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("gridColumns");
    return savedColumns ? parseInt(savedColumns, 10) : 4;
  });
  const columnSelectorRef = useRef(null); 

  useEffect(() => {
    localStorage.setItem("gridColumns", columns);
    ScrollTrigger.refresh();
  }, [columns]);

  useLayoutEffect(() => {
    let observer;

    const waitForElement = () => {
      const columnSelector = columnSelectorRef.current;

      if (columnSelector) {
        // Initialize ScrollTrigger once the element exists
        const trigger = ScrollTrigger.create({
          trigger: columnSelector,
          start: "top top",
          end: () => (document.body.scrollHeight - window.innerHeight), // Pin starts when the element reaches the top of the viewport // Adjust to desired scroll length
          pin: '.gallery-wrap > .div-reveal-element',
          pinSpacing: false,
        });

        ScrollTrigger.refresh(); // Ensure accurate positions after initialization

        // Cleanup
        return () => trigger.kill();
      }
    };

    // Use a MutationObserver to detect when `.column-selector` is added to the DOM
    observer = new MutationObserver(() => {
      if (columnSelectorRef.current) {
        waitForElement();
        observer.disconnect(); // Stop observing once the element is found
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (observer) observer.disconnect(); // Cleanup observer on unmount
    };
  }, []);
  
  
  
  

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
          },
          description
        }`,
        { slug }
      )
      .then((data) => {
        if (data && data.length > 0) {
          const imagesWithIndex = data[0].images.map((image, index) => ({
            ...image,
            index,
          }));
          const description = data[0].description;
          setAlbumData({ ...data[0], images: imagesWithIndex, description });
        } else {
          console.log("No album found");
        }
      })
      .catch(console.error);
  }, [slug]);

  useEffect(() => {
    // Recalculate parallax effect when columns change
    window.dispatchEvent(new Event("resize"));
  }, [columns]);

  if (!albumData) return <div>Loading...</div>;

  return (
    <div className="gallery-wrap">

        

      <RevealDiv>
        <div className="album-heading">
          <span>{albumData?.description ? albumData?.description : null}</span>
          <div className="column-selector" ref={columnSelectorRef}>
            <label>
              <input
                type="radio"
                name="columns"
                value="2"
                checked={columns === 2}
                onChange={() => setColumns(2)}
              />
              2 Columns
            </label>
            <label>
              <input
                type="radio"
                name="columns"
                value="4"
                checked={columns === 4}
                onChange={() => setColumns(4)}
              />
              4 Columns
            </label>
            <label>
              <input
                type="radio"
                name="columns"
                value="8"
                checked={columns === 8}
                onChange={() => setColumns(8)}
              />
              8 Columns
            </label>
          </div>

        </div>
        
      </RevealDiv>
      <div
        className="gallery-grid"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {albumData.images.map((img, index) => (
          <React.Fragment key={img.index}>
            <div className="gallery-item">
              <DelayLink to={`/album/${slug}/${img.index + 1}`} delay={800}>
                <RevealDiv>
                  <ParallaxImage
                    url={img.image.asset.url}
                    className="image-container"
                    index={`${index + 1}`}
                  />
                </RevealDiv>
              </DelayLink>

              <DelayLink to={`/album/${slug}/${img.index + 1}`} delay={800}>
                <Reveal
                  textContent={`${(index + 1).toString().padStart(2, "0")} ${
                    img.description ? "∙" + img.description : ""
                  }`}
                  element="div"
                  elementClass="parallax-index"
                />
              </DelayLink>
            </div>
            {(index + 1) % 5 === 0 && <div className="gallery-item empty-item" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
