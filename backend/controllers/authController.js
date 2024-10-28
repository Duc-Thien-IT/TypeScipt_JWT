const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../mailer");


let refreshTokens = [];
//luu otp khi het han
let otpStore = {};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const authController = {
    // Register
    registerUser: async (req, res) => {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
          const otp = generateOtp();

          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
          });

        const user = await newUser.save();

        //Luu ma~ trong vo`ng 5 phut
        otpStore[user.id] = { otp, expires: Date.now() + 300000 };
        //gui ma~ ve email ne`
        await sendOtpEmail(user.email, otp);

        res.status(200).json({ message: "Register successfully! Code OTP send to your email." , user });        
      } catch (err) {
        console.error('Error details:', err); 
        res.status(500).json({ error: 'Register failed! Please try register, using username and email different' });
      }
    },

    //Verify OTP
    verifyOtp: async (req, res) => {
        const { userId, otp } = req.body;

        const storedOtpData = otpStore[userId];
        if (!storedOtpData) {
            return res.status(400).json({ error: "CODE OTP invalid or expired" });
        }

        if (storedOtpData.otp === otp) {
            if (Date.now() > storedOtpData.expires) {
                delete otpStore[userId]; //delete otp if expired
                return res.status(400).json({ error: "CODE OTP Expired" });
            }
            delete otpStore[userId]; //delete for success

            return res.status(200).json({ message: "CODE OTP successfully" });
        } else {
            return res.status(400).json({ error: "CODE OTP Failed" });
        }
    },

    // Resend OTP API
    resendOtp: async (req, res) => {
        const { userId } = req.body;
        
        try {
            const user = await User.findByPk(userId); 
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const newOtp = generateOtp(); 

            otpStore[user.id] = { otp: newOtp, expires: Date.now() + 300000 };

            await sendOtpEmail(user.email, newOtp);

            res.status(200).json({ message: "A new OTP has been sent to your email." });
        } catch (error) {
            console.error("Error resending OTP: ", error);
            res.status(500).json({ error: "Failed to resend OTP. Please try again." });
        }
    },


    //GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin
            }, 
            process.env.SECRET_KEY,
            { expiresIn: "180s" }
        );
    },

    //GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin
            }, 
            process.env.REFRESH_KEY,
            { expiresIn: "1d" }
        );
    },


    //LOGIN USER
    loginUser: async(req, res) => {
        try{
            const user = await User.findOne({where: {username: req.body.username}});
            if(!user){
                res.status(404).json("Wrong username");
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if(!validPassword) {
                res.status(404).json("Wrong password");
            }
            if(user && validPassword){
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path:"/",
                    sameSite: "strict",
                });

                //Ẩn mật khẩu
                const userData = user.toJSON();
                const { password, ...others } = userData;
                res.status(200).json({user, accessToken});
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    },

    requestRefreshToken: async(req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json("You aren't authenticated");
        if(refreshTokens.includes(refreshToken)){
            return res.status(403).json("Refresh token is not valid");
        }   
        jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
            if(err){
                console.log(err);
                return res.status(403).json("Invalid refresh token");
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

            //tao moi accesstoken va refreshtoken
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken); //luu refreshToken vao mang tokens
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path:"/",
                sameSite: "strict",
            });

            res.status(200).json({accessToken: newAccessToken, refreshToken: newRefreshToken});
        });
    },

    //logout user
    userLogout: async(req, res) => {
        refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
        res.clearCookie("refreshToken");
        res.status(200).json("Logged out successfully!");
    },
    
};
  

module.exports = authController;
