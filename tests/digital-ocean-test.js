const SDK = require('../');
const sdk = new SDK({
  digitalOceanAPIKey: 'yourapikey'
});

async function test()
{
  if(sdk.config.getType() != 'digitalocean') {
    sdk.Spawn.DigitalOcean.setInstanceToDigitalOcean();
  }

  await sdk.Spawn.DigitalOcean.createHiveInstance();
  await sdk.Spawn.DigitalOcean.createWaspsInstances(2);

  console.log("Waiting for hive to come online.")
  await sdk.Hive.WaitForComplete();


  console.log("Waiting for all wasps to come online.");
  await sdk.Wasps.WaitForWasps(2);

  console.log("Check Hives Status.")
  var status = await sdk.Hive.HiveStatus();
  console.log('status', status.body);

  await sdk.Spawn.DigitalOcean.destoryHiveInstance();
  await sdk.Spawn.DigitalOcean.destoryWaspsInstances();
}

test();
