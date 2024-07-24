const AlertsModel = require("./models/alertsModel");
const moment = require("moment-timezone");
const { timeZone } = require("./utils");

const sendVoiceReminder = async (bot, chatId, reminderText) => {
  try {
    audioFilePath = "assets\\audio\\notificationTune.wav";
    await bot.sendMessage(chatId, `🔔 **Reminder** 🔔\n\n${reminderText}`);

    // await bot.sendVoice(chatId, audioFilePath);
  } catch (error) {
    console.error("Error sending voice reminder :", error);
  }
};

const checkAndSendAlerts = async (bot) => {
  // Get the current time in the specified time zone
  // const localTime = moment().tz(timeZone).format();
  const now = new Date();
  const utcNowDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  console.log("now date: ", now);
  console.log("utc now date: ", utcNowDate);
  console.log("utc now date: ISO ", utcNowDate.toISOString());
  console.log("offset: ", now.getTimezoneOffset());

  try {
    // Find alerts that are due and not yet sent
    const dueAlerts = await AlertsModel.find({
      alertDateTime: { $lte: utcNowDate },
      sent: false,
    });

    for (const alert of dueAlerts) {
      await sendVoiceReminder(bot, alert.chatId, alert.alertMessage);
      alert.sent = true;
      await alert.save();
    }
  } catch (error) {
    console.error("Error checking and sending alerts:", error);
  }
};

const deleteExpiredAlerts = async () => {
  const now = new Date().toISOString();
  try {
    // Delete alerts that were sent more than a day ago
    const result = await AlertsModel.deleteMany({
      alertDate: { $lte: now },
      sent: true,
      updatedAt: { $lte: new Date(now - 24 * 60 * 60 * 1000) }, // 24 hours ago
    });

    console.log(`Deleted ${result.deletedCount} old alerts.`);
  } catch (error) {
    console.error("Error deleting old alerts:", error);
  }
};

module.exports = {
  sendVoiceReminder,
  deleteExpiredAlerts,
  checkAndSendAlerts,
};
