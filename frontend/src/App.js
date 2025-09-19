import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';
import { FaSearch } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchContacts = () => {
    setLoading(true);
    setError('');
    axios.get(`${API_URL}/contacts?page=${currentPage}&limit=5&q=${searchTerm}`)
      .then(response => {
        setContacts(response.data.contacts);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching contacts:", err);
        setError('Failed to fetch contacts. The backend server might be asleep.');
        setLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchContacts();
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);


  const handleAddContact = async (contact) => {
    try {
      await axios.post(`${API_URL}/contacts`, contact);
      if (currentPage !== 1) setCurrentPage(1);
      else fetchContacts(); 
    } catch (err) {
      console.error("Error adding contact:", err);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/contacts/${id}`);
      if (contacts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchContacts(); 
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  return (
    <div className="App">
      <h1>Contact Book</h1>
      <ContactForm onAdd={handleAddContact} />
      
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search contacts..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p>Loading contacts...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <ContactList contacts={contacts} onDelete={handleDeleteContact} />
      )}
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default App;
