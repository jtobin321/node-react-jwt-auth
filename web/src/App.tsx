import React, { useState, useEffect } from 'react';
import { Routes } from './Routes';

interface Props {

}

export const App: React.FC<Props> = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
    }, [])

    if (loading) return <div>loading...</div> // loading animation goes here

    return <Routes />;
}