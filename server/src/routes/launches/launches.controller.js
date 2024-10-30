const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchById,
  abortLaunchById,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  const existsLaunch = await existsLaunchById(launchId);
  if (!existsLaunch) return res.status(404).json({ error: 'Launch not found' });

  const abortedLaunch = abortLaunchById(launchId);
  if (!abortedLaunch)
    return res.status(400).json({ error: 'Launch not aborted' });

  return res.status(200).json({ ok: true });
}

async function httpAddNewLaunch(req, res) {
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

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
