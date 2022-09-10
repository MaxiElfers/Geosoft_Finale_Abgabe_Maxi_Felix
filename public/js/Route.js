//declaration of global variables
let pois;
let aktPOIs;
let allPOIs = [];
let click = 0; // only for counting if the marker where set once or not
let coordinateslat;
let coordinateslon;
let directions;
let coorlon;
let coorlat;


let submitBut = document.getElementById("SubmitButton")
let submitButDiv = document.getElementById("SubmitButtonDiv")
let table = document.getElementById("table");
let mapDiv = document.getElementById("map");
let submitBut2 = document.getElementById("SubmitButton2")

// declaration of event listener
submitBut.addEventListener("click", function () { filltable(pois); });
submitBut2.addEventListener("click", function () { destinationCoords(document.getElementById("IDDiv").value); });

// fetch POIs
fetch("/getPoi")
    .then(response => {
        let res = response.json() // return a Promise as a result
        res.then(data => { // get the data in the promise result
            pois = data;
            console.log(pois)
        })
    })
    .catch(error => console.log(error))

mapboxgl.accessToken = 'pk.eyJ1IjoiYndhZGFtc29uIiwiYSI6ImNqajZhNm1idDFzMjIza3A2Y3ZmdDV6YWYifQ.9NhptR7a9D0hzWXR51y_9w';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [7.63, 51.96],
    zoom: 4
});

/**
 * Displays all mountains on the Map
 */
function displayAllPOIs() {
    if (click === 0) {

        // ein Versuch, die Pois als Layer der Karte hinzuzufügen
        /**map.addSource('berge', 
            {'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [pois]}});
        map.addLayer({'id': 'berge',
        'type': 'symbol','source': 'berge'});*/


        for (var i = 0; i < pois.length; i++) {
            if (pois[i].geometry.type === "Polygon") {
                //console.log(pois[i].geometry.coordinates[0]);
                var coords = [];
                for (var j = 0; j < pois[i].geometry.coordinates[0].length; j++) {
                    coords.push([pois[i].geometry.coordinates[0][j][1], pois[i].geometry.coordinates[0][j][0]]);
                }
                //console.log(coords);
                var polygon = new L.polygon(coords, { color: '#4496ee' })
                polygon.bindPopup("<table>Name: " + pois[i].properties.name + "<br>" +
                    "Altitude: " + pois[i].properties.altitude + "<br>" +
                    "Beschreibung: " + pois[i].properties.description + "<br>" +
                    "URL: " + pois[i].properties.url + "</table>");
                allPOIs[i] = polygon;
                polygon.addTo(map);
            }
            if (pois[i].geometry.type === "Point") {
                //console.log([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]]);
                const el = document.createElement('div');
                el.className = 'marker';
                // Marker werden trotzdem nicht angezeigt
                var marker = new mapboxgl.Marker(el).setLngLat([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]])
                /**marker.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(Name: " + pois[i].properties.name + "<br>" +
                    "Altitude: " + pois[i].properties.altitude + "<br>" +
                    "Beschreibung: " + pois[i].properties.description + "<br>" +
                    "URL: " + pois[i].properties.url));*/
                allPOIs[i] = marker;
                marker.addTo(map);
            }
        }
        filltable(pois);
        click++
    }
    else {
        for (var i = 0; i < allPOIs.length; i++) {
            map.removeLayer(allPOIs[i]); // deletes the old marker, so there is no overlapping
        }
        click = 0;
        displayAllPOIs();
    }
}

