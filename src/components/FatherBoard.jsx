import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FatherBoard = () => {
    const [links, setLinks] = useState([]);
    const [totalClicks, setTotalClicks] = useState(0);
    const [clicksByDate, setClicksByDate] = useState([]);
    const [clicksByDevice, setClicksByDevice] = useState([]);

    useEffect(() => {
        const fetchLinks = async () => {
            const username = localStorage.getItem('fp2_username');
            try {
                const response = await fetch('http://localhost:5000/links');
                const data = await response.json();
                console.log(data)
                const userLinks = data.filter(link => link.owner === username);
                setLinks(userLinks);
                calculateStatistics(userLinks);
            } catch (error) {
                console.error('Failed to fetch links:', error);
            }
        };

        fetchLinks();
    }, []);

    const calculateStatistics = (userLinks) => {
        let total = 0;
        let clicksDate = {};
        let clicksDevice = {};

        userLinks.forEach(link => {
            link.clicks.forEach(click => {
                total += 1;
                const date = click.click_time.split('T')[0];
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
            });
        });

        setTotalClicks(total);
        setClicksByDate(Object.keys(clicksDate).map(key => ({ date: key, clicks: clicksDate[key] })));
        setClicksByDevice(Object.keys(clicksDevice).map(key => ({ device: key, clicks: clicksDevice[key] })));
    };

    return (
        <div>
            <h1>Link Statistics</h1>
            <p>Total Clicks: {totalClicks}</p>
            <BarChart width={600} height={300} data={clicksByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clicks" fill="#8884d8" />
            </BarChart>
            <BarChart width={600} height={300} data={clicksByDevice}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clicks" fill="#82ca9d" />
            </BarChart>
        </div>
    );
};

export default FatherBoard;
