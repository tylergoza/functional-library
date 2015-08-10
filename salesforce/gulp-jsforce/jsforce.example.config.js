var jsForceConfig = {
  //You may have multiple user credentials
  //the FIRST credential object is the default account
  credentials: [
    {
      //salesforce username
      username: '',
      //salesforce password
      password: '',
      //salesforce security token
      token: ''
    }
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
