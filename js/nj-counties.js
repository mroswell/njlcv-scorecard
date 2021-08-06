let public_spreadsheet_url = "1OUgbFyBjrAdyTtHIekDTrGfgdE0U_6PaQClLS5RcwOM";
let boundaryLayer;
let NJDistricts = {};
let app = {};
let freeze = 0;
let $sidebar = $("#sidebar");
let clickedMemberNumber;


let map = L.map("map", {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    minZoom: 8
}).setView([40.09, -74.6728], 7);

// var map = L.map('map', {scrollWheelZoom: true}).setView([45.3, -69],7);


function init() {
    Tabletop.init({
        key: public_spreadsheet_url,
        callback: showInfo,
        // simpleSheet: true,
        parseNumbers: true
    });
}

var geoStyle = function(data) {
    // let legisId = data.properties.legis_id;
    var cty = data.properties.county;
    console.log("cty", cty);
    console.log(NJDistricts);
    console.log("data", data);
    var scoreColor = NJDistricts[cty].color;
    console.log(scoreColor);

    return {
        fillColor: scoreColor,
        weight: 3,
        opacity: 0.9,
        color: "#fefefe",
        dashArray: "0",
        fillOpacity: 1
    };
};

window.addEventListener("DOMContentLoaded", init);

$(document).ready(function() {

    let sourcebox = $("#senate-template-infobox").html();
    app.infoboxTemplate = Handlebars.compile(sourcebox);

    // let map_help = $("#welcome-map-help").html();
    // app.welcome = Handlebars.compile(map_help);
    // $sidebar.append(app.welcome);

});
function showInfo(sheet_data, tabletop) {
    let scoreColor;
    $.each(tabletop.sheets("Sheet1").all(), function(i, member) {
        scoreColor = member.color;
        member['scoreColor'] = scoreColor;
        if (member.county) {
        NJDistricts[member.county] = member;
       }
    });
    loadGeo();
}

function loadGeo() {
    let tileLayer = L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
        {
            maxZoom: 18,
            minZoom: 7,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: "mapbox.light"
        }
    );
    tileLayer.addTo(map);

    boundaryLayer = L.geoJson(nj_county_boundary_map, {
            onEachFeature: onEachFeature,
            style: data => geoStyle(data)}).bindTooltip(function (layer) {
        return String(layer.feature.properties.county)
    });
    boundaryLayer.addTo(map)
}

function getColor(score) {
    return score === "NIO" ? '#fefefe' :
        score > 80 ? '#82BC00' : //' '#4EAB07' :
            score > 60 ? '#82e0c3' :
                score > 40 ? '#FEF200' :
                    score > 20 ? '#FCA300' :
                        'rgb(255,0,0)';
}

function highlightFeature(e) {
    let layer = e.target;
    let legisId = layer.feature.properties.county;
    let memberDetail = NJDistricts[legisId];

    layer.setStyle({
        weight: 3,
        color: "#fefefe",
        dashArray: "",
        fillOpacity: .9
    });
    if (!freeze) {
        let html = app.infoboxTemplate(memberDetail);
        // $sidebar.html(html);
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }
}

function resetHighlight(e) {
    let layer = e.target
    boundaryLayer.resetStyle(layer);
    // let districtNumber = NJDistricts.feature.properties.legis_id;
}

function mapMemberDetailClick(e) {
    freeze = 1;
    let boundary = e.target;
    let legisId = parseInt(boundary.feature.properties.SLDUST);
    let member = memberDetailFunction(legisId);
}

function memberDetailFunction(legisId) {
    clickedMemberNumber = legisId;
    let districtDetail = NJDistricts[legisId];

    let html = app.infoboxTemplate(districtDetail);
    // $sidebar.html(html);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: mapMemberDetailClick
    });
}

map.attributionControl.addAttribution(
    'District Boundaries &copy; <a href="http://census.gov/">US Census Bureau</a>'
);

$(document).on("click", ".close", function(event) {
    event.preventDefault();
    clearInfobox();
    freeze = 0;
});

function clearInfobox() {
    $sidebar.html(" ");
    $sidebar.append(app.welcome);
    let $heading = $(".entry-default-text h4");
    $heading.html("Map Help");
}
