module.exports = (date) => {
  const tday = new Date();
  const tdayToHourse =
    tday.getFullYear() * 365 * 24 +
    tday.getMonth() * 29 * 24 +
    tday.getDay() * 24 +
    tday.getHours() +
    tday.getMinutes() / 60 +
    tday.getSeconds() / 3600;
  const dateToHourse =
    date.getFullYear() * 365 * 24 +
    date.getMonth() * 29 * 24 +
    date.getDay() * 24 +
    date.getHours() +
    date.getMinutes() / 60 +
    date.getSeconds() / 3600;
  return tdayToHourse >= dateToHourse + 24;
};
