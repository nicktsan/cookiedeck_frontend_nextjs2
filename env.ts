export const ENV = {
    SUPABASE: {
        NEXT_PUBLIC_SUPABASE_URL: String(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
        ),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: String(
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        ),
    },
    BACKEND_URL: String(process.env.BACKEND_URL),
    PATH: {
        GET_CREATOR_BY_ID_PATH: String(process.env.GET_CREATOR_BY_ID_PATH),
    },
    NODE_ENV: String(process.env.NODE_ENV),
};
