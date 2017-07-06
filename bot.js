'use strict';

// dfo - Under utvilking
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./config.js');
const request = require('request');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};
const token = Config.FB_PAGE_TOKEN;

// Bot actions
const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);

    // Bot testing mode, run cb() and return
    if (require.main === module) {
      cb();
      return;
	}

    // Our bot has something to say!
    // Hent facebook-bruker session
    // TODO: Hent facebook username?
    const recipientId = context._fbid_;
    if (recipientId) {
	  
      // Fant mottaker
      // Sender bot respons.
      FB.fbMessage(recipientId, message, (err, data) => {
        if (err) {
          console.log(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err
          );
        }

        // Callback til bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
      // Callback til bot
      cb();
    }
  },
		  
  merge(sessionId, context, entities, message, cb) {
    // Resetter context-key
	delete context.quicklog;
	delete context.quickreis;
	delete context.quickov;
	delete context.dagreis;
	delete context.regut;
	delete context.ovgen;
	delete context.kont;
	delete context.tidl;
	
// SEKSJON FOR QUICKREPLY-LOGIKK

	// Logikk for quickreply -> login problemer
	const quicklog = firstEntityValue(entities,'quicklog');
	if (quicklog) {
		context.quicklog = quicklog;
		const quicklogmsg = {
			"text": "Hvor stopper det opp?",
			"quick_replies": [
			{
				"content_type": "text",
				"title": "Problem med minID",
				"payload": "a"
			},
			{
				"content_type": "text",
				"title": "Teknisk problem",
				"payload": "b"
			},
			{
				"content_type": "text",
				"title": "Jeg er sperret",
				"payload": "c"
			},
			]
		}
		exports.quickData = quicklogmsg;
	}
	
	// Logikk for quickreply -> reiseregning
	const quickreis = firstEntityValue(entities,'quickreis');
	if (quickreis) {
		context.quickreis = quickreis; // Quick replies for registrering av reiseregning
		const quickreismsg = {
			"text": "Hvilken del av reiseregninger trenger du hjelp med?",
			"quick_replies": [
			{
				"content_type": "text",
				"title": "Dagreise innland",
				"payload": "d"
			},
			{
				"content_type": "text",
				"title": "Øvrige reiser",
				"payload": "e"
			},
			{
				"content_type": "text",
				"title": "Oversikt tidligere reiser",
				"payload": "f"
			},
			{
				"content_type": "text",
				"title": "Reiseregulativet",
				"payload": "g"
			},
			{
				"content_type": "text",
				"title": "Merverdiavgift",
				"payload": "h"
			},
			]
		}
		exports.quickData = quickreismsg;
	}
	
	// Logikk for quickreply -> Øvrige reiser1!
	const quickov = firstEntityValue(entities,'quickov');
	if (quickov) {
		context.quickov = quickov;
		const quickovmsg = {
			"text": "I hvilken fane trenger du hjelp?",
			"quick_replies": [
			{
				"content_type": "text",
				"title": "1-Generelle data",
				"payload": "ca"
			},
			{
				"content_type": "text",
				"title": "2-Registrer utgiftsbilag",
				"payload": "cb"
			},
			{
				"content_type": "text",
				"title": "3-Kontroller og send",
				"payload": "cc"
			},
			]
		}
		exports.quickData = quickovmsg;
	}


// SEKSJON FOR HYPERLINKIN-LOGIKK	
	
    // Logikk for lenker -> dagreise
    const dagreis = firstEntityValue(entities, 'dagreis');
    if (dagreis) {
      context.dagreis = dagreis; // lagrer i context
	  const dagreismsg = {
	    "attachment": {
		  "type": "template",
		  "payload": {
			"template_type": "generic",
			"elements": [
			  {
				"title": "Hjelp med:",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_dagsreise_innenlands.pdf#page=4",
					"title": "Send til godkjenning"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_dagsreise_innenlands.pdf#page=2",
					"title": "Vedlegg"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_dagsreise_innenlands.pdf#page=3",
					"title": "Fradrag måltider"
				  }
				]
			  },
			  {
				"title": "Registreringer av:",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_dagsreise_innenlands.pdf",
					"title": "dagreise innenlands"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_dagsreise_innenlands.pdf#page=3",
					"title": "kilometer"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_dagsreise_innenlands.pdf#page=4",
					"title": "utgiftsbilag"
				  }

				]
			  }
			]
		  }
		}
    }
	exports.messageData = dagreismsg;
    }
	
	//Logikk for Øvrige reiser steg1
	const ovgen = firstEntityValue(entities, 'ovgen');
    if (ovgen) {
      context.ovgen = ovgen; // lagrer i context
	  const ovgenmsg = {
	    "attachment": {
		  "type": "template",
		  "payload": {
			"template_type": "generic",
			"elements": [
			  {
				"title": "Hjelp med:",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=6",
					"title": "Regulativ"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=8",
					"title": "Kostgodtgjørelse"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=9",
					"title": "Strekningsdetaljer"
				  }
				]
			  },
			  {
				"title": "Registreringer av:",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=3",
					"title": "innenlandsreise"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=4",
					"title": "utenlandsreise"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=5",
					"title": "utgiftsrefusjon"
				  }

				]
			  }
			]
		  }
		}
    }
	exports.messageData = ovgenmsg;
    }
	
	// Logikk for øvrige reiser - steg2
	const regut = firstEntityValue(entities, 'regut');
    if (regut) {
      context.regut = regut; // lagrer i context
	  const regutmsg = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "button",
				"text": myResp,
				"buttons": [{
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=10",
					"title": "Reg utgiftsbilag",
			},
			{
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=12",
					"title": "Reg utgiftsbilag m/MVA",
			}]
		    }
	    }
    }
	exports.messageData = regutmsg;
	}
	
	// Logikk for øvrige reiser steg3
	const kont = firstEntityValue(entities, 'kont');
    if (kont) {
      context.kont = kont; // lagrer i context
	  const kontmsg = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "button",
				"text": myResp,
				"buttons": [{
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=10",
					"title": "Reg utgiftsbilag",
			},
			{
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=12",
					"title": "Reg utgiftsbilag m/MVA",
			}]
		    }
	    }
    }
	exports.messageData = kontmsg;
	}
	
	const tidl = firstEntityValue(entities, 'tidl');
    if (tidl) {
      context.tidl = tidl; // lagrer i context
	  const tidlmsg = {
	    "attachment": {
		  "type": "template",
		  "payload": {
			"template_type": "generic",
			"elements": [
			  {
				"title": "Hjelp med:",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_oversikt_over_tidligere_reiser.pdf#page=1",
					"title": "Finn reisenr"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_oversikt_over_tidligere_reiser.pdf#page=2",
					"title": "Se reiseregning"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_oversikt_over_tidligere_reiser.pdf#page=2",
					"title": "Status reiseregning"
				  }
				]
			  },
			  {
				"title": "Hjelp med tidligere reise:",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_oversikt_over_tidligere_reiser.pdf#page=3",
					"title": "Utestående"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_oversikt_over_tidligere_reiser.pdf#page=4",
					"title": "Endre"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_oversikt_over_tidligere_reiser.pdf#page=5",
					"title": "Kopiere/slette"
				  }

				]
			  }
			]
		  }
		}
    }
	exports.messageData = ovgenmsg;
    }


    cb(context);
  },

  error(sessionId, context, error) {
    console.log(error.message);
  },
};


const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}