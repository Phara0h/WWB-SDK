const EC2 = require('aws-sdk/clients/ec2');


class Aws
{
  constructor(config)
  {
    this.config = config;
    process.env.AWS_SDK_LOAD_CONFIG = 1;
  }

  setInstanceToAws() {
    this.config.setInstance('aws',{},[])
  }

  async startHiveInstance()
  {
    if (this.config.getType() == 'aws')
    {
      var ec2 = this._getEC2Instance();

      var filter = {
        InstanceIds: [this.config.getHive().instanceId]
      };
      this.config.log('Starting Hive Instance');
      await ec2.startInstances(filter).promise()
      this.config.log('Waiting for Hive...');
      await ec2.waitFor('instanceRunning', filter).promise();
      this.config.log('Saving Hives ip...');
      await this.updateHiveIp();
      this.config.log('Hive Started');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not aws'))
    }
  }

  async stopHiveInstance()
  {
    if (this.config.getType() == 'aws')
    {
      var ec2 = this._getEC2Instance();

      var filter = {
        InstanceIds: [this.config.getHive().instanceId]
      };

      this.config.log('Stopping Hive Instance');
      await ec2.stopInstances(filter).promise();
      this.config.log('Waiting for Hive...');
      await ec2.waitFor('instanceStopped', filter).promise();
      this.config.log('Hive Stopped');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not aws'))
    }
  }

  async createHiveInstance()
  {
    if (this.config.getType() == 'aws' && this.config.getAwsAmi())
    {
      var ec2 = this._getEC2Instance();

      if (this.config.getAwsSecurityGroupIds().length <= 0)
      {
        return Promise.reject(new Error('Config SecurityGroupIds is empty. Supply your own our generate on with createSecurityGroup()'));
      }

      var instanceParams = {
        ImageId: this.config.getAwsAmi().hive,
        InstanceType: 't1.micro',
        MinCount: 1,
        MaxCount: 1,
        SecurityGroupIds: [...this.config.getAwsSecurityGroupIds()],
        TagSpecifications: [{
            ResourceType: "instance",
            Tags: [{
              Key: "Name",
              Value: "WaspsWithBazookas [Hive]"
             }]
          }]
      };
      var instances = await ec2.runInstances(instanceParams).promise();
      this.config.log(`Creating Hive Instance...`);

      var instanceIds = instances.Instances.map(x => x.InstanceId);
      var filter = {
        InstanceIds: instanceIds
      };

      await ec2.waitFor('instanceRunning', filter).promise();

      this.config.log('Saving Hive Instances...');
      var hive = this.config.getHive();
      hive.instanceId = instanceIds[0];
      this.config.setHive(hive);

      await this.updateHiveIp();

      this.config.log('Hive Created and Running');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not aws'))
    }
  }

  async destoryHiveInstance()
  {
    if (this.config.getType() == 'aws')
    {
      var ec2 = this._getEC2Instance();

      var filter = {
        InstanceIds: [this.config.getHive().instanceId]
      };

      this.config.log('Destorying Hive Instances');
      await ec2.terminateInstances(filter).promise();
      this.config.log('Waiting for Hive...');
      await ec2.waitFor('instanceTerminated', filter).promise();
      this.config.log('Removing Hive Instances from Config');
      this.config.setHive({ip:'127.0.0.1',port:4697,instanceId:null});
      this.config.log('Hive Destoryed');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not aws'))
    }
  }

  async startWaspsInstances()
  {
    if (this.config.getType() == 'aws')
    {
      var ec2 = this._getEC2Instance();

      var filter = {
        InstanceIds: this.config.getWasps()
      };
      this.config.log('Starting Wasps Instances');
      await ec2.startInstances(filter).promise()
      this.config.log('Waiting for Wasps...');
      await ec2.waitFor('instanceRunning', filter).promise();
      this.config.log('Wasps Started');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not aws'))
    }
  }

  async stopWaspsInstances()
  {
    if (this.config.getType() == 'aws')
    {
      var ec2 = this._getEC2Instance();

      var filter = {
        InstanceIds: this.config.getWasps()
      };

      this.config.log('Stopping Wasps Instances');
      await ec2.stopInstances(filter).promise();
      this.config.log('Waiting for Wasps...');
      await ec2.waitFor('instanceStopped', filter).promise();
      this.config.log('Wasps Stopped');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not aws'))
    }
  }

