'use strict';

var process = function (el, location) {
  console.log("Process", el, location);
  var elWidth = el.clientWidth;
  var barWidth = ((elWidth - 10) / window.CONFIG.days);

  $(el).addClass("PICKITY-wrapper");

  var titleEl = $("<div class='PICKITY-title'>").appendTo(el);
  var locationEl = $("<div class='PICKITY-location'>").html(location).appendTo(titleEl);
  var priceEl = $("<div class='PICKITY-price'>").text("...").appendTo(titleEl);

  var graphEl = $("<div class='PICKITY-graph'>").appendTo(el);

  var barEls = {};
  for(var i = 0; i < window.CONFIG.days; i++) {
    var dateStr = moment().add(i, "days").format("YYYYMMDD");
    barEls[dateStr] = $("<a>", {
      class: "PICKITY-bar",
      target: "_blank"
    })
    .css({
      left: (i * barWidth) + "px",
      width: barWidth
    })
    .appendTo(graphEl);
  }

  chrome.runtime.sendMessage({
    action: "search",
    location: location
  }, function (res) {

    if (_.keys(res.prices).length) {
      var priceMin = _.min(_.values(res.prices));
      var priceMax = _.max(_.values(res.prices));
      priceEl.text(_.template("<%= from %> € – <%= to %> €")({
        from: priceMin,
        to: priceMax
      }));
    } else {
      priceEl.text("No flights :(");
    }

    for(var i = 0; i < window.CONFIG.days; i++) {
      var dateStr = moment().add(i, "days").format("YYYYMMDD");
      var barEl = barEls[dateStr];
      var price = res.prices[dateStr];

      if (price) {

        var href = _.template("https://en.skypicker.com/cheap-flights-from-<%= origin %>-to-<%= lat %>-<%= lng %>-50km/departure-<%= date %>-<%= date %>");

        barEl.attr("data-hint", moment().add(i, "days").format("L") + ": " + price + " €");
        barEl.attr("href", href({
          origin: window.CONFIG.origin,
          lat: res.geo.lat,
          lng: res.geo.lng,
          date: moment().add(i, "days").format("DD-MM-YYYY")
        }));
        barEl.addClass("hint--top");
        barEl.on("click", function (ev) {
          window.location.href = ev.target.href;
          return false;
        });

        var percent = (price - priceMin) / (priceMax - priceMin);
        if (price) {
          barEl.animate({height: ((percent * 100) + 10)+ "%"}, 500)
        }

      }
    }

  });

};

var traverse = function () {
  var mock = false;

  switch (window.location.host) {
    case "www.flickr.com":
      $(".zoom-view")
        .not(".PICKITY_already")
        .each(function (i, el) {
          $(el).addClass("PICKITY_already");
          if ($('.static-maps').length) {
            var location = $('.location-name-link').text().trim();
            var match = $('.static-maps').attr('href').match(/fLat=([-\d\.]+)&fLon=([-\d\.]+)/);
            if (match && match.length === 3) {
              var geo = {
                lat: match[1],
                lng: match[2]
              };
              process(el, location, geo);
            }
          }
        });
      break;

    case "instagram.com":

      $("a[class*=-PostsGrid__item]")
        .not(".PICKITY_already")
        .each(function (i, el) {
          $(el).addClass("PICKITY_already");
          var match = el.href.match(/\/p\/([\d\w]+)\//);
          if (match && match.length === 2) {
            var id = match[1];
            var log = "Image " + id;

            if (!mock) {
              $.ajax({
                url: "https://instagram.com/p/" + id,
                data: {
                  "__a": 1 // Return JSON?
                }
              }).done(function (res) {
                if (res.media.location) {
                  process(el, res.media.location.name);
                }
              });
            } else {
              process(el, "Paradise");
            }
          }
        });

      break;
  }

};

setInterval(traverse, 3000);