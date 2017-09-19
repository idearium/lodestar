'use strict';

const { parse } = require('url');
const AWS = require('aws-sdk');
const config = require('nconf');

// As simple log function.
/* eslint-disable no-console */
const log = (...args) => console.log(...args);
const error = (...args) => console.error(...args);
/* eslint-enable no-console */

// The environment variables we need.
const envVars = ['DOMAIN', 'HOSTED_ZONE_ID', 'SERVICE'];

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
const { host } = parse(config.get(serviceUrlEnv));

// Load in the AWS access credentials
AWS.config.loadFromPath('./aws.json');

// Create the ChangeBatch.
const params = {
    ChangeBatch: {
        Changes: [
            {
                Action: 'UPSERT',
                ResourceRecordSet: {
                    Name: config.get('DOMAIN'),
                    ResourceRecords: [{ Value: host }],
                    TTL: config.get('TTL') || 60,
                    Type: config.get('TYPE') || 'CNAME',
                },
            },
        ],
    },
    HostedZoneId: config.get('HOSTED_ZONE_ID'),
};

// Create an instance.
const route53 = new AWS.Route53();

// Send the request.
route53
    .changeResourceRecordSets(params)
    .promise()
    .then(data => log(data))
    .catch(err => error(err));
