import { useState } from "react";

export const useActivation = ()=>{
    const [navbarState, setNavbarState] = useState(true)
    return {navbarState, setNavbarState}
}