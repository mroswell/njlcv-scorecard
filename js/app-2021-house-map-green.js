let legislatorLayer; //points
let NJDistricts = {};  //data
let app = {};
let freeze = 0;
let $sidebar = $("#sidebar");
let clickedMemberNumber;


let SHEET_ID = '1Wljk36KFDsIwlWo0CzAdACn6WEMenR6AK3UwO3UbrWY';
let API_KEY = 'AIzaSyCMTnugKsNlKhajpPTm37IlHFTd_z297Eo';

function fetchSheet({ spreadsheetId, sheetName, apiKey, complete }) {
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;
    return fetch(url).then(response =>
        response.json().then(result => {
            let data = Papa.parse(Papa.unparse(result.values), { header: true });
            complete(data);
        })
    );
}

function init() {
    fetchSheet({
        spreadsheetId: SHEET_ID,
        sheetName: 'YES',
        apiKey: API_KEY,
        complete: showInfo
    });

    fetchSheet({
        spreadsheetId: SHEET_ID,
        sheetName: 'bill_descriptions',
        apiKey: API_KEY,
        complete: displayBills
    });
}

let map = L.map("map", {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    minZoom: 8
}).setView([40.09, -74.6728], 7);

let geoStyle = function(data) {
    let legisId = data.properties.legis_id;
    let scoreColor = getColor( NJDistricts[legisId].score_2021);

    return {
        radius: 7,
        fillColor: scoreColor,
        weight: 2,
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

    let map_help = $("#welcome-map-help").html();
    app.welcome = Handlebars.compile(map_help);
    $sidebar.append(app.welcome);

    let key_votes = $("#senate-template-bottom").html();
    app.votesTemplate = Handlebars.compile(key_votes);

});

function displayBills(priority_bills) {
    let key_votes = $("#senate-template-bottom").html();
    app.votesTemplate = Handlebars.compile(key_votes);
    let bills_html = app.votesTemplate(priority_bills.data);
    $("#priorityVotes").append(bills_html)
}

function showInfo(results) {
    let data = results.data;
    $.each(data, function(i, member) {
        member["normalScoreColor"] = getColor(member.score_2021);
        member["lifetimeScoreColor"] = getColor(member.lifetime_score);
        // if (member.legis_id) {
            NJDistricts[member.legis_id] = member;
        // }
           });
    loadGeo();
}

function loadGeo() {
    let tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
            maxZoom: 18,
            minZoom: 7,
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/light-v10',
            accessToken: 'pk.eyJ1IjoibXJvc3dlbGwiLCJhIjoiY2twZDN6eTB0MWJ4eDJxcGd5OG0yN2xtNCJ9.tUHOVBolz3YsZRQJOQRETg'
        }
    );
    tileLayer.addTo(map);

    let BoundaryLayer = L.geoJson(nj_legislative_boundary_map, {
    }).addTo(map).setStyle({
        stroke: true,
        fillColor:'#ffffff',
        color: '#3f3f3f',
        weight: 1,
        fillOpacity:.5
    });

    legislatorLayer = L.geoJson(legislator_points, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, geoStyle(feature));
        }
    });
    legislatorLayer.addTo(map);


}

// get color depending on score value
function getColor(score) {
    return score === "NIO" ? '#fefefe' :
        score > 80 ? '#82BC00' : //' '#4EAB07' :
            score > 60 ? '#82e0c3' :
                score > 40 ? '#FEF200' :
                    score > 20 ? '#FCA300' :
                        '#E53935';
//    'rgb(255,0,0)';
}

function highlightFeature(e) {
    let layer = e.target;
    let legisId = layer.feature.properties.legis_id;
    let memberDetail = NJDistricts[legisId];
    clickedMemberNumber = legisId;

    memberDetail["scoreColor"] = memberDetail["normalScoreColor"];
    layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 1
    });
    if (!freeze) {
        html = app.infoboxTemplate(memberDetail);
        $sidebar.html(html);
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }
}

function resetHighlight(e) {
    legislatorLayer.resetStyle(e.target);
    // let districtNumber = legislatorLayer.feature.properties.legis_id;
}

function mapMemberDetailClick(e) {
    freeze = 1;
    let point = e.target;
    let legisId = point.feature.properties.legis_id;
    let member = memberDetailFunction(legisId)
}

function memberDetailFunction(memberNumber) {
    clickedMemberNumber = memberNumber;
    let districtDetail = NJDistricts[memberNumber];

    let html = app.infoboxTemplate(districtDetail);
    $sidebar.html(html);
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
