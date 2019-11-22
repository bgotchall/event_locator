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

var event_array ;
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

        
        $("#card_container").empty();
        event_array = response._embedded.events;
        
        var new_td;
        var new_th;
        var clean_date;
        var timeZone;
        console.log(response);
        console.log($("#start_date"));
        console.log(event_array);
        

        for (var i = 0; i < event_array.length; i++) {
            //debugger;
            new_card_row = $("<div></div>");
            $(new_card_row).addClass("w3-row w3-round-xxlarge result_card");
            $(new_card_row).attr("index",i);                //add the index so we can quicklky get which thing the user is interested in.


            ////////Event name///////////////////
            new_td = $("<h3>");
            $(new_td).addClass("card-text");
            $(new_td).text(event_array[i].name);
            $(new_card_row).append(new_td);

            /////////date ("start date")//////////////
            new_td = $("<h3>");
            $(new_td).addClass("card-text");
            timeZone = event_array[i].dates.timezone;
            var my_date_string = get_date_and_time(event_array[i].dates.start.dateTime, timeZone);
            $(new_td).text(my_date_string);
            $(new_card_row).append(new_td);


            /////////venue/////////////
            new_td = $("<h3>");
            $(new_td).addClass("card-text");
            $(new_td).text(event_array[i]._embedded.venues[0].name);
            $(new_card_row).append(new_td);

            //////////picture////////////
            //iterate through the images to find a big hi res one.
            var best_picture_url=get_best_url(event_array[i].images);
            $(new_card_row).css("background-image","url("+best_picture_url+")" );  
            $(new_card_row).css("background-repeat","no-repeat");
            $(new_card_row).css("background-size","cover");
            $(new_card_row).append(new_td);

            ////////sales link////////
            new_td = $("<a class='ticket_sales_link'  target='_blank'> Tickets</a>");
            console.log("sales link will be: "+ event_array[i].url)
            $(new_td).attr("href",event_array[i].url)
            $(new_td).addClass("fa-3x fa fa-ticket");
            $(new_card_row).append(new_td);
                
            //add other stuff to card before adding the div

            
            $("#card_container").append(new_card_row);
        }


    });


})

$(document).on('click','.result_card',function(event){
    //click handler for the result cards.  pop up a modal window on this.
    console.log(event);
         console.log("card was clicked?");
         document.getElementById('id01').style.display='block';
         var this_index= $(event.currentTarget).attr("index");
         var this_item=event_array[this_index];
         $("#modal_p1").text(this_item.name);
         $("#modal_p2").text("Weather stuff here");
         console.log(this_item);

});



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


var string_so_far="";

var my_thing=moment(in_date,'' ,true).format('LT');
    string_so_far=moment(in_date,'' ,true).format('LT')+" "+moment(in_date,'' ,true).format('LL');
    return string_so_far
}



function get_best_url(images){
    //search through the provided images and find the largest 16x9 photo.
    
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