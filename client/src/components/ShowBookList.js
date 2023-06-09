import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BookCard from './BookCard';
import Cookies from 'js-cookie';

function ShowBookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8082/api/books', {
        headers: { Authorization: 'Bearer ' + Cookies.get('token') }
      })
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.log('Error from ShowBookList');
      });
  }, []);

  const bookList =
    books.length === 0
      ? 'You have no books yet. Shame on you!'
      : books.map((book, k) => <BookCard book={book} key={k} />);

  return (
    <div className='ShowBookList'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <br />
            <h2 className='display-4 text-center'>Books List</h2>
          </div>

          <div className='col-md-12'>
            <div className='row'>
              <div className='col-md-6'>
                <Link
                  to='/create-book'
                  className='btn btn-outline-warning float-right'
                >
                  + Add New Book
                </Link>
              </div>
              <div className='col-md-6 text-end'>
                <Link
                  to='/'
                  className='btn btn-outline-warning float-right'
                  onClick={() => {
                    Cookies.remove('token');
                  }}
                >
                  Logout
                </Link>
              </div>
            </div>

            <hr />
          </div>
        </div>

        <div className='list'>{bookList}</div>
      </div>
    </div>
  );
}

export default ShowBookList;
