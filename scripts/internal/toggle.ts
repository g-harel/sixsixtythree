import {useState, useEffect} from "react";

// Dev helper to toggle between true and false at the specified interval.
export const useToggle = (delay: number): boolean => {
    const [toggle, setToggle] = useState(true);

    useEffect(() => {
        const handle = setTimeout(() => setToggle(!toggle), delay);
        return () => clearTimeout(handle);
    });

    return toggle;
};
