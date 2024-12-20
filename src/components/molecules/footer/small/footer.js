import React, { useState, useRef, useEffect } from "react";
import styles from './footer.module.css';
import DelayLink from "../../../../utils/delayLink";

function Footer() {
    const currentYear = new Date().getFullYear();
    const [text, setText] = useState(""); // This will hold the progressively added "e"s
    const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
    const intervalRef = useRef(null); // Ref to track the interval
    const isHovered = useRef(false); // Ref to check hover state
    const textRef = useRef(text); // Ref to hold the current state of text

    // Update textRef whenever the text state changes
    useEffect(() => {
        textRef.current = text;
    }, [text]);

    // Load dark mode preference from localStorage when the component mounts
    useEffect(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        if (savedMode) {
            setIsDarkMode(JSON.parse(savedMode)); // Set the state based on saved preference
        }
    }, []);

    // Update the body class based on dark mode state
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('isDarkMode', JSON.stringify(true)); // Save dark mode preference
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('isDarkMode', JSON.stringify(false)); // Save light mode preference
        }
    }, [isDarkMode]);

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
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Toggle dark mode
    const handleModeToggle = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <footer className={styles["footer"]}>
            <div className={styles["footer-wrap"]}>
                <div className={styles["footer-col-1"]}>
                    <div className={styles["header-logo"]}>
                        <DelayLink to={'/'} delay={800}>
                            <img src="/LOGO-DESKTOP.png" alt="Logo" />
                        </DelayLink>
                    </div>
                </div>
                <div className={styles["footer-col-2"]}>
                    {/* Toggle button for dark mode */}
                    <div>
                        <label className={styles["toggle-label"]}>
                            Mode: {isDarkMode ? "Dark" : "Light"}
                            <input
                                type="checkbox"
                                checked={isDarkMode}
                                onChange={handleModeToggle}
                                className={styles["mode-toggle"]}
                            />
                            <span className={styles["toggle-slider"]}></span>
                        </label>
                    </div>
                </div>
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
