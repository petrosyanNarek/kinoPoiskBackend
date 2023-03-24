const { text } = require("./regexpValidation");

module.exports = {
  add: (name, minLength, reg) => {
    console.log(name, minLength, reg);
    return {
      name: {
        in: ["body"],
        matches: {
          options: reg?.test || text,
          errorMessage:
            reg?.message ||
            "Only alphabets are allowed and first letter must been to upper case",
        },
        trim: true,
        isLength: {
          options: { min: minLength || 3, max: 20 },
          errorMessage: ` ${name} must be between ${
            minLength || 3
          } and 20} characters`,
        },
      },
    };
  },
  eddit: (name, minLength, maxLength, reg) => {
    return {
      name: {
        in: ["body"],
        matches: {
          options: reg?.test || text,
          errorMessage:
            reg?.message ||
            "Only alphabets are allowed and first letter must been to upper case",
        },
        trim: true,
        isLength: {
          options: { min: minLength || 3, max: 20 },
          errorMessage: ` ${name} must be between ${
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
