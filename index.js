'use strict';

// DFO-chatbot under utvikling
// NY FACE BRUKER
const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');

// Henter bot, vertifikasjoner, og FB API
const bot = require('./bot.js');
const Config = require('./config.js');
const FB = require('./facebook.js');


// Setter opp bot
const wit = bot.getWit();

// Webserver parameter
const PORT = process.env.PORT || 8445;

// Wit.ai bot specific code

// Inneholder alle user sessions
// Alle sessions har entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbid) => {
  let sessionId;
  // Sjekker om aktiv session er �pen for fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // YEPP
      sessionId = k;
    }
  });
  if (!sessionId) {
    // Ingen aktiv session. Oppretter en ny
    sessionId = new Date().toISOString();
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }; // set context, _fid_
  }
  return sessionId;
};

// Starter opp webserver
const app = express();
app.set('port', PORT);
app.listen(app.get('port'));
app.use(bodyParser.json());
console.log("I'm wating for you @" + PORT);

// index. Let's say something fun
app.get('/', function(req, res) {
  res.send('"Oppe og hopper!" - DFOchatbot');
});

// Webhook verify setup using FB_VERIFY_TOKEN
const token = Config.FB_PAGE_TOKEN;
app.get('/webhook', (req, res) => {
  if (!Config.FB_VERIFY_TOKEN) {
    throw new Error('missing FB_VERIFY_TOKEN');
  }
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

// Main message handler
app.post('/webhook', (req, res) => {
  // Parsing Messenger API respons
  const messaging = FB.getFirstMessagingEntry(req.body);
  if (messaging && messaging.message) {

    // Mottok melding!
    // Henter Facebook user ID
    const sender = messaging.sender.id;
    // Hent session, eller lag ny
    // Finner samtalehistorikk
    const sessionId = findOrCreateSession(sender);

    // Hent meldingsinnhold
    const msg = messaging.message.text;
    const atts = messaging.message.attachments;
		
    else if (atts) {
      // Vi mottok et vedlegg,bilde,gif etc...

      // Autoreply
      FB.fbMessage(
        sender,
        'Kult! Jeg kan desverre kun prosessere tekstmeldinger'
      );
    } else if (msg) {
      // Mottok meldingstekst
      // Sender melding til wit.ai
      // Kj�r actions
      wit.runActions(
        sessionId, // aktiv session
        msg, // the user's message 
        sessions[sessionId].context, // session state
        (error, context) => {
          if (error) {
            console.log('Oops! Fikk en feil fra Wit:', error);
          } else {
            // bot er ferdig
            // Venter p� mer input
            console.log('Venter p� meldinger');
			
			// oppdater session state
            sessions[sessionId].context = context;

            // Reset session?
            // Kanskje med annen logikk..
            // Eksempel: Pr�ver med "intent"
			if(context.cat){
				sendGenericMessage(sender)
				delete sessions[sessionId];
			}
          }
        }
      );
    }
  }
  res.sendStatus(200);
});
function sendGenericMessage(sender){
	let messageData2 = bot.messageData;
	    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData2,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })

}