const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
    console.log(req.body);
    const candidate = await User.findOne({
        email: req.body.email
    });

    if (candidate) {
        //Проверка пароля
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
        if (passwordResult) {
            //Генерация токена, пароли совпали

            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60});
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            //Пароли не совпали, ошибка
            res.status(401).json({
                message: 'Wrong password!'
            })
        }
    } else {
        //Пользователя нет, ошибка
        res.status(404).json({
            message: 'User not found'
        })
    }
};

module.exports.register = async function (req, res) {
    //email password
    const candidate = await User.findOne({
        email: req.body.email
    });

    if (candidate) {
        //Пользователь существует - ошибка
        res.status(409).json({
            message: 'Such email already exists'
        })

    } else {
        //Нужно создать пользователя

        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        });

        try {
            await user.save();
            res.status(201).json(user)
        } catch (e) {
            errorHandler(res, e)
        }

    }
};