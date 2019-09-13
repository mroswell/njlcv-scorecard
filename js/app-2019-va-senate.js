// let public_spreadsheet_url = '1MVQ30DNes3hozskjPNTNSYE8m-yR9PboKTokC8YNlk4';
let public_spreadsheet_url = "1FoLv0alzLYDt3D5iQ3zbPXP0HS71_vgju-ESlDY_ayM";
let senateLayer;
let VADistricts = {};
let app = {};
let freeze=0;
let $sidebar = $("#sidebar");
let flipped = 0;
let normalLayer;
let flippedLayer;
let clickedMemberNumber;

let map = L.map("map", {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    minZoom: 7
}).setView([37.76, -79.3],7);
// var map = L.map('map', {scrollWheelZoom: true}).setView([45.3, -69],7);

// control that shows state info on hover
let info = L.control({ position: "bottomright" });

info.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = props
        ? "<b>" + props.NAMELSAD + "</b>"
        : "Hover over a district";
};

info.addTo(map);
function init() {
    console.log("initialized");
    Tabletop.init( {
        key: public_spreadsheet_url,
        callback: showInfo,
        // simpleSheet: true,
        parseNumbers: true
    });
}

let geoStyle = function(data, flipped) {
    let dist = data.properties.NAMELSAD.split(" ").pop();
    let party = VADistricts[dist].party;
    let party_flip = VADistricts[dist].party_flip;
    let scoreColor = getColor(party);
    let flippedColor = getColor(party_flip);

    return {
        fillColor: flipped ? flippedColor : scoreColor,
        weight: 2,
        opacity: 0.3,
        color: "#fefefe",
        dashArray: "0",
        fillOpacity: 0.9
    };
};

window.addEventListener("DOMContentLoaded", init);

document.addEventListener("DOMContentLoaded", function() {
    let checkbox = document.querySelector('input[type="checkbox"]');

    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            flipped = 1;
            map.removeLayer(normalLayer);
            flippedLayer.addTo(map);
        } else {
            flipped = 0;
            map.removeLayer(flippedLayer);
            normalLayer.addTo(map);
        }
        if (clickedMemberNumber) {
            memberDetailFunction(clickedMemberNumber);
        }
    });
});

$(document).ready(function () {
    let key_votes = $("#senate-template-bottom").html();
    app.template = Handlebars.compile(key_votes);

    let sourcebox = $("#senate-template-infobox").html();
    app.infoboxTemplate = Handlebars.compile(sourcebox);

    let map_help = $("#welcome-map-help").html();
    app.welcome = Handlebars.compile(map_help);
    $sidebar.append(app.welcome);
});
function showInfo(sheet_data, tabletop) {
    flipped = false;
    $.each(tabletop.sheets("va senate").all(), function (i, member) {
        member["normalScoreColor"] = getColor(member.party);
        member["flippedScoreColor"] = getColor(member.party_flip);
        VADistricts[member.current_district] = member;
    });
    loadGeo();
}
function loadGeo() {
    let tileLayer = L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
        {
        maxZoom: 18,
        minZoom:7,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: "mapbox.light"
        }
    );

    tileLayer.addTo(map);

    normalLayer = L.geoJson(geosenate, {
        onEachFeature: onEachFeature,
        style: data => geoStyle(data, false)
    });

    flippedLayer = L.geoJson(geosenate, {
        onEachFeature: onEachFeature,
        style: data => geoStyle(data, true)
    });

    normalLayer.addTo(map);
}

// get color depending on score value
function getColor(party) {
    return party === "R"
        ? "#BF353B" //#0079f2' :
        : party === "D"
            ? "#27609c" //'#ff3636' :
            : "rgb(255,255,0)";
}


function highlightFeature(e) {
    let layer = e.target;
    let districtNumber = layer.feature.properties.NAMELSAD.split(" ").pop();
    let memberDetail = VADistricts[districtNumber];
    clickedMemberNumber = districtNumber;
    if(!memberDetail){
        console.log("No memberDetail");
        return;
    }
    if (!flipped) {
        memberDetail["scoreColor"] = memberDetail["normalScoreColor"];
    } else {
        memberDetail["scoreColor"] = memberDetail["flippedScoreColor"];
    }
    layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.2
    });
    if (!freeze) {
        html = app.infoboxTemplate(memberDetail);
        $sidebar.html(html);
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }
}

function resetHighlight(e) {
    let layer = e.target;
    if (flipped) {
        flippedLayer.resetStyle(layer);
    } else {
        normalLayer.resetStyle(layer);
    }
    info.update();
}

function mapMemberDetailClick(e) {
    freeze = 1;
    let boundary = e.target;
    let districtNumber = boundary.feature.properties.NAMELSAD.split(" ").pop();
    let member = memberDetailFunction(districtNumber);
}

function memberDetailFunction(memberNumber) {
    clickedMemberNumber = memberNumber;
    let districtDetail = VADistricts[memberNumber];
    if (!flipped) {
        districtDetail["scoreColor"] = districtDetail["normalScoreColor"];
    } else {
        districtDetail["scoreColor"] = districtDetail["flippedScoreColor"];
    }
    let html = app.infoboxTemplate(districtDetail);
    $sidebar.html(html);
}
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: mapMemberDetailClick
    });
}

map.attributionControl.addAttribution('District Boundaries &copy; <a href="http://census.gov/">US Census Bureau</a>');


$(document).on("click",".close",function(event) {
    event.preventDefault();
    clearInfobox();
    freeze=0;
});

function clearInfobox() {
    $sidebar.html(" ");
    $sidebar.append(app.welcome);
    let $heading = $(".entry-default-text h4");
    $heading.html("Map Help");
}
