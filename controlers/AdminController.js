const passport = require("passport");
const { User, Admin } = require("../models");
const bcrypt = require("bcrypt");

class AdminController {
  static async newAdmin(req, res) {
    const us = req.body;
    const userFind = await Admin.findOne({ where: { email: us.email } });
    if (userFind) {
      res.send(false);
    } else {
      us.password = await bcrypt.hash(us.password, 10);
      await Admin.create({ ...us });
      res.send(true);
    }
  }

  static async getAdmin(req, res) {
    if (req.body.id) {
      const user = await Admin.findOne({ where: { id: req.body.id } });
      if (user) {
        const { id, name, surname, email, verify } = user;
        res
          .status(200)
          .send({ user: user ? { id, name, surname, email, verify } : {} });
      } else {
        res.status(200).send({ user: null });
      }
    } else {
      res.status(200).send({ user: {} });
    }
  }

  static async loginCheck(email, password, done) {
    let user = await Admin.findOne({ where: { email: email } });
    if (!user) {
      return done("The email is incorrect", false);
    }

    let result = await bcrypt.compare(password, user.password);
    if (!result) {
      return done("The password is incorrect", false);
    }

    return done(null, user);
  }
  static login(req, res, next) {
    passport.authenticate("admin", function (err, user, info) {
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
  static logout(req, res) {
    req.logout();
    res.send({ status: "OK" });
  }
}
module.exports = { AdminController };
