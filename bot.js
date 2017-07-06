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
		exports.quicklogmsg = quicklogmsg;
	}
	
	// Logikk for quickreply -> reiseregning
	const quickreis = firstEntityValue(entities,'quickreis');
	if (quickreis) {
		console.log('KOMMET MEG INN I QUICKREIS');
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
		exports.quickreismsg = quickreismsg;
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
		exports.quickovmsg = quickovmsg;
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
	exports.dagreismsg = dagreismsg;
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
	exports.ovgenmsg = ovgenmsg;
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
				"text": "Hjelp med registrering av utgiftsbilag:",
				"buttons": [{
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=10",
					"title": "Uten merverdiavgift",
			},
			{
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=12",
					"title": "Med merverdiavgift",
			}]
		    }
	    }
    }
	exports.regutmsg = regutmsg;
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
				"text": "Hjelp med steg 3-Kontroller og send",
				"buttons": [{
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=13",
					"title": "Kontroller og send",
			}]
		    }
	    }
    }
	exports.kontmsg = kontmsg;
	}
	
	const tidl = firstEntityValue(entities, 'tidl');
    if (tidl) {
	  console.log('ER I TIDL??????????????');
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
	exports.tidlmsg = tidlmsg;
    }
	
// Loggikk for diverse lenker
	const category = firstEntityValue(entities, 'intent');
    if (category) {
      context.cat = category; // lagrer i context
	  const wantedLinks = allLinks[context.cat || 'default']
	  const myLink = wantedLinks.toString();
	  const wantedTitle = allTitles[context.cat || 'default']
	  const myTitle = wantedTitle.toString();
	  const wantedResp = allResp[context.cat || 'default']
	  const myResp = wantedResp.toString();
	  
	  const divData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "button",
				"text": myResp,
				"buttons": [{
					"type": "web_url",
					"url": myLink,
					"title": myTitle,
			}]
		    }
	    }
    }
	exports.divData = divData;
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


const allLinks = {
  default: ['https://www.vg.no'],
  Nettleser: ["https://dfo.no/kundesider/lonnstjenester/selvbetjening/stottede-nettlesere/"],
  Sperret: ['https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_selvbetjeningsportalen.pdf'],
  logge: ["https://idporten.difi.no/opensso/UI/Login?realm=/norge.no&spEntityID=registrering.dfo.no&goto=http%3A%2F%2Fidporten.difi.no%2Fopensso%2FSSORedirect%2FmetaAlias%2Fnorge.no%2Fidp3%3FReqID%3DS9469b541-3617-494a-aba4-887f7ef11649%26index%3Dnull%26acsURL%3D%26spEntityID%3Dregistrering.dfo.no%26binding%3D"],
  Vedlegg: ["https://dfo.no/Documents/LA/brukerdokumentasjon/Hjelp%20til%20Opprett%20reiseregning.pdf#page=11"],
  Ikkesendt: ["https://dfo.no/Documents/LA/brukerdokumentasjon/Hjelp%20til%20Opprett%20reiseregning.pdf#page=20"],
  retur: ["http://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_selvbetjeningsportalen.pdf#page=3"],
  Reisereg: ["http://www.regjeringen.no/no/tema/arbeidsliv/Statlig-arbeidsgiverpolitikk/statens_reiseregulativ/id965/"],
};
const allTitles = {
	default: ['ingen context?'],
	Nettleser: ["Støttede nettlesere"],
	Sperret: ["Bruk av portal"],
	logge: ["Logg inn her"],
	Vedlegg: ["Legge ved Vedlegg"],
	Ikkesendt: ["Sende reise"],
	retur: ["Korrigering innkurv"],
	Reisereg: ["Statens reiseregulativ"],
};
const allResp = {
	default: ["oops"],
	Nettleser: ["Problemet kan komme av nettleseren du bruker. DFØ sin portal er optimalisert for Internet explorer 11."],
	Sperret: ["Det kan være du har sperret deg selv. Sperren forsvinner av seg selv etter 30 minutter."],
	logge: ["Forklar problemet ditt litt nærmere. Pass på at du logger deg inn riktig sted:"],
	Vedlegg: ["For å laste opp vedlegg må du klikke på vedlegg-knappen på trinn 1 - Generelle data."],
	Ikkesendt: ["Du bør undersøke om reisen/honoraret er sendt til godkjenning."],
	retur: ["Dersom du har fått et skjema i retur må du korrigere dette i innkurven i selvbetjeningsportalen."],
	Reisereg: ["Her finner du info om reiseregulativet:"],
};