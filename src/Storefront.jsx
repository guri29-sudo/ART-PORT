import React from 'react';
import { supabase } from './lib/supabaseClient';
import { Instagram, MessageCircle, Mail, X, ShieldCheck, Leaf, Truck, Award, Star, ArrowRight, Menu } from 'lucide-react';

const TopBar = ({ settings }) => {
    if (!settings?.is_offer_active) return null;
    return (
        <div className="top-bar">
            {settings.banner_offer_text || 'Welcome to THEARTCART'}
        </div>
    );
};

const Sidebar = ({ isOpen, onClose, settings }) => {
    const extractHandle = (input) => {
        if (!input) return '';
        if (input.startsWith('http')) {
            const parts = input.split('/').filter(Boolean);
            return parts[parts.length - 1];
        }
        return input;
    };

    const handle = extractHandle(settings?.instagram_username);
    const igLink = handle ? `https://ig.me/m/${handle}` : '#';

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
            <div className={`sidebar ${isOpen ? 'active' : ''}`}>
                <button className="sidebar-close" onClick={onClose}><X size={24} /></button>
                <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '3rem', letterSpacing: '2px' }}>THEARTCART</h2>

                <a href="#gallery" className="sidebar-link" onClick={onClose}>Shop <ArrowRight size={18} /></a>
                <a href="/admin" className="sidebar-link" onClick={onClose}>Artist Admin <ArrowRight size={18} /></a>

                <div className="sidebar-footer">
                    <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '1rem' }}>Follow us</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href={igLink} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><Instagram size={20} /></a>
                        <a href={`https://wa.me/${settings?.whatsapp_number}`} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><MessageCircle size={20} /></a>
                    </div>
                </div>
            </div>
        </>
    );
};

