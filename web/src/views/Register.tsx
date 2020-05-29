import React from 'react';
import { useRegisterMutation } from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';

export const Register: React.FC<RouteComponentProps> = ({history}) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    const [register] = useRegisterMutation();

    return (
        <form 
            onSubmit={async e => {
                e.preventDefault();
                console.log('form submitted');
                console.log(email, password);
                const response = await register({
                    variables: {
                        email,
                        password
                    }
                });

                console.log(response);
                history.push("/");
            }}
        >
            <div>
                <input 
                    value={email} 
                    placeholder="email"
                    type="email"
                    onChange={e => { setEmail(e.target.value); } }
                />
            </div>
            <div>
                <input 
                    value={password} 
                    placeholder="password"
                    type="password"
                    onChange={e => { setPassword(e.target.value); } }
                />
            </div>
            <button type="submit">Register</button>
        </form>
    );
}