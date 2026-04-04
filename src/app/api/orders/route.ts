import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    return payload;
}

export async function GET() {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: { userId: user.userId as number },
            orderBy: { createdAt: 'desc' }
        });

        const parsed = orders.map(o => ({
            ...o,
            items: JSON.parse(o.items)
        }));

        return NextResponse.json(parsed);
    } catch (error) {
        console.error('Orders GET error:', error);
        return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const { items, total, note } = await request.json();
        if (!items || !total) {
            return NextResponse.json({ error: 'Items y total son requeridos' }, { status: 400 });
        }

        const order = await prisma.order.create({
            data: {
                userId: user.userId as number,
                items: JSON.stringify(items),
                total: parseFloat(total),
                note: note || null,
                status: 'PENDIENTE'
            }
        });

        // WhatsApp Notification
        try {
            const settings = await prisma.setting.findFirst({ where: { id: 1 } });
            if (settings?.notifyOrderWS) {
                const admin = await prisma.user.findFirst({
                    where: { role: 'ADMIN' },
                    select: { phone: true }
                });

                if (admin?.phone) {
                    const message = `🛍️ *Nuevo Pedido Naia*\n\n` +
                        `ID: #${order.id}\n` +
                        `Cliente: ${user.name || user.email}\n` +
                        `Total: S/ ${total}\n` +
                        `Nota: ${note || 'Ninguna'}\n\n` +
                        `Revisa los detalles en el panel de administración.`;

                    await sendWhatsAppMessage(admin.phone, message);
                }
            }
        } catch (waError) {
            console.error('Error sending order notification:', waError);
        }

        return NextResponse.json({ message: 'Pedido creado', order });
    } catch (error) {
        console.error('Orders POST error:', error);
        return NextResponse.json({ error: 'Error al crear pedido' }, { status: 500 });
    }
}
