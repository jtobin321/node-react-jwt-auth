import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const App: React.FC = () => {
  const { data, loading } = useQuery(gql`
  query{
    users {
      id
      email
    }
  }
  `);

  if (loading) return <div>lodaing...</div>

return <div>{JSON.stringify(data)}</div>;
}

export default App;
