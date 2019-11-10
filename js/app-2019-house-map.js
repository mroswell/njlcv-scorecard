let public_spreadsheet_url = "1Y9gCf778XtztI-EipsewXCnvFWYrpoyyYLmkisQp9Hs";

let NJDistricts = {};
let app = {};
let freeze = 0;
let $sidebar = $("#sidebar");
let legislatorLayer;
let clickedMemberNumber;


let vote_context =  {
    "priority_votes": [{
        "vote_title":"1. Automatic Voter Registration",
        "vote_description":"LD 1483 would automatically register eligible citizens to vote when they receive or renew their driver's license or ID at the Bureau of Motor Vehicles and/or when they apply for or renew their eligibility for MaineCare, unless they opt out. It would also pre-register 16-year-old citizens when they get their first driver's license or state ID.",
        "result":"RESULT: SIGNED INTO LAW"
    },
        {
            "vote_title":"2. National Popular Vote",
            "vote_description": "LD 816 would have Maine join the National Popular Vote Compact, which would guarantee the Presidency to the candidate who receives the most popular votes in all 50 states and the District of Columbia. It gained enough support to pass in the Senate, but ultimately failed in the House.",
            "result":"RESULT: DEFEATED"
        },
        {
            "vote_title": "3. Presidential Primary",
            "vote_description": "LD 1626 was the Secretary of State's bill to restore presidential primaries in Maine. This was among our highest priorities, as it would implement a more inclusive and confidential system than caucuses. Its passage means that Maine will be among states voting on Super Tuesday, March 3, 2020.",
            "result": "RESULT: SIGNED INTO LAW"
        },
        {
            "vote_title": "4. Lobbyist Contribution Ban",
            "vote_description": "LD 54 would prohibit lobbyists from contributing to candidates’ political campaigns year-round (their contributions were already banned during the legislative session. The bill that passed is much narrower in scope than we wanted — it does not include contributions from the companies or organizations that employ the lobbyists — but it's a step in the right direction.",
            "result": "RESULT: PARTIAL VICTORY"
        },
        {
            "vote_title":"5. Ranked Choice Voting",
            "vote_description": "Constitutional Amendment LD 1477 would amend the Maine Constitution to permit ranked choice voting (RCV) in general elections for governor and state legislature. Because it's a constitutional amendment, this bill required the approval of two-thirds in each chamber before going to the voters for ratification. Despite gaining majorities in both chambers, it failed final passage. ",
            "result":"RESULT: DEFEATED"
        }, {
            "vote_title":"6. Early Voting",
            "vote_description": "LD 619 is an amendment to the Maine Constitution that would allow municipalities to hold early voting up to 30 days before an election. Early voting is supported by the Maine Secretary of State and the Maine Town and City Clerks Association, as well as by the League of Women Voters. The bill failed to gain the needed two-thirds majority in both chambers.",
            "result":"RESULT: DEFEATED"
        }]
};

let map = L.map("map", {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    minZoom: 8
}).setView([40.09, -74.6728], 7);

// var map = L.map('map', {scrollWheelZoom: true}).setView([45.3, -69],7);

// control that shows state info on hover
let info = L.control({ position: "bottomright" });

info.onAdd = function(map) {
    this._div = L.DomUtil.create("div", "info");
    this.update();
    return this._div;
};

info.update = function(props) {
    this._div.innerHTML = props
        ? "<b>" + props.NAMELSAD + "</b>"
        : "Hover over a district";
};

info.addTo(map);
function init() {
    Tabletop.init({
        key: public_spreadsheet_url,
        callback: showInfo,
        // simpleSheet: true,
        parseNumbers: true
    });
}

let geoStyle = function(data) {
    console.log("data.properties", data.properties);
    let legisId = data.properties.legis_id;
    console.log("---------legisId", legisId)
    console.log("NJDistricts", NJDistricts);
    console.log("NJDistricts[legisId].score_2019", NJDistricts[legisId].score_2019);
    var score = NJDistricts[legisId].score_2019;
    let scoreColor = getColor(score);

    return {
        radius: 6,
        fillColor: scoreColor,
        weight: 2,
        opacity: 0.9,
        color: "#fefefe",
        dashArray: "0",
        fillOpacity: 1
    };
};

window.addEventListener("DOMContentLoaded", init);

// nort

$(document).ready(function() {
    let key_votes = $("#senate-template-bottom").html();
    app.template = Handlebars.compile(key_votes);

    let sourcebox = $("#senate-template-infobox").html();
    app.infoboxTemplate = Handlebars.compile(sourcebox);

    let map_help = $("#welcome-map-help").html();
    app.welcome = Handlebars.compile(map_help);
    $sidebar.append(app.welcome);

    let html = app.template(vote_context);
    $("#priorityVotes").append(html);


});
function showInfo(sheet_data, tabletop) {
    $.each(tabletop.sheets("nj-assembly").all(), function(i, member) {
        console.log("member",member);
        member["normalScoreColor"] = getColor(member.score_2019);
        NJDistricts[member.legis_id] = member;
        //console.log(NJDistricts)
    });
    loadGeo();
}

function loadGeo() {
    let tileLayer = L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
        {
            maxZoom: 18,
            minZoom: 7,
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: "mapbox.light"
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
        // style: data => geoStyle(data, false)
        }
    });
    legislatorLayer.addTo(map);


}

// get color depending on score value
function getColor(score) {
    return score === "Medical leave" ? '#fefefe' :
        score > 99 ? '#4EAB07' :
            score > 74 ? '#82e0c3' :
                score > 49 ? '#FEF200' :
                    score > 24 ? '#FDC300' :
                        score > 0 ? '#FC8400' :
                            'rgb(255,0,0)';
}

function highlightFeature(e) {
    let layer = e.target;
    let legisId = layer.feature.properties.legis_id;
    let memberDetail = NJDistricts[legisId];
    clickedMemberNumber = legisId;
    if (!memberDetail) {
        console.log("No memberDetail");
        return;
    }

    memberDetail["scoreColor"] = memberDetail["normalScoreColor"];
    console.log("memberDetail",memberDetail);
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
        info.update(layer.feature.properties);
    }
}

function resetHighlight(e) {
    legislatorLayer.resetStyle(e.target);
    info.update();
}

function mapMemberDetailClick(e) {
    freeze = 1;
    let boundary = e.target;
    let districtNumber = boundary.feature.properties.legis_id;
    let member = memberDetailFunction(districtNumber);
}

function memberDetailFunction(memberNumber) {
    clickedMemberNumber = memberNumber;
    let districtDetail = NJDistricts[memberNumber];
    districtDetail["scoreColor"] = districtDetail["normalScoreColor"];

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
