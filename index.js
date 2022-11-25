const express = require("express");
const qrcode = require("qrcode-terminal");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  console.log("msg: ", msg);
});

client.initialize();

app.get("/send", async (req, res) => {
  try {
    let { hp, msg } = req.query;
    hp = hp + "@c.us";

    const isReg = await client.isRegisteredUser(hp);

    if (isReg) {
      console.log("hp", hp);
      await client.sendMessage(hp, msg);

      res.json({ message: "Sending success" });
    } else {
      res.json({ message: "Phone number is not registered" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/logout", async (req, res) => {
  const resp = await client.logout();

  console.log(resp);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
