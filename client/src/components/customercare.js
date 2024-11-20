// CustomerCare.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CustomerCare() {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:7000/queries');
                setQueries(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching queries:', error);
                setError('Failed to fetch queries. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSolvedClick = async (id) => {
        try {
            await axios.post(`http://localhost:7000/queries/${id}/markAsSolved`);
            setQueries(prevQueries =>
                prevQueries.map(query =>
                    query._id === id ? { ...query, solved: true } : query
                )
            );
        } catch (error) {
            console.error('Error marking query as solved:', error);
        }
    };

    const handleRemoveClick = async (id) => {
        try {
            await axios.delete(`http://localhost:7000/queries/${id}`);
            setQueries(prevQueries =>
                prevQueries.filter(query => query._id !== id)
            );
        } catch (error) {
            console.error('Error removing query:', error);
        }
    };

    const handleEmailClick = (email) => {
        window.location.href = `mailto:${email}`;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="customer-care-container">
            <h1 style={{ marginLeft: "1vw" }}>Customer Queries</h1>
            <div className="queries-scroll-container">
                <ul className="query-list">
                    {queries.map(query => (
                        <li key={query._id} className="query-item">
                            <p><strong>Name:</strong> {query.name}</p>
                            <p><strong>Email:</strong> {query.email}</p>
                            <p><strong>Subject:</strong> {query.subject}</p>
                            <p><strong>Message:</strong> {query.message}</p>
                            <div className="button-container">
                                {!query.solved ? (
                                    <button
                                        onClick={() => handleSolvedClick(query._id)}
                                        className="mark-solved"
                                    >
                                        Mark as Solved
                                    </button>
                                ) : (
                                    <button style={{backgroundColor:"green"}} className="solved-button" disabled>
                                        Solved
                                    </button>
                                )}
                                <button onClick={() => handleRemoveClick(query._id)}>Remove</button>
                                <button onClick={() => handleEmailClick(query.email)}>Message</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CustomerCare;
