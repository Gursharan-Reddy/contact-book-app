// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';
import { FaSearch } from 'react-icons/fa'; // Import the search icon

const API_URL = 'http://localhost:5000';

function App() {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  // Add a state for a custom profile image URL if you want,
  // but for Ghibli style, we'll use a dynamic approach in ContactList.js
  // For now, no new state needed here.

  const fetchContacts = async (page, search) => {
    try {
      const response = await axios.get(`${API_URL}/contacts?page=${page}&limit=5&q=${search}`);
      setContacts(response.data.contacts);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchContacts(currentPage, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);

  const handleAddContact = async (contact) => {
    try {
      await axios.post(`${API_URL}/contacts`, contact);
      fetchContacts(1, searchTerm);
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/contacts/${id}`);
      if (contacts.length === 1 && currentPage > 1) {
        fetchContacts(currentPage - 1, searchTerm);
      } else {
        fetchContacts(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  }

  return (
    <div className="App">
      <h1>Contact Book</h1>
      <ContactForm onAdd={handleAddContact} />
      
      {/* Update the search container to include an icon */}
      <div className="search-container">
        <FaSearch className="search-icon" /> {/* Search icon */}
        <input
          type="text"
          placeholder="Search contacts..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ContactList contacts={contacts} onDelete={handleDeleteContact} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default App;