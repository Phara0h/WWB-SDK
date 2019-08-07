const fs = require('fs');

class Config
{
  constructor(config)
  {
    this.log = config.log ? config.log : console.log;

    if (config.path)
    {
      this.path = require('path').resolve(config.path);
      this.config = require(this.path);
    }

    if (!this.config)
    {
      this.log('No config generating default one');

      this.path = require('path').dirname(require.main.filename);
      this.config = require(pwd + '/../config/default.json');
      this.path += '/../config/config.json';

      this.saveConfig();
    }
  }

  setInstance(type, hive, wasps)
  {
    this.config.instance = {
      type,
      hive,
      wasps
    }
    this.saveConfig();
  }

  saveConfig()
  {
    this.log('Saving Config');
    fs.writeFileSync(this.path, JSON.stringify(this.config, null, 4));
  }

  getType()
  {
    try
    {
      return this.config.instance.type;
    }
    catch (e)
    {
      return null;
    }
  }

  getHive()
  {
    try
    {
      return this.config.instance.hive;
    }
    catch (e)
    {
      return null;
    }
  }

  setHive(hive)
  {
    try
    {
      this.config.instance.hive = hive;
      this.saveConfig();
      return this.config.instance.hive;
    }
    catch (e)
    {
      return null;
    }
  }

  getHivePath()
  {
    try
    {
      return `http://${this.config.instance.hive.ip}:${this.config.instance.hive.port}/`
    }
    catch (e)
    {
      return null;
    }
  }

  getWasps()
  {
    try
    {
      return this.config.instance.wasps;
    }
    catch (e)
    {
      return null;
    }
  }

  setWasps(wasps)
  {
    try
    {
      this.config.instance.wasps = wasps
      this.saveConfig();
      return this.config.instance.wasps;
    }
    catch (e)
    {
      return null;
    }
  }

  getAwsAmi()
  {
    try
    {
      return this.config.settings.aws.ami;
    }
    catch (e)
    {
      return null;
    }
  }

  getAwsSecurityGroupIds()
  {
    try
    {
      return this.config.settings.aws.securityGroupIds;
    }
    catch (e)
    {
      return null;
    }
  }



}

module.exports = Config;
