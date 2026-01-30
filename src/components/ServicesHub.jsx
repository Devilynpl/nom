import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVibePoints } from '../hooks/useVibePoints';
import { Briefcase, CheckCircle, Search, Star } from 'lucide-react';
import './ServicesHub.css';

// Asset Imports
import imgMixer from '../assets/images/mixer2.png';
import imgPads from '../assets/images/pads.jpg';
import imgMic from '../assets/images/microphone.png';
import imgArt from '../assets/images/vibe_portal1_mixer.jpeg'; // Using 'vibe_portal1_mixer.jpeg' as placeholder for Art for now, or maybe generic.

const ServicesHub = () => {
    const { user } = useAuth();
    const { points, refreshPoints } = useVibePoints();
    const [services, setServices] = useState([]);

    // ... imports ...
    const [filter, setFilter] = useState('All');
    const [booking, setBooking] = useState(null); // ID of service being booked

    useEffect(() => {
        fetch('http://localhost:5000/api/services')
            .then(res => res.json())
            .then(data => setServices(data));
    }, []);

    const handleBook = async (service) => {
        if (!user) return alert('Login required');
        if (points < service.price) return alert('Not enough Vibe Points!');

        if (!window.confirm(`Confirm booking: ${service.title} for ${service.price} VP?`)) return;

        setBooking(service.id);
        try {
            const res = await fetch('http://localhost:5000/api/services/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceId: service.id, userId: user.id })
            });
            const data = await res.json();

            if (data.success) {
                alert(data.message);
                refreshPoints();
            } else {
                alert(data.error);
            }
        } catch (e) {
            alert('Booking failed');
        }
        setBooking(null);
    };

    // Image Mapping
    const getImage = (id) => {
        const map = {
            's1': imgMixer,
            's2': imgPads,
            's3': imgArt,
            's4': imgMic,
            's5': imgMixer // Fallback
        };
        return map[id] || imgMixer;
    };

    const filtered = filter === 'All' ? services : services.filter(s => s.category === filter);

    return (
        <div className="services-container animate-fade">
            <div className="hub-header">
                <h1>Services Hub</h1>
                <p>Hire top-tier talent or license exclusive assets.</p>
                <div className="balance-tag">Your Balance: {points} VP</div>
            </div>

            <div className="hub-filters">
                {['All', 'Engineering', 'Production', 'Creative', 'Business'].map(cat => (
                    <button
                        key={cat}
                        className={filter === cat ? 'active' : ''}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="services-grid">
                {filtered.map(service => (
                    <div key={service.id} className="service-card glass">
                        <div className="card-image-wrapper">
                            <img src={getImage(service.id)} alt={service.title} className="service-image" />
                        </div>
                        <div className="card-info">
                            <h3>{service.title}</h3>
                            <span className="provider">by {service.provider}</span>
                            <div className="rating">
                                <Star size={12} fill="#ffd700" color="#ffd700" /> 5.0 (Mock)
                            </div>
                        </div>
                        <div className="card-action">
                            <div className="price">{service.price} VP</div>
                            <button
                                onClick={() => handleBook(service)}
                                disabled={booking === service.id}
                                className="book-btn"
                            >
                                {booking === service.id ? 'Processing...' : 'Book Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesHub;
