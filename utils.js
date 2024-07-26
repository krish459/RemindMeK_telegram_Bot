const AlertsModel = require("./models/alertsModel");
const { convertISTtoUTCfunction } = require("./timeZoneConv");

const myMenu = (bot, chatId) => {
  const menuList = `
Welcome to RemindMe Bot! Here are the commands you can use:

1. Show Menu:
   Type /menu to display this menu again.

2. Set a Reminder:
   Type /add to set a reminder.

3. Show My Reminders:
   Type /view to view all your reminders.

4. Delete a Reminder:
   Type /delete my reminders to view all your reminders.

Feel free to ask me to set, show, or cancel reminders anytime!!
  `;
  bot.sendMessage(chatId, menuList);
};

const setAReminder = async (bot, chatId) => {
  try {
    const reminderText = await new Promise((resolve) => {
      bot.sendMessage(chatId, "Please enter the reminder text:");
      bot.once("message", (msg) => resolve(msg.text));
    });

    const reminderDate = await new Promise((resolve, reject) => {
      bot.sendMessage(chatId, 'Please enter the date in format "dd/mm/yyyy":');
      bot.once("message", (msg) => {
        const dateParts = msg.text.split("/");
        const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
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
          if (period.toLowerCase() === "pm" && hours < 12) hours += 12;
          if (period.toLowerCase() === "am" && hours === 12) hours = 0;
          resolve({ hours, minutes });
        }
      });
    });

    reminderDate.setHours(reminderTime.hours, reminderTime.minutes);
    const utcTime = convertISTtoUTCfunction(reminderDate);
    // console.log(`UTC Time: ${utcTime}`);
    // console.log(`UTC Time iso: ${utcTime.toISOString()}`);

    if (!utcTime) {
      bot.sendMessage(chatId, "Invalid date or time format.");
    } else {
      const newAlert = new AlertsModel({
        chatId: chatId,
        alertMessage: reminderText,
        alertDateTime: utcTime,
      });

      await newAlert.save();
      bot.sendMessage(
        chatId,
        `Reminder set for ${reminderDate.toLocaleString()}:\n\nReminder Text: ${reminderText}`
      );
    }
  } catch (error) {
    bot.sendMessage(chatId, error.message);
  }
};

const getAllAlerts = async (bot, chatId) => {
  try {
    const reminders = await AlertsModel.find({ chatId: chatId }).sort({
      alertDateTime: 1,
    });

    if (reminders.length === 0) {
      bot.sendMessage(chatId, "You have no alerts.");
      return;
    }

    let message = "Here are all your alerts:\n\n";
    reminders.forEach((alert, index) => {
      message += `${index + 1}. ${alert.alertMessage} - ${new Date(
        alert.alertDateTime
      ).toLocaleString()}\n`;
    });

    bot.sendMessage(chatId, message);
  } catch (error) {
    bot.sendMessage(chatId, "An error occurred while fetching your alerts.");
    console.error(error);
  }
};

const deleteReminder = async (bot, chatId) => {
  try {
    const reminders = await AlertsModel.find({ chatId: chatId }).sort({
      alertDateTime: 1,
    });

    if (reminders.length === 0) {
      bot.sendMessage(chatId, "You have no alerts to delete.");
      return;
    }

    let message = "Here are all your alerts:\n\n";
    reminders.forEach((alert, index) => {
      message += `${index + 1}. ${alert.alertMessage} - ${new Date(
        alert.alertDateTime
      ).toLocaleString()}\n`;
    });
    message += "\nPlease enter the number of the reminder you want to delete:";

    bot.sendMessage(chatId, message);

    bot.once("message", async (msg) => {
      const reminderNumber = parseInt(msg.text, 10);

      if (
        isNaN(reminderNumber) ||
        reminderNumber < 1 ||
        reminderNumber > reminders.length
      ) {
        bot.sendMessage(chatId, "Invalid number. Please try again.");
        return;
      }

      const reminderToDelete = reminders[reminderNumber - 1];
      await AlertsModel.deleteOne({ _id: reminderToDelete._id });

      bot.sendMessage(chatId, "Reminder deleted successfully.");
    });
  } catch (error) {
    bot.sendMessage(chatId, "An error occurred while deleting the reminder.");
    console.error(error);
  }
};

module.exports = {
  setAReminder,
  myMenu,
  getAllAlerts,
  deleteReminder,
};
