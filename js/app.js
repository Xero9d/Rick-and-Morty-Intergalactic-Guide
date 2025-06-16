$(document).ready(function() {
    const API_URL = 'https://rickandmortyapi.com/api/character/';
    const gallery = $('#character-gallery');
    const searchForm = $('#search-form');
    const searchInput = $('#search-input');
    const paginationContainer = $('#pagination-container');
    const characterModal = new bootstrap.Modal(document.getElementById('characterModal'));

    // Función principal para obtener y mostrar personajes
    async function getCharacters(url) {

        try {
            const response = await $.ajax({ url }); // Usando jQuery.ajax como pide el enunciado
            displayCharacters(response.results);
            displayPagination(response.info);
        } catch (error) {
            gallery.html('<p class="text-center text-danger">¡Oh, geez! No se pudieron cargar los personajes. Inténtalo de nuevo.</p>');
        }
    }

    // Función para mostrar los personajes en la galería
    function displayCharacters(characters) {
        gallery.empty(); // Limpiar galería anterior
        characters.forEach(character => {
            const statusClass = character.status.toLowerCase();
            const card = `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card character-card h-100">
                        <img src="${character.image}" class="card-img-top" alt="${character.name}">
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

    // Función para mostrar los detalles en el modal
    window.showCharacterDetails = async function(characterId) {
        try {
            // Usando fetch de JS moderno para mostrar la alternativa
            const response = await fetch(`${API_URL}${characterId}`);
            const character = await response.json();

            $('#modal-character-name').text(character.name);
            $('#modal-character-body').html(`
                <div class="row">
                    <div class="col-md-5">
                        <img src="${character.image}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-7">
                        <p><strong>Estado:</strong> ${character.status}</p>
                        <p><strong>Especie:</strong> ${character.species}</p>
                        <p><strong>Género:</strong> ${character.gender}</p>
                        <p><strong>Origen:</strong> ${character.origin.name}</p>
                        <p><strong>Ubicación Actual:</strong> ${character.location.name}</p>
                    </div>
                </div>
            `);
            characterModal.show();
        } catch (error) {
            alert('No se pudieron cargar los detalles del personaje.');
        }
    }

    // Función para crear la paginación
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
    
    // Evento para la paginación
    paginationContainer.on('click', '.page-link', function(e) {
        e.preventDefault();
        const url = $(this).data('url');
        if (url) {
            getCharacters(url);
        }
    });

    // Evento para el formulario de búsqueda
    searchForm.on('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.val().trim();
        getCharacters(`${API_URL}?name=${searchTerm}`);
    });

    // Carga inicial de personajes
    getCharacters(API_URL);

});