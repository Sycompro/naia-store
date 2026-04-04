'use client';
import React from 'react';
import AdminSettings from '@/components/admin/AdminSettings';
import { useRouter } from 'next/navigation';

export default function ConfigPage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.status === 403) {
                router.push('/auth/login');
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Cargando...</div>;

    return (
        <div className="admin-config-page">
            <AdminSettings />
        </div>
    );
}
