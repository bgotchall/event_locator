//event website

//example client side call:
//event brite stuff
//https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=YOUR_API_KEY&redirect_uri=YOUR_REDIRECT_URI
//add this to then end /v3/users/me/?token=CHY3NFJVQRWLTVGZLFIB
var api_key = "6WXJHRCFYQFNXRVSBL";

//ticketmaster stuff:
var TM_api_key = "3JcNn4ea56JrBolF27QIGsWgd58v9GSZ";
var location;

//////add in some default values so I don't go crazy: (get rid of this for release)////////
$("#location").val("Austin");
//console.log($("#start_date"));
$("#start_date").val("2019-11-22");
$("#end_date").val("2019-12-20");

var event_array;
var daily_array = []; //for weather data
//////////////////////////////////
var weather_location = $("#location")[0].value;
 /////////////////////////////////////////////////////////////////
//first get the 5 day forecast:
 queryURL =
 "https://api.openweathermap.org/data/2.5/forecast?q=" +
 weather_location +
 "&units=imperial&appid=1dd029263e9a36200e5256b3f8ab4a28";
$.ajax({
 url: queryURL,
 method: "GET"
}).then(function (response) {
 daily_array = [];
 console.log(response);
 forecast_array = response.list;

 //downsample the array to just 5 days, indexed to the search time
 for (var i = 0; i < forecast_array.length; i = i + 8) {
     daily_array.push(forecast_array[i]);
 }
 
});
/////////////////////////////////////////////////////////////////////////




$("#btn_submit").on("click", function (event) {
    event.preventDefault;
    //debugger;
    var start_date = convert_date($("#start_date")[0].value);
    var end_date = convert_date($("#end_date")[0].value);
    //console.log($("#search_field")[0]);
    var keyword = $("#search_field")[0].value;
    var location = $("#location")[0].value;

    //genres:

    var cb_music = $("#music").prop("checked");
    var cb_sports = $("#sports").prop("checked");
    var cb_arts_theater = $("#arts-theater").prop("checked");
    var cb_misc = $("#misc").prop("checked");

    var genre_string = "";
    if (cb_music || cb_sports || cb_arts_theater || cb_misc) {
        genre_string = "&segmentId=";
    } //only start this if something is selected
    if (cb_music) {
        genre_string += "KZFzniwnSyZfZ7v7nJ,";
    }
    if (cb_sports) {
        genre_string += "KZFzniwnSyZfZ7v7nE,";
    }
    if (cb_arts_theater) {
        genre_string += "KZFzniwnSyZfZ7v7na,";
    }
    if (cb_misc) {
        genre_string += "KZFzniwnSyZfZ7v7n1";
    }

    //console.log (genre_string);

    //console.log("location read is: " + location);

    //queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&keyword='+keyword+'&startDateTime='+start_date+'&endDateTime='+end_date+'&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';
    queryURL =
        "https://app.ticketmaster.com/discovery/v2/events.json?sort=date,asc" +
        genre_string +
        "&locale=*&city=" +
        location +
        "&keyword=" +
        keyword +
        "&startDateTime=" +
        start_date +
        "&endDateTime=" +
        end_date +
        "&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ";

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("#card_container").empty();
        event_array = response._embedded.events;

        var new_td;
        var clean_date;
        var timeZone;
        console.log(response);
        // console.log($("#start_date"));
        console.log(event_array);

        for (var i = 0; i < event_array.length; i++) {
            if (event_array[i].name != "No Longer on Sale for Web") {
                //avoid certain test objects
                //debugger;
                new_card_row = $("<div></div>");
                $(new_card_row).addClass("w3-row w3-round-xxlarge result_card");
                $(new_card_row).attr("index", i); //add the index so we can quicklky get which thing the user is interested in.

                ////////Event name///////////////////
                new_td = $("<h3>");
                $(new_td).addClass("card-text name");
                $(new_td).text(event_array[i].name);
                $(new_card_row).append(new_td);

                /////////date ("start date")//////////////
                new_td = $("<h3>");
                $(new_td).addClass("card-text");
                timeZone = event_array[i].dates.timezone;
                var my_date_string = get_date_and_time(
                    event_array[i].dates.start.dateTime,
                    timeZone
                );
                $(new_td).text(my_date_string);
                $(new_card_row).append(new_td);

                /////////venue/////////////
                new_td = $("<h3>");
                $(new_td).addClass("card-text");
                $(new_td).text(event_array[i]._embedded.venues[0].name);
                $(new_card_row).append(new_td);

                //////////picture////////////
                //iterate through the images to find a big hi res one.
                var best_picture_url = get_best_url(event_array[i].images);
                $(new_card_row).css(
                    "background-image",
                    "url(" + best_picture_url + ")"
                );
                $(new_card_row).css("background-repeat", "no-repeat");
                $(new_card_row).css("background-size", "cover");

                //////price range////////

                var test_thing = event_array[i].priceRanges;
                if (event_array[i].priceRanges != undefined) {
                    var min_price = event_array[i].priceRanges[0].min.toFixed(2);
                    var max_price = event_array[i].priceRanges[0].max.toFixed(2);
                    var price_string = "($" + min_price + " to $" + max_price + ")";
                    new_td = $("<h5 class='price_range'>");
                    $(new_td).text(price_string);
                    $(new_card_row).append(new_td);
                }

                ////////sales link////////

                new_td = $(
                    "<a class='ticket_sales_link'  target='_blank'> Tickets</a>"
                );
                // console.log("sales link will be: "+ event_array[i].url)

                $(new_td).attr("href", event_array[i].url);
                $(new_td).addClass("fa-3x fa fa-ticket");
                $(new_card_row).append(new_td);

                //add other stuff to card before adding the div

                $("#card_container").append(new_card_row);
            }
        }
       
    });
});

