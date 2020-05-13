import "reflect-metadata";
import 'dotenv/config';

import express from "express";
import cookieParser from 'cookie-parser'
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { verify } from "jsonwebtoken";

import { UserResolver } from "./UserResolver";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";

(async () => {
    const app = express();
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

    await createConnection();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("express server started");
    })
})();

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
