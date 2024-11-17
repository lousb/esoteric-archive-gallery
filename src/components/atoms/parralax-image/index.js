import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = forwardRef(({ url, className, index }, ref) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

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

    const imageHeight = image.offsetHeight;
    const maxParallax = imageHeight * 0.1; // Max 10% of image height

    gsap.to(image, {
      y: maxParallax,
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
      const imageHeight = image.offsetHeight;
      const maxParallax = imageHeight * 0.1;

      gsap.to(image, {
        y: 0, // Reset to initial position
        duration: 0.4,
        ease: "power1.out",
        onComplete: () => {
          ScrollTrigger.refresh(); // Ensure correct start and end points
        },
      });
    }
  };

  useEffect(() => {
    applyParallax();

    const handleResize = debounce(() => {
      resetAndRefresh();
    }, 200);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

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
        <img src={url} className={`${className} image-container`} ref={imageRef} />
      </div>
    </div>
  );
});

export default ParallaxImage;
