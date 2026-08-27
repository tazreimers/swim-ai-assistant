const requiredInAllEnvironments = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'FRONTEND_URL',
  'AI_SERVICE_URL',
] as const;

const requiredInProduction = ['SUPABASE_SERVICE_ROLE_KEY', 'AI_SERVICE_TOKEN'] as const;

export function validateApiConfig(environment: NodeJS.ProcessEnv = process.env): void {
  const required: string[] = [...requiredInAllEnvironments];
  if (environment.NODE_ENV === 'production') {
    required.push(...requiredInProduction);
  }

  const missing = required.filter((name) => !environment[name]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required API environment variables: ${missing.join(', ')}`);
  }
}
