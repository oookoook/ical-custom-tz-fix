const app = require ('./api.js');
process.env.LOCAL = "true";
app.listen(3000);
console.log('API started.');