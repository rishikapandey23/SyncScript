import './App.css';
import Editor from './Editor';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Signup from './pages/Signup';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
function App() {


  const router = createBrowserRouter([
    // {
    //   path: "/",
    //   element: <HomeLayout/>,
    //   children : [
        
    //   ]
    // },
    {
      path : '/register',
      element : <Register />
    },
    {
      path : '/signup',
      element : <Signup />
    },
    {
      path : "/login",
      element : <Login />
    },
    {
      path : "/",
      element : <HomePage />
    }, {
      path : "/document/:id",
      element : <Editor />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
