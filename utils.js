const { createHmac, timingSafeEqual } =  require('crypto');
require('dotenv/config');

// Get files that were modified in every commit of the event "push" to
// the "master" branch on GitHub/uwu-tech/Kind.
// Return modified files or empty array
function get_modified_files(payload) {
  var content = [];
  try {
    payload["commits"].forEach(commit => {
      const modified = commit["modified"];
      const added    = commit["added"];
      content = content.concat(modified.concat(added));
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
  try {
    const current_branch = payload["ref"]
    return current_branch.endsWith(branch)
  } catch (e) {
    console.log(e);
    return false;
  }
}

// TODO: will be used in the future
// Change dir to ../Kind and execute Kind/web/build.js to build all apps
function rebuild_apps(payload) {
  console.log("Rebuild ALL apps in Kind/App");
  let mod_apps = get_modified_Apps(get_modified_files(payload));

  // const res = execSync("node rebuild_apps");
  // return res;
}

function get_modified_Apps(files) {
  console.log("Modified files: ", files);
  return [];
}

function is_folder(path) {
  let folders = path.split("/");
  return (folders.length > 2) && (!folders[2].endsWith(".kind"));
}

function get_app_folder(path) {
  return path.split("/")[2];
}

function is_app(path){
  return path.startsWith("base/App/");
}

function get_app_name(path) {
  let name = get_app_folder(path);
  return is_app(path) 
    ? name.endsWith(".kind") ? name : name+".kind"
    : "";
}

function create_comparison_signature(body) {
  try {
    const hmac = createHmac('sha256', process.env.SECRET_TOKEN);
    const self_signature = hmac.update(JSON.stringify(body)).digest('hex');
    return `sha256=${self_signature}`; // shape in GitHub header
  } catch (e) {
    return "";
  }
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

module.exports = { get_modified_files, is_App_updated, rebuild_apps, verify_signature, 
  is_folder, get_app_folder, get_app_name}