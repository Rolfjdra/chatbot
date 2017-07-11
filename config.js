'use strict';
// Henter opp vertifikasjoner -> Facebookside, WIT-api, Heroku-webhook
// tester dfoface2
const WIT_TOKEN = process.env.WIT_TOKEN || "IIM3YKRT7YNJ5KR72YUU2R5J5P4JYBGX"
if (!WIT_TOKEN) {
  throw new Error("Ingen WIT_TOKEN. Hent: https://wit.ai/")
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || "EAABcpUgvhNoBAJKIWUI1kDd8wSIIrVCtKlWY5jJM1hcywTZBDHslRbeUoO79OGeFXCIKTZC9PPD4BVNZB6F8rE6IcLZAZCwXjDdX4UgO5U3u5QZChruAipZBCIXQLGr39KP2PajXnMDfcwZCKZC7rFr1j2knK0vPhN3VWwlNTWDavKw1tjorkmWyycMeyxRH9SM8ZD";
if (!FB_PAGE_TOKEN) {
	throw new Error("Ingen FB_PAGE_TOKEN. Gå til https://developers.facebook.com/docs/pages/access-tokens")
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'rolf'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}