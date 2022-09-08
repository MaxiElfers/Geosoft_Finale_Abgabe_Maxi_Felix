//declaration of global variables
let pois;
let aktPOIs;
let allPOIs = [];
let click; // only for counting if the marker where set once or not
let id;
let property;
let count = 0;
let snippet;
let gezeichnetesPolygon = [];

let x = document.getElementById("demo");
let tableFill = document.getElementById("table")
let oldIDDiv = document.getElementById("oldIDDiv");

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
                    "ID: " + pois[i].id);
                allPOIs[i] = polygon;
                polygon.addTo(map);
            }
            if (pois[i].geometry.type === "Point") {
                //console.log([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]]);
                var marker = new L.marker([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]])
                marker.bindPopup(pois[i].properties.name + "<br>" +
                    "ID: " + pois[i].id);
                allPOIs[i] = marker;
                marker.addTo(map);
            }
        }
        click++;
        filltable(pois);
    }
    else {
        for (var i = 0; i < allPOIs.length; i++) {
            map.removeLayer(allPOIs[i]); // deletes the old marker, so there is no overlapping
        }
        click = 0;
        displayPOIsMap();
    }
}, 500)

/**
 * Displays all the Data from the Database
 * as a table
 * @param {Object} pois 
 */
 function filltable(pois) {
    var table = document.getElementById("resultTable");
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
        oldIDDiv.value = hid;
    });
}

/**
 * Higlights the Layer with the given ID
 * @param {number} hid 
 */
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

/**
 * Resets the higlight from the layer with
 * the given ID
 * @param {number} hid 
 */
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
}

/**
 * Get the (from the user) given POI
 */
function ladePoi() {
    id = {"id": oldIDDiv.value};
    displayPoi();
}

/**
 * Shows the properties of the POI which was chosen,
 * so they can be changed
 */
function displayPoi() {
    var treffer = false;
    var hid = document.getElementById("oldIDDiv").value
    for (var i = 0; i < pois.length; i++) {
        if (hid == pois[i].id) {
            treffer = true;
            document.getElementById("FehlerDiv").style.display = "none";
            document.getElementById("EingabeDiv1").style.display = "none";
            document.getElementById("changeMount").style.display = "none";
            document.getElementById("Eingabewerte").style.display = "block";
            document.getElementById("NameDiv").value = pois[i].properties.name;
            document.getElementById("AltitudeDiv").value = pois[i].properties.altitude;
            document.getElementById("URLDiv").value = pois[i].properties.url;
            document.getElementById("IDDiv").value = pois[i].id;

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
            "id": newID,
            "type": "Feature",
            "geometry": {
                "type": newType,
                "coordinates": gezeichnetesPolygon
            },
            "properties": {
                "name": newName,
                "altitude": newAltitude,
                "url": newURL,
                "description": snippet
            }
        };
        console.log(data);
        postMarker(data);
        console.log(document.getElementById("oldIDDiv").value);
        id = { "id": document.getElementById("oldIDDiv").value};
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
            body: JSON.stringify(id)
        })
}

function highlightLayer(id) {
    for (var i = 0; i < allPOIs.length; i++) {
        if (id === pois[i].id) {
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
}