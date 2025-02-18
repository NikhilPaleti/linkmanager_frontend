import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css'; 
import { click } from '@testing-library/user-event/dist/click';

const Rerouter = () => {
    const { hash } = useParams();
    const navigate = useNavigate();
    const [browserName, setBrowserName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [currentTime, setCurrentTime] = useState('');



    useEffect(() => {
        function getBrowserName() {
            const test = regexp => {
              return regexp.test(navigator.userAgent);
            };
          
            // console.log(navigator.userAgent);
          
            if (test(/opr\//i) || !!window.opr) {
              return 'Opera';
            } else if (test(/edg/i)) {
              return 'MS Edge';
            } else if (test(/chrome|chromium|crios/i)) {
              return 'Chromium';
            } else if (test(/firefox|fxios/i)) {
              return 'Firefox';
            } else if (test(/safari/i)) {
              return 'Safari';
            } else if (test(/trident/i)) {
              return 'IExplorer';
            } else {
              return 'Unknown';
            }
          }
          
          const browserType = getBrowserName();
          setBrowserName(browserType);

        //     const getBrowserName = () => {
        //     const userAgent = navigator.userAgent;
        //     let browser = 'Unknown';
        //     console.log(userAgent)
        //     if (userAgent.indexOf('Chrome') > -1) {
        //         browser = 'Chrome';
        //     } else if (userAgent.indexOf('Firefox') > -1) {
        //         browser = 'Firefox';
        //     } else if (userAgent.indexOf('Safari') > -1) {
        //         browser = 'Safari';
        //     } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
        //         browser = 'Internet Explorer';
        //     }
        //     setBrowserName(browser);
        // };

        const getIpAddress = async () => {
            try {
                const response = await fetch(`https://linkmanager-backend.onrender.com/get-ip`)
                // const response = await fetch('https://api.ipify.org?format=json'); // Some stupid hacky way to get IP address. 
                const data = await response.json();
                // console.log("dayta", data)
                setIpAddress(data.ip);
            } catch (error) {
                toast.error('Error fetching IP address:', error);
            }
        };


        const getCurrentTime = () => {
            const now = new Date().toISOString();
            setCurrentTime(now.toString());
        };
        
        getBrowserName();
        getIpAddress();
        getCurrentTime();

    }, [hash]);

    // useEffect(()=>{
        
    // }, [currentTime])

    useEffect(() => {
        const fetchLinkData = async () => {
            try {
                const response = await fetch(`https://linkmanager-backend.onrender.com/link/${hash}`);
                const data = await response.json();
                // console.log("dtaya ", data)
                if (response.ok) {
                    if (ipAddress && browserName && currentTime){
                        const clickData = {
                            click_time: currentTime,
                            ip_addr: ipAddress.split(",")[0].trim(), //PURELY EXPERIMENTAL CODE. On Jio networks, I observed that 3 IP addrresses are returned. So this will make sure only the first is recorded.
                            user_device: browserName
                        };
                    

                    // console.log("hoyla", clickData);
                    await fetch(`https://linkmanager-backend.onrender.com/editclick/${hash}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ clickData }),
                    });

                    if (currentTime){
                        var date1 = currentTime;
                        var date2 = data.expiry_date;
                        if (date1 < date2) {
                            window.location.href = data.original_link;
                          } 
                          else if (!date2) {
                            window.location.href = data.original_link;
                          }
                            else {
                            toast.error("THE LINK IS EPIRED. LEARN TO BE FAST")
                          }
                        // const differenceInMilliseconds = date2 - date1;

                        // const differenceInMilliseconds = data.expiry_date - currentTime;
                        // console.log(currentTime, data.expiry_date)
                        // console.log("who", differenceInMilliseconds)
                    }
                }
                } else {
                    toast.error(data.error);
                }
            } catch (error) {
                toast.error('Error fetching link data:', error);
            }
        };
        
        fetchLinkData();
    }, [ipAddress])

    return (
        <div>
            <ToastContainer></ToastContainer>
            <p>Browser: {browserName}</p>
            <p>IP Address: {ipAddress}</p>
            <p>Current Time: {currentTime}</p>
        </div>
    );
};

export default Rerouter;
