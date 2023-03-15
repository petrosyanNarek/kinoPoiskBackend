module.exports = (sequelize, Sequelize) => {
  const Genre = sequelize.define(
    "genres",
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
  return Genre;
};
