require('dotenv').config();
const express = require('express');
const config = require('./server/config');
const port = process.env.PORT || 3000;

require('./database');

const hbs = require('hbs');
const app = config(express());

hbs.registerHelper('eq', (a, b) => {
  return a.toString() === b.toString();
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});