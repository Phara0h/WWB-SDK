const SDK = require('./');
const sdk = new SDK({path:require('path').resolve('./config/config.json')});

async function test()
{
  await sdk.Spawn.Aws.createSecurityGroup().catch(()=>{});
  await sdk.Spawn.Aws.createHiveInstance();
  await sdk.Spawn.Aws.createWaspsInstances(2);

  await sdk.Spawn.Aws.stopHiveInstance();
  await sdk.Spawn.Aws.stopWaspsInstances();

  await sdk.Spawn.Aws.startHiveInstance();
  await sdk.Spawn.Aws.startWaspsInstances();

  await sdk.Spawn.Aws.destoryHiveInstance();
  await sdk.Spawn.Aws.destoryWaspsInstances();
}

test();
