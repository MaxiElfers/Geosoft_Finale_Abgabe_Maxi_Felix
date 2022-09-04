//declaration of global variables
let pois;
let aktPOIs;
let allPOIs = [];
var click; // only for counting if the marker where set once or not

// declaration of event listener
document.getElementById("SubmitButton").addEventListener("click", function () { displayAllPOIs() });

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
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


/**
 * Displays all mountains on the Map
 */
function displayAllPOIs() {
    if (click === 0) {
        for (var i = 0; i < pois.length; i++) {
            if (pois[i].geometry.type === "Polygon") {
                //console.log(pois[i].geometry.coordinates[0]);
                var coords = [];
                for (var j = 0; j < pois[i].geometry.coordinates[0].length; j++) {
                    coords.push([pois[i].geometry.coordinates[0][j][1], pois[i].geometry.coordinates[0][j][0]]);
                }
                //console.log(coords);
                var polygon = new L.polygon(coords, {color: '#4496ee'})
                polygon.bindPopup("<table>Name: " + pois[i].properties.name + "<br>" +
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
        cel1.innerHTML = pois[j].properties.id;
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
        actId.push(pois[j].properties.id);
    }

    $("#resultTable tr").mouseenter(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        var id = $(this).find('td:first').html();
        highlightLayer(id);
    });
    $("#resultTable tr").mouseleave(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        var id = $(this).find('td:first').html();
        resetLayer(id);
    });

    /**
    
            var newRow = table.insertRow(j + 1);
            var cel1 = newRow.insertCell(0);
            var cel2 = newRow.insertCell(1);
            var cel3 = newRow.insertCell(2);
            var cel4 = newRow.insertCell(3);
            var cel5 = newRow.insertCell(4);
            var cel6 = newRow.insertCell(5);
            cel1.innerHTML = pois[j].properties.name;
            cel2.innerHTML = pois[j].geometry.coordinates;
            cel3.innerHTML = pois[j].properties.altitude;
            cel4.innerHTML = pois[j].properties.url;
            cel5.innerHTML = pois[j].properties.description;
            cel6.innerHTML = pois[j].properties.id;
            actId.push(pois[j].properties.id);
            rowCount++;
            console.log(actId);
            newRow.addEventListener('mouseover', function (e) {
                var $row = $(this);
                console.log($row.cel6);
                //console.log(e.actId[j]);
            });
        }
         */
    /**
     $(document).ready(function(){
         $("tr").mouseover(function(){
           console.log($("tr").cel6.innerHTML);
         });
         $("tr").mouseout(function(){
           $("tr").css("background-color", "white");
         });
       });
*/
}
/** 
function highlightLayer(actId) {
    console.log(actId);
}
*/

function highlightLayer(id) {
    for (var i = 0; i < allPOIs.length; i++) {
        if (id === pois[i].properties.id) {
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
        if (id === pois[i].properties.id) {
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
