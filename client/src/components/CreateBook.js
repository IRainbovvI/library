import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import InputField from './InputField';

import { useNavigate } from 'react-router-dom';

const CreateBook = (props) => {
  const navigate = useNavigate();
  const methods = useForm();

  const onSubmit = (f) => {
    axios
      .post('http://localhost:8082/api/books', f, {
        headers: { Authorization: 'Bearer ' + Cookies.get('token') }
      })
      .then((res) => {
        navigate('/show-books');
      })
      .catch((err) => {
        console.log('Error in CreateBook!');
      });
  };

  return (
    <div className='CreateBook'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8 m-auto'>
            <br />
            <Link
              to='/show-books'
              className='btn btn-outline-warning float-left'
            >
              Show Book List
            </Link>
          </div>
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Add Book</h1>
            <p className='lead text-center'>Create new book</p>

            <form
              noValidate
              onSubmit={methods.handleSubmit((f) => {
                onSubmit(f);
              })}
            >
              <InputField
                methods={methods}
                id='title'
                type='text'
                label='Title'
                placeholder='Title'
                validation={{
                  required: 'Title is required.'
                }}
              />
              <br />

              <InputField
                methods={methods}
                id='imgSrc'
                type='url'
                label='Image'
                placeholder='http://www.example.com/'
                validation={{
                  required: 'Image is required.',
                  matchPattern: (v) =>
                    /^(https?:\/\/)?([a-z0-9-]+\.)*[a-z0-9-]+(\.[a-z]{2,})(\/.*)*$/i.test(
                      v
                    ) || 'Field must be a valid url.'
                }}
              />
              <br />

              <InputField
                methods={methods}
                id='author'
                type='text'
                label='Author'
                placeholder='Author'
                validation={{
                  required: 'Author is required.'
                }}
              />
              <br />

              <InputField
                methods={methods}
                id='description'
                type='text'
                label='Description'
                placeholder='Description'
                validation={{}}
              />
              <br />

              <InputField
                methods={methods}
                id='published_date'
                type='date'
                label='Published Date'
                placeholder='2000.01.01'
                validation={{}}
              />
              <br />

              <InputField
                methods={methods}
                id='publisher'
                type='text'
                label='Publisher'
                placeholder='Publisher'
                validation={{}}
              />
              <br />

              <input
                type='submit'
                className='btn btn-outline-warning btn-block mt-4'
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBook;
