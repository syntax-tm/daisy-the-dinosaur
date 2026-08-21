import { useState, useEffect } from "react";
import { Breakpoint } from "@/types/enums";

export function useBreakpoint() {
    const getDevice = (width: number) => {
        if (width < 640) return Breakpoint.MOBILE;         // < sm
        if (width < 1024) return Breakpoint.TABLET;        //   sm  - lg
        if (width < 1280) return Breakpoint.LAPTOP;        //   lg  - xl
        if (width < 1536) return Breakpoint.DESKTOP;       //   xl  - 2xl
        if (width < 1920) return Breakpoint.DESKTOP_LG;    //   2xl Full HD
        if (width < 2560) return Breakpoint.DESKTOP_XL;    //   2K QHD
        if (width < 3840) return Breakpoint.DESKTOP_2XL;   //   4K UHD
        if (width < 7680) return Breakpoint.DESKTOP_3XL;   //   8K UHD
        return Breakpoint.DESKTOP_4XL;                     // > 8K
    };

    const [device, setDevice] = useState(() =>
        typeof window !== "undefined" ? getDevice(window.innerWidth) : "desktop"
    );

    useEffect(() => {
        const handleResize = () => setDevice(getDevice(window.innerWidth));
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return device;
}
