import { body, validationResult } from "express-validator";
import { GenerateAccessTokenAndRefreshToken } from '../../../Utils/GenerateAccessTokenAndRefreshToken.js';
import { connection } from "../../../utils/connection.js";
import { AccesstokenOption, RefreshtokenOption } from "../../../Utils/option.js";
import { makeQueue } from "../../../utils/makeQueue.js";
import { Model } from "../../../models/index.js";

const LoginValidate = [
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email Formet'),
    body('password')
        .notEmpty()
        .withMessage('password is required')
        .isString()
];


const loginAlertQueue = makeQueue('loginAlert');
const banAlertQueue = makeQueue('banAlert');

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        await Promise.all(LoginValidate.map((validate) => validate.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()[0].msg
            });
        }

        const result = req.monitoring.client
        const user = await Model.User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                message: "Account not Exist with this Email"
            });
        }

        if (user.status === 'banned') {

            const formattedDateTime = user.suspensionEnd?.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });

            return res.status(403).json({
                message: `Your Account temporarily Banned and unBanned on ${formattedDateTime}`
            });
        }

        const verifypass = await user.checkpassword(password);
        if (!verifypass) {
            const attemptKey = `failed:login:${email}`;


            const attemptCount = await connection.incr(attemptKey);
            if (attemptCount === 1) {
                await connection.expire(attemptKey, 60);
            }

            if (attemptCount >= 20) {
                const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
                const clientIp = ip === '::1' ? '127.0.0.1' : ip;


                await banAlertQueue.add('banAlert', {
                    email,
                    fullname: user.fullName || 'User',
                    ip: clientIp,
                    device: result.device?.type || 'Desktop',
                    browser: result.browser?.name || 'Unknown',
                    os: `${result.os?.name || 'Unknown'} ${result.os?.version || ''}`,
                    attemptCount,
                    lastAttempt: new Date()?.toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    })
                });
                const now = Date.now()

                user.suspensionEnd = now + 60 * 60 * 1000;
                user.status = "banned";

                await user.save({ validateBeforeSave: false })
                return res.status(429).json({
                    message: "Too many failed attempts. maybe Your Account got Banned ."
                });
            }

            return res.status(400).json({
                message: "Invalid Password"
            });
        }


        await connection.del(`failed:login:${email}`);

        const { RefreshToken, AccessToken } = await GenerateAccessTokenAndRefreshToken(user._id);


        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
        const clientIp = ip === '::1' ? '127.0.0.1' : ip;
        const isLocalIp = clientIp === '127.0.0.1' || clientIp === '::1';

        const device = result.device?.type || 'Desktop';
        const browser = result.browser?.name || 'Unknown';
        const os = `${result.os?.name || 'Unknown'} ${result.os?.version || ''}`;

        const loginTime = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });


        await loginAlertQueue.add('loginAlert', {
            email,
            fullname: user.fullName || 'User',
            ip: clientIp,
            device,
            browser,
            os,
            isLocalIp: isLocalIp ? 'Local IP (testing)' : 'Public IP',
            loginTime
        });

        console.log("User Login");

        return res
            .cookie("RefreshToken", RefreshToken, RefreshtokenOption)
            .cookie("AccessToken", AccessToken, AccesstokenOption)
            .status(200).json({
                message: "Login Success",
                accessToken: AccessToken
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server Error"
        });
    }
};

export { Login };