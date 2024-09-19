import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/PayslipDetail.css';

function P60Detail() {
    const [p60, setP60] = useState(null); 
    const [error, setError] = useState(null);
    const [user, setUser] = useState({});
    const { id } = useParams(); // Extract the payslip ID from the URL parameters

    useEffect(() => {
        const fetchP60Info = async () => {
            try {
                const response = await axios.get(`/api/p60s/${id}`);
                setP60(response.data);  
                setError(null);
            } catch (e) {
                console.error(e);
                setError('Failed to fetch payslip data');
            }
        };
        fetchP60Info();
    }, [id]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`/api/p60-user-info/${id}`);
                const user = response.data.user || {}; // Extract user data
                setUser(user);
                setError(null);
            } catch (e) {
                console.error(e);
                setError('Failed to fetch user data');
            }
        };
        fetchUserInfo();
    }, [id]);

    const formatCurrency = (amount) => {
        return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };


    if (!p60) {
        return <div>Loading...</div>; // Display a loading message while the data is being fetched
    }

    return (
        <div className='payslip-wrapper'>
            <div className='header'>
                <div className='company-info'>
                    <h2>Pay Pulse</h2>
                    <p>Generated on: {new Date(p60.created_at).toLocaleDateString()}</p>
                </div>
                <div className='customer-info'>
                    <h2>{user.username || 'N/A'}</h2>
                    <p>{user.email || 'N/A'}</p>
                    <p>{user.address_line_1 || 'N/A'}</p>
                    <p>{user.address_line_2 || 'N/A'}</p>
                    <p>{user.postal_code || 'N/A'}</p>
                </div>
            </div>

            <div className='payslip-summary'>
            <p>
            <strong>Pay Period:</strong> 01/01/2024 - 31/12/2024
            </p>
                <p><strong>Total Hours:</strong> {p60.yearly_hours}</p>
                <p><strong>Number of Shifts:</strong> {p60.yearly_number_of_shifts}</p>
            </div>
            
            <table className='payslip-table'>
                <thead>
                    <tr>
                        <th>Year to Date (YTD)</th>
                        <th>Hours/Units</th>
                        <th>Gross Pay</th>
                        <th>Tax</th>
                        <th className='total-netpay'>Net Pay</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total YTD</td>
                        <td>{p60.yearly_hours}</td>
                        <td>{p60.yearly_pay}</td>
                        <td>{formatCurrency(p60.yearly_tax)}</td>
                        <td><strong>{formatCurrency(p60.yearly_netpay)}</strong></td>
                    </tr>
                </tbody>
            </table>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default P60Detail;
