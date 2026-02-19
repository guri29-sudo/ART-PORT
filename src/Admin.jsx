import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { Plus, Trash2, Edit, Save, LogOut, Image as ImageIcon, X, Upload, ArrowLeft } from 'lucide-react';

const Admin = () => {
    const [session, setSession] = useState(null);
    const [activeTab, setActiveTab] = useState('paintings');
    const [paintings, setPaintings] = useState([]);
    const [settings, setSettings] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // New Painting Form State
    const [newPainting, setNewPainting] = useState({
        title: '',
        price: '',
        description: '',
        image_url: '',
        status: 'available',
        is_best_seller: false,
        rating: 5,
        review_count: 120
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session]);

    const fetchData = async () => {
        const { data: pData } = await supabase.from('paintings').select('*').order('created_at', { ascending: false });
        const { data: sData } = await supabase.from('site_settings').select('*').single();
        if (pData) setPaintings(pData);
        if (sData) setSettings(sData);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert(error.message);
        setLoading(false);
    };

    const handleLogout = () => supabase.auth.signOut();

    const handleImageUpload = async (e, bucket = 'paintings') => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const savePainting = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (isEditing) {
            const { error } = await supabase.from('paintings').update(newPainting).eq('id', editId);
            if (error) alert(error.message);
            else {
                setShowAddModal(false);
                setIsEditing(false);
                setEditId(null);
                setNewPainting({ title: '', price: '', description: '', image_url: '', status: 'available', is_best_seller: false, rating: 5, review_count: 120 });
                fetchData();
            }
        } else {
            const { error } = await supabase.from('paintings').insert([newPainting]);
            if (error) alert(error.message);
            else {
                setShowAddModal(false);
                setNewPainting({ title: '', price: '', description: '', image_url: '', status: 'available', is_best_seller: false, rating: 5, review_count: 120 });
                fetchData();
            }
        }
        setLoading(false);
    };

    const openEditModal = (painting) => {
        setNewPainting({
            title: painting.title || '',
            price: painting.price || '',
            description: painting.description || '',
            image_url: painting.image_url || '',
            status: painting.status || 'available',
            is_best_seller: painting.is_best_seller || false,
            rating: painting.rating || 5,
            review_count: painting.review_count || 120
        });
        setEditId(painting.id);
        setIsEditing(true);
        setShowAddModal(true);
    };

    const deletePainting = async (id) => {
        if (confirm('Delete this listing?')) {
            const { error } = await supabase.from('paintings').delete().eq('id', id);
            if (!error) fetchData();
        }
    };

    const toggleOffer = () => {
        setSettings({ ...settings, is_offer_active: !settings.is_offer_active });
    };

    const saveSettings = async () => {
        setLoading(true);
        const { error } = await supabase.from('site_settings').update(settings).eq('id', 1);
        if (error) alert(error.message);
        else alert('All changes published successfully!');
        setLoading(false);
    };

    if (!session) {
        return (
            <div className="login-container" style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-primary)', zIndex: 1000
            }}>
                <div style={{ width: '100%', maxWidth: '440px', padding: '1rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className="serif" style={{ fontSize: '3rem', letterSpacing: '4px', marginBottom: '0.5rem' }}>THEARTCART</h2>
                        <p style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '2px' }}>Curated Art Collective</p>
                    </div>

                    <div style={{
                        background: 'white', padding: '3.5rem', borderRadius: 'var(--radius-main)',
                        boxShadow: 'var(--shadow-premium)', border: '1px solid rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <a href="/" style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem',
                                fontWeight: 500, transition: '0.3s'
                            }} className="hover-link">
                                <ArrowLeft size={16} /> Back to Store
                            </a>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-gold)', letterSpacing: '1px' }}>ADMIN ACCESS</span>
                        </div>

                        <h3 className="serif" style={{ marginBottom: '2.5rem', fontSize: '1.8rem', textAlign: 'left' }}>Artist Login</h3>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label className="label-small" style={{ marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                                <input type="email" placeholder="admin@theartcart.com" value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" required />
                            </div>
                            <div>
                                <label className="label-small" style={{ marginBottom: '0.5rem', display: 'block' }}>Secret Password</label>
                                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" required />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1.2rem' }} disabled={loading}>
                                {loading ? 'Checking credentials...' : 'Enter Dashboard'}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.75rem', color: '#999' }}>
                        © 2024 THEARTCART Artist Portal. Unauthorized access is prohibited.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-wrapper container section-padding" style={{ minHeight: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <div>
                    <h1 className="serif" style={{ fontSize: '3rem' }}>Dashboard</h1>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Welcome back, Artist.</p>
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem', borderBottom: '1px solid var(--accent-soft)' }}>
                <button
                    onClick={() => setActiveTab('paintings')}
                    style={{
                        padding: '1rem 0', background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px',
                        borderBottom: activeTab === 'paintings' ? '2px solid var(--text-primary)' : 'none',
                        opacity: activeTab === 'paintings' ? 1 : 0.4
                    }}
                >
                    Paintings & Inventory
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    style={{
                        padding: '1rem 0', background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px',
                        borderBottom: activeTab === 'content' ? '2px solid var(--text-primary)' : 'none',
                        opacity: activeTab === 'content' ? 1 : 0.4
                    }}
                >
                    Site Setup & Content
                </button>
            </div>

            {activeTab === 'paintings' ? (
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 className="serif">Manage Store</h2>
                        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={16} /> Add New Listing
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {paintings.map(p => (
                            <div key={p.id} style={{ background: 'white', padding: '1.2rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-premium)', position: 'relative', overflow: 'hidden' }}>
                                <img src={p.image_url} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.2rem' }} />
                                {p.is_best_seller && (
                                    <div style={{ position: 'absolute', top: '2.5rem', left: '2.5rem', background: 'var(--accent-gold)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-pill)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                        Best Seller
                                    </div>
                                )}
                                <h4 className="serif" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{p.title}</h4>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '0.8rem', fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
                                    <span>★ {p.rating || 5}</span>
                                    <span style={{ color: '#999' }}>({p.review_count || 0} reviews)</span>
                                </div>
                                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-gold)' }}>₹{p.price}</p>
                                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => openEditModal(p)} style={{ background: 'var(--white)', border: 'none', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Edit size={14} />
                                    </button>
                                    <button onClick={() => deletePainting(p.id)} style={{ background: 'rgba(255, 68, 68, 0.9)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <section className="settings-overhaul">
                    {settings && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                            {/* Banner Offer Section */}
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-premium)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <div>
                                        <h3 className="serif" style={{ fontSize: '1.8rem' }}>Promo Banner</h3>
                                        <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Top bar announcement on your homepage.</p>
                                    </div>
                                    <div
                                        onClick={toggleOffer}
                                        style={{
                                            width: '60px', height: '32px', background: settings.is_offer_active ? 'var(--text-primary)' : '#ccc',
                                            borderRadius: '30px', position: 'relative', cursor: 'pointer', transition: '0.3s'
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute', top: '4px', left: settings.is_offer_active ? '32px' : '4px',
                                            width: '24px', height: '24px', background: 'white', borderRadius: '50%', transition: '0.3s'
                                        }}></div>
                                    </div>
                                </div>
                                <label className="label-small">Banner Message</label>
                                <input
                                    value={settings.banner_offer_text || ''}
                                    onChange={(e) => setSettings({ ...settings, banner_offer_text: e.target.value })}
                                    className="admin-input"
                                    placeholder="e.g. Free shipping on all orders over $100"
                                />
                            </div>

                            {/* Hero Section */}
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-premium)' }}>
                                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Hero Section</h3>
                                <div className="admin-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                    <div>
                                        <label className="label-small">Hero Title</label>
                                        <input
                                            value={settings.hero_title || ''}
                                            onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                                            className="admin-input"
                                        />
                                        <label className="label-small">Hero Subtitle</label>
                                        <textarea
                                            value={settings.hero_subtitle || ''}
                                            onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                                            className="admin-input"
                                            rows="3"
                                        />
                                        <label className="label-small">Button Text</label>
                                        <input
                                            value={settings.hero_button_text || ''}
                                            onChange={(e) => setSettings({ ...settings, hero_button_text: e.target.value })}
                                            className="admin-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label-small">Hero Background Image</label>
                                        <div style={{ position: 'relative', height: '200px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <img src={settings.hero_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <label style={{
                                                position: 'absolute', bottom: '1rem', right: '1rem', background: 'white', padding: '0.5rem 1rem',
                                                borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                            }}>
                                                Change Image
                                                <input type="file" style={{ display: 'none' }} onChange={async (e) => {
                                                    const url = await handleImageUpload(e, 'images');
                                                    if (url) setSettings({ ...settings, hero_image_url: url });
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews & Social Proof */}
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-premium)' }}>
                                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Reviews & Social Proof</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                    <div>
                                        <label className="label-small">Section Title</label>
                                        <input
                                            value={settings.reviews_title || ''}
                                            onChange={(e) => setSettings({ ...settings, reviews_title: e.target.value })}
                                            className="admin-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label-small">Section Subtitle</label>
                                        <input
                                            value={settings.reviews_subtitle || ''}
                                            onChange={(e) => setSettings({ ...settings, reviews_subtitle: e.target.value })}
                                            className="admin-input"
                                        />
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--accent-soft)', paddingTop: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h4 className="serif" style={{ fontSize: '1.4rem' }}>Manage Individual Reviews</h4>
                                        <button
                                            onClick={() => {
                                                const newReview = { name: 'Customer Name', date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), title: 'Review Title', comment: 'Review content...', rating: 5 };
                                                setSettings({ ...settings, reviews_data: [...(settings.reviews_data || []), newReview] });
                                            }}
                                            className="btn btn-outline"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                        >
                                            <Plus size={14} /> Add Review
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {(settings.reviews_data || []).map((rev, idx) => (
                                            <div key={idx} style={{ padding: '1.5rem', border: '1px solid var(--accent-soft)', borderRadius: 'var(--radius-card)', background: '#fcfcfc' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                    <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                                                        <div style={{ flex: 1 }}>
                                                            <label className="label-small">Reviewer Name</label>
                                                            <input
                                                                value={rev.name || ''}
                                                                onChange={(e) => {
                                                                    const newData = [...settings.reviews_data];
                                                                    newData[idx].name = e.target.value;
                                                                    setSettings({ ...settings, reviews_data: newData });
                                                                }}
                                                                className="admin-input"
                                                            />
                                                        </div>
                                                        <div style={{ width: '120px' }}>
                                                            <label className="label-small">Rating (1-5)</label>
                                                            <input
                                                                type="number" min="1" max="5"
                                                                value={rev.rating || 5}
                                                                onChange={(e) => {
                                                                    const newData = [...settings.reviews_data];
                                                                    newData[idx].rating = parseInt(e.target.value);
                                                                    setSettings({ ...settings, reviews_data: newData });
                                                                }}
                                                                className="admin-input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newData = settings.reviews_data.filter((_, i) => i !== idx);
                                                            setSettings({ ...settings, reviews_data: newData });
                                                        }}
                                                        style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <div style={{ marginBottom: '1rem' }}>
                                                    <label className="label-small">Review Title</label>
                                                    <input
                                                        value={rev.title || ''}
                                                        onChange={(e) => {
                                                            const newData = [...settings.reviews_data];
                                                            newData[idx].title = e.target.value;
                                                            setSettings({ ...settings, reviews_data: newData });
                                                        }}
                                                        className="admin-input"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="label-small">Comment</label>
                                                    <textarea
                                                        value={rev.comment || ''}
                                                        onChange={(e) => {
                                                            const newData = [...settings.reviews_data];
                                                            newData[idx].comment = e.target.value;
                                                            setSettings({ ...settings, reviews_data: newData });
                                                        }}
                                                        className="admin-input"
                                                        rows="3"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Benefits Bar */}
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-premium)' }}>
                                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Service Benefits</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    {(settings.benefits_data || []).map((b, idx) => (
                                        <div key={idx} style={{ padding: '1rem', border: '1px solid var(--accent-soft)', borderRadius: '8px' }}>
                                            <label className="label-small">Benefit {idx + 1} Title</label>
                                            <input
                                                value={b.title || ''}
                                                onChange={(e) => {
                                                    const newData = [...settings.benefits_data];
                                                    newData[idx].title = e.target.value;
                                                    setSettings({ ...settings, benefits_data: newData });
                                                }}
                                                className="admin-input"
                                                style={{ marginBottom: '1rem' }}
                                            />
                                            <label className="label-small">Description</label>
                                            <input
                                                value={b.description || ''}
                                                onChange={(e) => {
                                                    const newData = [...settings.benefits_data];
                                                    newData[idx].description = e.target.value;
                                                    setSettings({ ...settings, benefits_data: newData });
                                                }}
                                                className="admin-input"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact & Socials */}
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-premium)' }}>
                                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Branding & Contact</h3>
                                <div className="admin-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                    <div>
                                        <label className="label-small">WhatsApp Number</label>
                                        <input
                                            value={settings.whatsapp_number || ''}
                                            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                            className="admin-input"
                                        />
                                        <label className="label-small">Instagram Username</label>
                                        <input
                                            value={settings.instagram_username || ''}
                                            onChange={(e) => setSettings({ ...settings, instagram_username: e.target.value })}
                                            className="admin-input"
                                        />
                                        <label className="label-small">Contact Email</label>
                                        <input
                                            value={settings.contact_email || ''}
                                            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                            className="admin-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label-small">Artist Bio (Home Page)</label>
                                        <textarea
                                            value={settings.bio_text || ''}
                                            onChange={(e) => setSettings({ ...settings, bio_text: e.target.value })}
                                            className="admin-input"
                                            rows="4"
                                        />
                                        <label className="label-small">Footer Description</label>
                                        <textarea
                                            value={settings.footer_description || ''}
                                            onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                                            className="admin-input"
                                            rows="2"
                                        />
                                        <label className="label-small">Copyright Text</label>
                                        <input
                                            value={settings.copyright_text || ''}
                                            onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                                            className="admin-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ position: 'sticky', bottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                                <button onClick={saveSettings} className="btn btn-primary" style={{ padding: '1.5rem 4rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                                    {loading ? 'Publishing...' : 'Save & Publish Changes'}
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '640px', padding: '3rem', borderRadius: 'var(--radius-main)' }}>
                        <button className="modal-close" onClick={() => {
                            setShowAddModal(false);
                            setIsEditing(false);
                            setEditId(null);
                            setNewPainting({ title: '', price: '', description: '', image_url: '', status: 'available', is_best_seller: false });
                        }}><X size={24} /></button>
                        <h2 className="serif" style={{ marginBottom: '2rem', fontSize: '2rem' }}>{isEditing ? 'Edit Painting' : 'Add New Painting'}</h2>
                        <form onSubmit={savePainting} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="image-upload-preview" style={{
                                width: '100%', height: '240px', background: '#f8f8f8', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', borderRadius: 'var(--radius-card)', overflow: 'hidden', border: '1px solid var(--accent-soft)'
                            }}>
                                {newPainting.image_url ? (
                                    <img src={newPainting.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <label style={{ cursor: 'pointer', textAlign: 'center', padding: '2rem' }}>
                                        <Upload size={40} style={{ marginBottom: '1rem', color: 'var(--accent-gold)' }} />
                                        <h4 className="serif">Click to Upload</h4>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Hi-res images recommended (JPG, PNG)</p>
                                        <input type="file" accept="image/*" onChange={async (e) => {
                                            const url = await handleImageUpload(e);
                                            if (url) setNewPainting({ ...newPainting, image_url: url });
                                        }} style={{ display: 'none' }} />
                                    </label>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="label-small">Title</label>
                                    <input placeholder="e.g. Golden Harmony" value={newPainting.title} onChange={e => setNewPainting({ ...newPainting, title: e.target.value })} className="admin-input" required />
                                </div>
                                <div>
                                    <label className="label-small">Price (₹)</label>
                                    <input placeholder="2499" type="number" value={newPainting.price} onChange={e => setNewPainting({ ...newPainting, price: e.target.value })} className="admin-input" required />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label className="label-small">Stars (0-5)</label>
                                    <input type="number" step="0.1" min="0" max="5" value={newPainting.rating} onChange={e => setNewPainting({ ...newPainting, rating: parseFloat(e.target.value) })} className="admin-input" required />
                                </div>
                                <div>
                                    <label className="label-small">Review Count</label>
                                    <input type="number" value={newPainting.review_count} onChange={e => setNewPainting({ ...newPainting, review_count: parseInt(e.target.value) })} className="admin-input" required />
                                </div>
                            </div>
                            <div>
                                <label className="label-small">Description</label>
                                <textarea placeholder="Describe the texture, medium, and inspiration..." value={newPainting.description} onChange={e => setNewPainting({ ...newPainting, description: e.target.value })} className="admin-input" rows="4" />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: '#f9f9f9', borderRadius: '12px', cursor: 'pointer', marginBottom: '0.5rem' }} onClick={() => setNewPainting({ ...newPainting, is_best_seller: !newPainting.is_best_seller })}>
                                <input
                                    type="checkbox"
                                    checked={newPainting.is_best_seller || false}
                                    readOnly
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Mark as Best Seller</p>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.6, margin: 0 }}>Highlights the artwork on the main gallery.</p>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading || uploading}>
                                {loading ? 'Saving...' : isEditing ? 'Update Listing' : 'Publish Listing'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
