'use strict';

const co = require('co');
const request = require('co-request');
const cheerio = require('cheerio');
const _ = require('lodash');
const notifier = require('node-notifier');

const HOST = 'https://www.ticketswap.com';
const EVENT_URL = '/event/lost-in-a-moment-saint-malo/7f896c0e-7fdc-41e1-a671-9fcecd39e64d';
const CHECK_INTERVAL_MS = 200000;

let fetchResult = function (link) {
  return co(function *() {
    let result = yield request({
        uri: link,
        method: 'GET'
    });

    let $ = cheerio.load(result.body);

    return $('.counter-available .counter-value').text();
  });
};

let app = function () {
  return co(function* () {
    let result = yield request({
        uri: HOST + EVENT_URL,
        method: 'GET'
    });
    let $ = cheerio.load(result.body);
    let hasData = false;
    let linksFn = {};

    $('.events-list--item a').each((index, link) => {
      let fetchUrl = HOST + _.get(link, 'attribs.href');
      linksFn[fetchUrl] = fetchResult(fetchUrl);
    });

    let linksResults = yield linksFn;

    _.each(linksResults, function (res, key) {
      if (res === '') {
        console.log(`${key} : ---> Need to visit and check if you are block as robot`);
        return notifier.notify({
          'title': 'Need check as robot',
          'message': key,
          'open': key,
        });
      }

      if (parseInt(res, 10) > 0) {
        console.log(`${key} : ---> ${res} available`);
        return notifier.notify({
          'title': 'New ticket!!!',
          'message': key,
          'open': key,
        });
      }

      console.log(`${key} : ---> Not available`);
    });
  });
};

setInterval(app, CHECK_INTERVAL_MS);
