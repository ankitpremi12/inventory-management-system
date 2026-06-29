import React, { useState } from 'react';
import { toast } from 'react-toastify';
import UserNavbar from '../../components/UserNavbar';
import Footer from '../../components/Footer';

const avatars = [
    { seed: 'admin', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
    { seed: 'alex', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
    { seed: 'sara', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara' },
    { seed: 'john', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
    { seed: 'emma', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
];

const Profile = () => {
    const [profile, setProfile] = useState({
        name: 'Ankit Premi',
        email: 'ankitpremiji@gmail.com',
        phone: '08368680573',
        company: 'AP Solutions',
        role: 'Administrator',
        avatarSeed: 'admin'
    });

    const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarSeed);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setProfile(prev => ({ ...prev, avatarSeed: selectedAvatar }));
            setIsSaving(false);
            toast.success("Profile updated successfully!");
        }, 800);
    };

    const currentAvatarUrl = avatars.find(a => a.seed === selectedAvatar)?.url || avatars[0].url;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
            <UserNavbar />
            
            <main style={{ flex: 1, padding: '100px 24px 60px' }}>
                <div style={{ maxWidth: 750, margin: '0 auto' }} className="animate-fade-in">
                    {/* Header */}
                    <div style={{ marginBottom: 28 }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Account Profile</h1>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                            Update your personal profile, company details, and display identity
                        </p>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Avatar Card */}
                        <div className="ims-card" style={{ background: '#ffffff', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                            <div style={{ position: 'relative' }}>
                                <img 
                                    src={currentAvatarUrl} 
                                    alt="Profile Avatar" 
                                    style={{ width: 90, height: 90, borderRadius: '50%', background: '#ebdcd0', border: '3px solid var(--teal)' }} 
                                />
                            </div>
                            <div style={{ width: '100%', textAlign: 'center' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 12 }}>
                                    Choose Display Avatar
                                </label>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                                    {avatars.map(avatar => (
                                        <button
                                            key={avatar.seed}
                                            type="button"
                                            onClick={() => setSelectedAvatar(avatar.seed)}
                                            style={{
                                                background: 'transparent',
                                                border: selectedAvatar === avatar.seed ? '2px solid var(--teal)' : '2px solid transparent',
                                                borderRadius: '50%',
                                                padding: 2,
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <img src={avatar.url} alt={avatar.seed} style={{ width: 44, height: 44, borderRadius: '50%' }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className="ims-card grid grid-cols-1 md:grid-cols-2" style={{ background: '#ffffff', borderRadius: 12, padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="ims-input-wrap">
                                <label className="ims-label">Full Name</label>
                                <input 
                                    type="text" 
                                    value={profile.name} 
                                    onChange={e => setProfile({ ...profile, name: e.target.value })} 
                                    className="ims-input" 
                                    required 
                                />
                            </div>
                            
                            <div className="ims-input-wrap">
                                <label className="ims-label">Email Address</label>
                                <input 
                                    type="email" 
                                    value={profile.email} 
                                    onChange={e => setProfile({ ...profile, email: e.target.value })} 
                                    className="ims-input" 
                                    required 
                                />
                            </div>

                            <div className="ims-input-wrap">
                                <label className="ims-label">Phone Number</label>
                                <input 
                                    type="text" 
                                    value={profile.phone} 
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })} 
                                    className="ims-input" 
                                    required 
                                />
                            </div>

                            <div className="ims-input-wrap">
                                <label className="ims-label">Company Name</label>
                                <input 
                                    type="text" 
                                    value={profile.company} 
                                    onChange={e => setProfile({ ...profile, company: e.target.value })} 
                                    className="ims-input" 
                                    required 
                                />
                            </div>

                            <div className="ims-input-wrap col-span-1 md:col-span-2" style={{ gridColumn: 'span 2' }}>
                                <label className="ims-label">System Role</label>
                                <input 
                                    type="text" 
                                    value={profile.role} 
                                    disabled 
                                    className="ims-input" 
                                    style={{ background: 'var(--navy-elev)', cursor: 'not-allowed', color: 'var(--text-muted)' }} 
                                />
                            </div>
                        </div>

                        {/* Save Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="ims-btn ims-btn-teal"
                                style={{ padding: '12px 28px', fontSize: '0.9rem', borderRadius: 8 }}
                            >
                                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;