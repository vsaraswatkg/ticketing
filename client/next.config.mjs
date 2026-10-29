export default {
    nextConfig: (config) => {
        return {
            ...config,
            watchOptions: {
                ...config.watchOptions,
                poll: 300
            }
        };
    },
    allowedDevOrigins: ['ticketing.dev']
};
