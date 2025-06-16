// js/locations.js
$(document).ready(function() {
    const API_URL = 'https://rickandmortyapi.com/api/location/';
    const gallery = $('#location-gallery');
    const searchForm = $('#search-form');
    const searchInput = $('#search-input');
    const paginationContainer = $('#pagination-container');

    async function getLocations(url) {

        try {
            const response = await $.ajax({ url });
            displayLocations(response.results);
            displayPagination(response.info);
        } catch (error) {
            gallery.html('<p class="text-center text-danger">¡Oh, geez! No se pudieron cargar las ubicaciones.</p>');
        }
    }

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
        // Esta función es idéntica a la de app.js
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
    
    paginationContainer.on('click', '.page-link', function(e) {
        e.preventDefault();
        const url = $(this).data('url');
        if (url) {
            getLocations(url);
        }
    });

    searchForm.on('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.val().trim();
        getLocations(`${API_URL}?name=${searchTerm}`);
    });

    getLocations(API_URL);
});