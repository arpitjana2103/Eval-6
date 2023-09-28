const {User} = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async function (req, res) {
    try {
        const {name, email, password, passwordConfirm} = req.body;
        if (password !== passwordConfirm) {
            throw new Error('Password & Password Confirm have to be same');
        }
        const hashedPass = await bcrypt.hash(password, 5);

        await User.create({
            name: name,
            email: email,
            password: hashedPass,
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNq-fhMeQRIAFfcfgPFaQDO8yTQ_SOW1-6raA_0HgiiKDJTV0TkDiojPT98h40g8T4FAk&usqp=CAU',
        });

        return res.status(200).json({
            status: 'Success',
            message: 'Registrating Successfull',
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
};

const login = async function (req, res) {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            throw new Error('Email and Password required');
        }

        const user = await User.findOne({email: email});

        if (!user) {
            throw new Error('User not found with the Email');
        }
        const currectPass = await bcrypt.compare(password, user.password);

        if (!currectPass) {
            throw new Error('Wrong Password.');
        }

        user.password = undefined;

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        return res.status(200).json({
            status: 'success',
            message: 'Login Successfull',
            token: token,
            data: {
                data: user,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
};

const protect = async function (req, res, next) {
    try {
        let token = req.headers.authorization;
        if (!token) {
            throw new Error('Please Log-In to Continue');
        }

        if (!token.startsWith('Bearer')) {
            throw new Error('Bearer Token required');
        }

        token = token.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('Invalid Token');
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            error: error.message,
        });
    }
};

module.exports = {register, login, protect};
