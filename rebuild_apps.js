var fs = require("fs");
var {exec, execSync} = require("child_process");
var { chdir, cwd } = require('process');

// TODO: 
// - Build only the app that changed

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('../Kind/web');
  var kind_dir = cwd(); 
  if (kind_dir.endsWith("Kind/web")) {
    console.log("[!] Compiling apps. This will take some time\n");
    var code = String(execSync("node build"));
    console.log(code);
  } else {
    throw new Error('Kind dir not found.');
  }
} catch (e) {
  console.error(e);
}