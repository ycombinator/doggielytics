"use strict";

const tessel = require('tessel');
const accel = require('accel-mma84').use(tessel.port['A']);
const elasticsearch = require('elasticsearch');
const config = require('./config');
const logger = require('./lib/logger');
const Dog = require('./lib/dog');

const dog = new Dog();
const es = new elasticsearch.Client({
  host: {
    protocol: config.elasticsearch.connection.protocol,
    host: config.elasticsearch.connection.host,
    port: config.elasticsearch.connection.port,
    auth: config.elasticsearch.connection.username + ':' + config.elasticsearch.connection.password
  }
});

const FLAPPING_MAX_DURATION_MILLIS = 5 * 1000;
let flappingTimeoutId;
let message;

// Set timezone
process.env.TZ = config.timezone || 'Etc/UTC';

// Initialize state
let isFlapping = false;

// Dog visit variables
let dogVisitStartTime;

function flappingStopped() {
  logger.debug('Flapping has stopped for a while');
  clearTimeout(flappingTimeoutId);
  flappingTimeoutId = undefined;
  if (dog.isInside()) {
    // Dog was inside, just went out
    dog.wentOutside();
    message = 'Dog was inside, just went outside';
    logger.info(message);
    es.index({
      index: config.elasticsearch.indices.logs.index,
      type: config.elasticsearch.indices.logs.type,
      body: { '@timestamp': new Date(), message: message }
    });

    // Start timing dog's visit
    dogVisitStartTime = new Date();
  } else {
    // Dog was outside, just came in
    dog.cameInside();
    message = 'Dog was outside, just came in';
    logger.info(message);
    es.index({
      index: config.elasticsearch.indices.logs.index,
      type: config.elasticsearch.indices.logs.type,
      body: { '@timestamp': new Date(), message: message }
    });
    // Stop timing dog's visit
    const dogVisitEndTime = new Date();
    const dogVisitDurationInMillis = dogVisitEndTime.getTime() - dogVisitStartTime.getTime() - FLAPPING_MAX_DURATION_MILLIS;
    message = 'Dog just visited for ' + dogVisitDurationInMillis / 1000 + ' seconds'
    logger.info(message);
    es.index({
      index: config.elasticsearch.indices.logs.index,
      type: config.elasticsearch.indices.logs.type,
      body: { '@timestamp': new Date(), message: message }
    });
    es.index({
      index: config.elasticsearch.indices.visits.index,
      type: config.elasticsearch.indices.visits.type,
      body: {
        start_time: dogVisitStartTime,
        start_day_of_week: dogVisitStartTime.getDay(),
        start_month: dogVisitStartTime.getMonth(),
        end_time: dogVisitEndTime,
        end_day_of_week: dogVisitEndTime.getDay(),
        end_month: dogVisitEndTime.getMonth(),
        duration_in_millis: dogVisitDurationInMillis
      }
    });
  }
}

accel.on('ready', () => {
  logger.info('Accelerometer ready');
  accel.setOutputRate(1.56, () => {
    accel.on('data', (xyz) => {
      const x = xyz[0];
      const y = xyz[1];
      const z = xyz[2];

      if (x > -0.9) {
        // logger.trace('Door is flapping...');
        isFlapping = true;
      }

      if (isFlapping && x <= -0.9) {
        // Was flapping, now stopped
        isFlapping = false;
        logger.debug('Door was flapping, now stopped');
        if (flappingTimeoutId) {
          clearTimeout(flappingTimeoutId);
        }
        flappingTimeoutId = setTimeout(flappingStopped, FLAPPING_MAX_DURATION_MILLIS);
      }

    });
  });
});
