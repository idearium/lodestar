/* eslint-disable no-console, no-process-env, padded-blocks */

'use strict';

const { createServer } = require('http');
const port = process.env.APP_PORT || 80;

// Create a really simple response.
createServer((req, res) => {

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    return res.end(`<p>Lodestar ✫ (${Math.random()})</p>`);

})
    .listen(port, (err) => {

        if (err) {
            return console.error(err);
        }

        return console.log(`Listening on port ${port}`);

    });
/* eslint-enable no-console, no-process-env, padded-blocks */
