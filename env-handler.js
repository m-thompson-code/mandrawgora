// source: https://stackoverflow.com/questions/51388921/pass-command-line-args-to-npm-scripts-in-package-json
const execSync = require('child_process').execSync;
execSync;


const fs = require('fs');
const path = require('path');

console.log("~ env-handler.js: START\n");

const env = process.argv[2];

if (env !== 'prod' && env !== 'dev') {
    const message = " ~ Unexpected env";
    console.error(" ~ Unexpected env");
    throw {
        message: message,
        env: env
    };
}

const baseIndex = fs.readFileSync(path.resolve(__dirname, 'src/index.base.html'), "utf8");
let finalIndex = baseIndex;

// Update index meta tags depending on prod/dev
if (env === 'prod') {
    const title = 'ManDrawGora';
    const desc = 'Hey, hi. I like like drawin cute girls. Skullgirls enthusiast. Let’s fight some time maybe? @mandrawgora on twitter. Any spicy stuff will go there <3';
    const url = 'https://mandrawgora.com';

    finalIndex = baseIndex.replace('{% metatags %}', `
        <title>${title}</title>
        <meta name="description" content="${desc}">
    
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${desc}">
        <meta property="og:image" content="${url}/assets/social.jpg?v=1">
        <meta property="og:width" content="320">
        <meta property="og:height" content="320">
        <meta property="og:url" content="${url}">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="en_US">

        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${desc}">
        <meta name="twitter:image" content="${url}/assets/social.jpg?v=1">
        <meta name="twitter:site" content="${url}">
        <meta name="twitter:card" content="summary">

        <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
        <link rel="apple-touch-icon" sizes="57x57" href="assets/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="assets/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="assets/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="assets/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="assets/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="assets/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="assets/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="assets/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="assets/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="assets/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
        <link rel="manifest" href="assets/manifest.json">
        <meta name="msapplication-TileColor" content="#71c4c8">
        <meta name="msapplication-TileImage" content="assets/ms-icon-144x144.png">
        <meta name="theme-color" content="#71c4c8">
    `);
} else {
    const title = 'Art Gallery Demo';
    const desc = 'Art gallery website using Angular and Firebase for hosting and storage. This demo aims to showcase the website and overall functionality of the site management by making permissions public';
    const url = 'https://mandrawgora-demo.web.app';

    finalIndex = baseIndex.replace('{% metatags %}', `
        <title>${title}</title>
        <meta name="description" content="${desc}">
    
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${desc}">
        <meta property="og:image" content="${url}/assets/social.jpg?v=1">
        <meta property="og:width" content="320">
        <meta property="og:height" content="320">
        <meta property="og:url" content="${url}">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="en_US">

        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${desc}">
        <meta name="twitter:image" content="${url}/assets/social.jpg?v=1">
        <meta name="twitter:site" content="${url}">
        <meta name="twitter:card" content="summary">

        <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
        <link rel="apple-touch-icon" sizes="57x57" href="assets/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="assets/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="assets/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="assets/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="assets/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="assets/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="assets/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="assets/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="assets/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="assets/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png">
        <link rel="manifest" href="assets/manifest.json">
        <meta name="msapplication-TileColor" content="#71c4c8">
        <meta name="msapplication-TileImage" content="assets/ms-icon-144x144.png">
        <meta name="theme-color" content="#71c4c8">
    `);
}

fs.writeFileSync(path.resolve(__dirname, 'src/index.html'), finalIndex);

console.log(" ~ Updated src/index.html based on environment\n ~ env-handler.js: END");
