 import React, { useEffect, useState } from "react";
 import { opacity} from "./anim";
 import './clock.css'
 
 
 // Function to display current Sydney time
 export const Clock = (isActive) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    // Convert the time to Sydney timezone
    const sydneyTime = new Date(time.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
    const hour = sydneyTime.getHours().toString().padStart(2, '0');
    const minute = sydneyTime.getMinutes().toString().padStart(2, '0');

    if(isActive) {
      return (
        // Framer Motion span for the animated time display
        //!isActive ? 'closed' : 
  
        <p custom={1} variants={opacity} animate={!isActive ? 'closed' : 'open'} className={`menu-time ${ !isActive ? "empty-menu-link" : ''}`}>
          <span className={"menu-time-func"}>
            {/* Render the animated clock */}
            {hour}<span className='colon'>:</span>{minute}
          </span>
          <span className={"menu-location"}>Sydney,</span>
          <span className={"menu-country"}> Australia</span>
        </p>
  
      );
    }



      return(
        <p custom={1} variants={opacity} animate={!isActive ? 'closed' : 'open'} className={`"menu-time" ${ !isActive ? "empty-menu-link" : ''}`}>
          <span className={"menu-time-func"}>
            {/* Render the animated clock */}
            {hour}<span className='colon'>:</span>{minute}
          </span>
          <span className={"menu-location"}>Sydney,</span>
          <span className={"menu-country"}> Australia</span>
        </p>
      )
  };

export default Clock;