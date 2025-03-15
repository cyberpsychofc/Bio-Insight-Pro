import React, { useState, useEffect } from "react";

export default function AnimatedNumber({ value }) {
    const [count, setCount] = useState(0.00);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const frameRate = 10;
        const totalFrames = duration / frameRate;
        let frame = 0;

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1;
        };

        const interval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easedProgress = easeInOutQuad(progress);
            const newValue = start + easedProgress * (value - start);

            setCount(parseFloat(newValue.toFixed(2)));

            if (frame >= totalFrames) {
                setCount(parseFloat(value.toFixed(2)));
                clearInterval(interval);
            }
        }, frameRate);
        return () => clearInterval(interval);
    }, [value]);

    return (
        <div className="mt-12 items-center justify-center flex text-8xl">
            {count.toFixed(2)}
        </div>
    );
}