function filltable(pois) {
    document.getElementById("SubmitButton").style.visibility = "hidden";
    document.getElementById("EingabeDiv").style.display = "block";
    document.getElementById("SubmitButtonDiv2").style.display = "block";

    var actId = [];
    var rowCount = 0;
    //creates the Table with the pois
    for (var j = 0; j < pois.length; j++) {
        var newRow = document.createElement("tr");
        var cel1 = document.createElement("td");
        var cel2 = document.createElement("td");
        var cel3 = document.createElement("td");
        var cel4 = document.createElement("td");
        var cel5 = document.createElement("td");
        var cel6 = document.createElement("td");
        cel1.innerHTML = pois[j].id;
        cel2.innerHTML = pois[j].properties.name;
        cel3.innerHTML = pois[j].geometry.coordinates;
        cel4.innerHTML = pois[j].properties.altitude;
        cel5.innerHTML = pois[j].properties.url;
        cel6.innerHTML = pois[j].properties.description;
        newRow.append(cel1);
        newRow.append(cel2);
        newRow.append(cel3);
        newRow.append(cel4);
        newRow.append(cel5);
        newRow.append(cel6);
        document.getElementById("resultTable").appendChild(newRow);
        actId.push(pois[j].id);
    }
    /**
        $("#resultTable tr").mouseenter(function () {
            $(this).addClass('selected').siblings().removeClass('selected');
            var hid = $(this).find('td:first').html();
            highlightLayer(hid);
        });
        $("#resultTable tr").mouseleave(function () {
            $(this).addClass('selected').siblings().removeClass('selected');
            var hid = $(this).find('td:first').html();
            resetLayer(hid);
        });
        $("#resultTable tr").click(function () {
            $(this).addClass('selected').siblings().removeClass('selected');
            var hid = $(this).find('td:first').html();
            highlightLayer(hid);
            destinationCoords(hid);
            directionsAdden();
            table.style.display = "none";
        });*/
}
/** 
function highlightLayer(hid) {
    for (var i = 0; i < allPOIs.length; i++) {
        if (hid === pois[i].id) {
            if (pois[i].geometry.type === "Polygon") {
                allPOIs[i].setStyle({
                    color: 'red'
                })
            }
            if (pois[i].geometry.type === "Point") {
                allPOIs[i].valueOf()._icon.style.backgroundColor = 'red';
            }
        }
    }
}

function resetLayer(id) {
    for (var i = 0; i < allPOIs.length; i++) {
        if (id === pois[i].id) {
            if (pois[i].geometry.type === "Polygon") {
                allPOIs[i].setStyle({
                    color: '#4496ee'
                })
            }
            if (pois[i].geometry.type === "Point") {
                allPOIs[i].valueOf()._icon.style.backgroundColor = "rgba(0, 0, 0, 0)";
            }
        }
    }
}*/

/**
 * Returns the Geolocation of the browser
 * @returns {coordinates}
 */
setTimeout(function () {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    }
}, 100)
/**
* shows the position of the browser 
* @param {coordinates} position 
*/
function showPosition(position) {
    coordinateslat = position.coords.latitude
    coordinateslon = position.coords.longitude;
    console.log(coordinateslat, coordinateslon);
};


function destinationCoords(hid) {
    document.getElementById("FehlerDiv").style.display = "none";
    document.getElementById("FehlerDiv2").style.display = "none";
    var treffer = false;
    if (hid === "") {
        console.log("Nicht alle Felder wurden ausgefüllt")
        document.getElementById("FehlerDiv").style.display = "block";
    }
    else {
        for (var i = 0; i < pois.length; i++) {
            if (hid === pois[i].id) {
                treffer = true;
                if (pois[i].geometry.type === "Polygon") {
                    coorlat = pois[i].geometry.coordinates[0][0][1];
                    coorlon = pois[i].geometry.coordinates[0][0][0];
                }
                if (pois[i].geometry.type === "Point") {
                    coorlat = pois[i].geometry.coordinates[1];
                    coorlon = pois[i].geometry.coordinates[0];
                }
            }
        }
        if (!treffer) { document.getElementById("FehlerDiv2").style.display = "block"; }
        else {
            console.log(coorlat, coorlon);
            directionsAdden();
        }
    }
}


function directionsAdden() {
    if (click === 0) {
        directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken
        });
        map.addControl(directions, 'top-left');
        directions.setOrigin(coordinateslon + "," + coordinateslat);
        directions.setDestination(coorlon + ',' + coorlat);
        click++;
    }
    else {
        clearMap()
    }
};