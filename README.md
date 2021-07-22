# Watch Kind repository

This script is used in a server to watch [Kind](https://github.com/uwu-tech/Kind) repository.

### Pre-requirements:
- have a [webhook](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks) on Kind setted up;

### Install:
- Clone this repo and Kind in the same directory;
- Use `forever` or `tmux` to run `node watch_kind.js` on the server;

### TODO:
[ ] Build only the app that changed  
[x] Only allow GitHub to use route `/on_push`  
[x] Automatically pull on every req on `/on_push`  
 

