'use strict';

var origin = "BRQ";

var occurrences = [];
jQuery("img").each(function(i, el) {
  // Filter out profile occurrences and so on
  if (el.clientWidth > 250) {
    occurrences.push({
      el: el,
      locationString: "Hollywood California",
      locationGeo: null,
      priceMin: null,
      priceMax: null,
      prices: null
    })
  }
});

occurrences.forEach(function (occurrence) {

  chrome.runtime.sendMessage(
    {
      action: "search",
      origin: origin,
      locationString: "Hollywood California",
      passengers: 1
    }, function (res) {
      var prices = _.values(res);
      // TODO: Fill gaps

      occurrence.priceMin = _.min(prices);
      occurrence.priceMax = _.max(prices);

      var imageWidth = occurrence.el.clientWidth;
      var imageHeight = occurrence.el.clientWidth;
      var width = imageWidth / prices.length;

      var css = {
        display: "block",
        position: "absolute",
        bottom: 0,
        left: 0, // Dynamically changed
        width: width + "px", // Dynamically changed
        height: 0, // Dynamically changed
        background: "white",
        opacity: ".7"
      };

      prices.forEach(function (price, i) {
        $("<a title='"+ i + ": " + price + "' class='PriceBar'></a>")
          .appendTo(occurrence.el.parentNode)
          .css(_.extend({}, css, {
            left: (i * width) + "px",
            height: ((price / occurrence.priceMax * 100) / 2) + "%"
          }));
      });

    });

});

