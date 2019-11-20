//event website

//example client side call:
//event brite stuff
//https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=YOUR_API_KEY&redirect_uri=YOUR_REDIRECT_URI
//add this to then end /v3/users/me/?token=CHY3NFJVQRWLTVGZLFIB
var api_key = "6WXJHRCFYQFNXRVSBL";

//ticketmaster stuff:
//https://app.ticketmaster.com/discovery/v2/events.json?apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ
// search with a zipcode: 
//  this works: https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ
//search with a date range:
//startDateTime=2019-11-15T01:00:00Z
//endDateTime=2019-11-24  
//https://app.ticketmaster.com/discovery/v2/events.json?q={"postalCode":"78702"}&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ
var TM_api_key = "3JcNn4ea56JrBolF27QIGsWgd58v9GSZ";
//this works, searching zipcode and keyword:
//queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&keyword=surface&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';
//this works for location and dates:
//'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&startDateTime=2019-11-15T01:00:00Z&endDateTime=2019-12-30T01:00:00Z&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';
//640x360 looks good

//queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&startDateTime=2019-11-15T01:00:00Z&endDateTime=2019-12-30T01:00:00Z&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';
//console.log(queryURL);
var location;

//add in some default values so I don't go crazy: (get rid of this for release)////////

//to do list for bob:  
//1) make the date and time nice
//2) add the "buy tickets" link
//3) choose the best picture to use based on the resolution


$("#location").val("Austin");
console.log($("#start_date"));
$("#start_date").val("2019-11-16");
$("#end_date").val("2019-12-20");
//////////////////////////////////

$("#btn_submit").on("click", function (event) {
    event.preventDefault;
    //debugger;
    var start_date = convert_date($("#start_date")[0].value);
    var end_date = convert_date($("#end_date")[0].value);
    console.log($("#search_field")[0]);
    var keyword = $("#search_field")[0].value;
    var location = $("#location")[0].value;
    console.log("location read is: " + location);




    //queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&keyword='+keyword+'&startDateTime='+start_date+'&endDateTime='+end_date+'&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';
    queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?&locale=*&city=' + location + '&keyword=' + keyword + '&startDateTime=' + start_date + '&endDateTime=' + end_date + '&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';

    console.log(queryURL);


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        $("#event_results").empty();
        var event_array = response._embedded.events;
        var new_table_row;
        var new_td;
        var new_th;
        var clean_date;
        var timeZone;
        console.log(response);
        console.log($("#start_date"));
        console.log(event_array);
        draw_header();   //make a new header:

        for (var i = 0; i < event_array.length; i++) {
            //debugger;
            new_table_row = $("<div></div>");
            $(new_table_row).addClass("w3-row result_card");

            ////////Event name///////////////////
            new_td = $("<h3>");
            $(new_td).text(event_array[i].name);
            $(new_table_row).append(new_td);

            if (true){
            /////////date ("start date")//////////////
            new_td = $("<h3>");
            timeZone = event_array[i].dates.timezone;
            //clean_date = event_array[i].dates.start.dateTime.split("T")[0];
            var my_thing = get_date_and_time(event_array[i].dates.start.dateTime, timeZone);
            $(new_td).text(clean_date);
            $(new_table_row).append(new_td);

            // new_td = $("<td></td>");
            // //check if there is an end date.  some things dont have any
            // clean_date = event_array[i].classifications[0].segment.name;
            // console.log("segment: " + clean_date);
            // if (clean_date != undefined) {
                
            //     // clean_date = event_array[i].dates.end.dateTime.split("T")[0];  //have to make sure it is present in the object or this command throws an error
            // } else { clean_date = " "; }
            // $(new_td).text(clean_date);
            // $(new_table_row).append(new_td);

            /////////venue/////////////
            new_td = $("<h3>");
            $(new_td).text(event_array[i]._embedded.venues[0].name);
            $(new_table_row).append(new_td);

            //////////picture////////////
            console.log(event_array[i].images[1].url);
            var best_picture_url=get_best_url(event_array[i].images);
            //iterate through the images to find a big hi res one.
           // new_td = $("<img src=" + event_array[i].images[1].url + " height=" + 150 + " width=" + 300 + ">");
            $(new_table_row).css("background-image","url("+best_picture_url+")" );  
            $(new_table_row).css("background-repeat","no-repeat");
            $(new_table_row).css("background-size","cover");
           


            // var new_img=$('<img src='+event_array[i].images[3].url+'>');
            // $(new_td).innerHTML(new_img);        //empty for now, not sure this makes sense
            $(new_table_row).append(new_td);

                //card experiment
               // $("#first_card").css("background")

            //    <div class="w3-row result_card" >
            //   <h3 class="event_name">Quirky Play</h3>
            //   <h5 class="venue">Venue Spot</h5>
            //   <h5 class="date"> 5:30pm Dec 25, 2019</h5>
            // </div>

            }

            $("#card_container").append(new_table_row);
        }


    });


})

function convert_date(in_date) {
    //convert a date from an input date field into the format that the API wants:
    // example output: 2020-08-01T14:00:00Z
    // example input: 2019-11-15
    return in_date + "T14:00:00Z";        //the time doesn't matter for this.
}

function get_date_and_time(in_date, timeZone) {
    //here I am getting a time like this: 2019-12-29T02:30:00Z
    //and I need to output this: 8:30 pm Dec 29, 2019 
    //I need to convert for timezone... the api returns the timezone
var time_delta;
var date_first_part;
var date_second_part;
var year;
var month;
var day;
//debugger;
date_first_part = in_date.split("T")[0];
date_second_part=in_date.split("T")[1];

console.log(in_date);
console.log(date_first_part);
console.log(in_date);
    switch (timeZone) {
        case "America/New_York":
            time_delta=-5;
            break;
        case "America/Chicago":
            time_delta=-6;
            break;
        case "America/Denver":
            time_delta=-7;
            break;
        case "America/Los_Angeles":
            time_delta=-8;
            break;
        case "Pacific/Honolulu":
            time_delta=-10;
            break;
        default:
            break;
    }



    //America/Chicago
    //America/New_York
    //America/Denver
    //America/Los_Angeles
    //Pacific/Honolulu
}

function draw_header() {
    new_table_row = $("<tr>");
    new_th = $("<th></th>");
    $(new_th).text("Event Name");
    $(new_table_row).append(new_th);
    new_th = $("<th></th>");
    $(new_th).text("Start");
    $(new_table_row).append(new_th);
    new_th = $("<th></th>");
    $(new_th).text("End");
    $(new_table_row).append(new_th);
    new_th = $("<th></th>");
    $(new_th).text("Location");
    $(new_table_row).append(new_th);
    $("#event_results").append(new_table_row);
}

function get_best_url(images){
    //search through the provided images and find the largest 16x9 photo.
    console.log("images are: ")
    console.log(images)
    var best_url= images[0].url;    
    var biggest_size=0;    
    for (var i=0; i<images.length;i++){
        if (images[i].ratio=="16_9"){
            if (images[i].height> biggest_size){
                //we have a new champion
                biggest_size=images[i].height;
                best_url=images[i].url;
            }
        }

    }

    return best_url;

}
//the segments it can take are:
//Music
//Sports
//Miscellaneous
//Arts & Theatre