const Navbar = ({ onMenuClick }) => (
    <nav className="container" style={{ padding: '1.5rem 0', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Menu size={20} className="sidebar-toggle" style={{ cursor: 'pointer' }} onClick={onMenuClick} />
            <div className="desktop-only" style={{ display: 'flex', gap: '2rem' }}>
                <a href="#gallery" className="nav-link">Shop</a>
                <a href="#gallery" className="nav-link">Collections</a>
            </div>
        </div>

        <div style={{ textAlign: 'center' }}>
            <h1 className="serif desktop-only" style={{ fontSize: '2rem', letterSpacing: '4px', margin: 0 }}>THEARTCART</h1>
            <h1 className="serif mobile-only" style={{ fontSize: '1.4rem', letterSpacing: '2px', margin: 0 }}>THEARTCART</h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* Right side spacer to keep centering perfect */}
        </div>
    </nav>
);

const Hero = ({ settings }) => (
    <section className="hero-section" style={{ position: 'relative', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <div className="hero-bg" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: `url("${settings?.hero_image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=2000'}") center/cover no-repeat`,
            filter: 'brightness(0.9)',
            borderRadius: '8px'
        }}></div>
        <div style={{ position: 'relative', textAlign: 'center', color: 'white', maxWidth: '800px', padding: '0 1.5rem' }}>
            <h2 className="hero-title serif">{settings?.hero_title || 'Your source for wall-worthy art'}</h2>
            <p className="hero-subtitle">{settings?.hero_subtitle}</p>
            <button
                className="btn btn-white"
                onClick={() => document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' })}
            >
                {settings?.hero_button_text || 'Explore more'}
            </button>
        </div>
    </section>
);

const BenefitsBar = ({ settings }) => {
    const defaultBenefits = [
        { icon: ShieldCheck, title: 'FSC certified', description: 'Paper and frames are FSC® certified' },
        { icon: Leaf, title: 'Eco-friendly ink', description: 'Low-waste printing processes' },
        { icon: Truck, title: 'Local printing', description: 'Ensuring quickly and direct shipping' },
        { icon: Award, title: 'Museum quality', description: 'Uncompromising lifetime quality' }
    ];

    const icons = { ShieldCheck, Leaf, Truck, Award };
    const benefits = settings?.benefits_data || defaultBenefits;

    return (
        <div className="container">
            <div className="benefits-bar">
                {benefits.map((b, i) => {
                    const Icon = typeof b.icon === 'string' ? icons[b.icon] || Award : b.icon;
                    return (
                        <div className="benefit-item" key={i}>
                            <Icon size={24} strokeWidth={1} />
                            <h4>{b.title}</h4>
                            <p>{b.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const PaintingCard = ({ painting, onClick }) => (
    <div className="card" onClick={() => onClick(painting)}>
        <div style={{ position: 'relative' }}>
            <img src={painting.image_url || 'https://via.placeholder.com/400x500?text=Art'} alt={painting.title} />
            {painting.is_best_seller && (
                <div className="badge-premium">Best Seller</div>
            )}
            {painting.status === 'sold' && (
                <span style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'rgba(0,0,0,0.7)', color: 'white',
                    padding: '0.4rem 0.8rem', fontSize: '0.65rem',
                    borderRadius: 'var(--radius-pill)', fontWeight: 700,
                    letterSpacing: '1px', backdropFilter: 'blur(4px)'
                }}>SOLD OUT</span>
            )}
        </div>
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <h4 className="serif" style={{ fontSize: '1.2rem' }}>{painting.title}</h4>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>From ₹{painting.price}</span>
            </div>
            <div className="stars">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={12}
                        fill={i < Math.round(painting.rating || 5) ? "currentColor" : "none"}
                        stroke="currentColor"
                    />
                ))}
                <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({painting.review_count || 0})</span>
            </div>
        </div>
    </div>
);

const ReviewSection = ({ settings }) => {
    const defaultReviews = [
        { name: 'Emma Collins', date: 'July 27, 2024', title: 'Beautiful addition to my home', comment: '"The quality of the print is exceptional. It fits perfectly in my minimalist living room."', rating: 5 },
        { name: 'David Miller', date: 'August 12, 2024', title: 'Truly museum quality', comment: '"I was skeptical about buying art online, but THEARTCART exceeded my expectations. The colors are so vibrant."', rating: 5 },
        { name: 'Sarah J.', date: 'September 5, 2024', title: 'Perfect gift!', comment: '"Bought this for my sister\'s new apartment. She absolutely loves it. The packaging was also very secure."', rating: 5 },
        { name: 'Michael R.', date: 'October 1, 2024', title: 'Elegant and simple', comment: '"Adds a touch of class to my office space. Highly recommended for anyone looking for modern art."', rating: 5 }
    ];

    const reviews = settings?.reviews_data || defaultReviews;

    return (
        <section className="container section-padding">
            <h2 className="serif section-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>{settings?.reviews_title || 'Loved by people like you'}</h2>
            <p className="hero-subtitle" style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '4rem' }}>{settings?.reviews_subtitle}</p>
            <div className="reviews-grid">
                {reviews.map((rev, idx) => (
                    <div key={idx} className="review-card">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < (rev.rating || 5) ? "currentColor" : "none"} stroke="currentColor" />
                            ))}
                        </div>
                        <h4 style={{ marginBottom: '1rem' }}>{rev.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            {rev.comment}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ width: '32px', height: '32px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                                {rev.name.charAt(0)}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{rev.name}</p>
                                <p style={{ fontSize: '0.7rem', color: '#999' }}>{rev.date}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section >
    );
};

const BioSection = ({ settings }) => (
    <section className="container section-padding" id="about">
        <div className="bio-collage">
            <div className="collage-images">
                <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800" alt="Artist at work" />
                <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800" alt="Art detail" />
                <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800" alt="Studio" />
            </div>
            <div>
                <h2 style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '2rem' }}>Design that gives space meaning</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                    {settings?.bio_text || 'We bring museum-quality wall art into your life, ensuring every piece reflects your unique style.'}
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                >
                    Inquire for Bespoke Art
                </button>
                <div style={{ marginTop: '3rem' }}>
                    <p style={{ fontWeight: 600 }}>THEARTCART</p>
                    <p style={{ fontSize: '0.8rem', color: '#999' }}>Curated Art Collective</p>
                </div>
            </div>
        </div>
    </section>
);

