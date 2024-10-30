const mongoose = require('mongoose');

const { loadPlanetsData } = require('../models/planets.model');

const MONGO_URL =
  'mongodb+srv://nasaAdmin:Lrz6P11SZaI9Y7ae@nasaproject.mxmcf.mongodb.net/nasa?retryWrites=true&w=majority&appName=NasaProject';

mongoose.connection.once('open', () => {
  console.log('MongoDB connected!');
});

mongoose.connection.on('error', (error) => {
  console.error(error);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
