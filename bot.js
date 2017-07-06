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
    // Resetter cat
	delete context.cat
    // Henter entity og lagrer i context/
    const category = firstEntityValue(entities, 'intent');
    if (category) {
      context.cat = category; // lagrer i context
	  const wantedLinks = allLinks[context.cat || 'default']
	  const myLink = wantedLinks.toString();
	  const wantedTitle = allTitles[context.cat || 'default']
	  const myTitle = wantedTitle.toString();
	  const wantedResp = allResp[context.cat || 'default']
	  const myResp = wantedResp.toString();
	  
	  const messageData = {
	    "attachment": {
		  "type": "template",
		  "payload": {
			"template_type": "generic",
			"elements": [
			  {
				"title": "Velg brukerveilednig:",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_dagsreise_innenlands.pdf",
					"title": "Registrere dagsreise"
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
				"title": "Her også: ??",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_dagsreise_innenlands.pdf#page=3",
					"title": "Registrere kilometer"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_dagsreise_innenlands.pdf#page=4",
					"title": "Registrere utgiftsbilag"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_dagsreise_innenlands.pdf#page=4",
					"title": "Sende til godkjenning"
				  }
				]
			  }
			]
		  }
		}
    }
	exports.messageData = messageData;
    }
	const quickreply = firstEntityValue(entities,'quick');
	if (quickreply) {
		context.quick = quickreply;
		const quickData = {
			"text": "Velg et alternativ, eller forklar problemet ditt nærmere",
			"quick_replies": [
			{
				"content_type": "text",
				"title": "Problem med minID",
				"payload": "a"
			},
			{
				"content_type": "text",
				"title": "Problem med side",
				"payload": "b"
			},
			{
				"content_type": "text",
				"title": "Sperret",
				"payload": "c"
			},
			]
		}
		exports.quickData = quickData;
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

//Liste over lenker til brukerdokumentasjon:

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