const POLICIES = {
    privacy: {
        title: "Privacy Policy",
        content: `Your trust is our most valuable asset. We use industry-standard encryption to protect your personal information during the checkout process.\n\nYour data is exclusively used for order fulfillment and, if opted-in, our exclusive newsletter. We never sell or share your information with third-party marketers.\n\nWe use minimal cookies to enhance your browsing experience and remember your preferences.`
    },
    terms: {
        title: "Terms of Service",
        content: `By engaging with THEARTCART, you agree to the following:\n\nAll artwork remains the intellectual property of the artist. Purchase of a physical painting does not transfer copyright or reproduction rights.\n\nPrices are subject to change based on market value and demand. Every piece sold through this platform is guaranteed as an original work or authorized print from the artist.`
    },
    shipping: {
        title: "Shipping & Delivery",
        content: `At THEARTCART, we pride ourselves on ensuring your original masterworks reach you in pristine condition.\n\nEach painting is carefully inspected and secured for transit. Please allow 2-4 business days for packaging and dispatch.\n\nDomestic orders typically arrive within 6-10 business days. Full-scale canvases are either shipped rolled in heavy-duty protective tubes or custom-crated depending on size, ensuring zero risk of damage.`
    },
    returns: {
        title: "Returns & Refunds",
        content: `We want you to be absolutely enamored with your new art.\n\nIf the piece does not resonate with your space, we offer a 14-day return window from the date of delivery.\n\nArtwork must be returned in its original packaging and condition. In the rare event of transit damage, please contact us within 48 hours of receipt with photographic evidence for a full insurance-backed replacement or refund.`
    },
    contact: {
        title: "Contact & Support",
        content: `For inquiries regarding specific pieces, bespoke commissions, or bulk curations, our team is available 24/7.\n\nYou can reach us via WhatsApp for instant assistance or email us at support@theartcart.in.\n\nEvery piece is handled with extreme care from studio to doorstep.`
    }
};

const PolicyModal = ({ policyType, onClose }) => {
    if (!policyType || !POLICIES[policyType]) return null;
    const policy = POLICIES[policyType];

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2100 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: '3rem' }}>
                <button className="modal-close" onClick={onClose}><X size={24} /></button>
                <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{policy.title}</h2>
                <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {policy.content.split('\n').map((line, i) => line ? <p key={i} style={{ marginBottom: '1rem' }}>{line}</p> : <br key={i} />)}
                </div>
            </div>
        </div>
    );
};

