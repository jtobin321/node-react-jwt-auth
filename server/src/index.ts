import "reflect-metadata";
import 'dotenv/config';

import express from "express";
import cookieParser from 'cookie-parser'
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { verify } from "jsonwebtoken";
import cors from 'cors';

import { UserResolver } from "./resolvers/UserResolver";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth/auth";
import { sendRefreshToken } from "./auth/sendRefreshToken";

const port = process.env.PORT;

(async () => {
    const app = express();
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }))
    app.use(cookieParser());

    app.get("/", (_req, res) => res.send("hello"));

    app.post("/refresh_token", async (req, res) => {
        const token = req.cookies.jwtid;
        if (!token) return res.send({ success: false, accessToken: '' })

        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch(err) {
            console.log(err);
            return res.send({ success: false, accessToken: '' })
        }

        const user = await User.findOne({ id: payload.userId });

        // Check if no user was found and if the refresh token is valid    
        if (!user || user.tokenVersion !== payload.tokenVersion) return res.send({ success: false, accessToken: '' })

        // Token is now valid, send token
        sendRefreshToken(res, createRefreshToken(user));
        
        return res.send({ success: true, accessToken: createAccessToken(user) });
    });

    let retries = 5;
    while (retries) {
        try {
            await createConnection();
            break;
        } catch(err) {
            console.log(err);
            retries -= 1;
            console.log(`number of retries left: ${retries}`);
            // wait 5 seconds to try connecting to db again
            await new Promise(res => setTimeout(res, 5000));
        }
    }

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(port, () => {
        console.log(`express server started on port: ${port}`);
    })
})();