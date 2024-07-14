require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require("express");
const schedule = require("node-schedule");
const chrono = require("chrono-node");
const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World. The Server is running");
});

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;

  try {
    if (userInput.toLowerCase().startsWith("set a reminder")) {
        parseAndScheduleReminder(chatId, text);
    } else {
      bot.sendMessage(
        chatId,
        'Please send a reminder in the format: "Set a reminder [reminder text] [date/time/month]"'
      );
    }
  } catch (error) {
    bot.sendMessage(chatId, "Reminder doesn't exist.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
