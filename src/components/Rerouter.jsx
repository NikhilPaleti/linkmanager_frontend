import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css'; 

const Rerouter = () => {
    const { hash } = useParams();
    const navigate = useNavigate();
    const [browserName, setBrowserName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const fetchLinkData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/link/${localStorage.getItem('fp2_username')}/${hash}`);
                const data = await response.json();
                // console.log("hash", data)
                if (response.ok) {
                    // console.log(data.original_link)

                    window.location.href = data.original_link;
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error('Error fetching link data:', error);
            }
        };

        const getBrowserName = () => {
            const userAgent = navigator.userAgent;
            let browser = 'Unknown';
            if (userAgent.indexOf('Chrome') > -1) {
                browser = 'Chrome';
            } else if (userAgent.indexOf('Firefox') > -1) {
                browser = 'Firefox';
            } else if (userAgent.indexOf('Safari') > -1) {
                browser = 'Safari';
            } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
                browser = 'Internet Explorer';
            }
            setBrowserName(browser);
        };

        const getIpAddress = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get-ip`)
                // const response = await fetch('https://api.ipify.org?format=json'); // Some stupid hacky way to get IP address. 
                const data = await response.json();
                console.log("dayta", data)
                setIpAddress(data.ip);
            } catch (error) {
                console.error('Error fetching IP address:', error);
            }
        };


        const getCurrentTime = () => {
            const now = new Date();
            setCurrentTime(now.toString());
        };

        fetchLinkData();
        getBrowserName();
        getIpAddress();
        getCurrentTime();
        
    }, [hash]);

    return (
        <div>
            <p>Browser: {browserName}</p>
            <p>IP Address: {ipAddress}</p>
            <p>Current Time: {currentTime}</p>
        </div>
    );
};

export default Rerouter;
