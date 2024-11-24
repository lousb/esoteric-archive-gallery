import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = forwardRef(({ url, className, index }, ref) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageHeight, setImageHeight] = useState(0);

  useImperativeHandle(ref, () => ({
    resetParallax: () => {
      if (imageRef.current) {
        gsap.to(imageRef.current, { y: 0, duration: 0.2, ease: "power1.out" });
      }
    },
    updateParallax: () => {
      setupParallax();
    },
  }));

  const setupParallax = () => {
    if (!containerRef.current || !imageRef.current || !isImageLoaded) return;

    const container = containerRef.current;
    const image = imageRef.current;
    const maxParallax = imageHeight * 0.1;

    ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const translateY = maxParallax * (self.progress * 2 - 1); // Calculate translateY from -maxParallax to +maxParallax
        gsap.to(image, { y: translateY, overwrite: "auto", ease: "none" });
      },
      invalidateOnRefresh: true,
    });
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageHeight(imageRef.current.offsetHeight);
      setIsImageLoaded(true);
    }
  };

  const handleResize = () => {
    if (imageRef.current) {
      const newHeight = imageRef.current.offsetHeight;
      setImageHeight(newHeight);
      ScrollTrigger.refresh(); // Ensure ScrollTrigger recalculates positions
    }
  };

  useEffect(() => {
    const image = imageRef.current;

    // Handle cases where the image is already loaded
    if (image.complete) {
      handleImageLoad();
    } else {
      image.addEventListener("load", handleImageLoad);
    }

    const resizeObserver = new ResizeObserver(() => {
      // Avoid direct DOM updates inside the ResizeObserver
      requestAnimationFrame(() => {
        handleResize();
      });
    });

    if (image) {
      resizeObserver.observe(image);
    }

    return () => {
      image.removeEventListener("load", handleImageLoad);
      resizeObserver.disconnect();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Clean up all ScrollTriggers
    };
  }, []);


  useEffect(() => {
    if (isImageLoaded && imageHeight > 0) {
      setupParallax();
    }
  }, [isImageLoaded, imageHeight]); // Run setup when image is loaded and height is available

  return (
    <div className="parallax-wrap">
      <div
        className={`parallax-image-container ${className}-wrap ${className}-wrap-parallax-div-index-on-page`}
        ref={containerRef}
      >
        <img
          src={url}
          className={`${className} image-container`}
          ref={imageRef}
          alt=""
        />
      </div>
    </div>
  );
});

export default ParallaxImage;
