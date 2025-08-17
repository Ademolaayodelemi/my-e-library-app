const config = {
  env: {
    
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!, //only accessible in production
    localDatabaseUrl: process.env.LOCAL_DATABASE_URL!,
    NeonCloudDatabaseUrl: process.env.DATABASE_URL!,
    
    imagekit: {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    },
    
    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
      redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
      qstashUrl: process.env.QSTASH_URL!,
      qstashToken: process.env.QSTASH_TOKEN!,
    },
    
    resendToken: process.env.RESEND_TOKEN!,
  },
};

export default config;
// It is important to add "!" to all of them to tell TypeScript that there will be a string value for each one of these env.