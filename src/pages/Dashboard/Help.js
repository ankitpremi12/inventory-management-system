import React from 'react';

const Help = () => {
    return (
        <div className="ims-card" style={{ maxWidth: 680, margin: '24px auto', animation: 'fadeIn 0.3s ease-out' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                Help & Support
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>
                Find answers to common questions or reach out to our technical support team.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                    { q: 'How do I add a new product?', a: 'Go to the Inventory tab and click on the "+ Add New Product" button at the top right of the page.' },
                    { q: 'What is the difference between Main Stock and Supplies?', a: 'Main Stock contains products that are sold directly to customers. Supplies contains auxiliary products used internally by staff.' },
                    { q: 'How can I update supplier payments?', a: 'Go to Settings at the bottom of the sidebar, navigate to Supplier Payments, and click on the update action next to the supplier.' }
                ].map((faq, i) => (
                    <div key={i} style={{ borderBottom: '1px solid var(--navy-border)', paddingBottom: 16 }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                            {faq.q}
                        </h4>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {faq.a}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 24, padding: '16px', background: '#faf6f0', borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    Still need help?
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Email support at <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>support@stringlab.com</span> or call 1-800-555-0199.
                </p>
            </div>
        </div>
    );
};

export default Help;
