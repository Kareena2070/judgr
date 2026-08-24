const bcrypt = require('bcrypt');
const User = require('../models/User.model.js');
const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require('../utils/token.js');
const ApiError = require('../utils/ApiError.js');

const SALT_ROUNDS = 12;

const register = async({name, email, password}) =>{
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if(existingUser){
        throw new ApiError(
                409,
                "USER_EXISTS",
                "User with this email already exists"
            )
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "student"
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

};

const login = async({email, password})=>{
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail,
    });

    if(!user || !user.isActive){
        throw new ApiError(
            401, 
            "INVALID_CREDENTIALS",
            "Invalid email or password",
        )
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if(!isPasswordValid){
        throw new ApiError(
            401,
            "INVALID_CREDENTIALS",
            "Invalid email or password",
        )
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return{
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    }
}

const refresh = async({refreshToken})=>{
    if(!refreshToken){
        throw new ApiError(
            401, 
            "REFRESH_TOKEN_REQUIRED",
            "Refresh token is required",
        )
    }

    let decoded;

    try{
        decoded = verifyRefreshToken(refreshToken);
    } catch(error){
        throw new ApiError(
            401,
            "INVALID_REFRESH_TOKEN",
            "Invalid or expired refresh token"
        )
    }

    const user = await User.findById(decoded.sub);

    if(!user || !user.isActive){
        throw new ApiError(
            401,
            "INVALID_REFRESH_TOKEN",
            "Invalid or expired refresh token"
        )
    }

    const accessToken = generateAccessToken(user);

    return{
        accessToken,
    };
};


module.exports = {
    register,
    login,
    refresh,
}