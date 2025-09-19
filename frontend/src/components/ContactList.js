import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ContactList({ contacts, onDelete }) {
  const handleEdit = (id) => {
    alert(`Edit functionality for contact ID ${id} is not yet implemented.`);
  };

  const getProfileImage = (name) => {
    return `https://api.dicebear.com/8.x/personas/svg?seed=${encodeURIComponent(name)}`;
  };

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <div key={contact.id} className="contact-item">
          <div className="contact-details">
            <img
              src={getProfileImage(contact.name)}
              alt="Profile"
              className="profile-avatar"
            />
            <div>
              <p><strong>{contact.name}</strong></p>
              <p>{contact.email}</p>
              <p>{contact.phone}</p>
            </div>
          </div>
          <div className="contact-actions">
            <FaEdit className="action-icon" onClick={() => handleEdit(contact.id)} />
            <FaTrash className="action-icon" onClick={() => onDelete(contact.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;
