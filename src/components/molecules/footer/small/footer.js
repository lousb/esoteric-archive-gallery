import React, { useState, useRef } from "react";
import styles from './footer.module.css';

function Footer() {
    const currentYear = new Date().getFullYear();
    const [text, setText] = useState(""); // This will hold the progressively added "e"s
    const intervalRef = useRef(null); // Ref to track the interval
    const isHovered = useRef(false); // Ref to check hover state
    const textRef = useRef(text); // Ref to hold the current state of text

    // Update textRef whenever the text state changes
    React.useEffect(() => {
        textRef.current = text;
    }, [text]);

    // Handle hover start (enter)
    const handleHoverStart = () => {
        if (!isHovered.current) {
            isHovered.current = true; // Set hover state to true

            const targetText = "ee"; // Target string we want to reach ("eee")
            let index = 0;

            // Add "e"s progressively on hover
            intervalRef.current = setInterval(() => {
                if (index < targetText.length) {
                    setText((prev) => prev + targetText[index]); // Add "e"s one by one
                    index++;
                } else {
                    clearInterval(intervalRef.current); // Stop the interval once targetText is reached
                }
            }, 200); // 0.2s delay for each "e" addition
        }
    };

    // Handle hover end (leave)
    const handleHoverEnd = () => {
        if (isHovered.current) {
            isHovered.current = false; // Set hover state to false

            // Remove the "e"s progressively
            const removeInterval = setInterval(() => {
                setText((prev) => prev.slice(0, prev.length - 1)); // Remove "e"s one by one
                // Stop the interval once we've removed all "e"s
                if (textRef.current.length === 0) {
                    clearInterval(removeInterval);
                }
            }, 200); // 0.2s delay for each "e" removal
        }
    };

    // Cleanup intervals on component unmount
    React.useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <footer className={styles["footer"]}>
            <div className={styles["footer-wrap"]}>
                <div className={styles["footer-col-1"]}>
                    <div className={styles["header-logo"]}>
                        <img src="/LOGO-DESKTOP.png" alt="Logo" />
                    </div>
                </div>
                <div className={styles["footer-col-2"]}></div>
                <div className={styles["footer-col-3"]}></div>
                <div className={styles["footer-col-4"]}>
                    <p>Esoteric Art Studio © {currentYear}</p>
                    <a
                        href="https://wyeeeth.com"
                        target="_blank"
                        className={styles["wyeth-link"]}
                        onMouseEnter={handleHoverStart}
                        onMouseLeave={handleHoverEnd}
                    >
                        <span>A </span>
                        <span className={styles["hover-text"]}>
                            {`Wye${text}th`} {/* Dynamically update the text with "e"s */}
                        </span>
                        <span> Site</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
