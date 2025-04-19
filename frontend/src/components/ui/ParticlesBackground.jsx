import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBackground() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = useMemo(() => ({
        background: {
            color: { value: '#000000' }
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: { enable: true, mode: 'push' },
                onHover: { enable: true, mode: 'repulse' },
            },
            modes: {
                push: { quantity: 4 },
                repulse: { distance: 50, duration: 0.4 },
            },
        },
        particles: {
            color: { value: '#00ffff' },
            links: {
                color: '#c2b4d1',
                distance: 150,
                enable: false,
                opacity: 0.8,
                width: 1,
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: { default: 'bounce' },
                random: true,
                speed: 3,
                straight: false,
            },
            number: {
                density: { enable: true, area: 800 },
                value: 60,
            },
            opacity: { value: 0.8 },
            shape: { type: 'circle' },
            size: { value: { min: 2, max: 5 } },
        },
        detectRetina: true,
    }), []);

    return init ? (
        <Particles id="tsparticles" options={options} className="absolute inset-0 -z-10 opacity-70" />
    ) : null;
}