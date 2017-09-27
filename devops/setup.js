#!/usr/bin/env node

'use strict';

const execa = require('execa');
const Listr = require('listr');
const sudo = require('sudo-prompt');

// eslint-disable-next-line no-console
console.log('\nSetting up the project...\n');

const tasks = new Listr([
    {
        task: (ctx, task) => new Promise((resolve, reject) => {

            execa('docker', ['network', 'ls'])
                // eslint-disable-next-line consistent-return
                .then((result) => {

                    // Is the network already setup?
                    if (/idearium-dev-network/.test(result.stdout)) {

                        task.skip('The Docker network is already setup.');

                        return resolve();

                    }

                    execa('docker', ['network', 'create', 'idearium-dev-network'])
                        .then((createResult) => {

                            /* eslint-disable padded-blocks */
                            if (createResult.code !== 0) {
                                return reject(new Error(result.stderr));
                            }
                            /* eslint-enable padded-blocks */

                            return resolve();

                        });

                });

        }),
        title: 'Docker network',
    },
    {
        task: () => execa('c', ['dc', 'env', 'file', 'reset']),
        title: 'Docker environment (.env)',
    },
    {
        task: (ctx, task) => new Promise((resolve, reject) => {

            execa('cat', ['/etc/hosts'])
                // eslint-disable-next-line consistent-return
                .then((result) => {

                    // Is their already an entry for lodestar.local?
                    if (/lodestar\.local/.test(result.stdout)) {

                        task.skip('An entry for lodestar.local already exists. Please make sure it points to 127.0.0.1.');

                        return resolve();

                    }

                    // With sudo, create the directory.
                    sudo.exec('./node_modules/.bin/hostile set 127.0.0.1 lodestar.local', (err) => {

                        if (err) {
                            return reject(err);
                        }

                        return resolve();

                    });

                });

        }),
        title: 'Hosts',
    },
]);

// Run the tasks now.
tasks
    .run()
    .catch(() => {

        // Ignore the error, because it's reported by Listr.
        // But we need to catch it, so that Node.js doens't complain.

    });
