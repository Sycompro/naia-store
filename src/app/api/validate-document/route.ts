import { NextResponse } from 'next/server';

const API_TOKEN = '76ca7246c8a8c464fd551b6555e780791a69ff89acb8887558d65b23f05ab81b';

export async function POST(request: Request) {
    try {
        const { type, document } = await request.json();

        if (type === 'DNI') {
            const res = await fetch('https://apiperu.dev/api/dni', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                body: JSON.stringify({ dni: document })
            });
            const data = await res.json();
            return NextResponse.json(data);
        } else if (type === 'RUC') {
            const res = await fetch('https://apiperu.dev/api/ruc', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                body: JSON.stringify({ ruc: document })
            });
            const data = await res.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ success: false, message: 'Tipo de documento inválido' }, { status: 400 });
    } catch (error) {
        console.error('Error validating document:', error);
        return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
}
