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

    // Henter botmeliding!
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
	delete context.quicklonn;
	delete context.dagreis;
	delete context.regut;
	delete context.ovgen;
	delete context.kont;
	delete context.tidl;
	delete context.cat;
	delete context.bet;
	delete context.tidopp;
	delete context.lonn;
	delete context.pers;
	delete context.img;
	
// SEKSJON FOR QUICKREPLY-LOGIKK

	// Logikk for quickreply -> login problemer
	const quicklog = firstEntityValue(entities,'quicklog');
	if (quicklog) {
		context.quicklog = quicklog;
		const quicklogmsg = {
			"text": "Hvor stopper det opp for deg?",
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
	
	// Startbeskjed
	const Hilsen = firstEntityValue(entities,'Hilsen');
	if (Hilsen) {
	context.Hilsen = Hilsen; // Quick replies for registrering av reiseregning
	const startmsg = {
			"text": "Hei! Jeg er DFØ sin chatbot! Spør meg om du trenger hjelp, eller velg et hurtigvalg:",
			"quick_replies": [
			{
				"content_type": "text",
				"title": "Hjelp for nye brukere",
				"payload": "d"
			},
			{
				"content_type": "text",
				"title": "Teknisk problem",
				"payload": "h"
			},
			]
		}
		exports.startmsg = startmsg;
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
				"title": "Oversikt tidl reiser",
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
				"title": "Start registrering",
				"payload": "ca"
			},
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
	
	//Logikk for quickreply -> Lønn/honorarer
	const quicklonn = firstEntityValue(entities,'quicklonn');
	if (quicklonn) {
		context.quicklonn = quicklonn;
		const quicklonnmsg = {
			"text": "Hvilken del av Lønn og honoraer trenger du hjelp med?",
			"quick_replies": [
			{
				"content_type": "text",
				"title": "Betaling for oppdrag",
				"payload": "ca"
			},
			{
				"content_type": "text",
				"title": "Oversikt tidligere oppdrag",
				"payload": "cb"
			},
			{
				"content_type": "text",
				"title": "Lønnsslipp",
				"payload": "cc"
			},
			]
		}
		exports.quicklonnmsg = quicklonnmsg;
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
				"title": "Hvilken del av registrering av dagreiser trenger du hjelp med?",
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
				"title": "Fler valg:",
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
				"title": "Hvilken del av 1-Generelle data trenger du hjelp med?",
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
				"title": "Fler valg:",
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
      context.tidl = tidl; // lagrer i context
	  const tidlmsg = {
	    "attachment": {
		  "type": "template",
		  "payload": {
			"template_type": "generic",
			"elements": [
			  {
				"title": "Hvilken del av tidligere reiser trenger du hjelp med?",
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
				"title": "Fler valg:",
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
	
	const bet = firstEntityValue(entities, 'bet');
    if (bet) {
      context.bet = bet; // lagrer i context
	  const betmsg = {
	    "attachment": {
		  "type": "template",
		  "payload": {
			"template_type": "generic",
			"elements": [
			  {
				"title": "Hvilken del av Betaling for oppdrag trenger du hjelp med?",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_betaling_for_oppdrag.pdf#page=2",
					"title": "Utfylling "
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_betaling_for_oppdrag.pdf#page=3",
					"title": "Endre/Slette"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_betaling_for_oppdrag.pdf#page=4",
					"title": "Vedlegg"
				  }
				]
			  },
			  {
				"title": "Fler valg:",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_betaling_for_oppdrag.pdf#page=5",
					"title": "Send til godkjenning"
				  }
				]
			  }
			]
		  }
		}
    }
	exports.betmsg = betmsg;
    }
	
	const tidopp = firstEntityValue(entities, 'tidopp');
    if (tidopp) {
      context.tidopp = tidopp; // lagrer i context
	  const tidoppmsg = {
	    "attachment": {
		  "type": "template",
		  "payload": {
			"template_type": "generic",
			"elements": [
			  {
				"title": "Hvilken del av oversikt tidligere oppdrag trenger du hjelp  med?",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_oversikt_over_tidligere_oppdrag.pdf#page=1",
					"title": "Finne sekvensnummer"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_oversikt_over_tidligere_oppdrag.pdf#page=1",
					"title": "Se på skjema"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_oversikt_over_tidligere_oppdrag.pdf#page=2",
					"title": "Slette skjema"
				  }
				]
			  }
			]
		  }
		}
    }
	exports.tidoppmsg = tidoppmsg;
    }
	
	const lonn = firstEntityValue(entities, 'lonn');
    if (lonn) {
      context.lonn = lonn; // lagrer i context
	  const lonnmsg = {
	    "attachment": {
		  "type": "template",
		  "payload": {
			"template_type": "generic",
			"elements": [
			  {
				"title": "Hvilken del av lønnsslipp trenger du hjelp med?:",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_l%C3%B8nnsslipp.pdf#page=1",
					"title": "Se på lønnsslipp"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_l%C3%B8nnsslipp.pdf#page=2",
					"title": "Skrive ut lønnsslipp"
				  }
				]
			  }
			]
		  }
		}
    }
	exports.lonnmsg = lonnmsg;
    }
	
	const pers = firstEntityValue(entities, 'pers');
    if (pers) {
      context.pers = pers; // lagrer i context
	  const persmsg = {
	    "attachment": {
		  "type": "template",
		  "payload": {
			"template_type": "generic",
			"elements": [
			  {
				"title": "Hva vil du gjøre i din profil?",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_personlig_profil.pdf#page=1",
					"title": "Endre/Slette data"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_personlig_profil.pdf#page=2",
					"title": "Endre E-post / Tlfnr"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_personlig_profil.pdf#page=2",
					"title": "Legge inn ny adresse"
				  }
				]
			  },
			  {
				"title": "Fler valg:",
				"buttons": [
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_personlig_profil.pdf#page=3",
					"title": "Nytt bankkontonummer"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_personlig_profil.pdf#page=4",
					"title": "Bankkonto for reiseutgifter"
				  },
				  {
					"type": "web_url",
					"url": "https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_personlig_profil.pdf#page=4",
					"title": "Se persondata"
				  }

				]
			  }
			]
		  }
		}
    }
	exports.persmsg = persmsg;
    }
	
	
