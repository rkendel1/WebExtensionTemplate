export type BrowserMessageType = 'getColorScheme' | 'gotColorScheme' | 'toggleSidebar';

export type BrowserMessage = {
  type: BrowserMessageType;
  value?: any;
};

export type AppSettings = {
  displayHelpMessage: boolean;
  openaiApiKey: string;
};

export const DEFAULT_SETTINGS: AppSettings = {
  displayHelpMessage: true,
  openaiApiKey: ''
};

export type ColorScheme = 'light' | 'dark';