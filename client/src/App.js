import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import CreateBook from './components/CreateBook';
import ShowBookList from './components/ShowBookList';
import ShowBookDetails from './components/ShowBookDetails';
import UpdateBookInfo from './components/UpdateBookInfo';
import HomePage from './components/HomePage';
import AuthRoute from './components/AuthRoute';
import Cookies from 'js-cookie';

const App = () => {
  const isAuthenticated = () => {
    console.log('aaaaa');
    if (Cookies.get('token')) {
      const base64Url = Cookies.get('token').split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(base64);
      const decodedToken = JSON.parse(decodedPayload);
      if (decodedToken.exp < Date.now() / 1000) {
        Cookies.remove('token');
        return false;
      }
      return true;
    }
    return false;
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/show-books'
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <ShowBookList />
            </AuthRoute>
          }
        />
        <Route
          path='/create-book'
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <CreateBook />
            </AuthRoute>
          }
        />

        <Route
          path='/edit-book/:id'
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <UpdateBookInfo />
            </AuthRoute>
          }
        />

        <Route
          path='/show-book/:id'
          element={
            <AuthRoute isAuthenticated={isAuthenticated}>
              <ShowBookDetails />
            </AuthRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
