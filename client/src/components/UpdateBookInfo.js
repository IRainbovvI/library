import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import InputField from './InputField';

function UpdateBookInfo() {
  const methods = useForm();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8082/api/books/${id}`, {
        headers: { Authorization: 'Bearer ' + Cookies.get('token') }
      })
      .then((res) => {
        methods.setValue('title', res.data.book.title);
        methods.setValue('imgSrc', res.data.book.imgSrc);
        methods.setValue('author', res.data.book.author);
        methods.setValue('description', res.data.book.description);
        methods.setValue(
          'published_date',
          parseDate(res.data.book.published_date)
        );
        methods.setValue('publisher', res.data.book.publisher);
      })
      .catch((err) => {
        console.log('Error from UpdateBookInfo');
      });
  }, [id, methods]);

  const parseDate = (utcDate) => {
    const date = new Date(utcDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const onSubmit = (f) => {
    const data = {
      title: f.title,
      imgSrc: f.imgSrc,
      author: f.author,
      description: f.description,
      published_date: f.published_date,
      publisher: f.publisher
    };

    axios
      .put(`http://localhost:8082/api/books/${id}`, data, {
        headers: { Authorization: 'Bearer ' + Cookies.get('token') }
      })
      .then((res) => {
        navigate(`/show-book/${id}`);
      })
      .catch((err) => {
        console.log('Error in UpdateBookInfo!');
      });
  };

  return (
    <div className='UpdateBookInfo'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 m-auto'>
            <br />
            <Link
              to='/show-books'
              className='btn btn-outline-warning float-left'
            >
              Show Book List
            </Link>
          </div>
          <div className='col-md-6 m-auto'>
            <br />
            <Link
              to='/'
              className='btn btn-outline-warning float-end'
              onClick={() => {
                Cookies.remove('token');
              }}
            >
              Logout
            </Link>
          </div>
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Edit Book</h1>
            <p className='lead text-center'>Update Book's Info</p>
          </div>
        </div>

        <div className='col-md-8 m-auto'>
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
                required: 'Author is required.',
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

            <button
              type='submit'
              className='btn btn-outline-info btn-lg btn-block'
            >
              Update Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateBookInfo;
