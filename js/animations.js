document.addEventListener("DOMContentLoaded", function() {
    // Selecciona todas las secciones que deben tener la animación
    const sections = document.querySelectorAll('.fade-in-section');

    // Opciones para el IntersectionObserver
    const options = {
        root: null, // El viewport del navegador
        rootMargin: '0px',
        threshold: 0.15 // El 15% del elemento debe ser visible para disparar la animación
    };

    // El observador
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si la sección es visible, añade la clase 'is-visible'
                entry.target.classList.add('is-visible');
                // Deja de observar este elemento para que la animación no se repita
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Pone a cada sección bajo observación
    sections.forEach(section => {
        observer.observe(section);
    });
});

tsParticles.load("particles-js", {
    fpsLimit: 60,
    particles: {
        number: {
            value: 100, 
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            // Mezcla de colores: 2 partes de blanco, 1 de verde
            value: ["#ffffff", "#97F024", "#ffffff"] 
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.8,
            random: true,
        },
        size: {
            value: 3,
            random: true,
        },
        line_linked: {
            enable: false
        },
        move: {
            enable: true,
            speed: 1.5, 
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
        },
        // Efecto de brillo para las partículas
        shadow: {
            enable: true,
            color: "#97F024",
            blur: 20
        }
    },
    interactivity: {
        events: {
            onhover: {
                enable: true,
                mode: "bubble"
            },
            onclick: {
                enable: true,
                mode: "repulse"
            }
        },
        modes: {
            bubble: {
                distance: 200,
                size: 5,
                duration: 2,
                opacity: 1
            },
            repulse: {
                distance: 150
            }
        }
    },
    retina_detect: true
});