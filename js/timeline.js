document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.querySelector('.timeline-container');
    const API_EPISODE_URL = 'https://rickandmortyapi.com/api/episode';
    
    // Preparamos la instancia del Modal de Bootstrap que está en index.html
    const episodeModal = new bootstrap.Modal(document.getElementById('episodeModal'));

    let allEpisodes = [];

    // Función para obtener todos los episodios de la API
    async function fetchAllPages(url) {
        let results = [];
        let nextUrl = url;
        while (nextUrl) {
            const response = await fetch(nextUrl);
            const data = await response.json();
            results = results.concat(data.results);
            nextUrl = data.info.next;
        }
        return results;
    }

    // Función para agrupar los episodios por temporada
    function groupEpisodesBySeason(episodes) {
        return episodes.reduce((acc, episode) => {
            const seasonNumber = parseInt(episode.episode.substring(1, 3), 10);
            if (!acc[seasonNumber]) { acc[seasonNumber] = []; }
            acc[seasonNumber].push(episode);
            return acc;
        }, {});
    }

    // Función para construir la estructura inicial del timeline en el HTML
    function buildTimeline(seasons) {
        let timelineHTML = '';
        Object.keys(seasons).forEach((seasonNumber, index) => {
            const side = index % 2 === 0 ? 'timeline-left' : 'timeline-right';
            timelineHTML += `
                <div class="timeline-item ${side}" data-season="${seasonNumber}">
                    <div class="timeline-content-header" role="button">
                        <h4 class="logo-font">Temporada ${seasonNumber}</h4>
                        <p>${seasons[seasonNumber].length} episodios</p>
                    </div>
                    <div class="timeline-content-expandable"></div>
                </div>
            `;
        });
        timelineContainer.innerHTML = timelineHTML;
    }

    // Función para mostrar los detalles de un episodio en el modal
    async function showEpisodeDetails(episode) {
        const modalTitle = document.getElementById('modal-episode-title');
        const modalBody = document.getElementById('modal-episode-body');

        modalTitle.textContent = `${episode.episode}: ${episode.name}`;
        modalBody.innerHTML = `<p><strong>Fecha de Emisión:</strong> ${episode.air_date}</p><hr><h5>Personajes en este episodio:</h5><div class="text-center p-4"><img src="assets/portal.gif" width="100" alt="Cargando personajes..."></div>`;
        
        episodeModal.show();

        try {
            const characterPromises = episode.characters.map(url => fetch(url).then(res => res.json()));
            const characters = await Promise.all(characterPromises);
            let charactersHTML = '<div class="row g-3">';
            characters.forEach(char => {
                charactersHTML += `<div class="col-4 col-md-3"><div class="char-card h-100 text-center"><img src="${char.image}" alt="${char.name}" class="img-fluid rounded-circle mb-2" style="width: 80px;"><p class="small mb-0">${char.name}</p></div></div>`;
            });
            charactersHTML += '</div>';
            modalBody.innerHTML = `<p><strong>Fecha de Emisión:</strong> ${episode.air_date}</p><hr><h5>Personajes en este episodio:</h5>${charactersHTML}`;
        } catch (error) {
            modalBody.innerHTML += '<p class="text-danger">No se pudieron cargar los personajes.</p>';
        }
    }

    // Función para cargar el contenido de una temporada (episodios y personajes)
    async function loadSeasonContent(seasonEpisodes, contentDiv) {
        let episodesHTML = '<h5>Episodios</h5><div class="row g-2 mb-3">';
        seasonEpisodes.forEach(ep => {
            episodesHTML += `<div class="col-6 col-md-4 col-lg-3"><button class="btn episode-button w-100 h-100" data-episode-id="${ep.id}"><strong>${ep.episode}</strong><p class="small mb-0">${ep.name}</p></button></div>`;
        });
        episodesHTML += '</div>';
        
        const characterUrls = [...new Set(seasonEpisodes.flatMap(ep => ep.characters))].sort(() => 0.5 - Math.random()).slice(0, 8);
        const characterPromises = characterUrls.map(url => fetch(url).then(res => res.json()));
        const characters = await Promise.all(characterPromises);
        let charactersHTML = '<h5>Personajes Destacados</h5><div class="row g-2">';
        characters.forEach(char => {
            charactersHTML += `<div class="col-4 col-md-3 col-lg-2"><div class="char-card h-100"><img src="${char.image}" alt="${char.name}"><p>${char.name}</p></div></div>`;
        });
        charactersHTML += '</div>';
        
        contentDiv.innerHTML = `<div class="p-3">${episodesHTML}${charactersHTML}</div>`;
        contentDiv.dataset.loaded = "true";

        contentDiv.querySelectorAll('.episode-button').forEach(button => {
            button.addEventListener('click', () => {
                const episodeId = parseInt(button.dataset.episodeId, 10);
                const episodeData = allEpisodes.find(ep => ep.id === episodeId);
                if (episodeData) showEpisodeDetails(episodeData);
            });
        });
    }

    // Función principal que inicializa el timeline
    async function initTimeline() {
        try {
            allEpisodes = await fetchAllPages(API_EPISODE_URL);
            const seasons = groupEpisodesBySeason(allEpisodes);
            buildTimeline(seasons);
            
            document.querySelectorAll('.timeline-content-header').forEach(header => {
                header.addEventListener('click', async () => { 
                    const currentItem = header.closest('.timeline-item');
                    const contentDiv = currentItem.querySelector('.timeline-content-expandable');
                    const isAlreadyActive = currentItem.classList.contains('timeline-item--active');
                    document.querySelectorAll('.timeline-item--active').forEach(activeItem => {
                        activeItem.classList.remove('timeline-item--active');
                        activeItem.querySelector('.timeline-content-expandable').style.maxHeight = null;
                    });
                    if (!isAlreadyActive) {
                        currentItem.classList.add('timeline-item--active');
                        if (contentDiv.dataset.loaded !== "true") {
                            const seasonNumber = currentItem.dataset.season;
                            const seasonEpisodes = seasons[seasonNumber];
                            await loadSeasonContent(seasonEpisodes, contentDiv);
                        }
                        contentDiv.style.maxHeight = contentDiv.scrollHeight + 50 + "px";
                    }
                });
            });
        } catch (error) {
            console.error("Error al inicializar la línea de tiempo:", error);
            timelineContainer.innerHTML = '<p class="text-center text-danger">Wubba Lubba Dub Dub! Algo salió mal.</p>';
        }
    }

    initTimeline();
});