import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../styles/Dashboard.css';
import AddShifts from '../actions/AddShift';
import ShiftBox from '../actions/ShiftBox';
import EditShift from '../actions/EditShift';
import axios from 'axios';
import MyBigCalendar from '../actions/Calendar';
import Payslips from '../actions/Payslips';
import P60s from '../actions/P60s';
import { toast, ToastContainer } from 'react-toastify'
import EditDetails from '../actions/EditDetails';
import ChangePassword from '../actions/ChangePassword';
import 'react-toastify/dist/ReactToastify.css';
import Reviews  from '../actions/Reviews';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProjectedEarnings from '../actions/ProjectedEarnings';
import ContactForm from '../actions/ContactForm';



const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('calendar'); // Single state to manage sections
    const [shifts, setShifts] = useState([]);
    const [filteredShifts, setFilteredShifts] = useState([]);
    const [filterType, setFilterType] = useState('all'); // 'all', 'past', 'present'
    const [filterMonth, setFilterMonth] = useState('all'); // 'all', 'January', 'February', etc.
    const [totalHours, setTotalHours] = useState(0);
    const [totalPay, setTotalPay] = useState(0);
    const [payslips, setPayslips] = useState([]);
    const [p60s, setP60s] = useState([])
    const [user, setUser] = useState([])
    const [editShiftOpen, setEditShiftOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false)
    const [projectedData, setProjectedData] = useState({})
    const [submitReview, setSubmitReview] = useState('Submit')

    const { isAuthenticated, checkAuthentication } = useAuth();


    const navigator = useNavigate()


    // Fetch payslips only once when the dashboard is loaded
    useEffect(() => {
        const fetchPaySlips = async () => {
            const response = await axios.get('/api/payslips', { withCredentials: true });
            console.log('payslip information', response.data);
            setPayslips(response.data);
            setUser(response.data)
        };
        fetchPaySlips();
    }, [shifts]);

    useEffect(() => {
        const fetchP60s = async () => {
            const response = await axios.get('/api/p60s', { withCredentials: true });
            console.log('p60 information', response.data);
            setP60s(response.data);
            setUser(response.data)
        };
        fetchP60s();
    }, []);

    // Fetch shifts only once when the dashboard is loaded
    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const response = await axios.get('/api/shifts', { withCredentials: true });
                setShifts(response.data);
                setFilteredShifts(response.data); // Initialize with all shifts
            } catch (e) {
                console.error('Error fetching shifts:', e.response ? e.response.data : e.message);
                setShifts([]);
                setFilteredShifts([]);
            }
        };

        fetchShifts();
    }, []);

    // Handle filtering of shifts when filters change
    useEffect(() => {
        filterShifts();
    }, [filterType, filterMonth, shifts]);

    const filterShifts = () => {
        let filtered = [...shifts];
        const now = new Date();

        if (filterType === 'past') {
            filtered = filtered.filter(shift => new Date(shift.date) < now);
        } else if (filterType === 'present') {
            filtered = filtered.filter(shift => new Date(shift.date) >= now);
        }

        if (filterMonth !== 'all') {
            const monthIndex = new Date(Date.parse(`${filterMonth} 1, 2024`)).getMonth();
            filtered = filtered.filter(shift => {
                const shiftDate = new Date(shift.date);
                return shiftDate.getMonth() === monthIndex && shiftDate.getFullYear() === now.getFullYear();
            });
        }

        const totalPay = filtered.reduce((sum, shift) => sum + shift.total_pay, 0);
        const totalHours = filtered.reduce((sum, shift) => sum + shift.total_hours, 0);
        setTotalHours(totalHours);
        setTotalPay(totalPay);

        setFilteredShifts(filtered);
    };
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        if (name === 'filterType') {
            setFilterType(value);
        } else if (name === 'filterMonth') {
            setFilterMonth(value);
        }
    };

    // Handle Add Shift submit
    const handleShiftSubmit = async (formData) => {
        try {
            const response = await axios.post('/api/add-shift', {
                shift_name: formData.shiftName,
                date: formData.shiftDate,
                time_started: formData.timeStarted,
                time_finished: formData.timeFinished,
                location: formData.location,
                pay_rate: formData.payRate,
                description: formData.description
            }, { withCredentials: true });
    
            const newShift = response.data;
            
            // Append the new shift to the existing shifts
            setShifts(prevShifts => [...prevShifts, newShift]);
    
            // Reset filters to show all shifts, including the new one
            setFilteredShifts(prevShifts => [...prevShifts, newShift]);
    
            // Switch back to 'shifts' section
            setActiveSection('shifts');
    
            toast.success('Shift Successfully Added!');
        } catch (error) {
            console.error('Error adding shift:', error.response ? error.response.data : error.message);
            alert('Failed to add shift. Please try again.');
        }
    };
    

    const handleChangePassword = async (userId, password, newPassword, confirmPassword) => {
        try {
            console.log(userId, password, newPassword, confirmPassword);
    
            // Check if newPassword matches confirmPassword in the frontend
            if (newPassword !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            if (newPassword.length < 8 || confirmPassword.length < 8) {
                toast.error('Password must be at least 8 characters');
                return;
            }
            
            // Send the request to change password
            const response = await axios.post('/api/change-password', {
                userId, password, newPassword, confirmPassword
            });
    
            // If the response is successful, show success toast
            toast.success('Password changed successfully!');
            console.log(response.data);
            
            return 'success'
    
        } catch (error) {
            // Check if error response has the error message and display the relevant toast
            if (error.response && error.response.data && error.response.data.error) {
                // Show the error message from the backend
                toast.error(error.response.data.error);
            } else {
                // Show a generic error if something else went wrong
                toast.error('An error occurred while changing the password');
            }
            console.log(error);
        }
    };
    

    const handleDeleteShift = async (shift) => {
        const shiftId = shift._id; // Use _id instead of id
        if (!shiftId) {
            console.error('Shift _id is missing');
            return;
        }
    
        const confirmDelete = window.confirm(`Are you sure you want to delete the shift: ${shift.shift_name}?`);
        if (!confirmDelete) return;
    
        try {
            const response = await axios.delete(`/api/delete-shift/${shiftId}`);
            console.log(response.data);
    
            // Update the state to remove the deleted shift from the UI
            setShifts(shifts.filter(s => s._id !== shiftId)); // Remove the deleted shift from state
            toast.success('Shift deleted successfully!');
        } catch (e) {
            console.error(e);
            toast.error('Failed to delete shift.');
        }

    };

    // ediitng shift logic 

    const handleEditShift = (shift) => {
        setSelectedShift(shift);
        console.log(shift)
        setEditShiftOpen(true);
    };

    const handleCloseEditShift = () => {
        setEditShiftOpen(false);
        setSelectedShift(null);
    };

    const handleSaveShift = async (updatedShift) => {
        try {
            // Make sure updatedShift._id is available and valid
            if (!updatedShift._id) {
                console.error('Shift ID is missing');
                return;
            }
    
            // Update shift on server
            const response = await axios.put(`/api/update-shift/${updatedShift._id}`, {
                shift_name: updatedShift.shift_name,
                shift_date: updatedShift.shift_date,
                time_started: updatedShift.time_started,
                time_finished: updatedShift.time_finished,
                pay_rate: updatedShift.pay_rate,
                location: updatedShift.location,
                description: updatedShift.description,
            });
    
            const updatedShiftFromServer = response.data;
            console.log(updatedShiftFromServer)
            
            // Update local state with the new shift data
            setShifts(prevShifts =>
                prevShifts.map(shift =>
                    shift._id === updatedShiftFromServer._id ? updatedShiftFromServer : shift
                )
            );
            setFilteredShifts(prevShifts =>
                prevShifts.map(shift =>
                    shift._id === updatedShiftFromServer._id ? updatedShiftFromServer : shift
                )
            );
            handleCloseEditShift();
            toast.success('Shift updated successfully!');
        } catch (error) {
            console.error('Error updating shift:', error);
            toast.error('Failed to update shift.');
        }
    };
    


    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
        console.log('toggling menu')
    };
    

    const handleReviewSubmit = async (formData) => {
        setSubmitReview('Submitting...')
        console.log(formData)
        try{
            const response = await axios.post(`/api/submit-review`, formData)
            console.log(response.data)
            setSubmitReview('Review Sent Successfully!')
            toast.success('Review Successfully Submitted!')
            setTimeout(() => {
                setSubmitReview('Submit')
            }, 3000);


        }catch(e) {
            console.log(e)
        }
    }
    

    

    // Section rendering logic
    const renderActiveSection = () => {
        if (activeSection === 'addShift') {
            return <AddShifts onSubmit={handleShiftSubmit} />;
        } else if (activeSection === 'editShift') {
            return <AddShifts />
        } else if (activeSection === 'shifts') {
            return (
                <div className='shifts-wrap'>
                    <div className="filter-section">
                        <select name="filterType" value={filterType} onChange={handleFilterChange}>
                            <option value="all">All</option>
                            <option value="past">Past</option>
                            <option value="present">Present</option>
                        </select>
                        <select name="filterMonth" value={filterMonth} onChange={handleFilterChange}>
                            <option value="all">All Months</option>
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                    <div className='shift-grid'>
                        {filteredShifts.length > 0 ? (
                        filteredShifts.map((shift, i) => <ShiftBox key={i} shift={shift} onDelete={() => handleDeleteShift(shift)} onEdit={() => handleEditShift(shift)}
                        />)
                        ) : (
                            <p className='no-shifts-text'>No Shift Data Found.</p>
                        )}
                    </div>
                    {filteredShifts.length > 0 && (
                        <div className='shift-flex'>
                            <p>Total Hours: <strong>{(totalHours).toFixed(2)}</strong></p>
                            <p>Total Shifts: <strong>{filteredShifts.length}</strong></p>
                            <p>Total Pay: £<strong><span className='blur'>{(totalPay).toFixed(2)}</span></strong></p>
                        </div>
                    )}
                </div>
            );        
        } else if (activeSection === 'calendar') {
            return <MyBigCalendar />;
        } else if (activeSection === 'payslips') {
            return payslips.payslips && payslips.payslips.length > 0 ? (
                payslips.payslips.map(payslip => {
                    const monthName = new Date(payslip.start_date).toLocaleString('default', { month: 'long' });
                    const yearName = new Date(payslip.start_date).toLocaleString('default', { year: 'numeric' });
                    return (
                        <div key={payslip.id}>
                            <Payslips id={payslip.id} month={monthName} year={yearName} />
                        </div>
                    );
                })
            ) : (
                <p>No Payslips Available</p>
            );
        } else if (activeSection === 'p60s') {
            return p60s.p60s && p60s.p60s.length > 0 ? (
                p60s.p60s.map(p60 => {
                    const yearName = new Date(p60.year).toLocaleString('default', { year: 'numeric' });
                    return (
                        <div key={p60.id}>
                            <P60s id={p60.id} year={yearName} />
                        </div>
                    );
                })
            ) : (
                <p>P60s are generated at the start of each year (2nd January). Currently there are no P60s available.</p>
            );

        } else if (activeSection === 'edit') {
            return <EditDetails id={user.id} username={user.username} email={user.email} number={user.phone_number} address_line_1={user.address_line_1} address_line_2={user.address_line_2} postal_code={user.postal_code} onClick={updateEditDetails} />
        } else if (activeSection === 'change-password') {
            return <ChangePassword userId={user.id} handleSubmit={handleChangePassword} />
        } else if (activeSection === 'reviews') {
            return <Reviews handleSubmit={handleReviewSubmit} submit={submitReview} />
        } else if (activeSection === 'projected-earnings') {
            return <ProjectedEarnings projectedData={projectedData} />
        } else if (activeSection === 'contact') {
            return <ContactForm />
        }
    };
    
    const updateEditDetails = async (formData) => {
        console.log(formData);
        console.log('checking id for personal details', formData.id);
    
        try {
            const response = await axios.put('/api/edit-personal-details', { formData });
            
            toast.success(
                <>
                <p>Personal Details Updated Successfully!</p><br></br>
                <p>For these updates to update on payslips & emails, you <strong>must</strong> sign in again</p>
                </>
            )
        
        } catch (e) {
            console.log(e);
            toast.error('Failed to Update Details!');
        }
    };
    
    const handleLogout = async () => {
        try{
            const response = await axios.post('/api/logout')
            console.log(response.data)
            checkAuthentication()
        }catch(e) {
            console.log(e)
        }
    }

    const fetchProjectedEarnings = async () => {
        try{
            const response = await axios.get('/api/projected-earnings')
            console.log(response.data)
            setProjectedData(response.data)

        }catch(e) {
            console.log()
        }
    }

    useEffect(() => {
        fetchProjectedEarnings()
    }, [])

    return (
        <>
        <ToastContainer />


        {selectedShift && (
                <EditShift
                    open={editShiftOpen}
                    onClose={handleCloseEditShift}
                    shift={selectedShift}
                    onSave={handleSaveShift}
                />
            )}

            <Navbar user={user.username} toggleMenu={toggleMenu}/>
            <div className="dash-grid">
            <div className={`dash-l ${menuOpen ? 'open' : ''}`}>
                <ul>
                    <li className={activeSection === 'shifts' ? 'active' : ''} onClick={() => { setActiveSection('shifts'); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-calendar-day"></i> View Shifts</a>
                    </li>
                    <li className={activeSection === 'payslips' ? 'active' : ''} onClick={() => { setActiveSection('payslips'); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-file-invoice"></i> Payslips</a>
                    </li>
                    <li className={activeSection === 'p60s' ? 'active' : ''} onClick={() => { setActiveSection('p60s'); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-file-invoice"></i> P60</a>
                    </li>
                    <li className={activeSection === 'addShift' ? 'active' : ''} onClick={() => { setActiveSection('addShift'); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-plus-circle"></i> Add Shift</a>
                    </li>
                    <li className={activeSection === 'calendar' ? 'active' : ''} onClick={() => { setActiveSection('calendar'); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-calendar-alt"></i> Calendar</a>
                    </li>
                    <li className={activeSection === 'projected-earnings' ? 'active' : ''} onClick={() => { setActiveSection('projected-earnings'); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-chart-line"></i> Projected Earnings</a>
                    </li>
                    <li className={activeSection === 'reviews' ? 'active' : ''} onClick={() => { setActiveSection('reviews'); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-star"></i> Review</a>
                    </li>
                    <li className={activeSection === 'edit' ? 'active' : ''} onClick={() => { setActiveSection('edit'); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-edit"></i> Edit Details</a>
                    </li>
                    <li className={activeSection === 'change-password' ? 'active' : ''} onClick={() => { setActiveSection('change-password'); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-key"></i> Change Password</a>
                    </li>
                    <li className={activeSection === 'contact' ? 'active' : ''} onClick={() => { setActiveSection('contact'); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-envelope"></i> Contact</a>
                    </li>
                    <li onClick={() => { handleLogout(); toggleMenu(); }}>
                    <a href="#"><i className="fas fa-right-from-bracket"></i> Log out</a>
                    </li>
                </ul>
                </div>

                <div className="dash-r">
                    {renderActiveSection()}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
