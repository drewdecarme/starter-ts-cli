import { useEffect, useState } from "react";
export function useIntervalState(data, options) {
    const [currentIndex, setCurrentIndex] = useState(options?.initialIndex ?? 0);
    const [animationClassName, setAnimationClassName] = useState();
    useEffect(() => {
        const intervalId = setInterval(() => {
            // Trigger exit animation
            setAnimationClassName("exiting");
            setTimeout(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;
                    if (nextIndex > data.length - 1) {
                        return 0;
                    }
                    return nextIndex;
                }); // or whatever transformation you want
                // Trigger enter animation
                setAnimationClassName("entering");
            }, options?.transitionDuration ? options.transitionDuration * 1_000 : 250);
        }, options?.interval ?? 3_000);
        return () => clearInterval(intervalId); // cleanup on unmount
    }, [options?.interval, data.length, options?.transitionDuration]);
    return { currentData: data[currentIndex], animationClassName, currentIndex };
}
