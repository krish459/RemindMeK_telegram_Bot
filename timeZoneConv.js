const convertISTtoUTCfunction = (reminderDate) => {
  let localDateTime = reminderDate;
  //   console.log("localDateTime.getTime(): ", localDateTime.getTime());
  // IST offset is +5:30, so we subtract this to get UTC
  const istOffsetMinutes = 5 * 60 + 30; // 5 hours 30 minutes
  localDateTime = new Date(
    localDateTime.getTime() - istOffsetMinutes * 60 * 1000
  );

  return localDateTime;
};

module.exports = {
  convertISTtoUTCfunction,
};
