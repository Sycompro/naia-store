import prisma from './prisma';

/**
 * Sends a WhatsApp message using Meta Cloud API.
 * Uses configuration from the database (Settings) and environment variables.
 */
export async function sendWhatsAppMessage(to: string, content: string) {
    try {
        const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

        // Fetch settings for Phone ID
        const settings = await prisma.setting.findFirst({
            where: { id: 1 }
        });

        const PHONE_ID = settings?.whatsappPhoneId || process.env.WHATSAPP_PHONE_ID;

        if (!ACCESS_TOKEN || !PHONE_ID) {
            console.error('MISSING WHATSAPP CREDENTIALS:', { haseToken: !!ACCESS_TOKEN, hasPhoneId: !!PHONE_ID });
            return { error: 'Missing configuration', detail: 'ACCESS_TOKEN or PHONE_ID not found' };
        }

        // WhatsApp expects numbers with country code, for Peru it's 51
        const formattedPhone = to.startsWith('51') ? to : `51${to}`;

        const response = await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: formattedPhone,
                type: 'text',
                text: { body: content }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('WhatsApp API Error Response:', data);
            return { error: 'API Error', data };
        }

        return { success: true, messageId: data.messages?.[0]?.id };
    } catch (error) {
        console.error('WhatsApp Fetch Error:', error);
        return { error: 'Fetch failed', detail: error };
    }
}
