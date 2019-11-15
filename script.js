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
//endDateTime=2019-11-24  //q={"status": "GOLD"}
//https://app.ticketmaster.com/discovery/v2/events.json?q={"postalCode":"78702"}&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ
var TM_api_key="3JcNn4ea56JrBolF27QIGsWgd58v9GSZ";
//this works, searching zipcode and keyword:
//queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&keyword=surface&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';
//this works for location and dates:
//'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&startDateTime=2019-11-15T01:00:00Z&endDateTime=2019-12-30T01:00:00Z&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';


queryURL = 'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=78702&startDateTime=2019-11-15T01:00:00Z&endDateTime=2019-12-30T01:00:00Z&apikey=3JcNn4ea56JrBolF27QIGsWgd58v9GSZ';
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);


    });