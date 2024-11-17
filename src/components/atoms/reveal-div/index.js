import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function RevealDiv({ children, element = "div", elementClass = "" }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                // Only set isVisible to true if the element is intersecting
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 } // Adjust threshold as needed
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    // Determine the motion component based on the "element" prop
    const MotionComponent = motion[element] || motion.div; // Use motion.div as a fallback

    const revealAnimation = {
        initial: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } },
        open: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } },
    };

    return (
        <MotionComponent
            ref={ref}
            className={`div-reveal-element ${elementClass}`}
        >
            <motion.div
                className="reveal-inner"
                variants={revealAnimation}
                initial="initial"
                animate={isVisible ? "open" : "initial"} // Remain in initial if not visible
            >
                {children}
            </motion.div>
        </MotionComponent>
    );
}

export default RevealDiv;
