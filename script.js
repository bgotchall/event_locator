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

$("#btn_submit").on("click", function (event) {
    event.preventDefault;
    var start_date=convert_date($("#start_date")[0].value);
    var end_date=convert_date($("#end_date")[0].value);
    console.log($("#search_field")[0]);
    var keyword=$("#search_field")[0].value;
    var location=$("#location")[0].value;
    console.log("location read is: "+location);
    //queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&keyword='+keyword+'&startDateTime='+start_date+'&endDateTime='+end_date+'&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';
    queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&keyword='+keyword+'&startDateTime='+start_date+'&endDateTime='+end_date+'&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';

    console.log(queryURL);

    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        $("#table_info").empty();
        var event_array = response._embedded.events;
        var new_table_row;
        var new_td;
        var new_th;
        var clean_date;
        console.log(response);
        console.log(event_array);
        draw_header();   //make a new header:
       
        for (var i = 0; i < event_array.length; i++) {
            

            new_table_row = $("<tr>");
            new_td = $("<td></td>");
            $(new_td).text(event_array[i].name);
            $(new_table_row).append(new_td);
           
            new_td = $("<td></td>");
            clean_date = event_array[i].dates.start.dateTime.split("T")[0];
            $(new_td).text(clean_date);
            $(new_table_row).append(new_td);
            
            new_td = $("<td></td>");
            //check if there is an end date.  some things dont have any
            clean_date = event_array[i].dates.end;
            console.log ("end date: "+clean_date);
            if (clean_date!=undefined){
             clean_date = event_array[i].dates.end.dateTime.split("T")[0];  //have to make sure it is present in the object or this command throws an error
            } else { clean_date=" ";}
            $(new_td).text(clean_date);
            $(new_table_row).append(new_td);


            new_td = $("<td></td>");
            $(new_td).text(event_array[i]._embedded.venues[0].name);
            $(new_table_row).append(new_td);

            // console.log(event_array[i].images[1].url);
            // new_td = $("<td><img src=" + event_array[i].images[1].url + " height=" + 150 + " width=" + 300 + "></td>");
            // // var new_img=$('<img src='+event_array[i].images[3].url+'>');
            // // $(new_td).innerHTML(new_img);        //empty for now, not sure this makes sense
            // $(new_table_row).append(new_td);

            $("#table_info").append(new_table_row);
        }


    });


})

function convert_date (in_date){
//convert a date from an input date field into the format that the API wants:
// example output: 2020-08-01T14:00:00Z
// example input: 2019-11-15
    return in_date+"T14:00:00Z";        //the time doesn't matter for this.
}

function get_date_and_time(in_date){
    //here I am getting a time like this: 2019-12-29T02:30:00Z
    //and I need to output this: 8:30 pm Dec 29, 2019 
    //I need to convert for timezone... the api returns the timezone
    //America/Chicago
}

function draw_header(){
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
        $("#table_info").append(new_table_row);
}
