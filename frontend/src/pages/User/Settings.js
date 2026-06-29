import React, { useState } from 'react';
import { toast } from 'react-toastify';
import UserNavbar from '../../components/UserNavbar';
import Footer from '../../components/Footer';

const Settings = () => {
    const [preferences, setPreferences] = useState({
        lowStockLimit: 10,
        allowBackorders: false,
        autoCalculateTotals: true,
        notifyLowStock: true,
        notifyOrderPlaced: true,
        notifyDailySummary: false,
        enable2fa: false,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isSavingPref, setIsSavingPref] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handleSavePreferences = (e) => {
        e.preventDefault();
        setIsSavingPref(true);
        setTimeout(() => {
            setIsSavingPref(false);
            toast.success("System configurations updated!");
        }, 800);
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }
        setIsUpdatingPassword(true);
        setTimeout(() => {
            setIsUpdatingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success("Password reset successfully!");
        }, 1000);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
            <UserNavbar />

            <main style={{ flex: 1, padding: '100px 24px 60px' }}>
                <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
                    
                    {/* Header */}
                    <div>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>System Settings</h1>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                            Configure inventory alerts, notification settings, and login credentials
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }} className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
                        
                        {/* Left Side: System Configurations */}
                        <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div className="ims-card" style={{ background: '#ffffff', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1px solid var(--navy-border)', paddingBottom: 10, margin: 0 }}>
                                    Inventory System Preferences
                                </h3>

                                <div className="ims-input-wrap">
                                    <label className="ims-label">Low Stock Threshold Limit</label>
                                    <input 
                                        type="number" 
                                        value={preferences.lowStockLimit} 
                                        onChange={e => setPreferences({ ...preferences, lowStockLimit: parseInt(e.target.value) || 0 })} 
                                        className="ims-input" 
                                        required 
                                    />
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Products reaching or dropping below this level trigger a low stock alert.</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.allowBackorders} 
                                            onChange={e => setPreferences({ ...preferences, allowBackorders: e.target.checked })} 
                                            style={{ accentColor: 'var(--teal)', width: 16, height: 16 }} 
                                        />
                                        Allow Back-ordering (Negative Quantities)
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.autoCalculateTotals} 
                                            onChange={e => setPreferences({ ...preferences, autoCalculateTotals: e.target.checked })} 
                                            style={{ accentColor: 'var(--teal)', width: 16, height: 16 }} 
                                        />
                                        Auto-calculate Invoice Price Totals
                                    </label>
                                </div>
                            </div>

                            <div className="ims-card" style={{ background: '#ffffff', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1px solid var(--navy-border)', paddingBottom: 10, margin: 0 }}>
                                    Email Notification Reports
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.notifyLowStock} 
                                            onChange={e => setPreferences({ ...preferences, notifyLowStock: e.target.checked })} 
                                            style={{ accentColor: 'var(--teal)', width: 16, height: 16 }} 
                                        />
                                        Receive emails for low-stock product triggers
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.notifyOrderPlaced} 
                                            onChange={e => setPreferences({ ...preferences, notifyOrderPlaced: e.target.checked })} 
                                            style={{ accentColor: 'var(--teal)', width: 16, height: 16 }} 
                                        />
                                        Send customer a digital invoice upon order placement
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.notifyDailySummary} 
                                            onChange={e => setPreferences({ ...preferences, notifyDailySummary: e.target.checked })} 
                                            style={{ accentColor: 'var(--teal)', width: 16, height: 16 }} 
                                        />
                                        Deliver daily summary and transactions report
                                    </label>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                                    <button
                                        type="submit"
                                        disabled={isSavingPref}
                                        className="ims-btn ims-btn-teal"
                                    >
                                        {isSavingPref ? 'Saving configurations...' : 'Save Configuration'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Right Side: Security, MFA, Reset Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div className="ims-card" style={{ background: '#ffffff', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1px solid var(--navy-border)', paddingBottom: 10, margin: 0 }}>
                                    MFA Security Options
                                </h3>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={preferences.enable2fa} 
                                        onChange={e => {
                                            const val = e.target.checked;
                                            setPreferences({ ...preferences, enable2fa: val });
                                            toast.info(val ? "Two-Factor Authentication activated." : "Two-Factor Authentication deactivated.");
                                        }} 
                                        style={{ accentColor: 'var(--teal)', width: 16, height: 16 }} 
                                    />
                                    Enable Two-Factor Authentication (2FA)
                                </label>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Require a validation code from your app to log in.</span>
                            </div>

                            <form onSubmit={handleUpdatePassword} className="ims-card" style={{ background: '#ffffff', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1px solid var(--navy-border)', paddingBottom: 10, margin: 0 }}>
                                    Change Security Password
                                </h3>
                                
                                <div className="ims-input-wrap">
                                    <label className="ims-label">Current Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        value={passwordData.currentPassword} 
                                        onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
                                        className="ims-input" 
                                        required 
                                    />
                                </div>

                                <div className="ims-input-wrap">
                                    <label className="ims-label">New Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="Min. 8 characters" 
                                        value={passwordData.newPassword} 
                                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                                        className="ims-input" 
                                        required 
                                    />
                                </div>

                                <div className="ims-input-wrap">
                                    <label className="ims-label">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="Repeat new password" 
                                        value={passwordData.confirmPassword} 
                                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                                        className="ims-input" 
                                        required 
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                                    <button
                                        type="submit"
                                        disabled={isUpdatingPassword}
                                        className="ims-btn ims-btn-ghost"
                                        style={{ border: '1px solid var(--navy-border)', color: 'var(--text-primary)' }}
                                    >
                                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Settings;