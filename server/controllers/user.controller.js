const User = require("../Schema/user.model");
const { hashPassword, verifyPassword } = require("../utils/bcrypt");
const jwt = require('jsonwebtoken');

const signupUser = async (req, res) => {

    // expected format of body : 

    // name: String, 
    // username: String, 
    // password: String, 
    // email: String, 
    // profilePicture: String

    const userInformation = req.body;

    const hashedPassword = await hashPassword(userInformation.password);

    userInformation.password = hashedPassword;

    console.log(req)
    try {
        const user = await User.create(userInformation);
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const loginUser = async (req, res) => {

    if(req.user) {
        res.setHeader('Authorization', req.user.authorization);
        res.status(200).json({ _id: req.user._id , authorization : req.user.authorization});
        return;
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        const isPasswordSame = await verifyPassword(password, user.password);

        if(!isPasswordSame) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        } 

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.setHeader('Authorization', token);
        res.status(200).json({ _id: user._id , authorization : token});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserById = async (req, res) => {
    let userId = req.params.id;
    console.log(userId)
    if(req.user) {
        userId = req.user._id;
    } 

    try {
        const user = await User.findById(userId);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
}

module.exports = {
    signupUser, loginUser, getUserById
}