const Storefront = () => {
    const [settings, setSettings] = React.useState(null);
    const [paintings, setPaintings] = React.useState([]);
    const [selectedPainting, setSelectedPainting] = React.useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [activePolicy, setActivePolicy] = React.useState(null);
    const [filter, setFilter] = React.useState('all');
    const [email, setEmail] = React.useState('');
    const [subscribed, setSubscribed] = React.useState(false);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data: settingsData } = await supabase.from('site_settings').select('*').single();
        const { data: paintingsData } = await supabase.from('paintings').select('*').order('created_at', { ascending: false });

        if (settingsData) setSettings(settingsData);
        if (paintingsData) setPaintings(paintingsData);
    };

    return (
        <div className="app-wrapper">
            <TopBar settings={settings} />
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} settings={settings} />
            <Hero settings={settings} />
            <BenefitsBar settings={settings} />

            <main className="container section-padding" id="gallery">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                            {filter === 'best' ? 'Best Sellers' : 'Our Collection'}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {filter === 'best' ? 'Highly sought-after masterworks.' : 'Hand-painted originals for your curated space.'}
                        </p>
                    </div>
                    {filter === 'best' && (
                        <button className="nav-link" onClick={() => setFilter('all')} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            View All Collection <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
                        </button>
                    )}
                </div>

                <div className="gallery-grid">
                    {paintings.length > 0 ? (
                        (() => {
                            const filtered = paintings.filter(p => filter === 'best' ? p.is_best_seller : true);
                            return filtered.length > 0 ? filtered.map(p => (
                                <PaintingCard key={p.id} painting={p} onClick={setSelectedPainting} />
                            )) : (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                                    No paintings marked as Best Sellers yet. Explore our full collection!
                                </div>
                            );
                        })()
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.5, padding: '4rem 0' }}>
                            No paintings listed yet. Check back soon.
                        </div>
                    )}
                </div>
            </main>

            <ReviewSection settings={settings} />
            <BioSection settings={settings} />

            <footer className="container section-padding" id="contact" style={{ borderTop: '1px solid var(--accent-soft)' }}>
                <div className="footer-grid">
                    <div>
                        <h2 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>THEARTCART</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{settings?.footer_description}</p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <a href={settings?.instagram_username?.startsWith('http') ? settings.instagram_username : `https://instagram.com/${settings?.instagram_username}`} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                                <Instagram size={20} />
                            </a>
                            <a href={`https://wa.me/${settings?.whatsapp_number}`} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                                <MessageCircle size={20} />
                            </a>
                            <a href={`mailto:${settings?.contact_email}`} style={{ color: 'inherit' }}>
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Shop</h4>
                        <ul style={{ listStyle: 'none', fontSize: '0.85rem', lineHeight: '2.5' }}>
                            <li style={{ cursor: 'pointer' }} onClick={() => { setFilter('best'); document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' }); }}>Best sellers</li>
                            <li style={{ cursor: 'pointer' }} onClick={() => { setFilter('all'); document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' }); }}>New arrivals</li>
                            <li style={{ cursor: 'pointer' }} onClick={() => setActivePolicy('shipping')}>Gift sets</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Support</h4>
                        <ul style={{ listStyle: 'none', fontSize: '0.85rem', lineHeight: '2.5' }}>
                            <li style={{ cursor: 'pointer' }} onClick={() => setActivePolicy('shipping')}>Shipping info</li>
                            <li style={{ cursor: 'pointer' }} onClick={() => setActivePolicy('returns')}>Returns policy</li>
                            <li style={{ cursor: 'pointer' }} onClick={() => setActivePolicy('contact')}>Contact us</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Company</h4>
                        <ul style={{ listStyle: 'none', fontSize: '0.85rem', lineHeight: '2.5' }}>
                            <li><a href="#about" style={{ textDecoration: 'none', color: 'inherit' }}>About THEARTCART</a></li>
                            <li><a href="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>Artist Dashboard</a></li>
                            <li style={{ cursor: 'pointer' }} onClick={() => setActivePolicy('terms')}>Careers</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Newsletter</h4>
                        <p style={{ fontSize: '0.75rem', marginBottom: '1rem' }}>Get the latest updates on new art.</p>
                        {subscribed ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600 }}>Thank you for subscribing!</p>
                        ) : (
                            <div style={{ display: 'flex', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                                <input
                                    type="email"
                                    placeholder="Your email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', fontSize: '0.85rem', flex: 1, outline: 'none' }}
                                />
                                <ArrowRight size={16} style={{ cursor: 'pointer' }} onClick={() => email && setSubscribed(true)} />
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--accent-soft)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
                    <p>{settings?.copyright_text || '© 2024 THEARTCART. All rights reserved.'}</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => setActivePolicy('privacy')}>Privacy Policy</span>
                        <span style={{ cursor: 'pointer' }} onClick={() => setActivePolicy('terms')}>Terms of Service</span>
                    </div>
                </div>
            </footer>

            {selectedPainting && (
                <ProductModal
                    painting={selectedPainting}
                    onClose={() => setSelectedPainting(null)}
                    settings={settings}
                />
            )}

            {activePolicy && (
                <PolicyModal
                    policyType={activePolicy}
                    onClose={() => setActivePolicy(null)}
                />
            )}
        </div>
    );
};

const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className={`accordion-item ${isOpen ? 'active' : ''}`}>
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <span>{isOpen ? '−' : '+'}</span>
            </div>
            <div className="accordion-content">
                {children}
            </div>
        </div>
    );
};

