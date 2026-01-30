import React from 'react';
import './Profile.css';
import { Disc, Users, Star, Settings, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Profile = ({ user }) => {
    const { t } = useLanguage();
    if (!user) return null;

    // Calculate progress to Vinyl
    const VINYL_GOAL = 50000;
    const progress = Math.min((user.vibePoints / VINYL_GOAL) * 100, 100);

    return (
        <div className="profile-container animate-fade">
            <div className="profile-header glass">
                <div className="profile-avatar-large"></div>
                <div className="profile-info">
                    <h1>{user.name}</h1>
                    <p className="handle">@{user.id || 'alex_vibe'}</p>
                    <div className="badges">
                        <span className="badge">{t('badgeProducer')}</span>
                        <span className="badge">{t('badgeVerified')}</span>
                    </div>
                </div>
                <button className="settings-btn"><Settings size={20} /></button>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <div className="stat-icon"><Star className="accent-red" size={24} /></div>
                    <div className="stat-value">{user.vibePoints.toLocaleString()}</div>
                    <div className="stat-label">{t('statVibePoints')}</div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon"><Disc className="accent-cyan" size={24} /></div>
                    <div className="stat-value">{user.tracks.length}</div>
                    <div className="stat-label">{t('statTracks')}</div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-value">12.5k</div>
                    <div className="stat-label">{t('statFans')}</div>
                </div>
            </div>

            <div className="vinyl-goal-card glass">
                <div className="vinyl-header">
                    <h3>{t('vinylGoalTitle')}</h3>
                    <span>{user.vibePoints.toLocaleString()} / {VINYL_GOAL.toLocaleString()} {t('vinylPoints')}</span>
                </div>
                <div className="progress-container">
                    <div
                        className="progress-track"
                        data-testid="vinyl-progress"
                    >
                        <div
                            className="progress-fill"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                </div>
                <p className="goal-desc">
                    {progress >= 100
                        ? t('vinylCongrats')
                        : `${t('earn')} ${(user.vinylThreshold - user.vibePoints).toLocaleString()} ${t('vinylMorePoints')}`}
                </p>
            </div>

            <div className="profile-utility-grid">
                <div className="referral-section glass">
                    <h3>{t('refLink')}</h3>
                    <p>{t('refDesc')}</p>
                    <div className="link-copy">
                        <code>{user.referralLink}</code>
                        <button className="premium-button">{t('copy')}</button>
                    </div>
                </div>

                <div className="points-info glass">
                    <h3>{t('waysToEarn')}</h3>
                    <ul>
                        <li><strong>{t('earnRate')}:</strong> {t('earnRateDesc')}</li>
                        <li><strong>{t('earnUpload')}:</strong> {t('earnUploadDesc')}</li>
                        <li><strong>{t('earnRefer')}:</strong> {t('earnReferDesc')}</li>
                    </ul>
                </div>
            </div>

            <div className="my-tracks">
                <h2>{t('myReleases')}</h2>
                <div className="track-grid">
                    {user.tracks.map(track => (
                        <div key={track.id} className="mini-track-card glass">
                            <div className="mini-art"></div>
                            <div className="mini-info">
                                <h4>{track.title}</h4>
                                <div className="rating">⭐ {track.rating}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
