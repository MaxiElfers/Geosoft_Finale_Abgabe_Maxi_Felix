/**Leaflet einbinden */

var map = L.map('map').setView([51.9606649, 7.6261347], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/**add point-of-interests coordinates into the map */

var marker = L.marker([51.5, -0.09]).addTo(map);
L.marker([7.634876,51.957004]).addTo(map)
    .bindPopup('Münster Hauptbahnhof')
    .openPopup();
L.marker([7.610287,51.963638]).addTo(map)
    .bindPopup('Botanischer Garten')
    .openPopup();
L.marker([7.616133,51.963513]).addTo(map)
    .bindPopup('Schlossplatz')
    .openPopup();
L.marker([7.587046,51.94814]).addTo(map)
    .bindPopup('Allwetterzoo Münster')
    .openPopup();
L.marker( [7.628653,51.962898]).addTo(map)
    .bindPopup('Lambertikirche')
    .openPopup();
L.marker([7.595725,51.969422]).addTo(map)
    .bindPopup('Institut für Geographie')
    .openPopup();
L.marker([7.604563,51.949979]).addTo(map)
    .bindPopup('Aasee')
    .openPopup();
L.marker([7.618322,51.956997]).addTo(map)
    .bindPopup('Aaseekugeln')
    .openPopup();
L.marker([7.628068,51.962039]).addTo(map)
    .bindPopup('Prinzipalmarkt')
    .openPopup();
L.marker([7.628025,51.961701]).addTo(map)
    .bindPopup('Historisches Rathaus Münster')
    .openPopup();
L.marker([7.625337,51.963017]).addTo(map)
    .bindPopup('Paulusdom')
    .openPopup();
L.marker([7.600187,51.965512]).addTo(map)
    .bindPopup('Mensa am Ring')
    .openPopup();
L.marker([7.624277,51.961387]).addTo(map)
    .bindPopup('LWL-Museum')
    .openPopup();
L.marker([7.617179,51.955609]).addTo(map)
    .bindPopup('Mensa am Aasee')
    .openPopup();
L.marker([7.619486,51.960323]).addTo(map)
    .bindPopup('Mensa Bispinghof')
    .openPopup();
L.marker([7.601884,51.97511]).addTo(map)
    .bindPopup('Mensa Da Vinci')
    .openPopup();