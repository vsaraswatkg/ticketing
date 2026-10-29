import express, { Request, Response } from "express";
import { User } from "../models/user";
import { BadRequestErr, validateRequest } from "@vsstickets/common";
import { Password } from "../services/password";
import { body } from "express-validator";
import jwt from "jsonwebtoken";


const router = express.Router();

router.post('/api/users/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('Must supply password')
    ], validateRequest, async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw new BadRequestErr('Invalid credentials');
        }

        if (!await Password.toCompare(user.password, password)) {
            throw new BadRequestErr('Invalid password');
        }

        const userJwt = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_KEY!)

        req.session = { jwt: userJwt };
        res.status(200).send(user);
    });

export { router as signInRouter };