  async createWaspsInstances(amount)
  {
    if (this.config.getType() == 'aws' && this.config.getAwsAmi())
    {
      var ec2 = this._getEC2Instance();

      if (this.config.getAwsSecurityGroupIds().length <= 0)
      {
        return Promise.reject(new Error('Config SecurityGroupIds is empty. Supply your own our generate on with createSecurityGroup()'));
      }

      var instanceParams = {
        ImageId: this.config.getAwsAmi().wasp,
        InstanceType: 't1.micro',
        MinCount: amount,
        MaxCount: amount,
        SecurityGroupIds: [...this.config.getAwsSecurityGroupIds()],
        UserData: this._getUserDataScript(),
        TagSpecifications: [{
            ResourceType: "instance",
            Tags: [{
              Key: "Name",
              Value: "WaspsWithBazookas [Wasp]"
             }]
          }]
      };
      var instances = await ec2.runInstances(instanceParams).promise();
      this.config.log(`Creating ${amount} Wasps Instances...`);

      var instanceIds = instances.Instances.map(x => x.InstanceId);
      var filter = {
        InstanceIds: instanceIds
      };

      await ec2.waitFor('instanceRunning', filter).promise();

      this.config.log('Saving Wasps Instances...');
      this.config.setWasps(instanceIds);

      if (!(await this.isHiveRunning()))
      {
        this.config.log('Hive not running...');
        await stopWaspsInstances();
      }
      this.config.log('Wasps Created and Running');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not aws'))
    }
  }

  async destoryWaspsInstances()
  {
    if (this.config.getType() == 'aws')
    {
      var ec2 = this._getEC2Instance();

      var filter = {
        InstanceIds: this.config.getWasps()
      };

      this.config.log('Destorying Wasps Instances');
      await ec2.terminateInstances(filter).promise();
      this.config.log('Waiting for Wasps...');
      await ec2.waitFor('instanceTerminated', filter).promise();
      this.config.log('Removing Wasps Instances from Config');
      this.config.setWasps([]);
      this.config.log('Wasps Destoryed');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not aws'))
    }
  }

  async createSecurityGroup()
  {
    if (this.config.getType() == 'aws')
    {
      var ec2 = this._getEC2Instance();
      var params = {
        Description: "Security group for WaspsWithBazookas",
        GroupName: "wasps-with-bazookas"
      };
      this.config.log('Creating Security Group');
      var
      {
        GroupId
      } = await ec2.createSecurityGroup(params).promise();
      console.log(GroupId)
      var params = {
        GroupId,
        IpPermissions: [
          {
            FromPort: 4268,
            IpProtocol: "tcp",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
                Description: "Wasps with Bazookas ports"
              }
             ],
            ToPort: 4269
            }
           ]
      };
      this.config.log('Updating Groups Ingress ports');
      await ec2.authorizeSecurityGroupIngress(params).promise();
      this.config.log('Saving Security Group');
      this.config.getAwsSecurityGroupIds().push(GroupId);
      this.config.saveConfig();
      this.config.log('Security Group Created');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not aws'))
    }

  }

  async updateHiveIp()
  {
    var ec2 = this._getEC2Instance();
    var filter = {
      InstanceIds: [this.config.getHive().instanceId]
    };
    this.config.log('Updating Hives Ip');
    var ip = await ec2.describeInstances(filter).promise();
    var hive = this.config.getHive();
    hive.ip = ip.Reservations[0].Instances[0].PublicIpAddress;
    this.config.setHive(hive);
  }

  async isHiveRunning()
  {
    var ec2 = this._getEC2Instance();

    var params = {
      InstanceIds: [
        this.config.getHive().instanceId
     ]
    };

    return (await ec2.describeInstanceStatus(params).promise()).InstanceStatuses[0].InstanceState.Name == 'running';
  }

  _getEC2Instance()
  {
    if (!this._ec2)
    {
      this._ec2 = new EC2(
      {
        apiVersion: '2016-11-15'
      });
    }
    return this._ec2;
  }

  _getUserDataScript()
  {
    return Buffer.from(`
      #!/bin/bash
      echo "export WWB_HIVE_IP="${this.config.getHive().ip}""
      echo "export WWB_HIVE_PORT="${this.config.getHive().port}""
    `).toString('base64')
  }

}

module.exports = Aws;
