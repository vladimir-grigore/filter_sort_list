require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const apiRoutes = require("./api_calls");
app.use('/api', apiRoutes());
app.use(express.static("public"));

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Landing page
app.get('/', (request, response) => {
  response.render('index');
});

// Open listening port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
