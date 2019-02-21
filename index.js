//instance requirements
var request = require('request');
var weather = require('weather-js');

//static requirements
require('dotenv').config();

//Constants
let NEW_LINE = "\n";
/**
 * Fncion para buscar el clima.
 */
weather.find({search: 'Tijuana, Mx', degreeType: 'C', lang:"ES-MX"}, function(err, result) {
  if (err) {
    logit(err);
  } else {
    
    var place = result[0];
    var tempUnit = "°" + place.location.degreetype;
    var nextDay = place.forecast[0];

    var message = "El clima manana será " + nextDay.skytextday + NEW_LINE + "Con una mínima de " + nextDay.low + tempUnit + " y Minima de " + nextDay.high + tempUnit + ".";
    slackit(message);
  }
});

function slackit(slackMessage){
  var payload = JSON.stringify({channel: process.env.SLACK_CHANNEL, username:process.env.SLACK_USERNAME, text: slackMessage, icon_emoji:process.env.SLACK_EMOJI});
    request.post({ url: process.env.SLACK_URL, form: payload}, function (e, r, body) {
        if(e){
          logit('Error en slack: ' + JSON.stringify(err));
        } else {
          logit('Sent > ' + process.env.SLACK_CHANNEL + ": " + slackMessage);
        }
    });
}

function logit(message){
  var message = Date.now() + ' - ' + message;
  console.log(message);
}