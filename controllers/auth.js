const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keyJwt = require('../config/keys').jwt;
const errorHandler = require('../utils/errorHandler');


module.exports.login = async function(req, res) {
  const candidate = await User.findOne({ email: req.body.email });
  if (candidate) {
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
    if (passwordResult) {
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keyJwt, { expiresIn: 3600 });
      res.status(200).json({token: `Bearer ${token}`})
    } else {
      res.status(401).json({message: "Неверный email или пароль"});
    }
  } else {
    res.status(404).json({message: `Пользователь с с email '${req.body.email}' не найден`});
  }
};

module.exports.register = async function(req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    res.status(409).json({
      message: `Пользователь с email '${candidate.email}' уже зарегистрирован`
    })
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    });
    try {
      await user.save();
      res.status(201).json(user);
    } catch (e) {
      errorHandler(e)
    }
  }
};
