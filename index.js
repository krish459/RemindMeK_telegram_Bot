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
const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World. The Server is running");
});

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
