const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

const  User = require('../models/user');
const { ctrlWrapper, HttpError } = require('../helpers');
const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
        throw HttpError(409, "Email in use");
    };

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL});

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }
    
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token: token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.status(200).json({
        email,
        subscription,
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204);
}

const updateUserSubscription = async (req, res) => {
    const { _id } = req.user;
    const { subscription } = req.body;

    if (!subscription) {
        return res.status(400).json({ message: `Missing fields subscription` });
    }

    const subscriptionList = ['starter', 'pro', 'business'];

    if (!subscriptionList.includes(subscription)) {
        return null;
    }

    const updatedUser = await User.findByIdAndUpdate(_id,
        {
        $set: { subscription },
        },
        { new: true, select: '_id email subscription' }
    );

    if (!updatedUser) {
        return res.status(400).json({ message: `Subscription is wrong` });
    }

    res.status(200).json(updatedUser);
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, fileName);
    const originalSizeFile = await Jimp.read(tempUpload);

    originalSizeFile.resize(250, 250).write(tempUpload);

    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join('avatars', fileName);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({
        avatarURL,
    })
}


module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateUserSubscription: ctrlWrapper(updateUserSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}
