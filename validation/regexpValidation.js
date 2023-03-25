module.exports = {
  name: {
    reg: /^[A-Z][a-z]*$/,
    message:
      "Only alphabets of name are allowed and first letter must been to upper case",
  },
  country: {
    reg: /^[A-Za-z\s\-\(\)\.,]*$/,
    message: "Not valid country name",
  },
  firstName: {
    reg: /^[A-Z][\p{L}\p{M}'-]+$/u,
    message: "Is not valid in person name ",
  },
  lastName: {
    reg: /^[\p{Lu}\p{Lt}][\p{L}\p{M}'-]+$/u,
    message: "Is not valid in person surname",
  },
  email: {
    reg: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Not valid type of email",
  },
  password: {
    reg: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    message:
      "The password must be at least 8 characters long, must contain at least one lowercase letter, one uppercase letter, and one digit, and the special characters @$!%*?&",
  },
};
