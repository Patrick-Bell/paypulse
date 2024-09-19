import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/PayslipDetail.css';

function PayslipDetail() {
    const [payslip, setPayslip] = useState(null); 
    const [error, setError] = useState(null);
    const [user, setUser] = useState({});
    const { id } = useParams(); // Extract the payslip ID from the URL parameters

    useEffect(() => {
        const fetchPayslipInfo = async () => {
            try {
                const response = await axios.get(`/api/payslips/${id}`);
                setPayslip(response.data);  
                setError(null);
            } catch (e) {
                console.error(e);
                setError('Failed to fetch payslip data');
            }
        };
        fetchPayslipInfo();
    }, [id]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`/api/payslip-user-info/${id}`);
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


    if (!payslip) {
        return <div>Loading...</div>; // Display a loading message while the data is being fetched
    }

    return (
        <div className='payslip-wrapper'>
            <div className='header'>
                <div className='company-info'>
                    <h2>Pay Pulse</h2>
                    <p>Generated on: {new Date(payslip.created_at).toLocaleDateString()}</p>
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
            <strong>Pay Period:</strong> {new Date(new Date(payslip.start_date).getFullYear(), new Date(payslip.start_date).getMonth(), 1).toLocaleDateString('en-GB')} to {new Date(new Date(payslip.end_date).getFullYear(), new Date(payslip.end_date).getMonth(), 0).toLocaleDateString('en-GB')}
            </p>
                <p><strong>Total Hours:</strong> {payslip.month_hours}</p>
                <p><strong>Number of Shifts:</strong> {payslip.number_of_shifts}</p>
            </div>

            <table className='payslip-table'>
                <thead>
                    <tr>
                        <th>Wages & Earnings</th>
                        <th>Hours/Units</th>
                        <th>Rate</th>
                        <th className='total-netpay'>Total Pay</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Basic Pay</td>
                        <td>{payslip.month_hours}</td>
                        <td>{formatCurrency(payslip.month_pay / payslip.month_hours ? payslip.month_pay / payslip.month_hours : 0)}</td> {/* Calculate hourly rate */}
                        <td><strong>{formatCurrency(payslip.month_pay)}</strong></td>
                    </tr>
                </tbody>
            </table>

            <table className='payslip-table'>
                <thead>
                    <tr>
                        <th>Tax</th>
                        <th></th>
                        <th></th>
                        <th className='total-netpay'></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tax Deducted (PAYE)</td>
                        <td></td>
                        <td></td>
                        <td><strong>- {formatCurrency(payslip.month_tax)}</strong></td>
                    </tr>
                </tbody>
            </table>

            <table className='payslip-table'>
                <thead>
                    <tr>
                        <th>Net Pay</th>
                        <th></th>
                        <th></th>
                        <th className='total-netpay'></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Net Pay</td>
                        <td></td>
                        <td></td>
                        <td><strong>{formatCurrency(payslip.month_netpay)}</strong></td>
                    </tr>
                </tbody>
            </table>

            <table className='payslip-table'>
                <thead>
                    <tr>
                        <th>Year to Date (YTD)</th>
                        <th>Hours/Units</th>
                        <th>Tax</th>
                        <th className='total-netpay'>Total Pay</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total YTD</td>
                        <td>{payslip.to_date_hours}</td>
                        <td>{formatCurrency(payslip.to_date_tax)}</td>
                        <td><strong>{formatCurrency(payslip.to_date_pay)}</strong></td>
                    </tr>
                </tbody>
            </table>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default PayslipDetail;
