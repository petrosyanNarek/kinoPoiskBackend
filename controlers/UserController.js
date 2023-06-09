const passport = require("passport");
const { User, Admin } = require("../models");
const bcrypt = require("bcrypt");

class UserController {
  static async addUser(req, res) {
    const us = req.body;
    const userFind = await User.findOne({ where: { email: us.email } });
    if (userFind) {
      res.status(400).send({ message: "Email alredy used!" });
    } else {
      us.password = await bcrypt.hash(us.password, 10);
      try {
        await User.create({ ...us });
        res.status(200).send("You have successfully registered");
      } catch (e) {
        console.log(e);
        res.status(500).send("Networ error");
      }
    }
  }

  static async GetUser(req, res) {
    if (req.body.id) {
      const user = await User.findOne({
        attributes: ["id", "fullName", "email"],
        where: { id: req.body.id },
      });
      if (user) {
        res.status(200).send({ user: user ? user : {} });
      } else {
        res.status(200).send({ user: null });
      }
    } else {
      res.status(200).send({ user: {} });
    }
  }

  static async LoginCheck(email, password, done) {
    let user = await User.findOne({ where: { email: email } });
    if (!user) {
      return done("The email is incorrect", false);
    }

    let result = await bcrypt.compare(password, user.password);
    if (!result) {
      return done("The password is incorrect", false);
    }

    return done(null, user);
  }
  static Login(req, res, next) {
    passport.authenticate("user", function (err, user, info) {
      if (user) {
        req.logIn(user, (err) => {
          if (err) {
            res.send({ error: "Something went wrong" });
          }
          const { id, name, surname, email } = req.user;
          res.send({ verify: true, user: { id, name, surname, email } });
        });
      } else {
        res.send({ error: err });
      }
    })(req, res, next);
  }
  static Logout(req, res) {
    req.logout();
    res.send({ status: "OK" });
  }
}
module.exports = { UserController };
