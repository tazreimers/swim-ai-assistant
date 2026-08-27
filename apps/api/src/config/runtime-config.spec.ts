import { validateApiConfig } from './runtime-config';

const validConfig = {
  DATABASE_URL: 'postgresql://localhost/swim',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_ANON_KEY: 'anon',
  FRONTEND_URL: 'https://app.example.com',
  AI_SERVICE_URL: 'https://ai.example.com',
};

describe('validateApiConfig', () => {
  it('reports missing required variables', () => {
    expect(() => validateApiConfig({})).toThrow('Missing required API environment variables');
  });

  it('requires server-only production variables', () => {
    expect(() => validateApiConfig({ ...validConfig, NODE_ENV: 'production' })).toThrow(
      'SUPABASE_SERVICE_ROLE_KEY, AI_SERVICE_TOKEN',
    );
  });

  it('accepts complete production configuration', () => {
    expect(() =>
      validateApiConfig({
        ...validConfig,
        NODE_ENV: 'production',
        SUPABASE_SERVICE_ROLE_KEY: 'service-role',
        AI_SERVICE_TOKEN: 'service-token',
      }),
    ).not.toThrow();
  });
});
