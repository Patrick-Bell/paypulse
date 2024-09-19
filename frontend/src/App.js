import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Register from "./components/register/Register";
import Login from './components/signin/Login';
import Dashboard from './components/dashboard/Dashboard';
import PayslipDetail from './components/actions/PayslipDetail';
import ResetPassword from './components/actions/ResetPassword';
import { useAuth } from './components/context/AuthContext';
import HomePage from './components/home/HomePage';
import P60Detail from './components/actions/P60Detail';

function App() {
    const location = useLocation();
    const { isAuthenticated, checkAuthentication } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authenticate = async () => {
            await checkAuthentication();
            setLoading(false);
        };

        authenticate();
    }, [checkAuthentication]);

    // Define the routes
    const publicRoutes = (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<Login />} />
            <Route path='/home' element={<HomePage />}></Route>
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/home" />} /> {/* Redirect all other paths to login */}
        </Routes>
    );

    const protectedRoutes = (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payslip/:id" element={<PayslipDetail />} />
            <Route path="/p60/:id" element={<P60Detail />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} /> {/* Redirect all other paths to dashboard */}
        </Routes>
    );

    if (loading) {
        return <div>Loading...</div>; // Show a loading spinner or placeholder
    }

    return (
        <>
            {isAuthenticated ? protectedRoutes : publicRoutes}
        </>
    );
}

export default App;
