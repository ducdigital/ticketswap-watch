'use strict';

const co = require('co');
const request = require('co-request');
const cheerio = require('cheerio');
const _ = require('lodash');
const notifier = require('node-notifier');

const HOST = 'https://www.ticketswap.com';
const EVENT_URL = '/event/flume-world-tour/1afe7e5c-2609-43e6-ae18-f466109fdb13';
const CHECK_INTERVAL_MS = 200000;

let fetchResult = function (link) {
  return co(function *() {
    let result = yield request({
        uri: link,
        method: 'GET'
    });

    return cheerio.load(result.body);
  });
};

let botAction = {
  robotCheck: function (url) {
    console.log(`${url} : ---> Need to visit and check if you are block as robot`);
    return notifier.notify({
      'title': 'Need check as robot',
      'message': url,
      'open': url,
    });
  },
  availableTicket: function (url, data) {
    console.log(`${url} : ---> ${data} available`);
    return notifier.notify({
      'title': 'New ticket!!!',
      'message': url,
      'open': url,
    });
  },
  unavailableTicket: function (url, data) {
    console.log(`${url} : ---> Not available`);
    return false;
  }
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

    if ($('.events-list--item a').length > 0) {
      $('.events-list--item a').each((index, link) => {
        let fetchUrl = HOST + _.get(link, 'attribs.href');
        linksFn[fetchUrl] = fetchResult(fetchUrl);
      });
    } else {
      linksFn[HOST + EVENT_URL] = Promise.resolve($);
    }

    let linksResults = yield linksFn;

    _.each(linksResults, function ($query, url) {
      let counterValue = $query('.counter-available .counter-value').text();
      let isRobotCheck = $query('.counter-available .counter-value');

      if ($query('#recaptcha').length > 0) {
        return botAction.robotCheck(url);
      }

      if (parseInt(counterValue, 10) > 0) {
        return botAction.availableTicket(url, counterValue);
      }

      return botAction.unavailableTicket(url);
    });

    return true;
  }).catch(ex => {
    console.log(ex);
  });
};

app();
setInterval(app, CHECK_INTERVAL_MS);
