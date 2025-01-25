import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css'; 
import logoutIcon from '../assets/logout.svg';
import DashboardIcon  from '../assets/Dashboard.svg'
import SettingsIcon from '../assets/setting.svg';
import LinksIcon from '../assets/links.svg';
import AnalyticsIcon from '../assets/analytics.svg';
import FatherBoard from './FatherBoard';
import Settings from './Settings';
import LinkBoard from './LinkBoard';
import AnalyticBoard from './AnalyticBoard';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasExpiry, setHasExpiry] = useState(false);
    const [formData, setFormData] = useState({
        original_link: '',
        remarks: '',
        expiry_date: ''
    });

    const getGreeting = () => {
        const hour = new Date().getHours();
        const useris = localStorage.getItem('fp2_username');
        if (hour < 12) return 'Good Morning, '+useris;
        if (hour < 18) return 'Good Afternoon, '+useris;
        return 'Good Evening, '+useris;
    };

    const handleLogout = () => {
        localStorage.removeItem('fp2_user_jwt')
        localStorage.removeItem('fp2_username')
        window.location.href = '/'
    };

    const handleCreateLink = async () => {
        try {
            const response = await fetch('http://localhost:5000/createlinks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    expiry_date: hasExpiry ? formData.expiry_date : null,
                    owner: localStorage.getItem('fp2_username')
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Link created successfully!');
                setIsModalOpen(false);
                setFormData({ original_link: '', remarks: '', expiry_date: '' });
            } else {
                toast.error(data.error || 'Failed to create link');
            }
        } catch (error) {
            toast.error('Error creating link');
        }
    };

    const icons = {
        Dashboard: DashboardIcon,
        Analytics: AnalyticsIcon,
        Links: LinksIcon,
        Settings: SettingsIcon,
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <img src="logo.png" alt="Company Logo" className="logo" />
                <h2 className='deadToMe'>{getGreeting()}</h2>
                <button className="create-button" onClick={() => setIsModalOpen(true)}>Create New</button>
                <img className="logout-button" alt='Logout Button' src={logoutIcon} onClick={() => handleLogout()} />
            </header>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Create New Link</h3>
                        <form className='pseudo-content' onSubmit={handleCreateLink}>
                        <input
                            type="url"
                            placeholder="Original URL"
                            value={formData.original_link}
                            onChange={(e) => setFormData({...formData, original_link: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Enter remarks"
                            value={formData.remarks}
                            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                        />
                        <div className="expiry-toggle">
                            <label style={{display:"flex", flexDirection:"row", justifyContent:'space-evenly', width:"100%"}}>
                            Link Expiration
                                <input
                                    type="checkbox"
                                    checked={hasExpiry}
                                    style={{height:'1.5rem'}}
                                    onChange={(e) => setHasExpiry(e.target.checked)}
                                />
                                
                            </label>
                        </div>
                        {hasExpiry && (
                            <input
                                type="date"
                                placeholder="Link Expiry Date"
                                value={formData.expiry_date}
                                onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                            />
                        )}
                        <div className="modal-footer">
                            <button style={{backgroundColor:"#00000000", color: "black"}} onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button>Confirm</button> 
                        {/* onClick={handleCreateLink} */}
                        </div>
                    </form>
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                <nav className="sidebar">
                    {['Dashboard', 'Links', 'Analytics', 'Settings'].map(tab => (
                        <div 
                            key={tab} 
                            className={`tab ${activeTab === tab ? 'active-dash' : ''}`} 
                            onClick={() => setActiveTab(tab)}
                        >
                            <img src={icons[tab]} alt={`${tab} Icon`} />
                            <p className='deadToMe'>{tab}</p>
                        </div>
                    ))}
                </nav>
                <div className="main-content">
                    {activeTab === 'Dashboard' && <FatherBoard />}
                    {activeTab === 'Links' && <LinkBoard />}
                    {activeTab === 'Analytics' && <AnalyticBoard />}
                    {activeTab === 'Settings' && <Settings />}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Dashboard;
