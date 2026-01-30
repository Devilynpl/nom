import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import './Register.css';

const Register = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const { addNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }
            if (!username.trim()) {
                throw new Error('Username is required');
            }

            await register(email, password, { username });
            addNotification('Registration successful! Welcome to VibeMusic.', 'success');
        } catch (err) {
            console.error(err);
            addNotification(err.message || 'Registration failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card glass">
                <div className="register-header">
                    <h2>Join VibeMusic</h2>
                    <p className="text-muted">Create your sonic identity.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <User size={18} />
                        <input
                            type="text"
                            placeholder="dj_vibe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <Mail size={18} />
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <Lock size={18} />
                        <input
                            type="password"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="register-btn"
                    >
                        {isLoading ? 'Creating Account...' : (
                            <>
                                <UserPlus size={20} />
                                Sign Up
                            </>
                        )}
                    </button>
                </form>

                <div className="switch-mode">
                    Already have an account?
                    <button onClick={onSwitchToLogin}>
                        Log in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
