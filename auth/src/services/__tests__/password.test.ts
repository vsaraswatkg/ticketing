import { Password } from '../password';

it('hashes a password with salt', async () => {
    const hash = await Password.toHash('password123');
    expect(hash).toBeDefined();
    expect(hash).toContain('.');
});

it('returns true when comparing matching password', async () => {
    const hash = await Password.toHash('password123');
    const isMatch = await Password.toCompare(hash, 'password123');
    expect(isMatch).toBe(true);
});

it('returns false when comparing non-matching password', async () => {
    const hash = await Password.toHash('password123');
    const isMatch = await Password.toCompare(hash, 'wrongpassword');
    expect(isMatch).toBe(false);
});
