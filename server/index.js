require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/index.js');
const { handleResponse } = require('./helpers/responseHandler');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

app.all('*', (req, res) => {
  return handleResponse(res, 404, { message: 'API Not Found' });
});

if (!module.parent) {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  });
}

module.exports = app;
