import axios from 'axios';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import InputField from './InputField';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [cardState, setCardState] = useState(0); //0-starting card, 1-login card, 2-signup card
  const [generalError, setGeneralError] = useState(null);
  const navigate = useNavigate();
  const methods = useForm();

  //Handle Login
  const handleLogin = async (f) => {
    setGeneralError(null);

    try {
      const response = await axios.post(
        'http://localhost:8082/api/users/login',
        {
          email: f.email,
          password: f.password
        }
      );
      Cookies.set('token', response.data.data.token);
      navigate('/show-books');
    } catch (error) {
      setGeneralError('Wrong credentials.');
    }
  };

  //Handle Signup
  const handleSignup = async (f) => {
    setGeneralError(null);

    try {
      const response = await axios.post(
        'http://localhost:8082/api/users/signup',
        {
          email: f.email,
          password: f.password,
          name: f.name
        }
      );
      Cookies.set('token', response.data.data.token);
      navigate('/show-books');
    } catch (error) {
      setGeneralError('Server error');
    }
  };

  //Rendering Card in the middle based on variable
  const renderCard = () => {
    switch (cardState) {
      //Login Card
      case 1:
        return (
          <form
            onSubmit={methods.handleSubmit((f) => {
              handleLogin(f);
            })}
            noValidate
          >
            {generalError && (
              <div className='text-center text-danger'>{generalError}</div>
            )}
            <InputField
              methods={methods}
              id='email'
              type='email'
              label='Email address'
              placeholder='name@example.com'
              validation={{
                required: 'Email is required.',
                validate: {
                  matchPattern: (v) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    'Email address must be a valid address.'
                }
              }}
            />

            <InputField
              methods={methods}
              id='password'
              type='password'
              label='Password'
              placeholder='password'
              validation={{
                required: 'Password is required.'
              }}
            />

            <button type='submit' className='w-100 btn btn-outline-warning'>
              Login
            </button>
            <button
              className='w-100 btn btn-outline-warning mt-3'
              onClick={() => {
                setCardState(0);
              }}
            >
              Go Back
            </button>
          </form>
        );
      //Signup Card
      case 2:
        return (
          <form
            onSubmit={methods.handleSubmit((f) => {
              handleSignup(f);
            })}
            noValidate
          >
            {generalError && (
              <div className='text-center text-danger'>{generalError}</div>
            )}
            <InputField
              methods={methods}
              id='name'
              type='text'
              label='Name'
              placeholder='Name Surname'
              validation={{
                required: 'Name is required.'
              }}
            />
            <InputField
              methods={methods}
              id='email'
              type='email'
              label='Email address'
              placeholder='name@example.com'
              validation={{
                required: 'Email is required.',
                validate: {
                  matchPattern: (v) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    'Email address must be a valid address.'
                }
              }}
            />

            <InputField
              methods={methods}
              id={'password'}
              type={'password'}
              label={'Password'}
              placeholder='password'
              validation={{
                required: 'Password is required.',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long.'
                },
                validate: {
                  matchPattern: (v) =>
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.!@#$%^&*_-])/.test(
                      v
                    ) ||
                    'Password must include at least 1 number, 1 symbol, 1 uppercase and lovercase character.'
                }
              }}
            />

            <button type='submit' className='w-100 btn btn-outline-warning'>
              Signup
            </button>
            <button
              className='w-100 btn btn-outline-warning mt-3'
              onClick={() => {
                setCardState(0);
              }}
            >
              Go Back
            </button>
          </form>
        );
      //Starting Card
      default:
        return (
          <div>
            <div className='col-md-12'>
              <button
                className='w-100 btn btn-outline-warning'
                onClick={() => {
                  setCardState(1);
                }}
              >
                <b>Login</b>
              </button>
            </div>
            <div className='col-md-12 mt-3'>
              <button
                className='w-100 btn btn-outline-warning'
                onClick={() => {
                  setCardState(2);
                }}
              >
                <b>Signup</b>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className='HomePage'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12 text-center mt-5 header text-warning'>
            <h1>My Personal Library</h1>
            <h2>
              Unlock the Pages, Embrace the Knowledge: Your Personal Library,
              Preserving Treasured Tales!
            </h2>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className='card-container w-25 bg-dark p-5 mt-5 border border-warning'>
              {renderCard()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
