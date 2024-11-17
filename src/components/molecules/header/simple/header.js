import React, { useState } from "react";
import styles from './header.module.css';

import { translate } from "./anim";
import Hamburger from "../../../atoms/buttons/hamburger/hamburger.js";

function Header() {
 
  return (
    // Framer Motion header element
    <header
      className={`${styles["minimal-header"]}`} // Set class names based on isActive state
    >
      {/* Inner content of the header */}
      <div className={styles["header-inner-content"]}> {/* Set class name for inner content */}
        {/* Header logo */}
        <div className={styles["header-logo"]}>
          <img src="/LOGO-DESKTOP.png" alt="Logo"></img>
        </div>
      </div>
    </header>
  );
}

export default Header;
