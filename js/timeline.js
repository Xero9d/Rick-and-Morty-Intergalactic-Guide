
  document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.querySelector('.timeline-container');
    const API_EPISODE_URL = 'https://rickandmortyapi.com/api/episode';

    let allEpisodes = [];

    // Función para obtener todas las páginas de una API
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

    // Agrupa los episodios por temporada
    function groupEpisodesBySeason(episodes) {
        return episodes.reduce((acc, episode) => {
            const seasonNumber = parseInt(episode.episode.substring(1, 3), 10);
            if (!acc[seasonNumber]) {
                acc[seasonNumber] = [];
            }
            acc[seasonNumber].push(episode);
            return acc;
        }, {});
    }

    // Crea el HTML para la línea de tiempo
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
                    <div class="timeline-content-expandable">
                        </div>
                </div>
            `;
        });
        timelineContainer.innerHTML = timelineHTML;
    }

    // Carga y muestra el contenido de una temporada
    async function loadSeasonContent(seasonNumber, seasonEpisodes, contentDiv) {
        contentDiv.innerHTML = '<div class="p-4 text-center">Cargando datos de la temporada...</div>';

        // 1. Crear grid de episodios
        let episodesHTML = '<h5>Episodios</h5><div class="row g-2 mb-3">';
        seasonEpisodes.forEach(ep => {
            episodesHTML += `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="episode-card h-100">
                        <strong>${ep.episode}</strong>
                        <p>${ep.name}</p>
                    </div>
                </div>
            `;
        });
        episodesHTML += '</div>';

        // 2. Crear grid de personajes destacados
        const characterUrls = [...new Set(seasonEpisodes.flatMap(ep => ep.characters))];
        const randomCharacterUrls = characterUrls.sort(() => 0.5 - Math.random()).slice(0, 8); // Tomamos 8 personajes al azar
        
        const characterPromises = randomCharacterUrls.map(url => fetch(url).then(res => res.json()));
        const characters = await Promise.all(characterPromises);
        
        let charactersHTML = '<h5>Personajes Destacados</h5><div class="row g-2">';
        characters.forEach(char => {
            charactersHTML += `
                <div class="col-4 col-md-3 col-lg-2">
                    <div class="char-card h-100">
                        <img src="${char.image}" alt="${char.name}">
                        <p>${char.name}</p>
                    </div>
                </div>
            `;
        });
        charactersHTML += '</div>';
        
        // 3. Unir todo y mostrarlo
        contentDiv.innerHTML = `<div class="p-3">${episodesHTML}${charactersHTML}</div>`;
        contentDiv.dataset.loaded = "true"; // Marcar como cargado
    }

    // Función principal de inicialización
    async function initTimeline() {
        try {
            allEpisodes = await fetchAllPages(API_EPISODE_URL);
            const seasons = groupEpisodesBySeason(allEpisodes);
            buildTimeline(seasons);
            
            document.querySelectorAll('.timeline-content-header').forEach(header => {
            header.addEventListener('click', async () => { 
                const currentItem = header.closest('.timeline-item');
                const contentDiv = currentItem.querySelector('.timeline-content-expandable');

                // Comprueba si el item que se ha clickado ya está activo
                const isAlreadyActive = currentItem.classList.contains('timeline-item--active');

                // Primero, cierra todos los items que puedan estar abiertos
                document.querySelectorAll('.timeline-item--active').forEach(activeItem => {
                    activeItem.classList.remove('timeline-item--active');
                    activeItem.querySelector('.timeline-content-expandable').style.maxHeight = null;
                });

                // Si el item que se clickó NO estaba activo, ábrelo.
                if (!isAlreadyActive) {
                    const seasonNumber = currentItem.dataset.season;
                    const seasonEpisodes = seasons[seasonNumber];

                    currentItem.classList.add('timeline-item--active'); // <-- AÑADE LA CLASE ACTIVA

                    if (contentDiv.dataset.loaded !== "true") {
                        await loadSeasonContent(seasonNumber, seasonEpisodes, contentDiv);
                    }
                    
                    contentDiv.style.maxHeight = contentDiv.scrollHeight + 50 + "px";
                }
            });
        });


        } catch (error) {
            timelineContainer.innerHTML = '<p class="text-center text-danger">No se pudo construir la línea temporal. El universo es un lugar caótico.</p>';
            console.error("Error al inicializar la línea de tiempo:", error);
        }
    }

    initTimeline();
});