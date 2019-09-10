// let public_spreadsheet_url = '1MVQ30DNes3hozskjPNTNSYE8m-yR9PboKTokC8YNlk4';
let public_spreadsheet_url = '1FoLv0alzLYDt3D5iQ3zbPXP0HS71_vgju-ESlDY_ayM';
let senateLayer;
let MESenateDistricts = {};
let app = {};
let freeze=0;
let $sidebar = $('#sidebar');

var vote_context =  {
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
            "vote_description": "LD 54 would prohibit lobbyists from contributing to candidates’ political campaigns year-round (their contributions were already banned during the legislative session). The bill that passed is much narrower in scope than we wanted — it does not include contributions from the companies or organizations that employ the lobbyists — but it's a step in the right direction.",
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

let map = L.map('map', {
    scrollWheelZoom: false,
    zoomSnap: 0.25,
    minZoom: 7,
}).setView([37.76, -79.3],7);
// var map = L.map('map', {scrollWheelZoom: true}).setView([45.3, -69],7);

// control that shows state info on hover
let info = L.control({position: 'bottomright'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = (props ?
        '<b>' + props.NAMELSAD + '</b>'
        : 'Hover over a district');
};

info.addTo(map);
function init() {
    Tabletop.init( {
        key: public_spreadsheet_url,
        callback: showInfo,
        // simpleSheet: true,
        parseNumbers: true
    } )
}

let geoStyle = function(data) {
    let dist = data.properties.NAMELSAD.split(' ').pop();
    let party = MESenateDistricts[dist].party;
    let scoreColor = getColor(party);

    return {
        fillColor: scoreColor,
        weight: 2,
        opacity: 0.3,
        color: '#fefefe',
        dashArray: '0',
        fillOpacity:.7
    }
};

window.addEventListener('DOMContentLoaded', init);

$(document).ready(function () {
    let key_votes = $("#senate-template-bottom").html();
    app.template = Handlebars.compile(key_votes);

    let sourcebox = $("#senate-template-infobox").html();
    app.infoboxTemplate = Handlebars.compile(sourcebox);

    let html = app.template(vote_context);

    let map_help = $("#welcome-map-help").html();
    app.welcome = Handlebars.compile(map_help);
    $sidebar.append(app.welcome)

    $("#priorityVotes").append(html);

    Tabletop.init( { key: public_spreadsheet_url,
        callback: showInfo,
        simpleSheet: true } )
});
function showInfo(sheet_data, tabletop) {
    let scoreColor;
    let flipped = ( $("input.primary:checked + .slider ").is(':checked') ) ? 1 : 0;

    $.each(tabletop.sheets("va house").all(), function(i, member) {

        if (flipped === 1) {
            scoreColor = getColor(member.party_flip);
        }else {
            scoreColor = getColor(member.party);
        }
        member['scoreColor'] = scoreColor;
        MESenateDistricts[member.current_district] = member;
    });
    loadGeo();

}
// console.log('MESenateDistricts', MESenateDistricts);
function loadGeo() {
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        minZoom:7,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.light'
    }).addTo(map);

    senateLayer = L.geoJson(geosenate, {
        onEachFeature: onEachFeature,
        style: geoStyle
    });

    senateLayer.addTo(map);
}

// get color depending on score value
function getColor(party) {
    return  party === "R"? '#BF353B' : //#0079f2' :
        party === "D" ? '#27609c': //'#ff3636' :
            score > 49 ? '#FEF200' :
                score > 24 ? '#FDC300' :
                    score > 0 ? '#FC8400' :
                        'rgb(255,255,0)';
}


function highlightFeature(e) {
    let layer = e.target;
    let districtNumber = layer.feature.properties.NAMELSAD.split(' ').pop();
    let memberDetail = MESenateDistricts[districtNumber];
    if(!memberDetail){
        console.log("No memberDetail");
        return;
    }
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
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
    senateLayer.resetStyle(layer);
    info.update();
}

function mapMemberDetailClick(e) {
    freeze = 1;
    let boundary = e.target;
    let districtNumber = boundary.feature.properties.NAMELSAD.split(' ').pop();

    // console.log("mapMemberDetailClick: ", memberNumber);
    let member = memberDetailFunction(districtNumber);
}

function memberDetailFunction(memberNumber) {
    let districtDetail = MESenateDistricts[memberNumber];
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
    $sidebar.html(' ');
    $sidebar.append(app.welcome);
    let $heading = $('.entry-default-text h4');
    $heading.html("Map Help")
}
