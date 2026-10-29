import express from 'express';
import 'express-async-errors';
import { currentUser, errorHandler, NotFoundError } from "@vsstickets/common";
import cookieSession from 'cookie-session';
import { newOrderRouter } from "./routes/new";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";
import { showOrderRouter } from "./routes/show";

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
app.use(currentUser)
app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});
app.use(errorHandler);

export { app };
