const regexpValidation = require("./regexpValidation");

const a = { name: "Janna", surname: "Klike", info: "birt of 2014" };

module.exports = {
  add: (tableName) => {
    return {
      name: {
        in: ["body"],
        errorMessage: "Name is wrong",
        matches: {
          options: regexpValidation.firstName.reg,
          errorMessage: regexpValidation.firstName.message,
        },
        trim: true,
        isLength: {
          options: { min: 3, max: 20 },
          errorMessage: ` ${tableName} name must be between 3
           and 20 haracters`,
        },
      },
      surname: {
        in: ["body"],
        errorMessage: "Surname is wrong",
        matches: {
          options: regexpValidation.lastName.reg,
          errorMessage: regexpValidation.lastName.message,
        },
        trim: true,
        isLength: {
          options: { min: 3, max: 20 },
          errorMessage: ` ${tableName} lastname must be between 3
           and 20 characters`,
        },
      },
      info: {
        in: ["body"],
        errorMessage: "Info is wrong",
        trim: true,
        isString: true,
        errorMessage: "Info is not valid text",
        isLength: {
          options: { min: 3, max: 50 },
          errorMessage: ` ${tableName} lastname must be between 3
           and 50 characters`,
        },
      },
    };
  },
  eddit: (tableName) => {
    return {
      name: {
        in: ["body"],
        errorMessage: "Name is wrong",
        matches: {
          options: regexpValidation.firstName.reg,
          errorMessage: regexpValidation.firstName.message,
        },
        trim: true,
        isLength: {
          options: { min: 3, max: 20 },
          errorMessage: ` ${tableName} name must be between 3
           and 20 haracters`,
        },
      },
      surname: {
        in: ["body"],
        errorMessage: "Surname is wrong",
        matches: {
          options: regexpValidation.lastName.reg,
          errorMessage: regexpValidation.lastName.message,
        },
        trim: true,
        isLength: {
          options: { min: 3, max: 20 },
          errorMessage: ` ${tableName} lastname must be between 3
           and 20 characters`,
        },
      },
      info: {
        in: ["body"],
        errorMessage: "Info is wrong",
        trim: true,
        isString: true,
        errorMessage: "Info is not valid text",
        isLength: {
          options: { min: 3, max: 50 },
          errorMessage: ` ${tableName} lastname must be between 3
           and 50 characters`,
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
