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

// P3.6: last settings tab visited, so the sidebar link resumes where the user left off.
export const SETTINGS_TAB_STORAGE_KEY = 'pulse:settings-tab'
