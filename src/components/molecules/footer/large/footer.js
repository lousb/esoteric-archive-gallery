import React, { useState } from "react";
import styles from './footer.module.css';
import { motion } from "framer-motion";
import { translate } from "./anim";
import {Clock} from "../../../atoms/Clock/clock";
import Reveal from "../../../atoms/text-reveal";


function Footer() {

    const currentYear = new Date().getFullYear();

    const handleBackToTop = () => {
        const scrollContainer = document.querySelector('.scroll-container');
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }
      };

      

  return (
    <footer className={styles["footer"]}>
        <div className={styles["footer-wrap"]}>
            <div className={styles["footer-col-1"]}>
                <div className={styles["header-logo"]}>
                    <img src="/LOGO-DESKTOP.svg" alt="Logo"></img>
                    <div className={styles["footer-clock-wrap"]}>
                        <Clock/>
                    </div>

                </div>
            </div>
            <div className={styles["footer-col-2"]}>
                <a>Home</a>

                <a>About</a>
                <a>Gallery</a>
                <a>Contact</a>
            </div>
            <div className={styles["footer-col-3"]}>
                <a>Service 1</a>
                <a>Service 2</a>
                <a>Service 3</a>
                <a>Service 4</a>     

                <div className={styles["all-button"]}>
                    <Reveal textContent={'All Services'} element={"a"} elementClass={"footer-link"}/>
                </div>       
            </div>
            <div className={styles["footer-col-4"]}>
                <a>Site Name © {currentYear}</a>
                <a>A Wyeth Site</a>
                <div className={styles["back-to-top"]}>
                    <Reveal onClick={handleBackToTop} textContent={'Back to Top'} element={"a"} elementClass={"footer-link"}/>
                </div>
    
            </div>
        
        </div>
        <div className={styles["mobile-site-tag"]}>
             <a>A Wyeth Site</a>
        </div>
    </footer>
  );
}

export default Footer;
