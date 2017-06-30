'use strict';
// Henter opp vertifikasjoner -> Facebookside, WIT-api, Heroku-webhook
// tester dfoface2
const WIT_TOKEN = process.env.WIT_TOKEN || "WRAXCGEZKGZCMMAHKGDQGKBHQZUB273X"
if (!WIT_TOKEN) {
  throw new Error("Ingen WIT_TOKEN. Hent: https://wit.ai/")
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || "EAABcpUgvhNoBAKdo5ZAnCUk2BXvsxZC4XByVwAF6bhsH2ZCIcPpYnq1kJzcp2iLZCR3OKQgFMyFsiHSoC58xnw6yGftoQsYzZBs2ZAL1SZCKNT6FdTh2BFYmkR5wyHuRw2XKKIbT42mhjvtO5DZCqsIVDs6h9AxMYj9CvN4QRhL8WgHZA0axxm0lNyTCTtns20swZD";
if (!FB_PAGE_TOKEN) {
	throw new Error("Ingen FB_PAGE_TOKEN. Gå til https://developers.facebook.com/docs/pages/access-tokens")
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'rolf'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}