// js/locations.js - Versión con Filtros Avanzados

$(document).ready(function() {
    const API_BASE_URL = 'https://rickandmortyapi.com/api/location/';
    const gallery = $('#location-gallery');
    const paginationContainer = $('#pagination-container');

    // --- ELEMENTOS DEL FORMULARIO ---
    const filterForm = $('#filter-form');
    const nameInput = $('#name-input');
    const typeInput = $('#type-input');
    const dimensionInput = $('#dimension-input');

    // Función principal para obtener y mostrar ubicaciones
    async function getLocations(url) {
        gallery.html(`
            <div class="col-12 text-center py-5">
                <img src="assets/portal.gif" width="150" alt="Cargando...">
            </div>
        `);
        try {
            const response = await $.ajax({ url });
            displayLocations(response.results);
            displayPagination(response.info);
        } catch (error) {
            gallery.html('<p class="text-center text-danger col-12">¡Oh, geez! No se pudieron cargar las ubicaciones o no hay resultados para tu búsqueda.</p>');
            paginationContainer.empty();
        }
    }
    
    // Función para construir la URL con los filtros y lanzar la búsqueda
    function applyLocationFilters() {
        const params = {
            name: nameInput.val().trim(),
            type: typeInput.val().trim(),
            dimension: dimensionInput.val().trim()
        };

        // $.param() de jQuery construye la cadena de consulta (ej. name=Earth&type=Planet)
        // El segundo argumento 'true' ayuda a procesar los parámetros correctamente.
        const queryString = $.param(params, true);
        const finalUrl = `${API_BASE_URL}?${queryString}`;
        
        getLocations(finalUrl);
    }


    // --- EVENT LISTENERS ---

    // Al enviar el formulario
    filterForm.on('submit', function(e) {
        e.preventDefault();
        applyLocationFilters();
    });

    // Para la paginación
    paginationContainer.on('click', '.page-link', function(e) {
        e.preventDefault();
        const url = $(this).data('url');
        if (url) {
            getLocations(url);
        }
    });


    // --- OTRAS FUNCIONES (sin cambios) ---

    function displayLocations(locations) {
        gallery.empty();
        locations.forEach(location => {
            const card = `
                <div class="col-lg-4 col-md-6">
                    <div class="card character-card h-100">
                        <div class="card-body">
                            <h5 class="card-title logo-font accent-color">${location.name}</h5>
                            <p class="card-text mb-1"><strong>Tipo:</strong> ${location.type || 'Desconocido'}</p>
                            <p class="card-text"><strong>Dimensión:</strong> ${location.dimension || 'Desconocida'}</p>
                        </div>
                    </div>
                </div>
            `;
            gallery.append(card);
        });
    }

    function displayPagination(info) {
        paginationContainer.empty();
        let paginationHTML = '<ul class="pagination">';
        if (info.prev) {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-url="${info.prev}">Anterior</a></li>`;
        } else {
            paginationHTML += '<li class="page-item disabled"><a class="page-link" href="#">Anterior</a></li>';
        }
        if (info.next) {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-url="${info.next}">Siguiente</a></li>`;
        } else {
            paginationHTML += '<li class="page-item disabled"><a class="page-link" href="#">Siguiente</a></li>';
        }
        paginationHTML += '</ul>';
        paginationContainer.html(paginationHTML);
    }
    
    // Carga inicial de ubicaciones
    getLocations(API_BASE_URL);
});