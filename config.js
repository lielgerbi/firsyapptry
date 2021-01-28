// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    DIR: process.env.DIR,
    MAX_ERROR: process.env.MAX_ERROR,
  }
// config.js
// module.exports = {
//     NODE_ENV: process.env.NODE_ENV || 'development',
//     HOST: process.env.HOST || '127.0.0.1',
//     PORT: process.env.PORT || 3001,
//     DIR: 'C:/Users/liel/Desktop/FILES',
//     MAX_ERROR: 3
//   }