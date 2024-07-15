const schedule = require("node-schedule");
const chrono = require("chrono-node");

const myMenu = (bot, chatId) => {
  const menuList = `
Welcome to RemindMe Bot! Here are the commands you can use:

1. Show Menu:
   Type "menu" to display this menu again.

2. Set a Reminder:
   Type "set a reminder" to set a reminder.

3. Show My Reminders:
   Type "show my reminders" to view all your reminders.

Feel free to ask me to set, show, or cancel reminders anytime!
  `;
  bot.sendMessage(chatId, menuList);
};

const setAReminder = async (bot, chatId) => {
  try {
    const reminderText = await new Promise((resolve) => {
      bot.sendMessage(chatId, "Please enter the reminder text:");
      bot.once("message", (msg) => {
        resolve(msg.text);
      });
    });

    const reminderDate = await new Promise((resolve, reject) => {
      bot.sendMessage(chatId, 'Please enter the date in format "dd/mm/yyyy":');
      bot.once("message", (msg) => {
        const dateParts = msg.text.split("/");
        const date = new Date(
          `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        );
        if (isNaN(date.getTime())) {
          reject(
            'Invalid date format. Please enter the date in format "dd/mm/yyyy":'
          );
        } else {
          resolve(date);
        }
      });
    });

    const reminderTime = await new Promise((resolve, reject) => {
      bot.sendMessage(chatId, 'Please enter the time in format "hh:mm am/pm":');
      bot.once("message", (msg) => {
        const timeParts = msg.text.match(/(\d{1,2}):(\d{2})\s?(am|pm)/i);
        if (!timeParts) {
          reject(
            'Invalid time format. Please enter the time in format "hh:mm am/pm":'
          );
        } else {
          let [_, hours, minutes, period] = timeParts;
          hours = parseInt(hours, 10);
          minutes = parseInt(minutes, 10);

          if (period.toLowerCase() === "pm" && hours < 12) {
            hours += 12;
          } else if (period.toLowerCase() === "am" && hours === 12) {
            hours = 0;
          }
          resolve({ hours, minutes });
        }
      });
    });

    reminderDate.setHours(reminderTime.hours, reminderTime.minutes);

    if (isNaN(reminderDate.getTime())) {
      bot.sendMessage(chatId, "Invalid date or time format.");
    } else {
      // scheduleReminder(bot, chatId, reminderText, reminderDate);
      console.log(reminderText, reminderDate);
      bot.sendMessage(
        chatId,
        `Reminder set for ${reminderDate.toLocaleString()}: ${reminderText}`
      );
    }
  } catch (error) {
    bot.sendMessage(chatId, error);
  }
};

module.exports = {
  setAReminder,
  myMenu,
};
