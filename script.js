var bounds = [[0, 0], [1033, 1522]];
var paddedBounds = [[-200, -200], [1233, 1722]];

var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -1.2, // Evita alejar infinitamente (antes estaba en -10)
    maxZoom: 3,    // Límite de acercamiento razonable
    zoomSnap: 0.1,
    zoomDelta: 0.5,
    zoomControl: false, // Desactivamos el control por defecto para reubicarlo
    maxBounds: paddedBounds, // Limita el arrastre para no perder el mapa
    maxBoundsViscosity: 0.8 // Efecto de rebote/resistencia en los bordes
});

// Control de zoom en la parte inferior derecha al estilo Google Maps
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

L.imageOverlay('img/plano.png', bounds).addTo(map);

map.fitBounds(bounds);

let modoCreadorActivo = false;
let puntosCreador = [];
let polylineCreador = null;

// Funciones del creador de rutas
window.toggleModoCreador = function () {
    modoCreadorActivo = !modoCreadorActivo;
    const btn = document.getElementById('btn-toggle-creator');
    const panel = document.getElementById('creator-panel');

    if (modoCreadorActivo) {
        btn.classList.add('active');
        panel.style.display = 'block';
        document.getElementById('map').style.cursor = 'crosshair';
    } else {
        btn.classList.remove('active');
        panel.style.display = 'none';
        document.getElementById('map').style.cursor = '';
    }
};

window.limpiarTrazado = function () {
    puntosCreador = [];
    if (polylineCreador) map.removeLayer(polylineCreador);
    document.getElementById('output-coordenadas').value = "";
};

map.on('click', function (e) {
    if (modoCreadorActivo) {
        const y = Math.round(e.latlng.lat);
        const x = Math.round(e.latlng.lng);
        puntosCreador.push([y, x]);

        if (polylineCreador) map.removeLayer(polylineCreador);

        polylineCreador = L.polyline(puntosCreador, {
            color: '#1a73e8', // Color azul Google
            weight: 4
        }).addTo(map);

        document.getElementById('output-coordenadas').value = JSON.stringify(puntosCreador);
    } else {
        console.log(e.latlng);
    }
});

const ESCALA_METROS_POR_PIXEL = 0.28;
const VELOCIDAD_CAMINANDO_MPS = 1.4;

const rutasPredefinidas = {
    'banos': [[48, 241], [169, 361], [199, 389], [225, 365]],
    'aulas': [[49, 237], [59, 254], [76, 269], [105, 298], [157, 350], [182, 372], [204, 345]],
    'aulas2': [[54, 244], [93, 286], [142, 335], [208, 398], [238, 427], [263, 446], [300, 461], [324, 473], [362, 509], [385, 541], [405, 583], [417, 623], [419, 665], [359, 669], [317, 670], [314, 692]],
    'aulas3': [[51, 244], [117, 310], [165, 357], [208, 400], [242, 431], [265, 448], [295, 458], [319, 470], [339, 487], [367, 511], [382, 539], [398, 570], [417, 627], [420, 669], [419, 762], [417, 830], [415, 858], [392, 857], [392, 876]],
    'seguridad': [[49, 227], [52, 219], [54, 210], [56, 202], [64, 197]],
    'secretaria2': [[52, 245], [157, 348], [190, 379], [221, 413], [247, 437], [280, 452], [314, 467], [354, 500], [375, 526], [393, 558], [411, 605], [417, 644], [428, 657], [449, 656], [465, 656], [467, 638]],
    'secretaria': [[51, 240], [64, 259], [70, 266], [79, 275], [90, 285], [101, 299], [115, 306], [123, 318], [134, 330], [144, 337], [153, 342], [159, 334], [167, 325], [175, 318], [178, 314]],
    'kiosco': [[49, 242], [78, 271], [131, 324], [180, 370], [211, 399], [231, 423], [256, 443], [296, 458], [320, 471], [342, 490], [370, 519], [389, 549], [403, 586], [416, 620], [419, 658], [419, 719], [417, 755], [418, 781], [416, 813], [384, 815]],
    'laboratorio': [[55, 247], [141, 333], [235, 425], [252, 439], [264, 445], [278, 452], [295, 458], [315, 467], [331, 480], [352, 496], [364, 512], [375, 529], [387, 546], [400, 575], [411, 608], [418, 633], [416, 662], [413, 667], [377, 670], [326, 669], [315, 669], [314, 693]]
};

