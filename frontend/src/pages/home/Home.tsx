import axios from 'axios';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    axios.get('/').then((response) => {
      console.log(response.data);
    });
  }, []);
  return <h1>Money Super Hero</h1>;
};

export default Home;
