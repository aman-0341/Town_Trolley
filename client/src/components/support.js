import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export default function Support() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate= useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const supportData = {
            name,
            email,
            subject,
            message
        };

        try {
            const response = await axios.post('http://localhost:7000/support', supportData);
            setResponseMessage(response.data.message);
            setTimeout(() => {
                setResponseMessage('');
                navigate("/home")
            }, 3000); 
        } catch (error) {
            console.error("There was an error submitting the support request!", error);
            setResponseMessage('There was an error submitting your request. Please try again later.');
        }
    };

    return (
        <div className="support-page">
            <h1 className="support-title">Support</h1>
            <p className="support-description">If you have any questions or issues, please fill out the form below and we will get back to you as soon as possible.</p>
            <form className="support-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message" className="form-label">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-textarea"
                        required
                    ></textarea>
                </div>
                <button type="submit" className="form-button">Submit</button>
            </form>
            {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>
    );
}
