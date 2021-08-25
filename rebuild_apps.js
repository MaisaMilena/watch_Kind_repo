var { execSync } = require("child_process");
var { chdir, cwd } = require('process');
const { util } = require("webpack");
var utils = require('./utils');
require('dotenv/config');

// OBS: Require to be in "master" branch in Kind repository
// Will pull updates from the master branch and compile the Apps

function check_env() {
  console.log("> Checking environment");
  
  if (!(utils.is_kind_folder())) { 
    chdir(process.env.KIND_REPOSITORY_PATH+"/web");
    console.log("change dir to: ", cwd());
  }
  if(!process.env.DEV_ENV) {
    update_dependencies();
    console.log(pull_master());
  } else { console.log("[dev-env] will not update dependencies and pull master") }
}

// Build apps from Kind/base/App
// payload: sent from a webhook by GitHub
function build_modified_apps(payload) {
  let apps_to_rebuild = get_apps(payload);
  console.log("[!] Building apps. This may take a while.");
  console.log("-- "+new Date().toLocaleString('pt-BR')+" --\n");
  if (!(utils.is_kind_folder("/web"))) { 
    console.error("Couldn't change to Kind/web. This is required to build apps.")
  } else {
    apps_to_rebuild.forEach(app => {
      if (type_check_app(app)) {
        const res = execSync('node build '+app, function (error, stdout, stderr) {
            if(error) {
              console.log(error.stack);
            }
            stdout;
          });
        console.log(String(res));
      } else {
        got_build_error(app);
      }
    })
  }
}

// TODO: do something to re-establish the server
function got_build_error(app) {
  console.log("There is a type check error in "+app);
  console.log("- Check for the kind-lang and js-beautify global version.");
  console.log("- Update dependencies in Kind/web");
}

function update_dependencies() {
  console.log("Updating global: king-lang and js-beautify.");
  console.log("Updating Kind repo dependencies.");
  execSync('npm i -g kind-lang');
  execSync('npm i -g js-beautify');
  execSync('npm i');
}



// Get a list of Apps to be built based on modified files
function get_apps(payload) {
  let files = utils.get_modified_files(payload);
  var apps_name = new Set([]);
  files.forEach(file => {
    let app_name = utils.get_app_name(file);
    app_name ? apps_name.add(app_name) : apps_name
    });
  return apps_name;
}

// Uses Kind/web/type_check_Apps.js to type check an App before building it
function type_check_app(app_name) {
  const formatted = "base/App/"+app_name;
  try {
    return execSync('node type_check_Apps '+formatted, function (error, stdout, stderr) {
      if(error) {
        console.log(error.stack);
        return false;
      }
      console.log(stdout);
      return true;
    })
  } catch (e) {
    console.log(e);
    return false;
  }
}

// TODO: 
// - check if is branch master
// - check for conflict in pull
function pull_master() {
  console.log("Currently dir: ", cwd());
  console.log("[Kind repo] pull master");
  return String(execSync("git pull"));
}

module.exports = { build_modified_apps, check_env }