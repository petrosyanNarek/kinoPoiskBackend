const { name } = require("./regexpValidation");

module.exports = {
  add: (tableName, minLength, reg) => {
    console.log(tableName, minLength, reg);
    return {
      name: {
        in: ["body"],
        matches: {
          options: reg?.test || name.reg,
          errorMessage: reg?.message || name.message,
        },
        trim: true,
        isLength: {
          options: { min: minLength || 3, max: 20 },
          errorMessage: ` ${tableName} must be between ${
            minLength || 3
          } and 20 haracters`,
        },
      },
    };
  },
  eddit: (tableName, minLength, reg) => {
    return {
      name: {
        in: ["body"],
        matches: {
          options: reg?.test || name.reg,
          errorMessage: reg?.message || name.message,
        },
        trim: true,
        isLength: {
          options: { min: minLength || 3, max: 20 },
          errorMessage: ` ${tableName} must be between ${
            minLength || 3
          } and 20 characters`,
        },
      },
      id: {
        in: ["body"],
        errorMessage: "ID is wrong",
        isInt: true,
        toInt: true,
      },
    };
  },
};
