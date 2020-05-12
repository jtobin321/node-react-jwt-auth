import { 
    Resolver, 
    Query, 
    Mutation, 
    Arg, 
    ObjectType, 
    Field, 
    Ctx, 
    UseMiddleware
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';

import { User } from './entity/User';
import { MyContext } from './MyContext';
import { createAccessToken, createRefreshToken } from './auth';
import { isAuth } from './isAuth';

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

    @Query(() => String)
    @UseMiddleware(isAuth)
    bye(@Ctx() { payload }: MyContext) {
        return `your user id is: ${payload!.userId}`;
    }

    @Query(() => [User])
    users() {
        return User.find();
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { res }: MyContext
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error ('Could not find a user matching that email');

        const valid = await compare(password, user.password);
        if (!valid) throw new Error (`Incorrect password for user: ${email}`);

        // Login successful

        res.cookie(
            'jwtid', createRefreshToken(user),
            {
                httpOnly: true
            }
        )

        return { accessToken: createAccessToken(user) }
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