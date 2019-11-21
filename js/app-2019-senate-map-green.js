let public_spreadsheet_url = "1q2r9zczACPL6XArWEAVBbSgEUd9u8v3upp6-1L84_OI";
let boundaryLayer;
let NJDistricts = {};
let app = {};
let freeze = 0;
let $sidebar = $("#sidebar");
let clickedMemberNumber;

let vote_context =  {
    "priority_votes": [
        {
            "billnumber": "S598",
            "billname": "Upholding Paris Climate Accord",
            "billdescription": "Requires N.J. to join the U.S. Climate Alliance to uphold the Paris Climate Accord, lower greenhouse gas emissions, and address the threats posed by climate change in accordance with the goals established by the alliance. This action is in response to President withdrawal from the Paris Accord.",
            "outcome": "Passed by the Senate (26-12), Passed by the Assembly (49-23), signed by the Governor P.L. 2018, c. 3",
            "stance": "Support"
        },
        {
            "billnumber": "S721",
            "billname": "Electric School Buses",
            "billdescription": "Alters the current regulations on electric school bus sizes. The maximum overall width of an electric school bus will be increased from 96 inches to 106 inches, excluding accessories.",
            "outcome": "Passed by the Senate unanimously, Received in the Assembly",
            "stance": "Support"
        },
        {
            "billnumber": "S-611/S874",
            "billname": "Participation in the Regional Greenhouse Gas Initiative",
            "billdescription": "Requires New Jersey’s reentry into and full participation in the Regional Greenhouse Gas Initiative. RGGI is a cooperative effort to cap and reduce CO2 emissions from the electricity generating sector. This bill requires rules and regulations to be promulgated, and ensures that those who live in environmental justice communities that bare a disproportionate burden of the impacts of climate change and pollution are prioritized in projects funded by RGGI revenues.",
            "outcome": "Passed by the Assembly (48-24), Received in the Senate",
            "stance": "Support"
        },
        {
            "billnumber": "S258",
            "billname": "Prohibits Offshore Oil and Gas Development in State Waters (STOP Act)",
            "billdescription": "Prohibits offshore oil or natural gas exploration, development, and production in State waters (i.e., within three miles offshore), and prohibit the leasing of tidal or submerged lands in State waters for the purposes of oil or natural gas exploration, development, or production. Additionally, the bill would prohibit the DEP from issuing any permits and approvals for any development associated with offshore drilling in State waters or outside State waters.",
            "outcome": "Passed by the Assembly (72-1), Passed by the Senate (37-0), Signed by the Governor P.L. 2018, c. 7",
            "stance": "Support"
        },
        {
            "billnumber": "S606",
            "billname": "Electric Vehicle Charging Infrastructure",
            "billdescription": "Encourages municipalities to plan for the development of electric vehicle charging infrastructure at appropriate locations. By improving the infrastructure for electric vehicle charging, New Jersey can uphold the goals in the Energy Master Plan to promote and encourage the use of electric vehicles and reduce the emissions from our transportation sector.",
            "outcome": "Passed by the Assembly (67-4-1), Passed by the Senate (26-4)",
            "stance": "Support"
        },
        {
            "billnumber": "S1242",
            "billname": "One Hour Water Boil Notices",
            "billdescription": "Requires public water companies to notify the mayor and municipality via telephone and email within one hour of boil water emergency with notice and detailed report of where and who is affected.",
            "outcome": "Passed by the Senate unanimously, Received in the Assembly",
            "stance": "Support"
        },
        {
            "billnumber": "S1793",
            "billname": "Establishes Clean Vehicle Task Force",
            "billdescription": "Establishes Clean Vehicle Task Force to address and make recommendations about clean vehicle issues in NJ; clarifies California Low Emission Vehicle program implementations; legislative findings; only applies credits to vehicles sold in NJ.",
            "outcome": "Passed by the Senate (34-4), Received in the Assembly",
            "stance": "Support"
        },
        {
            "billnumber": "S2314",
            "billname": "Clean Renewable Energy Bill",
            "billdescription": "The landmark Clean Renewable Energy Bill reestablished New Jersey’s commitment to addressing the climate crisis and being a national leader in the clean energy economy by requiring 50% of the state’s energy to come from clean renewable energy by 2030. This bill catalyzes offshore wind development, kick starts a community solar pilot program, establishes aggressive annual energy efficiency goals, modifies the current solar market, and sets energy storage benchmarks.",
            "outcome": "Passed by the Assembly (51-20-2), Passed by the Senate (29-8), Signed by the Governor P.L. 2018, c.17",
            "stance": "Support"
        },
        {
            "billnumber": "S481/S651",
            "billname": "Automatic Voter Registration",
            "billdescription": "This bill requires the New Jersey Motor Vehicle Commission (MVC) to automatically register or update a person’s voter registration as part of the process of applying for or renewing a driver’s license.",
            "outcome": "Passed by the Assembly (50-23), Passed by the Senate (24-13), Signed by the Governor P.L. 2018, c.6",
            "stance": "Support"
        },
        {
            "billnumber": "S-2534",
            "billname": "Prohibits Smoking at Public Beaches",
            "billdescription": "Extends the “New Jersey Smoke-Free Air Act” to prohibit smoking at public beaches and parks. Public health is a top priority in New Jersey and this revision allows up to 15% of total area to be designated by the municipality or county by ordinance or resolution smoking area.",
            "outcome": "Passed by the Senate (34-1), Passed by the Assembly (66-1-2), Signed by the Governor P.L. 2018, C.64",
            "stance": "Support"
        },
        {
            "billnumber": "S-1073",
            "billname": "Stormwater Utilities",
            "billdescription": "The Clean Stormwater and Flood Reduction Act authorizes local authorities to voluntarily establish stormwater utilities to dedicatedly fund necessary improvements to stormwater infrastructure - with a focus on green infrastructure to manage polluted stormwater. New Jersey’s water infrastructure is antiquated and overburdened and the state currently faces a $16 billion funding deficit with few options for localities to address or fund these critical infrastructure improvements. Stormwater utilities are widely considered the most equitable and effective way to address stormwater management infrastructure needs and are used in over 40 states.",
            "outcome": "Passed by the Assembly (45-31), Passed by the Senate (25-11), Signed by the Governor P.L. 2019, c.42",
            "stance": "Support"
        },
        {
            "billnumber": "S-1074",
            "billname": "Public Right of Access to Waterways and Beaches",
            "billdescription": "Protects New Jerseyan’s right to access the state’s natural resources including beaches and waterfronts. New Jersey is known for its beautiful 130-mile shore line and is an essential part of our state’s cultural identity and economy. This bill will ensure New Jersey residents will have the ability to enjoy these natural amenities and will not be denied access by developers and major property owners.",
            "outcome": "Passed by the Assembly (71-7-2), Passed by the Senate unanimously, Signed by the Governor P.L. 2019, c.81",
            "stance": "Support"
        },
        {
            "billnumber": "ACR144",
            "billname": "Condemns EPA decision to withdraw from \"Once-In-Always-In\" (Clean Air Act)",
            "billdescription": "Resolution condemns the United States Environmental Protection Agency for its decision to withdraw the “once-in-always-in” policy under the Clean Air Act. “Major sources” of hazardous air pollutants (HAP) are now allowed to reclassify as an “area source” after acting to limit emissions, which would relieve these facilities of the requirements of stricter regulations.",
            "outcome": "Passed by the Assembly (52-13-8), Passed by the Senate (26-12), Filed with the Secretary of State",
            "stance": "Support"
        },
        {
            "billnumber": "S-678",
            "billname": "Concerns Fracking Wastewater",
            "billdescription": "Prohibits the treatment, discharge, disposal, application, or storage of fracking wastewater that contains toxic chemicals harmful to the state. The release of this toxic wastewater into New Jersey’s waterways threaten public health and pollutes ecosystems.",
            "outcome": "Passed by the Senate (31-5), Received in the Assembly",
            "stance": "Support"
        },
        {
            "billnumber": "SCR-118",
            "billname": "Concerns Regulations for Interstate Natural Gas Pipelines",
            "billdescription": "Resolution urges the President of the United States and Congress to hold pipeline companies to our more stringent public safety standards if constructing in New Jersey. As the most densely populated state, it is crucial we prioritize and protect our communities.",
            "outcome": "Passed by the Senate (30-3), Received in the Assembly",
            "stance": "Support"
        },
        {
            "billnumber": "SCR-150",
            "billname": "Concerns Fracking Wastewater and the Delaware River Basin",
            "billdescription": "Urges the Governor to block the Delaware River Basin Commission’s proposed rule that would permit the use and discharge of hydraulic fracturing wastewater in the basin as well as the export of water from the basin to be used in “fracking”. Hydraulic fracturing requires the pumping of a plethora of unknown chemicals into the earth to release natural gas, and by doing so damages the health and integrity of the ground and water. The Delaware River Basin provides fresh drinking water to 15 million people in the surrounding area.",
            "outcome": "Passed in the Senate (33-2), Received in the Assembly",
            "stance": "Support"
        },
        {
            "billnumber": "S2140",
            "billname": "Authorizes Prescribed Burning",
            "billdescription": "Authorizes prescribed burning for certain resources, requires the DEP to develop and administer a plan on burning wildland fire fuels for a reasonable fee, authorizes the DEP to assess against a landowner, addresses liability issues with prescribed burning, and allows the DEP to adopt regulations necessary to implement the bill.",
            "outcome": "Passed by both chambers unanimously, Signed by the Governor P.L. 2018, c. 107",
            "stance": "Support"
        },
        {
            "billnumber": "S-3207",
            "billname": "Updates Global Warming Response Act",
            "billdescription": "Establishes new timeframes for the completion of the Legislature’s directives in the Global Warming Response Act. Specifically, with this update, the DEP is now required to adopt rules and promulgate regulations to meet the 80% economy-wide emissions reductions from 2006 levels by 2050 outlined in the original GWRA due to an added mandate that ensures action. This bill also requires the State to develop a comprehensive strategy and promulgate regulations to reduce short-lived climate pollutants in the State including black carbon.",
            "outcome": "Passed by Senate (29-6), Passed by the Assembly (66-8-1), signed by the Governor P.L. 2019, c.197",
            "stance": "Support"
        },
        {
            "billnumber": "S150",
            "billname": "Partial Disclosure Bill",
            "billdescription": "This bill requires C(4) non-profits who are involved in policy and lobbying work to disclose their donors, while keeping big, well fueled corporations and trade organizations in the dark by requiring no new disclosure standards. This bill would severely impact nonprofits ability to fight against corporate interests.",
            "outcome": "Passed by the Assembly (68-0-4), Passed by the Senate unanimously, Signed by the Governor P.L. 2019, c.124",
            "stance": "Oppose"
        },
        {
            "billnumber": "S2920",
            "billname": "Permanent Open Space Funding",
            "billdescription": "Establishes the funding allocations for the constitutional dedication of Corporation Business Tax (CBT) revenues for the State’s open space, farmland, and historic preservation programs for fiscal year 2020 and thereafter. For Fiscal Year 2020 and thereafter, this annual dedication is increased from four to six percent.",
            "outcome": "Passed by both chambers unanimously, Signed by the Governor P.L. 2019, c.136",
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
    console.log("data.properties", data.properties);
    // let legisId = data.properties.legis_id;
    let legisId = parseInt(data.properties.SLDUST);
    console.log("---------legisId", legisId);

    let scoreColor = getColor( NJDistricts[legisId].score_2019);

    return {
        fillColor: scoreColor,
        weight: 2,
        opacity: 0.9,
        color: "#fefefe",
        dashArray: "0",
        fillOpacity: 0.7
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
    let scoreColor;
    let lifetimeScoreColor;
    $.each(tabletop.sheets("nj-senate").all(), function(i, member) {
        scoreColor = getColor(member.score_2019);
        member['scoreColor'] = scoreColor;
        lifetimeScoreColor = getColor(member.lifetime_score);
        member['lifetimeScoreColor'] = lifetimeScoreColor;
        console.log("member", member);
        if (member.legis_id) {
        NJDistricts[member.legis_id] = member;
       }
        console.log(NJDistricts);
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

    boundaryLayer = L.geoJson(nj_legislative_boundary_map, {
        onEachFeature: onEachFeature,
        style: data => geoStyle(data)
    }).addTo(map);
}

// get color depending on score value
function getColor(score) {
    return score === "NIO" ? '#fefefe' :
        score > 99 ? '#82BC00' : //' '#4EAB07' :
            score > 74 ? '#82e0c3' :
                score > 49 ? '#FEF200' :
                    score > 24 ? '#FDC300' :
                        score > 0 ? '#FC8400' :
                            'rgb(255,0,0)';
}
// get color depending on score value
// function getColor(score) {
//     return score === "NIO" ? '#fefefe' :
//         score > 80 ? '#82BC00' : //' '#4EAB07' :
//             score > 60 ? '#82e0c3' :
//                 score > 40 ? '#FEF200' :
//                     score > 20 ? '#FCA300' :
//                         'rgb(255,0,0)';
// }

function highlightFeature(e) {
    let layer = e.target;
    let legisId = parseInt(layer.feature.properties.SLDUST);
    let memberDetail = NJDistricts[legisId];
    console.log(memberDetail);
    // if(!memberDetail){
    //     console.log("No memberDetail");
    //     return;
    // }

    // clickedMemberNumber = legisId;

    // memberDetail["scoreColor"] = memberDetail["normalScoreColor"];
    layer.setStyle({
        weight: 3,
        color: "#8e8e8e",
        dashArray: "",
        fillOpacity: .4
    });
    if (!freeze) {
        let html = app.infoboxTemplate(memberDetail);
        $sidebar.html(html);
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
    // console.log("mapMemberDetailClick: ", memberNumber);
    let member = memberDetailFunction(legisId);
}

function memberDetailFunction(legisId) {
    clickedMemberNumber = legisId;
    let districtDetail = NJDistricts[legisId];
    console.log(NJDistricts[legisId],"***");
     // districtDetail["scoreColor"] = districtDetail["normalScoreColor"];

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
