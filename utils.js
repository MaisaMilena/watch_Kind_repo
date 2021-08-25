const { execSync } = require('child_process');
const { createHmac, timingSafeEqual } =  require('crypto');
var { chdir, cwd } = require('process');

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

const is_kind_folder = (folder = "") => cwd().endsWith("Kind"+folder);
const exec = (cmd) => console.log(String(execSync(cmd)));

// TODO: check if it is installed if not, trow an error. 
// Scheme is necessary to build App folders
function install_scheme_target() {
  console.log("> Installing Scheme ...");
  // let scheme_target = "kind-scm_1.0.1-0_amd64.deb";
  // console.log(execSync(`apt-get -d install ${scheme_target}`));
  // console.log(execSync(`dpkg -i ${scheme_target}`));
  exec("make");
  exec("sudo make install");
  exec("kind-scm");
}

const is_dev_env = () => {
  return process.env.ENV === "dev";
}

const get_kind_web_env = () => {
  return process.env.KIND_REPOSITORY_PATH+"/web";
}


module.exports = { get_modified_files, is_App_updated, verify_signature, is_folder, get_app_folder, get_app_name, install_scheme_target, is_kind_folder, exec, is_dev_env, get_kind_web_env}

