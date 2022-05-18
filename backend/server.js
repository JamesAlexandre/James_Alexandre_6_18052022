const https = require("https");
const app = require('./app')
const server = https.createServer(app);

server.listen(process.env.PORT || 3000);
