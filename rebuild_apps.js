var fs = require("fs");
var {exec, execSync} = require("child_process");
var { chdir, cwd } = require('process');

// TODO: 
// - Build only the app that changed

// OBS: Require to be in "master" branch
// Will pull updates from the master branch and compile the Apps
console.log(`Starting directory: ${cwd()}`);
try {
  chdir('../Kind/web');
  console.log(String(execSync("git pull")));
  console.log(compile_apps(cwd()));
} catch (e) {
  console.error(e);
}

function compile_apps(kind_dir) {
  if (kind_dir.endsWith("Kind/web")) {
    console.log("[!] Compiling apps. This will take some time\n");
    return String(execSync("node build"));
  } else {
    throw new Error('Kind dir not found.');
  }
}
