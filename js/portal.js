document.addEventListener('DOMContentLoaded', () => {
    const portalGif = document.getElementById('portal-gif');
    const resultArea = document.getElementById('location-result');

    const API_BASE_URL = 'https://rickandmortyapi.com/api/';

    // Variable para almacenar el número total de ubicaciones
    let totalLocations = 0;

    // Obtenemos el número total de ubicaciones al cargar la página
    async function getTotalLocations() {
        try {
            const response = await fetch(`${API_BASE_URL}location`);
            const data = await response.json();
            totalLocations = data.info.count; // Guardamos el total
        } catch (error) {
            console.error("Error al obtener el total de ubicaciones:", error);
            resultArea.innerHTML = `<p class="text-danger">No se pudo contactar con el Consejo de Ricks. Inténtalo de nuevo.</p>`;
        }
    }

    // Función principal que se activa al hacer clic en el portal
    async function travelToRandomLocation() {
        if (totalLocations === 0) {
            resultArea.innerHTML = `<p class="text-danger">El portal no está calibrado. Vuelve a intentarlo.</p>`;
            return;
        }
        
        // Muestra un mensaje de "Viajando..."
        resultArea.style.display = 'block';
        resultArea.innerHTML = `<p class="lead">Abriendo portal a una dimensión aleatoria...</p>`;

        // Genera un ID de ubicación aleatorio
        const randomLocationId = Math.floor(Math.random() * totalLocations) + 1;

        try {
            // Obtiene los datos de la ubicación aleatoria
            const locationResponse = await fetch(`${API_BASE_URL}location/${randomLocationId}`);
            const locationData = await locationResponse.json();

            let featuredCharacterHTML = '<p>Esta ubicación está deshabitada o sus habitantes son demasiado tímidos.</p>';
            
            // Si hay residentes, elige uno al azar
            if (locationData.residents && locationData.residents.length > 0) {
                const randomResidentUrl = locationData.residents[Math.floor(Math.random() * locationData.residents.length)];
                
                // Obtiene los datos del personaje residente
                const characterResponse = await fetch(randomResidentUrl);
                const characterData = await characterResponse.json();
                
                // Crea la tarjeta del personaje
                featuredCharacterHTML = `
                <h5 class="logo-font mb-0">Habitante Destacado</h5>
                <div class="row justify-content-center">
                    <div class="col-auto">
                        <div class="featured-character-card d-flex align-items-center">
                            <img src="${characterData.image}" alt="${characterData.name}" class="img-fluid rounded-circle me-3" style="width: 160px;">
                            <div>
                                <h6 class="logo-font mb-0">${characterData.name}</h6>
                                <span class="text-muted">${characterData.species}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            }

            // Muestra toda la información en la tarjeta de resultado
            resultArea.innerHTML = `
                <div class="location-card">
                    <h3>${locationData.name}</h3>
                    <p class="text-muted">Dimensión: ${locationData.dimension || 'Desconocida'} | Tipo: ${locationData.type || 'Desconocido'}</p>
                    <hr class="my-4">
                    <div class="location-image-placeholder"></div>
                    ${featuredCharacterHTML}
                </div>
            `;

        } catch (error) {
            console.error("Error durante el viaje interdimensional:", error);
            resultArea.innerHTML = `<p class="text-danger">¡El portal colapsó! Intenta viajar de nuevo.</p>`;
        }
    }

    // Asigna el evento de clic al portal
    portalGif.addEventListener('click', travelToRandomLocation);

    // Precarga el número total de ubicaciones al iniciar
    getTotalLocations();

});