import React, { useState } from 'react';
import './Premium.css';
import { Check, Star, Zap, Crown, Headphones, Heart } from 'lucide-react';

const Premium = ({ onUpgrade }) => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const tiers = [
        {
            name: 'Listener',
            price: 'Free',
            icon: <Star size={24} />,
            features: ['Ad-supported listening', 'Standard Audio Quality', 'Follow 5 Artists'],
            cta: 'Current Plan',
            active: true
        },
        {
            name: 'Listener Pro',
            price: billingCycle === 'monthly' ? '$2.00' : '$20.00',
            period: billingCycle === 'monthly' ? '/mo' : '/yr',
            icon: <Headphones size={24} />,
            color: 'blue',
            features: ['Ad-Free Listening', 'Promote 1 Own Album', 'Join Rankings', 'High Quality Audio'],
            cta: 'Upgrade'
        },
        {
            name: 'Beginner / Supporter',
            price: billingCycle === 'monthly' ? '$4.00' : '$40.00',
            period: billingCycle === 'monthly' ? '/mo' : '/yr',
            icon: <Heart size={24} />,
            color: 'purple',
            features: ['Ad-Free Experience', 'Upload 5 Tracks', 'Basic Analytics', 'Support the Platform', 'Supporter Badge'],
            cta: 'Start Creating'
        },
        {
            name: 'Pro Artist',
            price: billingCycle === 'monthly' ? '$9.99' : '$99.99',
            period: billingCycle === 'monthly' ? '/mo' : '/yr',
            icon: <Zap size={24} />,
            color: 'cyan',
            features: ['Unlimited Uploads', 'Hi-Res Audio (FLAC)', 'Advanced Analytics', 'Verification Badge', 'Keep 100% Royalties'],
            cta: 'Go Pro',
            highlight: true
        },
        {
            name: 'Label',
            price: billingCycle === 'monthly' ? '$49.99' : '$499.99',
            period: billingCycle === 'monthly' ? '/mo' : '/yr',
            icon: <Crown size={24} />,
            color: 'gold',
            features: ['Manage 5 Artists', 'Priority Support', 'Trend Forecasting', 'Legal Aid Access', 'API Access'],
            cta: 'Contact Sales'
        }
    ];

    return (
        <div className="premium-container animate-fade">
            <div className="premium-header">
                <h1>Upgrade Your Career</h1>
                <p>Tools for serious artists. Cancel anytime.</p>

                <div className="billing-toggle">
                    <span className={billingCycle === 'monthly' ? 'active' : ''} onClick={() => setBillingCycle('monthly')}>Monthly</span>
                    <span className={billingCycle === 'yearly' ? 'active' : ''} onClick={() => setBillingCycle('yearly')}>Yearly (-20%)</span>
                </div>
            </div>

            <div className="tier-grid">
                {tiers.map((tier, i) => (
                    <div key={i} className={`tier-card glass ${tier.highlight ? 'highlight' : ''}`}>
                        {tier.highlight && <div className="badge-pop">MOST POPULAR</div>}
                        <div className={`tier-icon ${tier.color || ''}`}>
                            {tier.icon}
                        </div>
                        <h3>{tier.name}</h3>
                        <div className="price-block">
                            <span className="price">{tier.price}</span>
                            <span className="period">{tier.period}</span>
                        </div>
                        <ul className="features">
                            {tier.features.map((feat, j) => (
                                <li key={j}><Check size={16} className="check-icon" /> {feat}</li>
                            ))}
                        </ul>
                        <button
                            className={`tier-btn ${tier.highlight ? 'glow' : 'outline'}`}
                            disabled={tier.active}
                            onClick={() => !tier.active && onUpgrade(tier.name)}
                        >
                            {tier.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Premium;
