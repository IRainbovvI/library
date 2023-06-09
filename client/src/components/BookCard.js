import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const BookCard = (props) => {
  const book = props.book;

  return (
    <div className='card-container border border-warning border-2'>
      <img src={book.imgSrc} className='card-img-top' alt='Book' height={200} />
      <div className='desc'>
        <h2>
          <Link to={`/show-book/${book._id}`}>{book.title}</Link>
        </h2>
        <h3>{book.author}</h3>
        <p>{book.description}</p>
      </div>
    </div>
  );
};

export default BookCard;
