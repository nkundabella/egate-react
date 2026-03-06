declare var process: any;

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
    async registerVisitor(data: { parentName: string; phone: string; studentName: string; visitCode: string }) {
        const res = await fetch(`${API_URL}/visitors/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Registration failed');
        }
        return res.json();
    },

    async addGuests(visitorId: string, guests: { name: string; relationship: string }[], token?: string) {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/visitors/${visitorId}/guests`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ guests }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Failed to add guests');
        }
        return res.json();
    },

    async initializePayment(visitorId: string, token?: string) {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/payments/${visitorId}/initialize`, {
            method: 'POST',
            headers,
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Failed to initialize payment');
        }
        return res.json();
    },

    async processPayment(visitorId: string, data: { network?: string; phoneNumber?: string; transactionId?: string; }, token?: string) {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/payments/${visitorId}/pay`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Payment failed');
        }
        return res.json();
    }
};
