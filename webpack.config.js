const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        main: path.resolve(__dirname, 'index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    }
}