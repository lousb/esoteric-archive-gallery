import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function RevealDiv({ children, element = "div", elementClass = "", onLoad = false }) {
    const [isVisible, setIsVisible] = useState(onLoad);
    const ref = useRef(null);

    useEffect(() => {
        if (onLoad) return; // Skip observer logic if onLoad is true

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [onLoad]);

    const MotionComponent = motion[element] || motion.div;

    const revealAnimation = {
        initial: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } },
        open: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] } },
    };

    return (
        <MotionComponent ref={ref} className={`div-reveal-element ${elementClass}`}>
            <motion.div
                className="reveal-inner"
                variants={revealAnimation}
                initial="initial"
                animate={isVisible ? "open" : "initial"}
            >
                {/* Render children immediately, animation can still depend on `isVisible` */}
                {children}
            </motion.div>
        </MotionComponent>
    );
}


export default RevealDiv;
