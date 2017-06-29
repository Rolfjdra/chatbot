'use strict';
// Henter opp vertifikasjoner -> Facebookside, WIT-api, Heroku-webhook
const WIT_TOKEN = process.env.WIT_TOKEN || "WRAXCGEZKGZCMMAHKGDQGKBHQZUB273X"
if (!WIT_TOKEN) {
  throw new Error("Ingen WIT_TOKEN. Hent: https://wit.ai/")
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || "EAABcpUgvhNoBAFzeIoe3T4ZBf5OBPoJ7RZB6tUWG2V3bHDuxZCVPe7fLCJev4IwwXUeGglCxxVRmtz2Y8RreX3pQVjmZANsoBIxcYvWga5AQs4u1DmeH2BxUW9negaQsPfHB30ZBXQVmOI49d75oGPqJgdM4H1ZAKpUxSMWyLIAjdyZCUKau9RTgk2lx2FX13oZD";
if (!FB_PAGE_TOKEN) {
	throw new Error("Ingen FB_PAGE_TOKEN. Gå til https://developers.facebook.com/docs/pages/access-tokens")
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'my_voice_is_my_password_verify_me'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}