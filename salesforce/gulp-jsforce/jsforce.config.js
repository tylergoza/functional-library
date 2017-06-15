var jsForceConfig = {
  //resimplifi shared test org
  credentials: [
    {
      //salesforce username
      username: 'elijah@resimplifi.dev',
      //salesforce password
      password: 'Science1',
      //salesforce security token
      token: 'IfbYNDwOiDxJvqFqpp7SDKPb'
    },
    {
      //salesforce username
      username: 'elijah@resimplifi.test',
      //salesforce password
      password: 'Science1',
      //salesforce security token
      token: 'cneiN8QObAJxi4n7v7o9nv3b3'
    }
    /*
    {
      //salesforce username
      username: 'elijah+resimplifipho@codescience.com',
      //salesforce password
      password: 'Science1',
      //salesforce security token
      token: 'WBiNwWda6UBiX8jR5eNE8hWd'
    }
   */
  ],

  //name of bundle on salesforce
  //name MUST NOT have any period characters
  bundleName: 'resource',
  paths: { //TODO: not supported yet
    //directory JS build tools target
    buildDir: './dist',
    //used by gulp to set base directory option
    baseDir: '.',
    //directory to store files for server (probably in)
    bundleDir: './staticResources',
    //directory of project (used to push project)
    projectDir: '../../project'
  },
  //TODO: not supported (might not be needed)
  //filetypes to upload
  fileTypes: 'all' //grab all filetypes in buildSrc
  /* you may whitelist specific filetypes if desired
  [ 'css', 'js', 'png' ]
  */
};

module.exports = jsForceConfig;
