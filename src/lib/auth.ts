import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const secret = process.env.JWT_SECRET;
if (!secret && process.env.NODE_ENV === 'production') {
    console.warn('WARNING: JWT_SECRET is not defined in environment variables');
}

const SECRET_KEY = new TextEncoder().encode(secret || 'dev-secret-only-for-local');

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getRoleFromToken(token: string) {
    const payload = await verifyToken(token);
    return payload ? (payload as any).role : null;
}
