export const expirationQueue = {
    add: jest.fn().mockResolvedValue({}),
    process: jest.fn(),
};
