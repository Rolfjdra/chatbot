'use strict';
// Henter opp vertifikasjoner -> Facebookside, WIT-api, Heroku-webhook
// 
const WIT_TOKEN = process.env.WIT_TOKEN || "UP7OIFIZV6IWD7R22PG4H66DHKMHPWH4"
if (!WIT_TOKEN) {
  throw new Error("Ingen WIT_TOKEN. Hent: https://wit.ai/")
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || "EAACtPl97H00BALSImxYPCAtr4AJDUzsEwaNlZBdoei78JBP4zs2nkSCKiLeFNcEgWX5jjTBZCLssh6ffiIbupgH5X5FdRJi2Eth4IvjZCn5bN5z6LcWZALwA6NCcqUgIqE1UFxfzp9TuR4l0bP6EPOjCDVYIXqgrglIAkdcYCwZDZD";
if (!FB_PAGE_TOKEN) {
	throw new Error("Ingen FB_PAGE_TOKEN. Gå til https://developers.facebook.com/docs/pages/access-tokens")
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'rolf'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}