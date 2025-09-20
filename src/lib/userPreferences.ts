import { TonePreference, UserPreferences } from '../types';

const PREFERENCES_KEY = 'career-builder-preferences';

const defaultPreferences: UserPreferences = {
  tone: 'professional'
};

export class UserPreferencesService {
  public static getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {...defaultPreferences, ...parsed};
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
    return defaultPreferences;
  }

  public static savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  public static updateTone(tone: TonePreference): void {
    const preferences = this.getPreferences();
    preferences.tone = tone;
    this.savePreferences(preferences);
  }

  public static getTone(): TonePreference {
    return this.getPreferences().tone;
  }
}