const lugaresDataInfo = {
    'banos': { title: 'Baños', desc: 'Sanitarios públicos ubicados en el sector central.', images: ['img/baño1.jpeg'] },
    'aulas': { title: 'Aulas', desc: 'Sector principal de cursada.', images: ['img/aula40.jpeg', 'img/aula40-3.jpeg', 'img/aula40-2.jpeg'] },
    'aulas2': { title: 'Laboratorio', desc: 'Segundo sector de aulas.', images: ['img/aula2.jpeg', 'img/aula21.jpeg', 'img/aulta22.jpeg', 'img/aulta23.jpeg',] },
    'aulas3': { title: 'Aulas', desc: 'Tercer sector de aulas.', images: ['img/aula3.jpeg'] },
    'seguridad': { title: 'Seguridad', desc: 'Puesto de control y vigilancia.', images: ['img/seguridad.jpeg'] },
    'secretaria': { title: 'ISFT n°240', desc: 'Atención al alumno e informes.', images: ['img/n240.jpg'] },
    'secretaria2': { title: 'CFL 407', desc: 'Atención al alumno e informes.', images: ['img/cfl-407.jpg'] },
    'kiosco': { title: 'Kiosco', desc: 'Buffet, comidas y fotocopias.', images: ['img/kiosco-foto.jpg'] },
    'laboratorio': { title: 'Laboratorio', desc: 'Prácticas y ciencias.', images: ['img/aula2.jpeg'] } // Placeholder img
};

let destinoActualId = null;
let currentImageIndex = 0;
let currentImagesArray = [];

window.mostrarInfoLugar = function (destinoId) {
    limpiarRuta(); // Limpia cualquier ruta previa
    destinoActualId = destinoId;
    const data = lugaresDataInfo[destinoId];

    // 1. Mostrar información en el panel lateral (foto y texto)
    if (data) {
        document.getElementById('place-title').innerText = data.title;
        document.getElementById('place-desc').innerText = data.desc;

        // Configurar carrusel
        currentImagesArray = data.images || [];
        if (data.img && currentImagesArray.length === 0) currentImagesArray.push(data.img); // Fallback por si usan 'img' en vez de 'images'
        currentImageIndex = 0;
        actualizarCarruselUI();

        document.getElementById('place-info-panel').style.display = 'flex';
        document.getElementById('destinations-list').classList.remove('active');
        document.getElementById('search-input').value = data.title;
    }

    // 2. Trazar la ruta automáticamente
    const ruta = rutasPredefinidas[destinoId];
    if (ruta) {
        // Dibujar borde blanco
        rutaBordeLayer = L.polyline(ruta, {
            color: '#ffffff', weight: 10, lineCap: 'round', lineJoin: 'round', opacity: 0.8
        }).addTo(map);

        // Dibujar ruta azul
        rutaActualLayer = L.polyline(ruta, {
            color: '#1a73e8', weight: 6, lineCap: 'round', lineJoin: 'round'
        }).addTo(map);

        // Ajustar vista
        //map.fitBounds(rutaActualLayer.getBounds(), { padding: [50, 50], paddingTopLeft: [400, 50] }); ANTERIOR
        map.fitBounds(rutaActualLayer.getBounds(), { padding: [25, 25], paddingTopLeft: [200, 25] });
        // Calcular distancia y tiempo
        const distanciaMetros = Math.round(calcularDistanciaRuta(ruta));
        const tiempoSegundos = distanciaMetros / VELOCIDAD_CAMINANDO_MPS;
        const tiempoMinutos = Math.ceil(tiempoSegundos / 60);

        // Mostrar recuadro de distancia dentro del panel
        const routeDetailsInline = document.getElementById('route-details-inline');
        if (routeDetailsInline) {
            routeDetailsInline.style.display = 'flex';
            document.getElementById('distancia-valor').innerText = `(${distanciaMetros} m)`;
            document.getElementById('tiempo-valor').innerText = tiempoMinutos + ' min';
        }
    }
};

window.cerrarInfoLugar = function () {
    document.getElementById('place-info-panel').style.display = 'none';
    document.getElementById('search-input').value = '';
    destinoActualId = null;
    limpiarRuta();
    map.fitBounds(bounds); // Volver al zoom general
};

let rutaActualLayer = null;
let rutaBordeLayer = null;

function calcularDistanciaRuta(ruta) {
    let distanciaPixeles = 0;
    for (let i = 0; i < ruta.length - 1; i++) {
        const p1 = ruta[i];
        const p2 = ruta[i + 1];
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];
        distanciaPixeles += Math.sqrt(dx * dx + dy * dy);
    }
    return distanciaPixeles * ESCALA_METROS_POR_PIXEL;
}