const ProductModal = ({ painting, onClose, settings }) => {
    if (!painting) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><X size={24} /></button>
                <div className="modal-body">
                    <div className="modal-image-container">
                        <div className="modal-image-main">
                            <img src={painting.image_url || 'https://via.placeholder.com/600x800'} alt={painting.title} />
                        </div>
                    </div>

                    <div className="modal-details">
                        <div className="stars" style={{ marginBottom: '1rem' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    fill={i < Math.round(painting.rating || 5) ? "currentColor" : "none"}
                                    stroke="currentColor"
                                />
                            ))}
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                ({painting.review_count || 0} reviews)
                            </span>
                        </div>

                        <h2 className="modal-title serif">{painting.title}</h2>
                        <div className="modal-price">₹{painting.price}</div>

                        <div className="size-selector">
                            <span className="label-small">Select Size</span>
                            <div className="pill-group">
                                <button className="pill active">20x24"</button>
                                <button className="pill">30x40"</button>
                                <button className="pill">12x12"</button>
                                <button className="pill">8x12"</button>
                            </div>
                        </div>

                        {painting.status === 'sold' ? (
                            <div style={{
                                padding: '1.5rem',
                                background: '#f8f8f8',
                                borderRadius: '8px',
                                textAlign: 'center',
                                border: '1px solid #eee'
                            }}>
                                <p style={{ fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>This piece has found its home</p>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>Stay tuned for new arrivals.</p>
                            </div>
                        ) : (
                            <a
                                href={`https://wa.me/${settings?.whatsapp_number}?text=${encodeURIComponent(`Hello! I'm interested in purchasing: "${painting.title}".\n\nPrice: ₹${painting.price}\nView here: ${window.location.origin}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-primary"
                                style={{ textAlign: 'center', borderRadius: '4px', padding: '1.2rem' }}
                            >
                                <MessageCircle size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                                Order on WhatsApp
                            </a>
                        )}
                        {painting.status !== 'sold' && (
                            <button
                                onClick={() => {
                                    const h = settings?.instagram_username?.startsWith('http')
                                        ? settings.instagram_username.split('/').filter(Boolean).pop()
                                        : settings?.instagram_username;
                                    const text = `Hello! I'm interested in: "${painting.title}". (Price: ₹${painting.price})`;
                                    navigator.clipboard.writeText(text);
                                    window.open(`https://ig.me/m/${h}`, '_blank');
                                }}
                                className="btn btn-outline"
                                style={{ textAlign: 'center', width: '100%', borderRadius: '4px', padding: '1.2rem' }}
                            >
                                <Instagram size={18} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                                DM on Instagram (Auto-Copy)
                            </button>
                        )}

                        <div className="accordion">
                            <AccordionItem title="About the piece">
                                <p>{painting.description || "This original artwork is hand-painted using premium quality materials. Each piece captures a unique moment of emotion and texture."}</p>
                            </AccordionItem>
                            <AccordionItem title="Delivery and returns">
                                <p>Every artwork is insured and shipped with extreme care. Delivery across India typically takes 6-12 business days. We offer a 14-day return policy if the piece does not perfectly complement your space.</p>
                            </AccordionItem>
                            <AccordionItem title="Specifications">
                                <p>• Medium: Mixed Media / Acrylic on Canvas<br />• Finish: UV Protective Gloss Varnish<br />• Certificate of Authenticity: Included with every piece.</p>
                            </AccordionItem>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Storefront;
