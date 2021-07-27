var {execSync} = require("child_process");
const { createHmac, timingSafeEqual, sign } =  require('crypto');
require('dotenv/config');

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

// Check if files inside "Kind/base/App" on branch "master" have been modified
function is_App_updated(payload) {
  if (is_branch("master", payload) || is_branch("main", payload)) {
    const content = get_modified_files(payload).filter(path => path.startsWith("base/App/"))
    return content.length > 0 ? true : false;
  } else {
    return false;
  }
}

// Returns true if the payload is from "branch"
function is_branch(branch, payload) {
  const current_branch = payload["ref"]
  return current_branch.endsWith(branch)
}

// Change dir to ../Kind and execute Kind/web/build.js
function rebuild_apps() {
  console.log("Rebuild apps in Kind/App");
  const res = execSync("node rebuild_apps");
  return res;
}

function create_comparison_signature(body) {
  const hmac = createHmac('sha256', process.env.SECRET_TOKEN);
  const self_signature = hmac.update(JSON.stringify(body)).digest('hex');
  return `sha256=${self_signature}`; // shape in GitHub header
}

function compare_signatures(signature, comparison_signature) {
  const source = Buffer.from(signature);
  const comparison = Buffer.from(comparison_signature);
  return timingSafeEqual(source, comparison); // constant time comparison
}

function verify_signature(github_sig, body) {
  const comparison_signature = create_comparison_signature(body);
  try {
    return compare_signatures(github_sig, comparison_signature);
  } catch (e) {
    return false;
  }
}

module.exports = { is_App_updated, rebuild_apps, rebuild_app, verify_signature }