require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const db = require("./db");
const express = require("express");
const {
  setAReminder,
  myMenu,
  getAllAlerts,
  deleteReminder,
} = require("./utils");
const { deleteExpiredAlerts, checkAndSendAlerts } = require("./schedule");
const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World. The Server is running");
});

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.setWebHook(`https://remindmek-telegram-bot.onrender.com/${token}`);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userTextInAnyCase = msg.text;
  const userInput = userTextInAnyCase.toLowerCase();
  //   console.log(userInput);
  try {
    if (userInput == "/menu" || userInput == "/start") {
      myMenu(bot, chatId);
    } else if (userInput == "/add") {
      await setAReminder(bot, chatId);
    } else if (userInput == "/view") {
      await getAllAlerts(bot, chatId);
    } else if (userInput == "/delete") {
      await deleteReminder(bot, chatId);
    }
  } catch (error) {
    bot.sendMessage(chatId, "Error 404.");
  }
});

const cleanUpInterval = 24 * 60 * 60 * 1000; // Clean up once a day
setInterval(() => {
  deleteExpiredAlerts();
}, cleanUpInterval);

const interval = 60000; // Check every minute
setInterval(() => {
  checkAndSendAlerts(bot);
}, interval);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
