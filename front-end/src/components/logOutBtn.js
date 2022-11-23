import axios from 'axios';
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LogOutBtn = () => {

    const { getLoggedIn } = useContext(AuthContext);

    async function logOut(){
        await axios.get('http://localhost:5000/auth/logout');
        await getLoggedIn();
    }
    return (  
        <Link to='/' className="nav-link" onClick={ logOut }> Logout </Link>
    );
}
 
export default LogOutBtn;