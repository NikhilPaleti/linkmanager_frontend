import React, { useState, useEffect } from 'react';
import DeleteIcon from '../assets/delete.svg';
import EditIcon from '../assets/pencil.svg'

const LinkBoard = () => {
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 10;
  const baseURL = window.location.origin; 

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('http://localhost:5000/links');
      const data = await response.json(); 
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/link/${localStorage.getItem('fp2_username')}/${id}`, {
        method: 'DELETE' 
      });
      
      if (response.ok) {
        fetchLinks(); 
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const totalPages = Math.ceil(links.length / linksPerPage);
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = links.slice(indexOfFirstLink, indexOfLastLink);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [links, currentPage, totalPages]);

  return (
    <div className="linkboard-container">
      {links.length === 0 ? (
        <p className="no-links">No links found</p>
      ) : (
        <>
          <table className="linkboard-table">
            <thead>
              <tr className="table-header">
                <th>Original URL</th>
                <th>Short URL</th>
                <th>Remarks</th>
                <th>Total Clicks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLinks.map((link) => (
                <tr key={link.short_link} className="table-row">
                  
                  <td>{link.original_link}</td>
                  <td>
                    <a href={`${baseURL}/${link.short_link}`} className="short-url">
                      {`${baseURL}/${link.short_link}`}
                    </a>
                  </td>
                  <td>{link.remarks}</td>
                  <td>{link.clicks}</td>
                  <td style={{display:'flex', flexDirection:'row'}}>
                    <button
                      onClick={() => handleDelete(link.short_link)}
                      className="delete-button"
                    >
                      <img src={DeleteIcon} style={{color:'#ff0000'}} alt="DELETE BRO" />
                    </button>
                    <button
                      onClick={() => window.location.href = `/edit/${link._id}`}
                      className="edit-button"
                    >
                      <img src={EditIcon} style={{color:'black'}} alt="Edit thems" />
                    </button>
                  </td>
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

export default LinkBoard;