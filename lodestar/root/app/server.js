'use strict';

const { parse } = require('url');
const AWS = require('aws-sdk');
const config = require('nconf');

// Make nconf use an in-memory store.
config.use('memory');

// As simple log function.
/* eslint-disable no-console */
const log = (...args) => console.log(...args);
const error = (...args) => console.error(...args);
/* eslint-enable no-console */

// The environment variables we need.
const envVars = ['DOMAINS', 'HOSTED_ZONE_ID', 'SERVICE'];

// Load environment variables
config.env();

// Make sure we have everything we need before moving forward
envVars.forEach((envVar) => {

    if (!config.get(envVar)) {
        throw new Error(`Could not find environment variable ${envVar}`);
    }

});

// Create the ENV string for the service URL.
const serviceUrlEnv = `CF_URL_${config.get('SERVICE')}`;

// Make sure we have the SERVICE URL environment variable.
if (!config.get(serviceUrlEnv)) {
    throw new Error(`Could not find environment variable ${serviceUrlEnv}`);
}

// Retrieve the domain only, from the service URL.
const { hostname, protocol } = parse(config.get(serviceUrlEnv));

// Support a temporary LAUNCH_DOMAINS environment variable.
// LAUNCH_DOMAINS supersedes DOMAINS environment variable.
if (config.get('LAUNCH_DOMAINS')) {
    config.set('DOMAINS', config.get('LAUNCH_DOMAINS'));
}

// Load in the AWS access credentials
AWS.config.loadFromPath('./aws.json');

// Create a change object for each domain
const changes = config.get('DOMAINS')
    .split(',')
    .map((domain) => {

        return {
            Action: 'UPSERT',
            ResourceRecordSet: {
                Name: domain,
                ResourceRecords: [{ Value: hostname }],
                TTL: config.get('TTL') || 60,
                Type: config.get('TYPE') || 'CNAME',
            },
        };

    });

// Create the ChangeBatch.
const params = {
    ChangeBatch: { Changes: changes },
    HostedZoneId: config.get('HOSTED_ZONE_ID'),
};

// Create an instance.
const route53 = new AWS.Route53();

// Send the request.
route53
    .changeResourceRecordSets(params)
    .promise()
    .then(() => {

        return log(`OTE running at ${protocol}//${config.get('DOMAINS')}:{port}`);

    })
    .catch(err => error(err));
