var {execSync} = require("child_process");

// Get files that were modified in every commit of the event "push" to
// the "master" branch on GitHub/uwu-tech/Kind.
function get_modified_files(payload) {
  var content = [];
  try {
    payload["commits"].forEach(commit => {
      const modified = commit["modified"];
      const added    = commit["added"];
      const removed  = commit["removed"];
      content = modified.concat(added).concat(removed)
    });
    return content;
  } catch (e) {
    console.log("Error while getting modified files in the payload")
    console.log(e);
    return [];
  }
}

// Check if files inside dir "Kind/base/App" were changed
function is_App_updated(payload) {
  const content = get_modified_files(payload).filter(path => path.startsWith("base/App/"))
  return content.length > 0 ? true : false;
}

// Change dir to ../Kind and execute Kind/web/build.js
function rebuild_apps() {
  console.log("Rebuild apps in Kind/App");
  const res = execSync("node rebuild_apps");
  return res;
}

module.exports = { is_App_updated, rebuild_apps }