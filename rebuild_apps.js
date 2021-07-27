var { execSync } = require("child_process");
var { chdir, cwd } = require('process');

// TODO: 
// - Build only the app that changed

// OBS: Require to be in "master" branch
// Will pull updates from the master branch and compile the Apps
console.log(`Starting directory: ${cwd()}`);
try {
  chdir('../Kind/web');
  // pull_master();
  let app_name = process.argv[2];
  console.log(String(app_name ? build_apps(app_name) : build_apps()));
} catch (e) {
  console.error(e);
}

// Build apps from base/App
function build_apps(name = "") {
  console.log("[!] Building apps. This may take a while.\n");
  return execSync('node build '+name, function (error, stdout, stderr) {
    if(error) {
      console.log(error.stack);
    }
    stdout;
  });
}

// TODO: 
// - check if is branch master
// - check for conflict in pull
function pull_master() {
  cwd();
  return String(execSync("git pull"));
}
