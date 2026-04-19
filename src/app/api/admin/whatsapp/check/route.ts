export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getRoleFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token || !(await verifyToken(token)) || (await getRoleFromToken(token)) !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        const settings = await prisma.setting.findUnique({
            where: { id: 1 }
        });

        if (!settings || !settings.whatsappPhoneId || !settings.whatsappVerifyToken) {
            return NextResponse.json({
                status: 'Desconectado',
                message: 'Faltan credenciales de configuración'
            });
        }

        // Aquí se podría implementar un ping real a la API de Meta
        // Por ahora, validamos que los campos tengan contenido
        return NextResponse.json({
            status: 'Conectado',
            message: 'Configuración válida'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error al verificar' }, { status: 500 });
    }
}
