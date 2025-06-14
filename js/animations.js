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