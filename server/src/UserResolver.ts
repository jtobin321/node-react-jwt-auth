import { Resolver, Query, Mutation, Arg, ObjectType, Field } from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken'

import { User } from './entity/User';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "hi!";
    }

    @Query(() => [User])
    users() {
        return User.find();
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error ('Could not find a user matching that email');

        const valid = await compare(password, user.password);
        if (!valid) throw new Error (`Incorrect password for user: ${email}`);

        // Login successful

        return {
            accessToken: sign({ userId: user.id }, 'cool-jwt', { expiresIn: '60m' })
        };
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string,
    ) {
        const hashedPassword = await hash(password, 12);

        try {
            await User.insert({
                email,
                password: hashedPassword
            });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }
}