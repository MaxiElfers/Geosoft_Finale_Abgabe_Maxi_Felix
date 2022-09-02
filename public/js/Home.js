/**************************
*** All Event Listeners ***
**************************/
let addElem = document.getElementById("AddElem")
let routeElem = document.getElementById("RouteElem")
let deleteElem = document.getElementById("DeleteElem")
let changeElem = document.getElementById("ChangeElem")

addElem.addEventListener("click", function(){window.location.href = "http://localhost:3000/add";})
routeElem.addEventListener("click", function(){window.location.href = "http://localhost:3000/route";})
deleteElem.addEventListener("click", function(){window.location.href = "http://localhost:3000/delete";})
changeElem.addEventListener("click", function(){window.location.href = "http://localhost:3000/change";})

//declaration of global variables
let pois;
let aktPOIs;
let allPOIs = [];
var click; // only for counting if the marker where set once or not
let id;


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
var map = L.map('map', {scrollWheelZoom: false}).setView([51.96, 7.63], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
map.dragging.disable();
/**
 * Displays all stops on the map and saves the marker in an Array
 */
setTimeout(function displayAllPOIs(){
    if(click === 0){
        for (var i = 0; i < pois.length; i++) {
            if (pois[i].geometry.type === "Polygon") {
                //console.log(pois[i].geometry.coordinates[0]);
                var coords = [];
                for (var j = 0; j < pois[i].geometry.coordinates[0].length; j++) {
                    coords.push([pois[i].geometry.coordinates[0][j][1], pois[i].geometry.coordinates[0][j][0]]);
                }
                //console.log(coords);
                var polygon = new L.polygon(coords)
                polygon.bindPopup("<table><big>Name:</big> " + pois[i].properties.name + "<br>" +
                                  "Altitude: " + pois[i].properties.altitude + "<br>" + 
                                  "Beschreibung: " + pois[i].properties.description + "<br>" + 
                                  "URL: " + pois[i].properties.url + "</table>");
                allPOIs[i] = polygon;
                polygon.addTo(map);
            }
            if (pois[i].geometry.type === "Point") {
                //console.log([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]]);
                var marker = new L.marker([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]])
                marker.bindPopup("Name: " + pois[i].properties.name + "<br>" +
                                 "Altitude: " + pois[i].properties.altitude + "<br>" + 
                                 "Beschreibung: " + pois[i].properties.description + "<br>" + 
                                 "URL: " + pois[i].properties.url);
                allPOIs[i] = marker;
                marker.addTo(map);
            }
        }
        click++
    }
    else{
        for(var i = 0; i < allPOIs.length; i++){
            map.removeLayer(allPOIs[i]); // deletes the old marker, so there is no overlapping
        }
        click = 0;
        displayAllPOIs();
    }
}, 1000)

//document.onload = displayAllPOIs();