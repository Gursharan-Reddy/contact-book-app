import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';
import { FaSearch } from 'react-icons/fa';

// This line is crucial for deployment.
// It tells the app to use the live Render URL when deployed on Vercel,
// and 'http://localhost:5000' when running on your local computer.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // To show a loading state initially
  const [error, setError] = useState(''); // To show fetch errors

  // A single function to fetch contacts based on the current state
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

  // useEffect hook to fetch contacts when the page or search term changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchContacts();
    }, 500); // Debounce to prevent API calls on every keystroke

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);


  // Handler to add a new contact and then refresh the list
  const handleAddContact = async (contact) => {
    try {
      await axios.post(`${API_URL}/contacts`, contact);
      // After adding, go to page 1 to see the new contact
      if (currentPage !== 1) setCurrentPage(1);
      else fetchContacts(); // Or just refetch if already on page 1
    } catch (err) {
      console.error("Error adding contact:", err);
    }
  };

  // Handler to delete a contact and then refresh the list
  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/contacts/${id}`);
      // If the last item on a page is deleted, go to the previous page
      if (contacts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchContacts(); // Otherwise, just refresh the current page
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
