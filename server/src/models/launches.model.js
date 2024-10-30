const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function existsLaunchById(launchId) {
  return await launches.findOne({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const lastLaunch = await launches.findOne().sort('-flightNumber');

  if (!lastLaunch) return DEFAULT_FLIGHT_NUMBER;

  return lastLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  try {
    const planet = await planets.findOne({ keplerName: launch.target });

    if (!planet) throw new Error('Planet not found!');

    await launches.findOneAndUpdate(
      { flightNumber: launch.flightNumber },
      launch,
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`Could not save launch ${error}`);
  }
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const abortedLaunch = await launches.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );

  return abortedLaunch.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchById,
  abortLaunchById,
};
