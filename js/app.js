// js/app.js - Versión con Filtros Avanzados

$(document).ready(function() {
    const API_BASE_URL = 'https://rickandmortyapi.com/api/character/';
    const gallery = $('#character-gallery');
    const paginationContainer = $('#pagination-container');
    const characterModal = new bootstrap.Modal(document.getElementById('characterModal'));

    // --- ELEMENTOS DEL FORMULARIO ---
    const filterForm = $('#filter-form');
    const searchInput = $('#search-input');
    const statusFilter = $('#status-filter');
    const genderFilter = $('#gender-filter');

    // Función principal para obtener y mostrar personajes
    async function getCharacters(url) {
        gallery.html(`
            <div class="col-12 text-center py-5">
                <img src="assets/portal.gif" width="150" alt="Cargando...">
            </div>
        `);
        try {
            const response = await $.ajax({ url });
            if (response.results.length === 0) {
                gallery.html('<p class="text-center text-warning col-12">No se encontraron personajes con esos filtros. ¡Inténtalo de nuevo, Jerry!</p>');
                paginationContainer.empty();
            } else {
                displayCharacters(response.results);
                displayPagination(response.info);
            }
        } catch (error) {
            gallery.html('<p class="text-center text-danger col-12">¡Oh, geez! No se pudieron cargar los personajes. La API podría no haber encontrado nada.</p>');
            paginationContainer.empty();
        }
    }

    // Función para construir la URL con los filtros actuales y lanzar la búsqueda
    function applyFilters() {
        // URLSearchParams es una forma moderna y segura de construir URLs con parámetros
        const params = new URLSearchParams();
        
        const name = searchInput.val().trim();
        const status = statusFilter.val();
        const gender = genderFilter.val();

        if (name) params.append('name', name);
        if (status) params.append('status', status);
        if (gender) params.append('gender', gender);

        const finalUrl = `${API_BASE_URL}?${params.toString()}`;
        getCharacters(finalUrl);
    }

    // --- EVENT LISTENERS ---

    // Al enviar el formulario
    filterForm.on('submit', function(e) {
        e.preventDefault();
        applyFilters();
    });

    // También aplicamos los filtros automáticamente si el usuario cambia un desplegable
    statusFilter.on('change', applyFilters);
    genderFilter.on('change', applyFilters);

    // Para la paginación
    paginationContainer.on('click', '.page-link', function(e) {
        e.preventDefault();
        const url = $(this).data('url');
        if (url) {
            getCharacters(url);
        }
    });

    // --- OTRAS FUNCIONES (sin cambios) ---

    function displayCharacters(characters) {
        gallery.empty();
        characters.forEach(character => {
            const statusClass = character.status.toLowerCase();
            const card = `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card character-card h-100">
                        <img src="${character.image}" class="card-img-top" alt="${character.name}" loading="lazy">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title logo-font accent-color">${character.name}</h5>
                            <p class="card-text">
                                <span class="status-indicator ${statusClass}"></span>
                                ${character.status} - ${character.species}
                            </p>
                            <button class="btn btn-secondary mt-auto" onclick="showCharacterDetails(${character.id})">
                                Ver más detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
            gallery.append(card);
        });
    }

    window.showCharacterDetails = async function(characterId) {
        try {
            const response = await fetch(`${API_BASE_URL}${characterId}`);
            const character = await response.json();
            $('#modal-character-name').text(character.name);
            $('#modal-character-body').html(`
                <div class="row"><div class="col-md-5"><img src="${character.image}" class="img-fluid rounded"></div><div class="col-md-7"><p><strong>Estado:</strong> ${character.status}</p><p><strong>Especie:</strong> ${character.species}</p><p><strong>Género:</strong> ${character.gender}</p><p><strong>Origen:</strong> ${character.origin.name}</p><p><strong>Ubicación Actual:</strong> ${character.location.name}</p></div></div>
            `);
            characterModal.show();
        } catch (error) {
            alert('No se pudieron cargar los detalles del personaje.');
        }
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
    
    // Carga inicial de personajes
    getCharacters(API_BASE_URL);
});