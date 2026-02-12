export function isAdminAccessEnabled(): boolean {
  // Keep admin local-only by default.
  // To enable in production explicitly, set ENABLE_ADMIN_IN_PRODUCTION=true.
  return process.env.NODE_ENV !== 'production' || process.env.ENABLE_ADMIN_IN_PRODUCTION === 'true';
}

export function getAdminDisabledMessage(): string {
  return 'Admin panel is disabled in production. Use local environment.';
}
