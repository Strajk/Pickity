'use strict';

// Debugging
chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});


chrome.browserAction.setBadgeText({text: window.CONFIG.origin});


chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (sender.tab) {
    if (req.action === "search") {
      onSearch(req, sendResponse);
      return true; // Keep waiting for async
    }
  }
});


function geocode(input, cb) {
  var mock = false;

  if (mock) {

    cb({
      lat: 34.0928092,
      lng: 118.32866139999999
    });

  } else {

    console.log("geocode: " + input);
    $.ajax({
      url: "https://maps.googleapis.com/maps/api/geocode/json",
      data: {
        address: input,
        key: window.CONFIG.googleApiKey
      }
    }).done(function (res) {
      if (_.isArray(res.results) && res.results.length) {
        // TODO: Let user choose
        var formatted = res.results[0]["formatted_address"];
        var geo = res.results[0].geometry.location;
        console.info("geocode success: " + formatted);
        cb(geo);
      } else {
        console.warn("geocode failed");
        // cb();
      }
    });

  }
}


function prices(geo, cb) {
  var mock = false;

  if (!mock) {

    console.log("prices: ", geo);
    $.ajax({
      url: "https://api.skypicker.com/flights",
      data: {
        v: 2, locale: "en",
        sort: "price", asc: 1,
        flyFrom: window.CONFIG.origin,
        latitudeTo: geo.lat, longitudeTo: geo.lng,
        radiusTo: window.CONFIG.destionationRadius,
        dateFrom: moment().format("DD/MM/YYYY"),
        dateTo: moment().add(window.CONFIG.days, "days").format("DD/MM/YYYY"),
        typeFlight: "oneway", one_per_date: 1,
        adults: window.CONFIG.passengers
      }
    }).done(function (res) {
      var prices = {};

      var flights = res.data;
      console.log("prices complete: " + res.data.length);
      flights.forEach(function(flight) {
        var dateStr = moment.utc(flight.dTime * 1000).format("YYYYMMDD");
        var price = flight.price;
        if (!prices[dateStr] || flights[dateStr] > price) {
          prices[dateStr] = price;
        }
      });
      cb(prices);
    });

  } else {

    cb({
      "20150622": 2304.56,
      "20150624": 2051.03,
      "20150629": 2296.12,
      "20150701": 1950.09,
      "20150703": 2726.58
    });

  }

}

function onSearch(req, sendResponse) {
  if (req.geo) {
    prices(req.geo, function (prices) {
      sendResponse({
        prices: prices,
        geo: req.geo
      })
    });
  } else {
    geocode(req.location, function (geo) {
      prices(geo, function (prices) {
        sendResponse({
          prices: prices,
          geo: geo
        })
      });
    });
  }
}
