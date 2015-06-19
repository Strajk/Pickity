'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});


chrome.browserAction.setBadgeText({text: '\'Allo'});


chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (sender.tab) {
    console.log("Msg received, from content script", sender.tab.url);
    if (req.action === "search") {
      onSearch(req, sendResponse);
    }
  }

});


function mapLocationStringToLocationGeo(locationString, cb) {
  if (locationString === "Hollywood California") {
    // TODO: Implement
    cb({
      lat: 34.0928092,
      lon: 118.32866139999999
    })
  } else {
    cb(new Error("Uknown location"));
  }
}

function callFlightsApi(geo, cb) {
  /*
   https://api.skypicker.com/flights?v=2
   &sort=price
   &asc=1
   &locale=en
   &daysInDestinationFrom=
   &daysInDestinationTo=
   &affilid=
   &flyFrom=BRQ
   &radiusTo=250
   &latitudeTo=56.04749958329888
   &longitudeTo=18.0615234375
   &dateFrom=01%2F07%2F2015
   &dateTo=31%2F07%2F2015
   &typeFlight=oneway
   &returnFrom=
   &returnTo=
   &one_per_date=1
   &adults=1
   &children=0
   &infants=0
  */

  /*
    lights.reduce((prev, flight) => {
    var dateIndex = moment.utc(flight.dTime*1000).format("YYYYMMDD");
    if (prev.get(dateIndex) && prev.get(dateIndex) < flight.price) {
      return prev;
    } else {
      return prev.set(dateIndex, new DayPrice({price: flight.price, journey: flightsApiToJourney(flight)}));
    }
   */

  cb({
    1: 10,
    2: 20,
    3: 30,
    4: 25,
    5: 20,
    6: 15,
    7: 10,
    8: 8,
    9: 5
  });
}

function onSearch(req, sendResponse) {
  mapLocationStringToLocationGeo(req.locationString, function (geo) {
    callFlightsApi(geo, function (prices) {
      sendResponse(prices)
    });
  });
}
