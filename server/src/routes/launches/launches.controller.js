const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchById,
  abortLaunchById,
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  if (!existsLaunchById(launchId))
    return res.status(404).json({ error: 'Launch not found' });

  const abortedLaunch = abortLaunchById(launchId);
  return res.status(200).json(abortedLaunch);
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.launchDate ||
    !launch.target ||
    !launch.rocket ||
    !launch.mission
  ) {
    return res.status(400).json({
      error: 'Missing required launch data',
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Launch date invalid',
    });
  }

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
