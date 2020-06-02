import React from 'react';
import { useByeQuery } from '../generated/graphql';

interface Props {

}

export const Bye: React.FC<Props> = () => {
    const {data, loading, error} = useByeQuery();

    if (loading) return <div>loading...</div>

    else if (error) {
        console.log(error);
        return <div>err</div>;
    }

    else if (!data) {
        return <div>no data</div>;
    }
    
    return <div>{data.bye}</div>;
}