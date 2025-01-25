import React, { useState, useEffect } from 'react';
import DeleteIcon from '../assets/delete.svg';
import EditIcon from '../assets/pencil.svg';
import cpImg from '../assets/copy.svg';

const LinkBoard = () => {
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const linksPerPage = 10;
  const baseURL = window.location.origin; 
  const [hasExpiry, setHasExpiry] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    original_link: '',
    remarks: '',
    expiry_date: ''
  });

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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://linkmanager-backend.onrender.com/link/${localStorage.getItem('fp2_username')}/${id}`, {
        method: 'DELETE' 
      });
      
      if (response.ok) {
        fetchLinks(); 
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleEdit = async (hash) => {
    try {
      const response = await fetch(`https://linkmanager-backend.onrender.com/link/${localStorage.getItem('fp2_username')}/${hash}`);
      const data = await response.json();
      setEditingLink(data);
      setFormData({
        original_link: data.original_link,
        remarks: data.remarks || '',
        expiry_date: data.expiry_date ? new Date(data.expiry_date).toISOString().split('T')[0] : ''
      });
      setHasExpiry(!!data.expiry_date);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching link details:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://linkmanager-backend.onrender.com/link/${localStorage.getItem('fp2_username')}/${editingLink.short_link}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setShowEditModal(false);
        fetchLinks();
      }
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  const filteredLinks = links.filter(link => 
    link.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);

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
          <div className="search-container" style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search by remarks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                width: '250px'
              }}
            />
          </div>

          <table className="linkboard-table">
            <thead>
              <tr className="table-header">
                <th>Original URL</th>
                <th>Short URL</th>
                <th>Remarks</th>
                <th>Total Clicks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLinks.map((link) => (
                <tr key={link.short_link} className="table-row">
                  
                  <td>{link.original_link}</td>
                  <td>
                    <div 
                      onClick={() => navigator.clipboard.writeText(`${baseURL}/${link.short_link}`)} 
                      className="short-url" 
                      style={{cursor: 'pointer'}}
                    >
                      {`${baseURL}/${link.short_link}`}
                      <img src={cpImg} alt="Copy thingie" style={{padding:'auto', marginLeft:'0.5rem'}}/>
                    </div>
                  </td>
                  <td>{link.remarks}</td>
                  <td>{link.clicks.length}</td>
                  <td>
                    {link.expiry_date ? (
                      new Date() < new Date(link.expiry_date) ? 
                        "Active" : 
                        "Inactive"
                    ) : "Active"}
                  </td>
                  <td style={{display:'flex', flexDirection:'row'}}>
                    <button
                      onClick={() => handleDelete(link.short_link)}
                      className="delete-button"
                    >
                      <img src={DeleteIcon} style={{color:'#ff0000'}} alt="DELETE BRO" />
                    </button>
                    <button
                      onClick={() => handleEdit(link.short_link)}
                      className="edit-button"
                    >
                      <img src={EditIcon} style={{color:'black'}} alt="Edit" />
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

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Link</h3>
            <form className='pseudo-content' onSubmit={handleUpdate}>
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
                            onChange={(e) => {
                                setHasExpiry(e.target.checked);
                                if (!e.target.checked) {
                                    setFormData({...formData, expiry_date: ''});
                                }
                            }}
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
                <button style={{backgroundColor:"#00000000", color: "black"}} type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="save-button">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkBoard;