const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');

const  User = require('../models/user');
const { ctrlWrapper, HttpError, sendEmail } = require('../helpers');
const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
        throw HttpError(409, "Email in use");
    };

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    const verifyEmail = {
        to: email, subject: 'Verify email',
        html: `<a target="blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    console.log(verificationToken);
    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw HttpError(404, 'User not found');
    };
    
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

    res.status(200).json({
        message: 'Verification successful'
    })
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, 'Email not found');
    };

    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed');
    };

    console.log(user.verificationToken);

    const verifyEmail = {
        to: email, subject: 'Verify email',
        html: `<a target="blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`
    };
  
    await sendEmail(verifyEmail);

    res.status(200).json({
        message: 'Verification email sent'
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };

    if (!user.verify) {
        throw HttpError(401, "Email is not verified");
    }

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
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.status(200).json({
        email,
        subscription,
    })
};

const logout = async (req, res) => {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204);
};

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
};


module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateUserSubscription: ctrlWrapper(updateUserSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}
