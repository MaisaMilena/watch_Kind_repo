const express = require('express');
const body_parser = require("body-parser");
const utils = require("./utils");
const rebuild = require("./rebuild_apps");
require('dotenv/config');

const app = express();
const port = process.env.PORT;

app.use(body_parser.json());

app.get('/', (req, res) => {
  res.send('Hello from Belanna and Neelix!')
})

// This route is used by Github on every "push" to Github/uwu-tech/Kind
// Read more: https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks
app.post('/on_push', (req, res) => {
  const sig = req.get("X-Hub-Signature-256");
  if (utils.verify_signature(sig, req.body) || utils.is_dev_env()) {
    let rebuild_apps = utils.is_App_updated(req.body);
    if (rebuild_apps) {
      rebuild.check_env();
      rebuild.build_modified_apps(req.body);
    } else {
      console.log("There isn't app to rebuild");
    }
    res.status(200).end();
  } else {
    res.status(401).send("Unauthorized request. Verify if GitHub webhook is correctly configured.");
  }
})

app.listen(port, () => {
  console.log(`Listening Kind repo on: ${port}`)
})

