const DigitalOceanAPI = require('do-wrapper').default;

class DigitalOcean
{
  constructor(config)
  {
    this.config = config;
  }

  setInstanceToDigitalOcean()
  {
    this.config.setInstance('digitalocean',
    {
      port: 80
    }, [])
  }

  async startHiveInstance()
  {
    if (this.config.getType() == 'digitalocean')
    {
      return new Error('This method is not yet complete.')
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not digitalocean'))
    }
  }

  async stopHiveInstance()
  {
    if (this.config.getType() == 'digitalocean')
    {
      return new Error('This method is not yet complete.')
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not digitalocean'))
    }
  }

  async createHiveInstance(region)
  {
    if (this.config.getType() == 'digitalocean' && this.config.getDOImages())
    {
      var DO = this._getDOInstance();
      var ssh_keys = (await DO.accountGetKeys()).body.ssh_keys.map(x => x.id);
      var instanceParams = {
        "name": "WaspsWithBazookas-Hive",
        "region": "nyc1",
        "size": "s-1vcpu-1gb",
        "image": this.config.getDOImages().hive,
        "ssh_keys": ssh_keys,
        "backups": false,
        "private_networking": true,
        "tags": [
          "wwb",
          "hive"
        ]
      };
      var instance = (await DO.dropletsCreate(instanceParams)).body;
      this.config.log(`Creating Hive Instance...`);

      var instanceId = instance.droplet.id;


      await this._waitForComplete(instance.links.actions[0].id);

      this.config.log('Saving Hive Instances...');
      var hive = this.config.getHive();
      hive.instanceId = instanceId;
      this.config.setHive(hive);

      await this.updateHiveIp();

      this.config.log('Hive Created and Running');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not digitalocean'))
    }
  }

  async destoryHiveInstance()
  {
    if (this.config.getType() == 'digitalocean')
    {
      var DO = this._getDOInstance();
      this.config.log('Destorying Hive Instances');
      await DO.dropletsDelete(this.config.getHive().instanceId)
      this.config.log('Removing Hive Instances from Config');
      this.config.setHive(
      {
        ip: '127.0.0.1',
        port: 80,
        instanceId: null
      });
      this.config.log('Hive Destoryed');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not digitalocean'))
    }
  }

  async startWaspsInstances()
  {
    if (this.config.getType() == 'digitalocean')
    {
      return new Error('This method is not yet complete.')
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not digitalocean'))
    }
  }

  async stopWaspsInstances()
  {
    if (this.config.getType() == 'digitalocean')
    {
      return new Error('This method is not yet complete.')
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not digitalocean'))
    }
  }

  async createWaspsInstances(amount)
  {
    if (this.config.getType() == 'digitalocean' && this.config.getDOImages())
    {
      var DO = this._getDOInstance();

      var ssh_keys = (await DO.accountGetKeys()).body.ssh_keys.map(x => x.id);
      var names = [];

      for (var i = 0; i < amount; i++)
      {
        names.push("WaspsWithBazookas-Wasp-" + (i + 1));
      }
      var instanceParams = {
        "names": names,
        "region": "nyc1",
        "size": "s-1vcpu-1gb",
        "image": this.config.getDOImages().wasp,
        "ssh_keys": ssh_keys,
        "backups": false,
        "user_data": this._getUserDataScript(),
        "private_networking": true,
        "tags": [
          "wwb",
          "hive"
        ]
      };
      var instances = (await DO.dropletsCreate(instanceParams)).body;
      this.config.log(`Creating ${amount} Wasps Instances...`);

      var instanceIds = instances.droplets.map(x => x.id);
      await this._waitForComplete(instances.links.actions[0].id + 1); // Have to add +1 min due to a bug with their API.


      this.config.log('Saving Wasps Instances...');
      this.config.setWasps(instanceIds);

      // if (!(await this.isHiveRunning()))
      // {
      //   this.config.log('Hive not running...');
      //   await stopWaspsInstances();
      // }
      this.config.log('Wasps Created and Running');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not digitalocean'))
    }
  }

  async destoryWaspsInstances()
  {
    if (this.config.getType() == 'digitalocean')
    {
      var DO = this._getDOInstance();

      this.config.log('Destorying Wasps Instances');
      var wasps = this.config.getWasps()
      for (var i = 0; i < wasps.length; i++)
      {
        await DO.dropletsDelete(wasps[i]);
      }
      this.config.log('Removing Wasps Instances from Config');
      this.config.setWasps([]);
      this.config.log('Wasps Destoryed');
    }
    else
    {
      return Promise.reject(new Error('Config instance type is not digitalocean'))
    }
  }

  async updateHiveIp()
  {
    var DO = this._getDOInstance();

    this.config.log('Updating Hives Ip.');
    var ip = (await DO.dropletsGetById(this.config.getHive().instanceId)).body.droplet;

    var hive = this.config.getHive();
    hive.ip = ip.networks.v4[0].ip_address;
    this.config.log('Hives Ip: ' + hive.ip);
    this.config.setHive(hive);
  }

  async isHiveRunning()
  {
    // var DO = this._getDOInstance();
    //
    // var params = {
    //   InstanceIds: [
    //     this.config.getHive().instanceId
    //  ]
    // };
    //
    // return (await DO.describeInstanceStatus(params).promise()).InstanceStatuses[0].InstanceState.Name == 'running';
  }

  _getDOInstance()
  {
    if (!this._do)
    {
      this._do = new DigitalOceanAPI(this.config.getDOAPIKey());
    }
    return this._do;
  }

  _getUserDataScript()
  {
    return Buffer.from(`
      #!/bin/bash
      echo "export WWB_HIVE_IP="${this.config.getHive().ip}""
      echo "export WWB_HIVE_PORT="${this.config.getHive().port}""
    `).toString('ascii')
  }

  _waitForComplete(actionId)
  {
    return new Promise((resolve, reject) =>
    {
      var DO = this._getDOInstance();
      var int = setInterval(async () =>
      {
        try
        {
          var progress = (await DO.accountGetAction(actionId)).body;
          if (progress.action.status == 'completed')
          {
            resolve(true);
            clearInterval(int);
          }
          else if (progress.action.status == 'errored')
          {
            reject(false);
            clearInterval(int);
          }
        }
        catch (e)
        {
          console.log(e, actionId)
          actionId++;
        }

      }, 1000)
    })
  }
}

module.exports = DigitalOcean;
