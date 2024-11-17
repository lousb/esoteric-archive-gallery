// Define opacity animation variants with initial, open, and closed states
export const opacity = {
    initial:{
        opacity: 0
    },
    open:{
        opacity:1,
        transition:{duration:0.65, delay: 0.55}
    },
    closed:{
        opacity:0,
        transition:{duration:0.65},
        
    }
}