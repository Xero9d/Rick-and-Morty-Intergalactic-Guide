document.addEventListener('DOMContentLoaded', () => {

    const clickSound = document.getElementById('click-sound');
    
    if (!clickSound) {
        console.error("¡Error! No se encontró el elemento <audio> con id='click-sound'.");
    }

    const clickableSelectors = [
        'a.btn', 'button', '.page-link', '.timeline-content-header', 
        '.gif-link', '.character-card .btn', '.navbar-brand', '.nav-link', '#portal-gif'
    ].join(',');

    document.addEventListener('click', (event) => {
        const clickableElement = event.target.closest(clickableSelectors);

        if (clickableElement && clickSound) {
            clickSound.currentTime = 0;
            clickSound.play();

            // Comprobamos si el elemento es un enlace de navegación interno
            const isInternalNav = clickableElement.tagName === 'A' &&
                                  clickableElement.href &&
                                  clickableElement.target !== '_blank' &&
                                  !clickableElement.href.startsWith('#');

            if (isInternalNav) {
                // 1. Prevenimos la navegación inmediata
                event.preventDefault();

                // 2. Aplicamos la clase para el efecto de desvanecimiento
                document.body.classList.add('page-fade-out');

                const destination = clickableElement.href;
                const transitionDuration = 400; // Debe coincidir con la duración en el CSS

                // 3. Esperamos a que la animación termine y luego navegamos
                setTimeout(() => {
                    window.location.href = destination;
                }, transitionDuration);
            }
        }
    });
});