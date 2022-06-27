//declaration of global variables
let pois;
let aktPOIs;
let allPOIs = [];
var click; // only for counting if the marker where set once or not

// declaration of event listener
document.getElementById("SubmitButton").addEventListener("click", function(){displayAllPOIs()});

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
var map = L.map('map').setView([51.96, 7.63], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

/**
 * Displays all POIs on the Map
 */
function displayAllPOIs(){
    if(click === 0){
        for(var i = 0; i < pois.length; i++){
            var marker = new L.marker([pois[i].geometry.coordinates[1], pois[i].geometry.coordinates[0]])
            allPOIs[i] = marker;
            marker.addTo(map);
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
}