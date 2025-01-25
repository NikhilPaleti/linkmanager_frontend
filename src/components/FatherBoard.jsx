import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FatherBoard = () => {
    const [links, setLinks] = useState([]);
    const [totalClicks, setTotalClicks] = useState(0);
    const [clicksByDate, setClicksByDate] = useState([]);
    const [clicksByDevice, setClicksByDevice] = useState([]);

    const calculateStatistics = (userLinks) => {
        let total = 0;
        let clicksDate = {};
        let clicksDevice = {};

        userLinks.forEach(link => {
            link.clicks.forEach(click => {
                total += 1;
                console.log("ummm", click.time)
                if (click.time !== "") {
                    const date = new Date(click.click_time).toDateString();
                    console.log("wein", date)
                    if (clicksDate[date]) {
                        clicksDate[date] += 1;
                    } else {
                        clicksDate[date] = 1;
                    }

                    if (clicksDevice[click.user_device]) {
                        clicksDevice[click.user_device] += 1;
                    } else {
                        clicksDevice[click.user_device] = 1;
                    }
                }
            });
        });

        setTotalClicks(total);
        setClicksByDate(Object.keys(clicksDate).map(key => ({ date: key, clicks: clicksDate[key] })));
        setClicksByDevice(Object.keys(clicksDevice).map(key => ({ device: key, clicks: clicksDevice[key] })));
    };

    useEffect(() => {
        const fetchLinks = async () => {
            const username = localStorage.getItem('fp2_username');
            
            try {
                const response = await fetch(`http://localhost:5000/links?username=${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setLinks(data);
            } catch (error) {
                toast.error(`Failed to fetch links: ${error.message}`);
            }
        };

        fetchLinks();
    }, []);

    useEffect(()=>{
        if (links.length != 0){
            calculateStatistics(links); 
        }
    }, [links])

    // useEffect(() => {
        
    // if (window.innerWidth/window.innerHeight > 1){
    //     setcWidth = window.innerWidth * 0.6;
    //     setcHeight = window.innerHeight *0.35
    // }
    // else{
    //     setcWidth = window.innerWidth * 0.70;
    //     setcHeight = window.innerHeight * 0.45;
    // }
    //   });

    return (
        <div style={{ height:'100%', display: 'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'center'}}>
            <h1>Link Statistics</h1>
            <p>Total Clicks: {totalClicks}</p>
            <div className="barChart-container">
                <div className="bc1">
                    <p>Clicks by Date</p>
            <BarChart width={window.innerWidth*0.6} height={window.innerHeight*0.35} data={clicksByDate} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number"/>
                <YAxis type="category" dataKey="date" width={100}/>
                <Tooltip />
                <Bar dataKey="clicks" fill="#8884d8" />
            </BarChart>
                </div>
            <div className="bc1">
                <p>Clicks by Device</p>
            <BarChart width={window.innerWidth*0.6} height={window.innerHeight*0.35} data={clicksByDevice} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number"/>
                <YAxis type="category" dataKey="device" width={100}/>
                <Tooltip />
                <Bar dataKey="clicks" fill="#82ca9d" />
            </BarChart>
            </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default FatherBoard;