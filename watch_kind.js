const express = require('express');
const body_parser = require("body-parser");
const utils = require("./utils");

const app = express();
const port = 3000;

app.use(body_parser.json());

app.get('/', (req, res) => {
  res.send('Hello from Belanna and Neelix!')
})
// TODO: pull on every push
// This route is used by Github on every "push" to Github/uwu-tech/Kind
// Read more: https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks
app.post('/on_push', (req, res) => {
  let sig = req.get("X-Hub-Signature-256");
  console.log(sig);
  if (utils.verify_signature(sig, req.body)) {
    let rebuild_apps = utils.is_App_updated(req.body);
    if (rebuild_apps) {
      const res = utils.rebuild_apps().toString();
      console.log(res);
    } else {
      console.log("There isn't app to rebuild");
    }
    res.status(200).end();
  } else {
    res.status(401).send("Unauthorized request. Verify if GitHub webhook is correctly configured.");
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

