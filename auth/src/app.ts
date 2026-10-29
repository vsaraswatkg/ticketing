import express from 'express';
import 'express-async-errors';
import { currentUserRouter } from "./routes/current-user";
import { signUpRouter } from "./routes/signup";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { errorHandler, NotFoundError } from "@vsstickets/common";
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);

app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        // jest will use http not https
        secure: process.env.NODE_ENV !== 'test',
    })
)

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});
app.use(errorHandler);

export { app };
