const SDK = require('../');
const sdk = new SDK();

async function test()
{
  if(sdk.config.getType() != 'aws') {
      sdk.Spawn.Aws.setInstanceToAws();
  }

  await sdk.Spawn.Aws.createSecurityGroup().catch(()=>{});
  await sdk.Spawn.Aws.createHiveInstance();
  await sdk.Spawn.Aws.createWaspsInstances(2);

  await sdk.Spawn.Aws.stopHiveInstance();
  await sdk.Spawn.Aws.stopWaspsInstances();

  await sdk.Spawn.Aws.startHiveInstance();
  await sdk.Spawn.Aws.startWaspsInstances();

  var status = await sdk.Hive.HiveStatus();

  console.log('status', status.body);

  await sdk.Spawn.Aws.destoryHiveInstance();
  await sdk.Spawn.Aws.destoryWaspsInstances();
}

test();
