import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = forwardRef(({ url, className, index }, ref) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [isReady, setIsReady] = useState(false); // State to check if the image is ready

  // Expose control methods to the parent via ref
  useImperativeHandle(ref, () => ({
    resetParallax: () => {
      if (imageRef.current) {
        gsap.to(imageRef.current, { y: 0, duration: 0.2, ease: "power1.out" });
      }
    },
    updateParallax: () => {
      applyParallax();
    },
  }));

  const applyParallax = () => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) return;

    // Wait until the image is fully loaded and the height is valid
    if (!isReady) return;

    const imageHeight = image.offsetHeight;
    const maxParallax = imageHeight * 0.1; // Max 10% of image height

    gsap.to(image, {
      y: 0, // Start with 0 position
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        pin: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const translateY = maxParallax * (progress * 2 - 1); // From -maxParallax to +maxParallax
          gsap.set(image, { y: translateY });
        },
      },
    });
  };

  const resetAndRefresh = () => {
    if (imageRef.current) {
      const image = imageRef.current;
      gsap.to(image, {
        y: 0, // Reset to initial position
        duration: 0.4,
        ease: "power1.out",
        onComplete: () => {
          ScrollTrigger.refresh(); // Ensure correct start and end points
          applyParallax(); // Reapply parallax after refresh
        },
      });
    }
  };

  const handleImageLoad = () => {
    setIsReady(true); // Set the image as ready once loaded
  };

  useEffect(() => {
    // Listen for image load to ensure it's ready
    const image = imageRef.current;
    if (image) {
      image.addEventListener("load", handleImageLoad);
    }

    return () => {
      if (image) {
        image.removeEventListener("load", handleImageLoad);
      }
    };
  }, []);

  useEffect(() => {
    // Apply parallax only after image is ready
    if (isReady) {
      applyParallax();
    }

    const handleResize = debounce(() => {
      resetAndRefresh();
    }, 200);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isReady]); // Re-run when image is ready

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

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
