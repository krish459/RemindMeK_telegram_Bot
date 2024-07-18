const usersModel = require("./models/usersModel");

const addUsers = async (bot, chatId, userName) => {
  try {
    const check = await usersModel.find({ chatId: chatId });
    //   console.log(check.length);

    if (check.length == 0) {
      const user = new usersModel({
        chatId: chatId,
        name: userName,
      });

      await user.save();
      bot.sendMessage(chatId, `Welcome to Remind Me ${userName}`);
    }
  } catch (error) {
    console.error("Error adding user:", error);
    bot.sendMessage(
      chatId,
      "An error occurred while adding you. Please try again later."
    );
  }
};

module.exports = {
  addUsers,
};
