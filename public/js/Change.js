//declaration of global variables
let pois;
let aktPOIs;
let allPOIs = [];
let click; // only for counting if the marker where set once or not
let id;
let property;
let count = 0;

let tableFill = document.getElementById("table")

// declaration of event listener
document.getElementById("changeMount").addEventListener("click", function () { ladePoi() });
document.getElementById("SubmitButton").addEventListener("click", function () { getValues(); location.reload() });


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

// setting up and working with the map
var map = L.map('map').setView([51.96, 7.63], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/**
 * Displays all stops on the map and saves the marker in an Array
 */
setTimeout(function displayPOIsMap() {
    if (click === 0) {
        for (var i = 0; i < pois.length; i++) {
            if (pois[i].geometry.type === "Polygon") {
                //console.log(pois[i].geometry.coordinates[0]);
                var coords = [];
                for (var j = 0; j < pois[i].geometry.coordinates[0].length; j++) {
                    coords.push([pois[i].geometry.coordinates[0][j][1], pois[i].geometry.coordinates[0][j][0]]);
                }
                //console.log(coords);
                var polygon = new L.polygon(coords)
                polygon.bindPopup(pois[i].properties.name + "<br>" +
                    "ID: " + pois[i].properties.id);
                allPOIs[i] = polygon;
                polygon.addTo(map);
            }
            if (pois[i].geometry.type === "Point") {
                //console.log([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]]);
                var marker = new L.marker([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]])
                marker.bindPopup(pois[i].properties.name + "<br>" +
                    "ID: " + pois[i].properties.id);
                allPOIs[i] = marker;
                marker.addTo(map);
            }
        }
        click++
    }
    else {
        for (var i = 0; i < allPOIs.length; i++) {
            map.removeLayer(allPOIs[i]); // deletes the old marker, so there is no overlapping
        }
        click = 0;
        displayPOIsMap();
    }
}, 500)

setTimeout(function displayPOIsTable() {
    let ueberschrift = '<table class="table-mountains">'
        + '<tr>'
        + '<td id="ueberschrift">'
        + 'Mountians'
        + '</td>'
        + '<td id="ueberschrift">'
        + 'Altitude'
        + '</td>'
        + '<td id="ueberschrift">'
        + 'Description'
        + '</td>'
        + '<td id="ueberschrift">'
        + 'ID'
        + '</td>'
        + '</tr>'
    let tableEnde = '</table>'

    for (let i = 0; i < pois.length; i++) {
        property = property + '<tr>' + '<td id="inhalt">' + pois[i].properties.name + '</td>'
            + '<td id="inhalt">' + pois[i].properties.altitude + '</td>'
            + '<td id="inhalt">' + pois[i].properties.description + '</td>'
            + '<td id="inhalt">' + pois[i].properties.id + '</td>'
            + '</tr>';
    }

    tableFill.innerHTML = ueberschrift + property + tableEnde;
}, 500);


function ladePoi() {
    id = document.getElementById("oldIDDiv").value;
    displayPoi(id);
}


function displayPoi(id) {
    var treffer = false;
    for (var i = 0; i < pois.length; i++) {
        if (id == pois[i].properties.id) {
            treffer = true;
            document.getElementById("FehlerDiv").style.display = "none";
            document.getElementById("EingabeDiv1").style.display = "none";
            document.getElementById("changeMount").style.display = "none";
            document.getElementById("Eingabewerte").style.display = "block";
            document.getElementById("NameDiv").value = pois[i].properties.name;
            document.getElementById("AltitudeDiv").value = pois[i].properties.altitude;
            document.getElementById("URLDiv").value = pois[i].properties.url;
            document.getElementById("IDDiv").value = pois[i].properties.id;

            let geojson = {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": pois[i].geometry.type,
                        "coordinates": pois[i].geometry.coordinates
                    }
                }]
            }
            document.getElementById("textfeld").value = JSON.stringify(geojson);
        }
    }
    if (!treffer) { document.getElementById("FehlerDiv").style.display = "block"; }
}


var snippet;
let gezeichnetesPolygon = [];
/**
 * takes the values out of the input and starts the fetch post function
 */
