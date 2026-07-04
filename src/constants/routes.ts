export const routes = {
  login: '/login',
  signup: '/signup',
  resetPassword: '/reset-password',
  // Onboarding is a modal over the dashboard, opened via ?connect=1.
  connectExtension: '/overview?connect=1',
  privacy: '/privacy',
  overview: '/overview',
  insights: '/insights',
  devices: '/devices',
  settingsPrivacy: '/settings/privacy',
  settingsCategories: '/settings/categories',
  settingsNotifications: '/settings/notifications',
  settingsAccount: '/settings/account',
  bot: '/bot',
} as const