// Loggikk for diverse lenker
	const category = firstEntityValue(entities, 'div');
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
	
	// Versjon 3:
	
	const quickbank = firstEntityValue(entities, 'quickbank');
	if (quickbank) {
		context.quickbank = quickbank;
		const quickbankmsg = {
			"text": "Hvilke bankkonto vil du legge til? ",
			"quick_replies": [
			{
				"content_type": "text",
				"title": "Hovedbankkonto",
				"payload": "ca"
			},
			{
				"content_type": "text",
				"title": "Egen konto reise",
				"payload": "cb"
			}
			]
		}
		exports.quickbankmsg = quickbankmsg;
	}
	
	
	
	const img = firstEntityValue(entities, 'img');
	if (img) {
		context.img = img;
		const wantedImg = allImgs[context.img || 'default'];
		const myImg = wantedImg.toString();
		
	  const imgdata = {
	    "attachment": {
		    "type": "image",
		    "payload": {
					"url": myImg,
						}
	    }
    }
	exports.imgdata = imgdata;
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
  MVA: ["https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#nameddest=Merverdiavgift"],
  startreg: ["https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_%C3%B8vrige_reiser.pdf#page=2"],
  veil: ["https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_selvbetjeningsportalen.pdf"],
};
const allTitles = {
	default: ['ingen context?'],
	Nettleser: ["Veiledning nettlesere"],
	Sperret: ["Bruk av portal"],
	logge: ["Logg inn her"],
	Vedlegg: ["Legge ved Vedlegg"],
	Ikkesendt: ["Sende reise"],
	retur: ["Korrigering innkurv"],
	Reisereg: ["Statens reiseregulativ"],
	MVA: ["Mva info"],
	startreg: ["Start registrering"],
	veil: ["Selvbetjeningsportalen"],
};
const allResp = {
	default: ["oops"],
	Nettleser: ["Problemet skyldes mest sannsynlig nettleseren du bruker. DFØ sin portal er optimalisert for Internet explorer 11. Se veiledning:"],
	Sperret: ["Det kan være du har sperret deg selv. Sperren forsvinner av seg selv etter 30 minutter. Sperren kan komme av:"],
	logge: ["Forklar problemet ditt litt nærmere. Pass på at du logger deg inn riktig sted:"],
	Vedlegg: ["For å laste opp vedlegg må du klikke på vedlegg-knappen på trinn 1 - Generelle data."],
	Ikkesendt: ["Du bør undersøke om reisen/honoraret er sendt til godkjenning."],
	retur: ["Dersom du har fått et skjema i retur må du korrigere dette i innkurven i selvbetjeningsportalen."],
	Reisereg: ["Her finner du info om reiseregulativet:"],
	MVA: ["Undersøk mer om Mva her:"],
	startreg: ["Her finner du hjelp til å starte registreringen din:"],
	veil: ["Her finner du hjelp om du er ny til selvbetjeningsportalen:"],
};

const allImgs = {
	default: [""],
	Vedlegg: ["http://i.imgur.com/OjZiDny.png"],
	Hovedbank: ["http://i.imgur.com/RmVzDix.png"],
	Reisebank: ["http://i.imgur.com/dr9rlu1.png"],
	retur: ["http://i.imgur.com/Qlzg930.png"],
};