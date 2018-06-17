// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
    presets: [ 'env' ]
})
// Use ASYN/AWAIT in Application
require('babel-polyfill');
// Import the rest of our application.
module.exports = require('./src/app')