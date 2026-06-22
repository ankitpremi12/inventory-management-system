import { apiBaseUrl } from './api';

export function setupMockApi() {
    // Remove any previously seeded data from older db keys
    localStorage.removeItem('ims_db_v2');
    localStorage.removeItem('ims_db_v1');

    const originalFetch = window.fetch;

    window.fetch = async function (url, options) {
        if (typeof url === 'string' && url.startsWith(apiBaseUrl)) {
            const path = url.replace(apiBaseUrl + '/', '');
            const method = options?.method || 'GET';

            const parts = path.split('/');
            let collection = parts.slice(0, -1).join('/');
            let id = parts[parts.length - 1];

            if (parts.length === 1) {
                collection = parts[0];
                id = null;
            } else {
                const fullPath = parts.join('/');
                const knownCollections = [
                    'setup/categories', 'setup/unitTypes', 'setup/companies',
                    'suppliers/lists', 'suppliers/payments', 'suppliers/documents',
                    'requestedItems/pharmacy', 'requestedItems/nonPharmacy', 'requestedItems/main', 'requestedItems/supplies',
                    'products/pharmacy', 'products/non-pharmacy', 'products/nonPharmacy', 'products/main', 'products/supplies',
                    'orders/pharmacy', 'orders/nonPharmacy', 'orders/main', 'orders/supplies',
                    'purchases/pharmacy', 'purchases/nonPharmacy', 'purchases/main', 'purchases/supplies',
                    'returns/customers', 'returns/expiresOrDamagesReturns', 'returns/expiresOrDamages',
                    'customers', 'employees'
                ];

                if (knownCollections.includes(fullPath)) {
                    collection = fullPath;
                    id = null;
                } else {
                    const twoParts = parts.slice(0, 2).join('/');
                    if (knownCollections.includes(twoParts)) {
                        collection = twoParts;
                        id = parts.slice(2).join('/');
                    } else {
                        collection = parts.slice(0, -1).join('/');
                        id = parts[parts.length - 1];
                    }
                }
            }

            // Normalize collection names
            let normalizedCollection = collection;
            if (collection === 'products/non-pharmacy' || collection === 'products/nonPharmacy' || collection === 'products/supplies') {
                normalizedCollection = 'products/supplies';
            }
            if (collection === 'products/pharmacy' || collection === 'products/main') {
                normalizedCollection = 'products/main';
            }
            if (collection === 'orders/pharmacy' || collection === 'orders/main') {
                normalizedCollection = 'orders/main';
            }
            if (collection === 'orders/nonPharmacy' || collection === 'orders/supplies') {
                normalizedCollection = 'orders/supplies';
            }
            if (collection === 'requestedItems/pharmacy' || collection === 'requestedItems/main') {
                normalizedCollection = 'requestedItems/main';
            }
            if (collection === 'requestedItems/nonPharmacy' || collection === 'requestedItems/supplies') {
                normalizedCollection = 'requestedItems/supplies';
            }
            if (collection === 'purchases/pharmacy' || collection === 'purchases/main') {
                normalizedCollection = 'purchases/main';
            }
            if (collection === 'purchases/nonPharmacy' || collection === 'purchases/supplies') {
                normalizedCollection = 'purchases/supplies';
            }
            if (collection === 'returns/expiresOrDamages' || collection === 'returns/expiresOrDamagesReturns') {
                normalizedCollection = 'returns/expiresOrDamagesReturns';
            }

            // DB key v3 — previous seeded data from v2 is discarded
            let db = JSON.parse(localStorage.getItem('ims_db_v3') || '{}');

            if (!db[normalizedCollection]) {
                db[normalizedCollection] = [];
                localStorage.setItem('ims_db_v3', JSON.stringify(db));
            }

            await new Promise(resolve => setTimeout(resolve, 200));

            if (method === 'GET') {
                if (id) {
                    const item = db[normalizedCollection].find(x => x._id === id);
                    if (item) {
                        return new Response(JSON.stringify(item), { status: 200, headers: { 'Content-Type': 'application/json' } });
                    }
                    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
                } else {
                    return new Response(JSON.stringify(db[normalizedCollection]), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }
            }

            if (method === 'POST') {
                const body = JSON.parse(options.body || '{}');
                const newItem = {
                    ...body,
                    _id: Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9),
                    addedTime: new Date().toISOString(),
                    updatedTime: new Date().toISOString(),
                };
                db[normalizedCollection].push(newItem);
                localStorage.setItem('ims_db_v3', JSON.stringify(db));
                return new Response(JSON.stringify({ acknowledged: true, insertedId: newItem._id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }

            if (method === 'DELETE') {
                if (id) {
                    const index = db[normalizedCollection].findIndex(x => x._id === id);
                    if (index !== -1) {
                        db[normalizedCollection].splice(index, 1);
                        localStorage.setItem('ims_db_v3', JSON.stringify(db));
                        return new Response(JSON.stringify({ deletedCount: 1 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                    }
                }
                return new Response(JSON.stringify({ deletedCount: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        }

        return originalFetch(url, options);
    };
}