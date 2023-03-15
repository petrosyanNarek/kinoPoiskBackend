module.exports = (sequelize, Sequelize) => {
  const Country = sequelize.define(
    "countries",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return Country;
};
