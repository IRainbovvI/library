import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import Cookies from 'js-cookie';

function ShowBookDetails(props) {
  const [book, setBook] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8082/api/books/${id}`, {
        headers: { Authorization: 'Bearer ' + Cookies.get('token') }
      })
      .then((res) => {
        setBook({
          ...res.data.book,
          published_date:
            res.data.book.published_date &&
            parseDate(res.data.book.published_date)
        });
      })
      .catch((err) => {
        console.log('Error from ShowBookDetails');
      });
  }, [id]);

  const parseDate = (utcDate) => {
    const date = new Date(utcDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const onDeleteClick = (id) => {
    axios
      .delete(`http://localhost:8082/api/books/${id}`, {
        headers: { Authorization: 'Bearer ' + Cookies.get('token') }
      })
      .then((res) => {
        navigate('/show-books');
      })
      .catch((err) => {
        console.log('Error form ShowBookDetails_deleteClick');
      });
  };

  const BookItem = (
    <div>
      <table className='table table-hover table-dark'>
        <tbody>
          <tr>
            <th scope='row'>1</th>
            <td>Title</td>
            <td>{book.title}</td>
          </tr>
          <tr>
            <th scope='row'>2</th>
            <td>Author</td>
            <td>{book.author}</td>
          </tr>
          <tr>
            <th scope='row'>3</th>
            <td>Image</td>
            <td>{book.imgSrc}</td>
          </tr>
          <tr>
            <th scope='row'>4</th>
            <td>Description</td>
            <td>{book.description}</td>
          </tr>
          <tr>
            <th scope='row'>5</th>
            <td>Published Date</td>
            <td>{book.published_date}</td>
          </tr>
          <tr>
            <th scope='row'>6</th>
            <td>Publisher</td>
            <td>{book.publisher}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className='ShowBookDetails'>
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
          <br />
          <div className='col-md-8 m-auto'>
            <h1 className='display-4 text-center'>Book's Record</h1>
            <p className='lead text-center'>View Book's Info</p>
            <hr /> <br />
          </div>
          <div className='col-md-10 m-auto'>{BookItem}</div>
          <div className='col-md-6 m-auto'>
            <button
              type='button'
              className='btn btn-outline-danger btn-lg btn-block'
              onClick={() => {
                onDeleteClick(book._id);
              }}
            >
              Delete Book
            </button>
          </div>
          <div className='col-md-6 m-auto'>
            <Link
              to={`/edit-book/${book._id}`}
              className='btn btn-outline-info btn-lg btn-block'
            >
              Edit Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowBookDetails;