$(document).on("click", ".result_card", function (event) {
    //click handler for the result cards.  pop up a modal window on this.
    //console.log(event);
    //console.log("card was clicked?");
    document.getElementById("id01").style.display = "block";
    var this_index = $(event.currentTarget).attr("index");
    var this_item = event_array[this_index];
    $("#modal_p1").text(this_item.name);

    //here is missing some magic to map the event dates with the weather dates:
    console.log("here are the two arrays");
    console.log(daily_array);
    console.log(event_array);
    console.log(this_item);
    debugger;
    var this_events_date = this_item.dates.start.localDate;
    console.log(this_events_date);

    var diff = 0;
    diff = get_diff(this_events_date);
    //if this events date is within the next 5 days from now, there is a forecast for it.
    //all I need is the difference between the event_date-todays_date.  that is the index into
    //the weather array.  if it is 0-4, get the element.  if it is >4 then no forecast.
    //This partial solution will fail
    if (diff > 4) {
        $("#modal_p2").text("No Forecast Available");
    } else {
        debugger;
        $("#modal_p2").text(
            "Forecast: " +
            daily_array[diff].weather[0]
                .description +
            ", Temp: " +
            daily_array[diff].main.temp +
            "°F"
        );
        //get the icon for this modal:
        var my_code=daily_array[diff].weather[0].icon;
        icon_img_url="http://openweathermap.org/img/wn/"+my_code+"@2x.png";
        $("#modal_icon").attr("src",icon_img_url);
        
    }
   

});

function convert_date(in_date) {
    //convert a date from an input date field into the format that the API wants:
    // example output: 2020-08-01T14:00:00Z
    // example input: 2019-11-15
    return in_date + "T14:00:00Z"; //the time doesn't matter for this.
}

function get_date_and_time(in_date, timeZone) {
    //here I am getting a time like this: 2019-12-29T02:30:00Z
    //and I need to output this: 8:30 pm Dec 29, 2019
    //I need to convert for timezone... the api returns the timezone

    var string_so_far = "";

    var my_thing = moment(in_date, "", true).format("LT");
    string_so_far =
        moment(in_date, "", true).format("LT") +
        " " +
        moment(in_date, "", true).format("LL");
    return string_so_far;
}

function get_best_url(images) {
    //search through the provided images and find the largest 16x9 photo.

    var best_url = images[0].url;
    var biggest_size = 0;
    for (var i = 0; i < images.length; i++) {
        if (images[i].ratio == "16_9") {
            if (images[i].height > biggest_size) {
                //we have a new champion
                biggest_size = images[i].height;
                best_url = images[i].url;
            }
        }
    }

    return best_url;
}

///////////////////////////////////////////////////////////////////

function get_diff(this_events_date) {
    //return a simple integer, of how many days in advance the date passed in is.
    //this_events_date is in this format: 2019-12-25
    var todays_date = moment().format("L");
    var todays_day = todays_date.split("/")[1];
    var todays_month = todays_date.split("/")[0];
    var events_day = this_events_date.split("-")[2];
    var answer;
   
    //here I want to return the diff between the dates.  but if the later date is in
    //a new month, i will get a negative result.  so have to check if it is on a boundary and adjust.
    // events are always today or in the future.
    answer = events_day - todays_day;
    if (answer < 0) {
        // say april 2 event observed on March 30.  that is 3 days diff.  2-30=-28.  add the length
        // of march (31)to the diff to correct.  -28_+31=3
        switch (parseInt(todays_month)) {
            case 1:
                //jan
                answer = answer + 31;
                break;
            case 2:
                //Feb
                answer = answer + 28;
                break;
            case 3:
                //March
                answer = answer + 31;
                break;
            case 4:
                //April
                answer = answer + 30;
                break;
            case 5:
                //May
                answer = answer + 31;
                break;
            case 6:
                //Jun
                answer = answer + 30;
                break;
            case 7:
                //July
                answer = answer + 31;
                break;

            case 8:
                //Aug
                answer = answer + 31;
                break;
            case 9:
                //Sept
                answer = answer + 30;
                break;
            case 10:
                //Oct
                answer = answer + 31;
                break;
            case 11:
                //Nov
                answer = answer + 30;
                break;
            case 12:
                //Dec
                answer = answer + 31;
                break;
            default:
                break;
        }


    }
    return answer;
}
