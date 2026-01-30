import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, Music, Chrome } from 'lucide-react';

import Register from './Register';
import TrueFocus from './ui/TrueFocus';

const Login = () => {
    const { login, loginGoogle } = useAuth();
    const { t } = useLanguage();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            console.error("Login failed:", err);
            alert("Login Failed: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isRegistering) {
        return <Register onSwitchToLogin={() => setIsRegistering(false)} />;
    }

    return (
        <div className="login-container">
            <div className="login-card glass">
                <div className="login-header">
                    <div className="logo-pulse mb-8">
                        <div className="scale-[0.75] origin-center">
                            <TrueFocus
                                sentence="Vibe Music Me"
                                manualMode={false}
                                blurAmount={5}
                                borderColor="#00F2FF"
                                animationDuration={0.5}
                                pauseBetweenAnimations={1.5}
                            />
                        </div>
                    </div>
                    <h1>{t('welcomeBack')}</h1>
                    <p>{t('studioAwaits')}</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <Mail size={18} className="input-icon" />
                        <input
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            placeholder={t('passwordPlaceholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="primary-btn glow" disabled={isLoading}>
                        {isLoading ? t('signingIn') : t('signIn')}
                    </button>
                </form>

                <div className="divider"><span>{t('or')}</span></div>

                <button onClick={loginGoogle} className="google-btn">
                    <Chrome size={18} />
                    <span>{t('continueWithGoogle')}</span>
                </button>

                <button
                    onClick={() => login('guest@vibe.music', 'guest123')}
                    className="guest-btn"
                >
                    {t('continueAsGuest')}
                </button>

                <p className="switch-mode">
                    {t('dontHaveAccount')}{' '}
                    <span onClick={() => setIsRegistering(true)}>
                        {t('signUp')}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
