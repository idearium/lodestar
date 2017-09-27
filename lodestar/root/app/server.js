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
const envVars = ['DOMAINS', 'HOSTED_ZONE_ID', 'CF_HOST_NAME'];

// Load environment variables
config.env();

// You can set `DEBUG` to turn on debugging of all environment variables.
if (config.get('DEBUG')) {

    // eslint-disable-next-line no-process-env
    const allVars = process.env;
    const keys = Object.keys(allVars);

    keys.forEach(key => log(key, allVars[key]));

}

// Make sure we have everything we need before moving forward
envVars.forEach((envVar) => {

    if (!config.get(envVar)) {
        throw new Error(`Could not find environment variable ${envVar}`);
    }

});

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
                ResourceRecords: [{ Value: config.get('CF_HOST_NAME') }],
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

        return log(`OTE running at //${config.get('DOMAINS')}`);

    })
    .catch(err => error(err));
