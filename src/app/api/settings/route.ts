import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // @ts-ignore
        const settings = await prisma.setting.findUnique({
            where: { id: 1 },
            select: {
                storeName: true,
                buyWhatsAppNumber: true,
                supportEmail: true,
                mainAddress: true
            }
        });

        if (!settings) {
            return NextResponse.json({
                storeName: "Naia Beauty Store",
                buyWhatsAppNumber: "51944399377"
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching public settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
