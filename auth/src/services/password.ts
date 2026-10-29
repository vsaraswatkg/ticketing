import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

// Scrypt uses callbacks,  we use promisfy to make it async based

const scryptAsync = promisify(scrypt);
const getSalt = () => randomBytes(8).toString('hex');

export class Password {
    static async toHash(password: string) {
        const salt = getSalt();
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer; // -> this tells TS that buffer is of type Buffer
        return `${buffer.toString('hex')}.${salt}`;

    }

    static async toCompare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buffer = (await scryptAsync(suppliedPassword, salt!, 64)) as Buffer; // -> this tells TS that buffer is of type Buffer
        return buffer.toString('hex') === hashedPassword;
    }
}