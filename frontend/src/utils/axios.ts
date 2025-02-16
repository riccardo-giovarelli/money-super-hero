import axios from 'axios';


const tank = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

tank.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 401:
          window.location.replace('/signin?sessionExpired=true');
          break;
        default:
          console.log('Network error', error);
      }
      return Promise.reject(error);
    }
  }
);

export default tank;
