
let app = {};


let SHEET_ID = '1SElVFbGXQ9W_X43Kb2S2PFRsxwgW_yGJrIJUdjRCYxc';
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
        sheetName: 'bill_descriptions',
        apiKey: API_KEY,
        complete: displayVotes
    });
}


window.addEventListener("DOMContentLoaded", init);

$(document).ready(function() {

    // let sourcebox = $("#generate-senate-template").html();
    // app.infoboxTemplate = Handlebars.compile(sourcebox);
    //
    // let map_help = $("#welcome-map-help").html();
    // app.welcome = Handlebars.compile(map_help);
    // $sidebar.append(app.welcome);
    //
    // let key_votes = $("#senate-template-bottom").html();
    // app.votesTemplate = Handlebars.compile(key_votes);
    let key_votes = $("#generate-senate-template").html();

});

function displayVotes(priority_bills) {
    let key_votes = $("#generate-senate-template").html();
    console.log(key_votes)
    app.votesTemplate = Handlebars.compile(key_votes);
   console.log(app.votesTemplate)
   console.log(priority_bills)
    let bills_html = app.votesTemplate(priority_bills.data);
   console.log(bills_html)
    $("#priorityVotes").append(bills_html)
}



function clearInfobox() {
    $sidebar.html(" ");
    $sidebar.append(app.welcome);
    let $heading = $(".entry-default-text h4");
    $heading.html("Map Help");
}
