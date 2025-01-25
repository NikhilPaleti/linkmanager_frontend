import React, { useState, useEffect } from 'react';

const AnalyticBoard = () => {
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const clicksPerPage = 10;
  const baseURL = window.location.origin; 

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const username = localStorage.getItem('fp2_username');
      const response = await fetch(`https://linkmanager-backend.onrender.com/links?username=${username}`);
      const data = await response.json(); 
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const totalClicks = links.reduce((acc, link) => acc + link.clicks.length, 0);
  const totalPages = Math.ceil(totalClicks / clicksPerPage);
  const currentClicks = [];

  links.forEach(link => {
    link.clicks.forEach(click => {
      currentClicks.push({
        click_time: click.click_time,
        original_link: link.original_link,
        short_link: link.short_link,
        ip_addr: click.ip_addr,
        user_device: click.user_device,
      });
    });
  });

  const indexOfLastClick = currentPage * clicksPerPage;
  const indexOfFirstClick = indexOfLastClick - clicksPerPage;
  const displayedClicks = currentClicks.slice(indexOfFirstClick, indexOfLastClick);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  return (
    <div className="analyticboard-container">
      {currentClicks.length === 0 ? (
        <p className="no-clicks">No clicks found</p>
      ) : (
        <>
          <table className="analyticboard-table">
            <thead>
              <tr className="table-header">
                <th>Click Time</th>
                <th>Original URL</th>
                <th>Short URL</th>
                <th>IP Address</th>
                <th>User Device</th>
              </tr>
            </thead>
            <tbody>
              {displayedClicks.map((click, index) => (
                <tr key={index} className="table-row">
                  <td>{new Date(click.click_time).toLocaleString()}</td>
                  <td>{click.original_link}</td>
                  <td>
                    <a href={`${baseURL}/${click.short_link}`} className="short-url">
                      {`${baseURL}/${click.short_link}`}
                    </a>
                  </td>
                  <td>{click.ip_addr}</td>
                  <td>{click.user_device}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="prev-button"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="next-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticBoard;
