import {AtSymbolIcon, EyeIcon, EyeSlashIcon} from '@heroicons/react/24/solid';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {loginFailure} from '../app/userSlice';
import bgLogin from '../assets/bg-login.jpg';
import {baseUrl} from '../config';

function Login() {
  const [username, setusername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordShown, setPasswordShown] = React.useState(false);
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/users/login`, {
        username: username,
        password: password,
      });
      localStorage.setItem('token', res.data.data);
      const decodedJwt = jwt_decode<any>(res.data.data);
      localStorage.setItem('user', decodedJwt.role);
      localStorage.setItem('id', decodedJwt.userId);
      navigate('/');
    } catch (err) {
      dispatch(loginFailure());
      setError(true);
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <section className='relative flex flex-wrap bg-gray-100 lg:h-screen lg:items-center'>
      <div className='w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-2/5 lg:px-8 lg:py-24'>
        <div className='mx-auto max-w-lg text-center'>
          <h1 className='text-2xl font-bold sm:text-3xl'>Hello Welcome back!</h1>
        </div>

        <form action='' className='mx-auto mt-8 mb-0 max-w-md space-y-4'>
          <div>
            <label htmlFor='username' className='sr-only'>
              username
            </label>

            <div className='relative'>
              <input
                type='username'
                className='w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm'
                placeholder='Enter username'
                onChange={(e) => setusername(e.target.value)}
              />

              <span className='absolute inset-y-0 right-4 inline-flex items-center'>
                <AtSymbolIcon className='h-5 w-5 text-gray-400' />
              </span>
            </div>
          </div>

          <div>
            <label htmlFor='password' className='sr-only'>
              Password
            </label>
            <div className='relative'>
              <input
                type={passwordShown ? 'text' : 'password'}
                className='w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm'
                placeholder='Enter password'
                onChange={(e) => setPassword(e.target.value)}
              />

              <span className='absolute inset-y-0 right-4 inline-flex items-center'>
                {passwordShown ? (
                  <EyeIcon className='h-5 w-5 text-gray-400' onClick={togglePassword} />
                ) : (
                  <EyeSlashIcon className='h-5 w-5 text-gray-400' onClick={togglePassword} />
                )}
              </span>
            </div>
          </div>
          {error && <p className='text-center text-base text-red-600'>ٍEmail or password incorrect</p>}

          <div className='flex items-center justify-between'>
            <button
              type='submit'
              onClick={handleLogin}
              className=' inline-block w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white'
            >
              Sign in
            </button>
          </div>
        </form>
      </div>

      <div className='relative h-64 w-full sm:h-96 lg:h-full lg:w-[60%]'>
        <img src={bgLogin} className='absolute inset-0 h-screen w-full  ' />
      </div>
    </section>
  );
}

export default Login;