window.limpiarRuta = function () {
    if (rutaActualLayer) {
        map.removeLayer(rutaActualLayer);
        rutaActualLayer = null;
    }
    if (rutaBordeLayer) {
        map.removeLayer(rutaBordeLayer);
        rutaBordeLayer = null;
    }

    const routeDetailsInline = document.getElementById('route-details-inline');
    if (routeDetailsInline) routeDetailsInline.style.display = 'none';
}

let initialZoom = null;

map.on('zoom', function () {
    let zoom = map.getZoom();
    if (initialZoom === null) initialZoom = zoom;

    let scale = Math.pow(2, (initialZoom - zoom) * 0.6);

    if (scale < 0.60) scale = 0.60;
    if (scale > 5) scale = 5;

    document.documentElement.style.setProperty('--icon-scale', scale);
});

setTimeout(() => {
    initialZoom = map.getZoom();
    document.documentElement.style.setProperty('--icon-scale', 1);
}, 200);

function crearIconoZoom(url) {
    return L.divIcon({
        className: 'contenedor-icono',
        html: `<img src="${url}" class="imagen-marcador">`,
        iconSize: [0, 0] // El ancla y transformaciones se manejan en CSS
    });
}

var iconoAula = crearIconoZoom('img/aula.png');
var iconoEntrada = crearIconoZoom('img/entrada.png');
var iconoOficina = crearIconoZoom('img/oficina.png');
var iconoBaño = crearIconoZoom('img/baño.png');
var iconoKiosco = crearIconoZoom('img/kiosco.png');
var iconoPosicion = crearIconoZoom('img/posicion.png');

// Opciones de popup para estilizarlo como Google Maps
const popupOptions = {
    className: 'custom-google-popup',
    closeButton: false,
    offset: [0, -10]
};

// Además de bindPopup, agregamos evento de click para abrir el panel lateral
L.marker([180, 313], { icon: iconoOficina }).addTo(map).bindPopup("<b>Secretaría</b>", popupOptions).on('click', () => mostrarInfoLugar('secretaria'));
L.marker([463, 635], { icon: iconoOficina }).addTo(map).bindPopup("<b>Secretaría2</b>", popupOptions).on('click', () => mostrarInfoLugar('secretaria2'));
L.marker([231, 365], { icon: iconoBaño }).addTo(map).bindPopup("<b>Baños</b>", popupOptions).on('click', () => mostrarInfoLugar('banos'));
L.marker([380, 815], { icon: iconoKiosco }).addTo(map).bindPopup("<b>Kiosco</b>", popupOptions).on('click', () => mostrarInfoLugar('kiosco'));
L.marker([210, 338], { icon: iconoAula }).addTo(map).bindPopup("<b>Aulas</b>", popupOptions).on('click', () => mostrarInfoLugar('aulas'));
L.marker([300, 694], { icon: iconoAula }).addTo(map).bindPopup("<b>Aulas2</b>", popupOptions).on('click', () => mostrarInfoLugar('aulas2'));
L.marker([383, 877], { icon: iconoAula }).addTo(map).bindPopup("<b>Aulas3</b>", popupOptions).on('click', () => mostrarInfoLugar('aulas3'));
L.marker([39, 231], { icon: iconoPosicion }).addTo(map).bindPopup("<b>Tu posición</b>", popupOptions);

setTimeout(() => {
    map.invalidateSize();
}, 100);

// UI Interactions (Buscador y Desplegable)
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const destinationsList = document.getElementById('destinations-list');

    searchInput.addEventListener('click', function (e) {
        destinationsList.classList.toggle('active');
        e.stopPropagation();
    });

    document.addEventListener('click', function (e) {
        // Cierra la lista si se hace clic afuera
        if (!searchInput.contains(e.target) && !destinationsList.contains(e.target)) {
            destinationsList.classList.remove('active');
        }
    });
});

// --- Funciones de Carrusel ---
window.cambiarImagen = function (dir) {
    if (currentImagesArray.length <= 1) return;
    currentImageIndex += dir;
    if (currentImageIndex < 0) currentImageIndex = currentImagesArray.length - 1;
    if (currentImageIndex >= currentImagesArray.length) currentImageIndex = 0;
    actualizarCarruselUI();
};

function actualizarCarruselUI() {
    const imgEl = document.getElementById('place-image');
    if (currentImagesArray.length > 0) {
        imgEl.src = currentImagesArray[currentImageIndex];
    }

    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (currentImagesArray.length > 1) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        dotsContainer.style.display = 'flex';

        // Update dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i < currentImagesArray.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (i === currentImageIndex ? ' active' : '');
            // Optional: click on dot to go to image
            dot.onclick = () => {
                currentImageIndex = i;
                actualizarCarruselUI();
            };
            dotsContainer.appendChild(dot);
        }
    } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        dotsContainer.style.display = 'none';
    }
}