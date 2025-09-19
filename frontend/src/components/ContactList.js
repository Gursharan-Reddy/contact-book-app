import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ContactList({ contacts, onDelete }) {
  const handleEdit = (id) => {
    alert(`Edit functionality for contact ID ${id} is not yet implemented.`);
  };

  // Generates a unique, consistent avatar for each contact
  const getProfileImage = (id) => `https://i.pravatar.cc/50?u=${id}`;

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <div key={contact.id} className="contact-item">
          <div className="contact-details">
            <img
              src={getProfileImage(contact.id)}
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