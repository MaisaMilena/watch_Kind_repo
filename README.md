# Watch Kind repository

This script is used in a server to watch [Kind](https://github.com/uwu-tech/Kind) repository.

- Receives notification from GitHub when `master` is updated
- Pull `master`, type check and build modified Apps in `Kind/base/App`

### 🐙 Pre-requirements:
- have a [webhook](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks) on [Kind](https://github.com/uwu-tech/Kind) repo setted up;
- Require to have this repo and Kind in the same root dir:
  ```
  root  
  |_ Kind (cloned repo)  
  |_ watch_kind_repo (cloned repo)
  ```
- Require to be in `master` branch in Kind repository;
- Route `on_push` is only available to be [used by GitHub](https://stripe.com/docs/webhooks/signatures);

#### Dependencies
- local `kind-lang` and `js-beautify` updated;
- local `Kind/web` dependencies updated;
> There is a function to force this update in `rebuild_apps.js`;

### 👩‍💻 Install:
- Clone this repo and Kind in the same root directory;
- Install the dependencies for each repo (`npm i`);
- Use `forever` or `tmux` to run `node watch_kind.js` on the server;

### 📝 TODO:
[x] Build only the app that changed  
[x] Only allow GitHub to use route `/on_push`  
[x] Automatically pull on every req on `/on_push`  
[ ] Check `master` is the current branch in Kind repo - required to pull
[ ] Recover from `failed` pull

🦄 In the future...  
[ ] Type check all Apps in `Kind/base` periodically  
[ ] Notify devs if something is wrong during the type check


 

