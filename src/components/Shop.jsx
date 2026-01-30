import React from 'react';
import './Shop.css';
import { Heart, Music, Video, Star, Crown, Gift, Shirt, Image } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Shop = ({ onPurchase }) => {
    const { t } = useLanguage();

    const supportPackages = [
        {
            id: 1,
            name: t('tierSupporter'),
            price: '$10',
            icon: <Heart size={32} className="accent-red" />,
            features: [
                t('featLicense'),
                t('featImport1')
            ],
            color: 'red'
        },
        {
            id: 2,
            name: t('tierSuper'),
            price: '$20',
            icon: <Music size={32} className="accent-cyan" />,
            features: [
                t('featAllPrev'),
                t('featImport2'),
            ],
            highlight: true,
            color: 'cyan'
        },
        {
            id: 3,
            name: t('tierMega'),
            price: '$30',
            icon: <Star size={32} className="accent-gold" />,
            features: [
                t('featAllPrev'),
                t('featImport3')
            ],
            color: 'gold'
        },
        {
            id: 4,
            name: t('tierGargantuan'),
            price: '$100',
            icon: <Crown size={32} className="accent-purple" />,
            features: [
                t('featAllPrev'),
                t('featTopCharts'),
                t('featHighlight')
            ],
            premium: true,
            color: 'purple'
        },
        {
            id: 5,
            name: t('tierAbsolute'),
            price: '$1000',
            icon: <Gift size={40} className="rainbow-text" />,
            features: [
                t('feat10Albums'),
                t('featVidTools'),
                t('featVidChannel'),
                t('featTshirts'),
                t('featPosters')
            ],
            absolute: true,
            color: 'rainbow'
        }
    ];

    return (
        <div className="shop-container animate-fade">
            <div className="shop-header">
                <h1>{t('supportWork')}</h1>
                <p>{t('supportDesc')}</p>
            </div>

            <div className="package-grid support-grid">
                {supportPackages.map(pkg => (
                    <div
                        key={pkg.id}
                        className={`package-card glass ${pkg.highlight ? 'highlight' : ''} ${pkg.premium ? 'premium' : ''} ${pkg.absolute ? 'absolute-tier' : ''}`}
                    >
                        {pkg.premium && <div className="badge">{t('legend')}</div>}
                        {pkg.absolute && <div className="badge absolute-badge">{t('godlike')}</div>}

                        <div className="tier-icon-wrapper">
                            {pkg.icon}
                        </div>

                        <h3>{pkg.name}</h3>

                        <div className="price-tag">{pkg.price}</div>
                        <div className="pay-type">{t('oneTime')}</div>

                        <ul className="support-features">
                            {pkg.features.map((feat, i) => (
                                <li key={i}>{feat}</li>
                            ))}
                        </ul>

                        <button
                            className={`support-btn ${pkg.color}`}
                            onClick={() => onPurchase(pkg.price)}
                        >
                            {t('support')} {pkg.price}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;
