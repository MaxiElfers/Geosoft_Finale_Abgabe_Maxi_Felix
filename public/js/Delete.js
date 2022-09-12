//declaration of global variables
let pois;
let aktPOIs;
let allPOIs = [];
var click; // only for counting if the marker where set once or not
let id;
let hid;

// declaration of event listener
document.getElementById("SubmitButton").addEventListener("click", function () { getValue(); location.reload()});


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
* Displays all mountains on the map and in the table and saves the marker/polygons in an Array (allPOIs)
*/
setTimeout(function displayAllPOIs() {
    if (click === 0) {
        for (var i = 0; i < pois.length; i++) {
            if (pois[i].geometry.type === "Polygon") { // falls Polygon
                //console.log(pois[i].geometry.coordinates[0]);
                var coords = [];
                for (var j = 0; j < pois[i].geometry.coordinates[0].length; j++) {
                    coords.push([pois[i].geometry.coordinates[0][j][1], pois[i].geometry.coordinates[0][j][0]]);
                }
                //console.log(coords);
                var polygon = new L.polygon(coords)
                polygon.bindPopup(pois[i].properties.name + "<br>" + "id: " + pois[i].id);
                allPOIs[i] = polygon;
                polygon.addTo(map);
            }
            if (pois[i].geometry.type === "Point") { // falls Punkt
                var marker = new L.marker([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]])
                marker.bindPopup(pois[i].properties.name + "<br>" + "id: " + pois[i].id)
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
        displayAllPOIs();
    }
}, 1000)


/**
 * get the value of the IDDiv and start the fetch (delete)
 */
function getValue() {
    id = {"id": document.getElementById("IDDiv").value};
    deletePOIs();
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