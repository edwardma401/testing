const apiKey = API_KEY

const grayMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.mapbox.com/">MapBox</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    accessToken: apiKey
})

const satelliteMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.mapbox.com/">MapBox</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    accessToken: apiKey
})

const outdoorsMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.mapbox.com/">MapBox</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v11',
    accessToken: apiKey
})

// created layers
const map = L.map('map', {
    center: [
        51.505, -0.09
    ],
    zoom: 3,
    layers: [grayMap, satelliteMap, outdoorsMap]
})

// add map
grayMap.addTo(map)

// create two sets of data
const tectonicplates = new L.LayerGroup()
const earthquakes = new L.LayerGroup()

// defining map choices
const baseMaps = {
    Satellite: satelliteMap,
    Grayscale: grayMap,
    Outdoors: outdoorsMap
}

// define overlays
const overlays = {
    'Tectonic Plates': tectonicplates,
    Earthquakes: earthquakes
}

// add control
L
    .control
    .layers(baseMaps, overlays)
    .addTo(map)
// create legend
const legend = L.control({
    position: 'bottomright'
})
// add legend
legend.onAdd = function () {
    const div = L
        .DomUtil
        .create('div', 'info legend')

    const grades = [0, 10, 100, 1000, 10000, 100000]
    const colors = [
        '#98ee00',
        '#d4ee00',
        '#eecc00',
        '#ee9c00',
        '#ea822c',
        '#ea2c2c'
    ]
    // get colored square
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background: ' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
    }
    return div
}

// add legend
legend.addTo(map)

$(document).ready(function () {
    $("#btn").click(function () {
        $.get("/init")
    })
    var html = "";
    $.get('/getTime', function (data) {
        if (data) {
            for (var i = 0; i < data.length; i++) {
                html += '<option>' + data[i].stat_date + '</option>'
            }
            $("#select").html(html)
            buildD3()
        }
    })
    $("#select").change(function () {
        buildD3();
    })
});

function buildD3() {
    var maxData = 1
    var stat_date = $("#select").children('option:selected').val();
    earthquakes.clearLayers()
    // get geoJSON data
    d3.json('/all/' + stat_date, function (data) {
        //build geo data
        data = buildGeoJson(data);
        // add a GeoJSON layer
        L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng)
            },
            style: styleInfo,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('country: ' + feature.properties.country
                    + '<br>active: ' + feature.properties.active
                    + '<br>Recovered: ' + feature.properties.Recovered
                    + '<br>Deaths: ' + feature.properties.Deaths
                    + '<br>Confirmed: ' + feature.properties.Confirmed
                )
            }
        }).addTo(earthquakes)
        // add earthquake layer
        earthquakes.addTo(map)

        function styleInfo(feature) {
            return {
                opacity: 1,
                fillOpacity: 1,
                fillColor: getColor(feature.properties.Confirmed),
                color: '#000',
                radius: getRadius(feature.properties.Confirmed),
                stroke: true,
                weight: 0.5
            }
        }

        // set marker color
        function getColor(magnitude) {
            switch (true) {
                case magnitude > 100000:
                    return '#ea2c2c'
                case magnitude > 10000:
                    return '#ea822c'
                case magnitude > 1000:
                    return '#ee9c00'
                case magnitude > 100:
                    return '#eecc00'
                case magnitude > 10:
                    return '#d4ee00'
                default:
                    return '#98ee00'
            }
        }

        function buildGeoJson(data) {
            var geoData = {
                type: "FeatureCollection",
                features: [],
            };
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data) {
                        geoData.features[i] = {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [
                                    data[i].Lon,
                                    data[i].Lat
                                ],
                            },
                            properties: data[i]

                        }
                        if (maxData < data[i].Confirmed) {
                            maxData = data[i].Confirmed
                        }
                    }

                }
            }
            console.log(geoData)
            return geoData;
        }

        // set radius
        function getRadius(magnitude) {
            switch (true) {
                case magnitude > 100000:
                    return 50
                case magnitude > 10000:
                    return 25
                case magnitude > 1000:
                    return 10
                case magnitude > 100:
                    return 5
                case magnitude > 10:
                    return 1
                default:
                    return 0
            }
        }
    })
}

