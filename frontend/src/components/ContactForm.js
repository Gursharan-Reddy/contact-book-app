import React, { useState } from 'react';

function ContactForm({ onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone) {
      setError('Please fill all fields');
      return;
    }

    onAdd({ name, email, phone });
    
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Phone" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
        />
        <button type="submit">Add Contact</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </>
  );
}

export default ContactForm;