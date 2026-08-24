const authService = require('../services/auth.service.js');
const ApiResponse = require('../utils/ApiResponse.js');
const asyncHandler = require("../middlewares/asyncHandler.js");
const User = require("../models/User.model.js");
const ApiError = require("../utils/ApiError.js");

const register = asyncHandler(async(req, res)=>{
    const { name, email, password } = req.validated.body;

    const user = await authService.register({
        name,
        email,
        password,
    });

    return res.status(201).json(
        new ApiResponse(
            user,
            "User registered successfully"
        )
    )
})

const login = asyncHandler(async(req, res)=>{
    const {email, password} = req.validated.body;

    const {
        user, 
        accessToken,
        refreshToken,
    } = await authService.login(
        {
            email, password,
        }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7*24*60*60*1000,
    });

    return res.status(200).json(
        new ApiResponse(
            {
                user, 
                accessToken,
            },
            "Login successful"
        )
    )
})

const refresh = asyncHandler(async(req, res)=>{
    const refreshToken = req.cookies.refreshToken;

    const {accessToken} = await authService.refresh({
        refreshToken,
    })

    return res.status(200).json(
        new ApiResponse(
            {accessToken},
            "Access token refreshed successfully"
        )
    )
});

const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.sub);

    if (!user) {
        throw new ApiError(
            404,
            "USER_NOT_FOUND",
            "User not found"
        );
    }

    if (!user.isActive) {
        throw new ApiError(
            403,
            "USER_INACTIVE",
            "User account is inactive"
        );
    }

    const safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
    };

    return res.status(200).json(
        new ApiResponse(
            safeUser,
            "Current user fetched successfully"
        )
    );
});

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res.status(200).json(
        new ApiResponse(
            null,
            "Logged out successfully"
        )
    );
});

module.exports = {
    register,
    login,
    refresh,
    me,
    logout,
};