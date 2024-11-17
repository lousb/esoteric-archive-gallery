import React, { useState, useEffect } from "react";
import styles from './../header.module.css';
import { motion } from "framer-motion";
import { opacity, translate, margintop } from "../anim";
import Clock from "../../../../atoms/Clock/clock";

function Nav({ isActive }) {
  
  // Arrays of links for the navigation menu
  const socialLinks = ["Instagram", "Facebook", "Twitter"];
  const column2Links = ["Leave a Review", "Find Us"];




  // State variable to store the current year
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const column3Links = ["Site Name © "+currentYear, '', "A Wyeth Site"];

    // Find the maximum count of links in any array
    const maxLinkCount = Math.max(socialLinks.length, column2Links.length, column3Links.length);

  // Function to update the current year
  const updateYear = () => {
    setCurrentYear(new Date().getFullYear());
  };

  // UseEffect hook to update the current year every second
  useEffect(() => {
    const intervalId = setInterval(updateYear, 1000);
    return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
  }, []);

 
  // Function to animate each character of the link text
  const getChar = (title) => {
    return title.split("").map((char, index) => (
      // Framer Motion span for each animated character
      <motion.span custom={[0.15 + index * 0.02, (title.length - index) * 0.01]} variants={translate} initial="initial" animate={!isActive ? 'closed' : 'open'} key={`c_${index}`}>
        {char}
      </motion.span>
    ));
  };

  // Helper function to generate anchor tags dynamically
  const generateAnchorTags = (links) => {
  return Array.from({ length: maxLinkCount }, (_, index) => {
    const linkText = links[index] || ''; // Get the link text or use an empty string for empty links
    const isEmptyLink = linkText.trim() === '';
    const linkClassName = `${styles["header-subtext-link"]} ${isEmptyLink ? styles["empty-menu-link"] : ''}`;
    return (
      <a className={linkClassName} href="#" key={index}>
        {isEmptyLink ? '' : getChar(linkText)}
      </a>
    );
  });
  }

  return (
    <div className={styles["header-menu"]}>
      <div className={styles["header-menu-links"]}>
        {/* Render the navigation menu links */}
        {['home', 'about', 'gallery', 'contact'].map((linkText) => (
          <a className={styles["header-menu-link"]} href="#" key={linkText}>
            {getChar(linkText)}
          </a>
        ))}
      </div>
      <div className={styles["header-menu-subtext"]}>
        {/* Subtext columns */}
        <div className={styles["header-menu-subtext-col-1"]}>
          <div className={styles["header-menu-subtext-links"]}>
            {/* Render social media links */}
            {generateAnchorTags(socialLinks)}
          </div>
        </div>
        <div className={styles["header-menu-subtext-col-2"]}>
          <div className={styles["header-menu-subtext-links"]}>
            {/* Render the time in Sydney */}
            <motion.div custom={1} variants={opacity} animate={!isActive ? 'closed' : 'open'} className={`${styles["menu-time-wrap"]} ${ !isActive ? styles["empty-menu-link"] : ''}`}>

                <Clock />

            </motion.div>
            {/* Render column 2 links */}
            {generateAnchorTags(column2Links)}
          </div>
        </div>
        <div className={styles["header-menu-subtext-col-3"]}>
          <div className={styles["header-menu-subtext-links"]}>
            {/* Render column 3 links */}
            {generateAnchorTags(column3Links)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