function getValues() {

    //Werte aus dem Textfeld ins Geojson übernehmen
    try {
        object = JSON.parse(document.getElementById("textfeld").value);
    } catch (error) {
        is_json = false;
        //alert("Invalid JSON string");
        console.log("Invalid JSON string")
        document.getElementById("FehlerDiv2").style.display = "block";
    }

    document.getElementById("geojsontextarea").value = document.getElementById("textfeld").value;
    //console.log(document.getElementById("geojsontextarea").value);
    var gezeichnetesGeojson = document.getElementById("geojsontextarea").value;
    gezeichnetesGeojson = JSON.parse(gezeichnetesGeojson);
    console.log(gezeichnetesGeojson);
    gezeichnetesGeojson.features.forEach(element1 => {
        newType = element1.geometry.type;
        element1.geometry.coordinates.forEach(element2 => {
            gezeichnetesPolygon.push(element2);
        })
    })

    // restliche Werte übernehmen
    //console.log(gezeichnetesPolygon);
    newName = document.getElementById("NameDiv").value;
    newAltitude = document.getElementById("AltitudeDiv").value;
    newURL = document.getElementById("URLDiv").value;
    newID = document.getElementById("IDDiv").value;
    if (newName === "" || newAltitude === "" || newURL === "" || newID === "" || gezeichnetesPolygon === null || gezeichnetesPolygon === "") {
        console.log("Nicht alle Felder wurden ausgefüllt")
        document.getElementById("FehlerDiv1").style.display = "block";
    }
    else {
        // teste, ob es eine Wikipedia URL ist
        if (newURL.startsWith("https://en.wikipedia.org/wiki/") || newURL.startsWith("https://de.wikipedia.org/wiki/")) {
            // Anfrage an die Wikipedia API zusammenbauen
            newURL.substr(30, newURL.length - 30)
            while (newURL.includes("_")) {
                newURL.replace("_", "%20");
            }
            anfrage = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" + newURL;
            console.log(anfrage);

            // Erstellen eines XHR-Objektes für die Anfrage des Wikipedia Artikels
            var xhr = new XMLHttpRequest()
            xhr.onreadystatechange = "statechangecallback";
            xhr.open("GET", anfrage, true);
            xhr.send();
            console.log(xhr);

            /**
             * Callback Funktion zum Erstellen der Bushaltestellen-Objekte und der Berechnung der Entfernungen dorthin
             */
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    //console.log(this.responseText);
                    res = JSON.parse(this.responseText);
                    //console.log(res);
                    snippet = res.query.search.snippet;
                };
            }

        }
        else { snippet = "keine Information vorhanden" }

        data = {
            "type": "Feature",
            "geometry": {
                "type": newType,
                "coordinates": gezeichnetesPolygon
            },
            "properties": {
                "name": newName,
                "altitude": newAltitude,
                "url": newURL,
                "id": newID,
                "description": snippet
            }
        };
        console.log(data);
        postMarker(data);
        console.log(document.getElementById("oldIDDiv").value);
        id = { "_id": document.getElementById("oldIDDiv").value};
        deletePOIs();
    }

}



/**
 * Creates an fetch to post the new Marker
 */
function postMarker(doc) {
    if (count === 0) {
        fetch("/addPoi",
            {
                headers: { 'Content-Type': 'application/json' },
                method: "post",
                body: JSON.stringify(doc)
            })
    }
};



var x = document.getElementById("demo");

/**
 * Returns the Geolocation of the browser
 * @returns {coordinates}
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

/**
 * shows the position of the browser 
 * @param {coordinates} position 
 */
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

    // GeoJSON "Rahmenelement"
    let geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": []
            }
        }]
    }

    geojson.features[0].geometry.coordinates = [position.coords.longitude, position.coords.latitude];
    document.getElementById("textfeld").value = JSON.stringify(geojson);
}

/**
 * fetch (deletes) the choosen POI
 */
 function deletePOIs() {
    fetch("/deletePoi",
        {
            headers: { 'Content-Type': 'application/json' },
            method: "delete",
            body: JSON.stringify()
        })
}