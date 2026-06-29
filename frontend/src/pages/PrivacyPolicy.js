import React from 'react';
import DefaultNavbar from '../components/DefaultNavbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
            <DefaultNavbar isLight={true} />
            
            <div style={{ flex: 1, padding: '120px 24px 80px', maxWidth: 900, margin: '0 auto' }} className="animate-fade-in">
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>Privacy Policy</h2>

                <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.7, textAlign: 'justify', display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <p>The latest revision of this Privacy Policy was published on May 23, 2018.</p>
                    
                    <p>
                        Please check back regularly to keep track of any Privacy Policy updates. The previous version of this Policy can be viewed here. At AP Solutions we care about your privacy and believe in transparency. That’s why we are committed to being upfront about our privacy practices. We only collect personal information necessary to deliver our services and we handle it carefully and sensibly.
                    </p>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>A. Who we are?</h3>

                    <p>
                        This Policy explains our privacy practices for apsolutions.com (we’ll refer to it as the “website”, “Website”) and our other services provided by AP Solutions (“AP Solutions” together with “we,” “us,” and “our”). We’ll refer to the Website and our other services as the “Services.” This Privacy Policy describes why and how we collect and use the personal information of our customers and website visitors. It also describes your options to choose how we use your personal data and how to contact us with any concerns and requests to in relation to that.
                    </p>
                    
                    <p>
                        If you have questions about the processing of your personal data, don’t hesitate to contact us through privacy@apsolutions.com.
                    </p>
                    
                    <p>
                        AP Solutions, is a software development company established by an international group of financial advisors and software developers. If you reside or are located in the European Economic Area (“EEA”) AP Solutions is the data controller of the personal data (as defined below) collected via the Website, as set out in this Privacy Policy.
                    </p>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>B. Data Collection</h3>

                    <p>AP Solutions processes your personal data so you can better use our services. Below you can find an overview of the personal data that we process, if you give permission for this, and for which services this happens.</p>

                    <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>B.1 Statistics</h4>
                        <p style={{ marginTop: 8 }}>
                            We use Cookies to collect some of the information set out in this Policy. A cookie is a small piece of data sent from a website and stored in your web browser on your computer, mobile or other handheld device, while you are browsing a website.
                            Our Website uses cookies to identify you. Cookies can store your account identifier and website tracking. They can also be used for technical purposes such as keeping track of your current session and enabling you to proceed to the next step and use information which has already been entered (languages and theme choices), so that we can offer improved and more personalised services, products and other relevant communication tailored to you.
                        </p>
                        <p style={{ marginTop: 10 }}>
                            You can also modify your Cookie preferences straight from your browser. Please note that if you simply disable all of our cookies or cookies in general in your browser settings, you may find that certain sections or features of our Website will not work, because your browser may prevent us from setting Website functionally required cookies.
                            You can find more detailed information about our use of cookies in our Cookie Statement.
                        </p>
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>C) GENERAL OBLIGATIONS</h3>
                    <p>
                        The use of the service and the website are intended for your own lawful internal business purposes only, in accordance with these terms and any notices or conditions sent directly to you or posted on the website by AP Solutions. The service and the website can likewise be used on behalf of others or in order to provide services to others but you must ensure that you have authorisation to do so and that all persons for whom or to whom services are provided comply with and accept all terms of this agreement. Invited users are the sole responsibility of the subscriber and AP Solutions will not be made liable for any actions taken by an invited user.
                    </p>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>D) ACCESS CONDITIONS</h3>
                    <p>
                        1. All usernames and passwords required to access the service must be kept secure and confidential. In the event of an unauthorised use of your password, or any other breach of security, AP Solutions is to be notified immediately to reset your password. You must take all other actions deemed reasonable by AP Solutions to maintain or enhance security of AP Solutions’s computing systems and networks, and your access to the services. 2. When accessing and using the services, as a condition of these terms, you must: (i) Not make any attempt to undermine the integrity or security of AP Solutions’s computing systems or networks, or of any third party’s computing systems and networks upon which the services are hosted (ii) Not impair the functionality of the services or website, other systems used to deliver the services, or any other user of the services, by your use or misuse of the system (iii) Not attempt to gain unauthorised access to any materials or any computer system on which the services are hosted, other than to those materials you have been given express permission to access. (iv) Not input into the website, or otherwise transmit, any files that may cause damage to any other person’s computing devices or software; offensive content; or material that violates any law (including copyright or trade secret law) and; (v) Not attempt to modify, copy, adapt, reproduce, disassemble, decompile or reverse engineer any computer programs used for the delivery of services for operation except as is strictly necessary for normal operation.
                    </p>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>E) REASONABLE USE POLICY</h3>
                    <p>
                        AP Solutions Inventory is to be used in reasonable way. If your use of AP Solutions Inventory is deemed not reasonable or your use is causing performance degradation for other Users, we may impose limits on your use of AP Solutions Inventory. Where possible, you will be given at least 24 hours prior notice and request for your usage to be reduced before imposing any limits. Limitations on your use of AP Solutions Inventory may include (but are not limited to) the quantities and volumes of the following parameters, per account: (i) storage required to host and backup user data; (ii) sales/purchase transactions per calendar month; (iii) API (application programming interface) calls per five (5) period; (iv) page views per five (5) minute period; (v) bandwidth usage per twenty four (24) hour period; (vi) support tickets opened per calendar month; or (vii) users, products and customers.
                    </p>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>F) COMMUNICATION CONDITIONS</h3>
                    <p>
                        You agree, as a condition of these terms, that any use of communication tools available through the website, such as forum, chat room or message centre, are to be used only for lawful and legitimate purposes. You must not use any such communication tool for posting or disseminating any material unrelated to the services. This includes, but is not limited to: offers of sale for goods and services, unsolicited commercial email, files that may result in damage to the computing devices or software of other people, offensive content or any content that may be deemed offensive by other users, or content that violates any law, including those of copyright or trade secrets. It is your obligation to ensure that any communications made on the website are lawful and in accordance with these terms and conditions, as outlined above. As with any other web-based forum, you must exercise caution when using the available communication tools. However, AP Solutions does reserve the right to remove any communication it deems breaches these conditions at any time in its sole discretion.
                    </p>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 12 }}>G) INDEMNITY</h3>
                    <p>
                        AP Solutions shall not be liable for any claims, costs, damages or loss arising from your breach of any of these terms and obligations. AP Solutions will not be held responsible for any human-error resulted in incorrect irreversible data entry. We are not liable for any service interruption caused by internal cloud provider problems.
                    </p>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;