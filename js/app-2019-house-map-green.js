let public_spreadsheet_url = "1DhG_oFKYEjKkZ28OUajNNFf6UCLQc_ExNR7wwG6rdvQ";
let legislatorLayer; //points
let NJDistricts = {};  //data
let app = {};
let freeze = 0;
let $sidebar = $("#sidebar");
let clickedMemberNumber;
let vote_context =  {
    "priority_votes":
        [
            {
                "billnumber": "A1929",
                "billname": "Upholds Paris Climate Accord",
                "billdescription": "Requires New Jersey to join the U.S. Climate Alliance to uphold the Paris Climate Accord, lower greenhouse gas emissions, and address the threats posed by climate change in accordance with the goals established by the alliance. This action is in response to President Trump’s withdrawal from the Paris Accord.",
                "outcome": "Passed by the Senate (26-12), Passed by the Assembly (49-23), Signed by the Governor P.L. 2018, c. 3.",
                "stance": "Support"
            },
            {
                "billnumber": "A839",
                "billname": "Prohibits Offshore Oil and Gas Development in State Waters (STOP Act)",
                "billdescription": "This bill prohibits offshore oil or natural gas exploration, development, and production in State waters (i.e., within three miles offshore), and prohibits the leasing of tidal or submerged lands in State waters for the purposes of oil or natural gas exploration, development, or production. Additionally, the bill would prohibit the DEP from issuing any permits and approvals for any development associated with offshore drilling in State waters or outside State waters.",
                "outcome": "Passed by the Assembly (72-1), Passed by the Senate unanimously, Signed by the Governor P.L. 2018, c. 7",
                "stance": "Support"
            },
            {
                "billnumber": "A1212",
                "billname": "Participation in the Regional Greenhouse Gas Initiative",
                "billdescription": "Requires New Jersey’s reentry into and full participation in the Regional Greenhouse Gas Initiative. RGGI is a cooperative effort to cap and reduce CO2 emissions from the electricity generating sector and requires the state to adopt rules and regulations to guide this process.",
                "outcome": "Passed by the Assembly (48-24), Received in the Senate",
                "stance": "Support"
            },
            {
                "billnumber": "ACR144",
                "billname": "Condemns EPA decision to withdraw from \"Once-In-Always-In” Policy (Clean Air Act)",
                "billdescription": "Resolution condemns the United States Environmental Protection Agency for its decision to withdraw the “once-in-always-in” policy under the Clean Air Act. “Major sources” of hazardous air pollutants (HAP) are now allowed to reclassify as an “area source” after acting to limit emissions, which would relieve these facilities of the requirements of stricter regulations.",
                "outcome": "Passed by the Assembly (52-13-8), Passed by the Senate (26-12), Filed with the Secretary of State",
                "stance": "Support"
            },
            {
                "billnumber": "A1675",
                "billname": "Authorizes Prescribed Burning",
                "billdescription": "Authorizes prescribed burning for certain resources, requires the DEP to develop and administer a plan on burning wildland fire fuels for a reasonable fee, authorizes the DEP to assess against a landowner, addresses liability issues with prescribed burning, and allows the DEP to adopt regulations necessary to implement the bill.",
                "outcome": "Passed by both chambers unanimously, Signed by the Governor P.L. 2018, c. 107",
                "stance": "Support"
            },
            {
                "billnumber": "A3723",
                "billname": "Clean Renewable Energy Bill",
                "billdescription": "The landmark Clean Renewable Energy Bill reestablishes New Jersey’s commitment to addressing the climate crisis and being a national leader in the clean energy economy by requiring 50% of the state’s energy to come from clean renewable energy by 2030. This bill catalyzes offshore wind development, kick starts a community solar pilot program, establishes aggressive annual energy efficiency goals, modifies the current solar market, and sets energy storage benchmarks.",
                "outcome": "Passed by the Assembly (51-20-2), Passed by the Senate (29-8), Signed by the Governor P.L. 2018, c.17",
                "stance": "Support"
            },
            {
                "billnumber": "A2014",
                "billname": "Automatic Voter Registration",
                "billdescription": "This bill requires the New Jersey Motor Vehicle Commission (MVC) to automatically register or update a person’s voter registration as part of the process of applying for or renewing a driver’s license.",
                "outcome": "Passed by the Assembly (50-23), Passed by the Senate (24-13), Signed by the Governor P.L. 2018, c.6",
                "stance": "Support"
            },
            {
                "billnumber": "A2694",
                "billname": "Stormwater Utilities",
                "billdescription": "The Clean Stormwater and Flood Reduction Act authorizes local authorities to voluntarily establish stormwater utilities to dedicatedly fund necessary improvements to stormwater infra&shy;structure - with a focus on green infrastructure to manage polluted stormwater. NJ’s water infra&shy;structure is antiquated and overburdened and the state currently faces a $16B funding deficit with few options for localities to address or fund these critical infrastructure improvements. Stormwater utilities are widely considered the most equitable and effective way to address stormwater management infra&shy;structure needs and are used in over 40&nbsp;states.",
                "outcome": "Passed by the Senate (25-11), Passed by the Assembly (45-31), Signed by the Governor P.L.2019, c.42",
                "stance": "Support"
            },
            {
                "billnumber": "A1371",
                "billname": "Electric Vehicle Charging Infrastructure",
                "billdescription": "Encourages municipalities to plan for the development of electric vehicle charging infrastructure at appropriate locations. By improving the infrastructure for electric vehicle charging, New Jersey can uphold the goals in the Energy Master Plan to promote and encourage the use of electric vehicles and reduce the emissions from our transportation sector.",
                "outcome": "Passed by the Assembly (67-4-1), Passed by the Senate (26-4)",
                "stance": "Support"
            },
            {
                "billnumber": "A4821",
                "billname": "Updated Global Warming Response Act",
                "billdescription": "This bill establishes new timeframes for the completion of the Legislature’s directives in the Global Warming Response Act. Specifically, with this update, the DEP is now required to adopt rules and promulgate regulations to meet the 80% economy-wide emissions reductions from 2006 levels by 2050 outlined in the original GWRA due to an added mandate that ensures action. This bill also requires the State to develop a comprehensive strategy and promulgate regulations to reduce short-lived climate pollutants in the State including black carbon.",
                "outcome": "Passed by Senate (29-6), Passed by the Assembly (66-8-1), Signed by the Governor P.L. 2019, c.197",
                "stance": "Support"
            },
            {
                "billnumber": "S150",
                "billname": "Partial Disclosure Bill",
                "billdescription": "This bill requires C(4) non-profits who are involved in policy and lobbying work to disclose their donors, while keeping big, well fueled corporations and trade organizations in the dark by requiring no new disclosure standards. This bill would severely impact non-profits' ability to fight against corporate interests.",
                "outcome": "Passed by the Assembly (68-0-4), Passed by the Senate unanimously, Signed by the Governor P.L. 2019, c.124",
                "stance": "Oppose"
            },
            {
                "billnumber": "S2920",
                "billname": "Permanent Open Space Funding",
                "billdescription": "Establishes the funding allocations for the constitutional dedication of Corporation Business Tax (CBT) revenues for the State’s open space, farmland, and historic preservation programs for fiscal year 2020 and thereafter. For Fiscal Year 2020 and thereafter, this annual dedication is increased from four to six percent.",
                "outcome": "Passed by both chambers unanimously, Signed by the Governor P.L. 2019, c. 136",
                "stance": "Support"
            },
            {
                "billnumber": "S2534",
                "billname": "Prohibits Smoking at Public Beaches",
                "billdescription": "Extends the “New Jersey Smoke-Free Air Act” to prohibit smoking at public beaches and parks. Public health is a top priority in New Jersey and this revision allows up to 15% of total area to be designated by the municipality or county by ordinance or resolution as a smoking area.",
                "outcome": "Passed by the Senate (34-1), Passed by the Assembly (66-1-2), Signed by the Governor P.L 2018, c.64",
                "stance": "Support"
            },
            {
                "billnumber": "S1074",
                "billname": "Public Right of Access to Waterways and Beaches",
                "billdescription": "Protects New Jerseyans' right to access the state’s natural resources including beaches and waterfronts. New Jersey is known for its beautiful 130-mile shore line, which is an essential part of our states cultural identity and economy. This bill will ensure New Jersey residents will have the ability to enjoy these natural amenities and will not be denied access by developers and major property owners.",
                "outcome": "Passed by the Senate (36-4), Passed by the Assembly (71-7-2), Signed by the Governor P.L. 2019, c.81",
                "stance": "Support"
            }
        ]
};

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

let geoStyle = function(data) {
    let legisId = data.properties.legis_id;
    let scoreColor = getColor( NJDistricts[legisId].score_2019);

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
        member["normalScoreColor"] = getColor(member.score_2019);
        member["lifetimeScoreColor"] = getColor(member.lifetime_score);
        // if (member.legis_id) {
            NJDistricts[member.legis_id] = member;
        // }
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
                            'rgb(255,0,0)';
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
