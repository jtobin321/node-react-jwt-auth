import React from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { useLoginMutation } from '../generated/graphql';

interface Props {

}

export const Login: React.FC<RouteComponentProps> = ({history}) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    const [login] = useLoginMutation();

    return (
        <form 
            onSubmit={async e => {
                e.preventDefault();
                console.log('form submitted');
                console.log(email, password);
                const response = await login({
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
            <button type="submit">Login</button>
        </form>
    );
}