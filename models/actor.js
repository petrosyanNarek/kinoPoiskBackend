module.exports = (sequelize, Sequelize) => {
  const Actor = sequelize.define(
    "actors",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      info: {
        type: Sequelize.TEXT,
      },
      img: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return Actor;
};
