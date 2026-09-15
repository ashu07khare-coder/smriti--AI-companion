import { FamilyMember, Reminder, GameSession, DailyScore, CaregiverAlert, CaregiverNote, SyncQueueItem, LanguageCode, UserProfile, DailyAdherenceLog, ReminderAdherenceMetrics } from '../types';
import { INITIAL_FAMILY_MEMBERS, INITIAL_REMINDERS, INITIAL_DAILY_SCORES, INITIAL_ALERTS, INITIAL_CARE_NOTES, INITIAL_ADHERENCE_HISTORY } from '../data/mockData';
import { calculateReminderAdherenceMetrics, evaluateReminderTimeliness } from './adherenceMetrics';

const KEYS = {
  FAMILY: 'smriti_family_members',
  REMINDERS: 'smriti_reminders',
  SESSIONS: 'smriti_game_sessions',
  DAILY_SCORES: 'smriti_daily_scores',
  ALERTS: 'smriti_alerts',
  NOTES: 'smriti_care_notes',
  SYNC_QUEUE: 'smriti_sync_queue',
  PIN: 'smriti_caregiver_pin',
  ACCESS_LOGS: 'smriti_caregiver_logs',
  LANG: 'smriti_selected_lang',
  BASELINE_DAY: 'smriti_baseline_day',
  CURRENT_USER: 'smriti_current_user',
  REGISTERED_USERS: 'smriti_registered_users',
  ADHERENCE_HISTORY: 'smriti_adherence_history',
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-default-aita',
  elderName: 'Minati Barua',
  preferredName: 'Aita',
  phone: '+91 98765 43210',
  pin: '1234',
  age: 74,
  stateRegion: 'Assam',
  districtArea: 'Majuli',
  language: 'as',
  caregiverName: 'Priya Barua',
  caregiverPhone: '+91 98765 00001',
  caregiverRelation: 'Daughter (Primary Caregiver)',
  familyMemberName: 'Arjun Barua',
  familyMemberPhone: '+91 98765 00002',
  familyMemberRelation: 'Son (Guwahati)',
  createdAt: '2026-07-01',
};

export const DEMO_MIZORAM_PROFILE: UserProfile = {
  id: 'usr-demo-pi-vanlali',
  elderName: 'Pi Vanlali',
  preferredName: 'Ka Pi',
  phone: '+91 98765 43211',
  pin: '1234',
  age: 76,
  stateRegion: 'Mizoram',
  districtArea: 'Aizawl',
  language: 'lus',
  caregiverName: 'Lalrintluanga',
  caregiverPhone: '+91 98765 00003',
  caregiverRelation: 'Son (Primary Caregiver)',
  familyMemberName: 'Zodinpuii',
  familyMemberPhone: '+91 98765 00004',
  familyMemberRelation: 'Daughter (Champhai)',
  createdAt: '2026-07-15',
};

export class AppStorage {
  static getFamilyMembers(): FamilyMember[] {
    try {
      const data = localStorage.getItem(KEYS.FAMILY);
      if (!data) {
        localStorage.setItem(KEYS.FAMILY, JSON.stringify(INITIAL_FAMILY_MEMBERS));
        return INITIAL_FAMILY_MEMBERS;
      }
      const parsed: FamilyMember[] = JSON.parse(data);
      // Migrate / sync INITIAL_FAMILY_MEMBERS if old unsplash URL was stored
      let modified = false;
      const updated = parsed.map(m => {
        const initial = INITIAL_FAMILY_MEMBERS.find(init => init.id === m.id);
        if (initial && initial.photoUrl.startsWith('/photos/') && m.photoUrl !== initial.photoUrl) {
          modified = true;
          return { ...m, photoUrl: initial.photoUrl };
        }
        return m;
      });
      if (modified) {
        localStorage.setItem(KEYS.FAMILY, JSON.stringify(updated));
      }
      return updated;
    } catch {
      return INITIAL_FAMILY_MEMBERS;
    }
  }

  static saveFamilyMember(member: FamilyMember): FamilyMember[] {
    const list = this.getFamilyMembers();
    const existingIndex = list.findIndex(m => m.id === member.id);
    let updated: FamilyMember[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = member;
    } else {
      updated = [member, ...list];
    }
    localStorage.setItem(KEYS.FAMILY, JSON.stringify(updated));
    this.enqueueSync('save', 'family_members', member);
    return updated;
  }

  static setFamilyMembers(members: FamilyMember[]): FamilyMember[] {
    localStorage.setItem(KEYS.FAMILY, JSON.stringify(members));
    this.enqueueSync('batch_save', 'family_members', members);
    return members;
  }

  static deleteFamilyMember(id: string): FamilyMember[] {
    const list = this.getFamilyMembers().filter(m => m.id !== id);
    localStorage.setItem(KEYS.FAMILY, JSON.stringify(list));
    this.enqueueSync('delete', 'family_members', { id });
    return list;
  }

  static getReminders(): Reminder[] {
    try {
      const data = localStorage.getItem(KEYS.REMINDERS);
      if (!data) {
        localStorage.setItem(KEYS.REMINDERS, JSON.stringify(INITIAL_REMINDERS));
        return INITIAL_REMINDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REMINDERS;
    }
  }

  static saveReminder(reminder: Reminder): Reminder[] {
    const list = this.getReminders();
    const idx = list.findIndex(r => r.id === reminder.id);
    let updated: Reminder[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = reminder;
    } else {
      updated = [reminder, ...list];
    }
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(updated));
    this.enqueueSync('save', 'reminders', reminder);
    return updated;
  }

  static toggleReminder(id: string, customCompletedAt?: string): Reminder[] {
    const now = new Date();
    const list: Reminder[] = this.getReminders().map((r): Reminder => {
      if (r.id === id) {
        const nextCompleted = !r.completed;
        if (nextCompleted) {
          const completedAt = customCompletedAt || now.toISOString();
          const evalRes = evaluateReminderTimeliness({ ...r, completed: true, completedAt }, now, 30);
          return {
            ...r,
            completed: true,
            completedAt,
            completionStatus: evalRes.status,
            responseDelayMinutes: evalRes.delayMinutes,
          };
        } else {
          return {
            ...r,
            completed: false,
            completedAt: undefined,
            completionStatus: 'pending',
            responseDelayMinutes: undefined,
          };
        }
      }
      return r;
    });
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(list));
    this.enqueueSync('update_status', 'reminders', { id });
    return list;
  }

  static getAdherenceHistory(): DailyAdherenceLog[] {
    try {
      const data = localStorage.getItem(KEYS.ADHERENCE_HISTORY);
      if (!data) {
        localStorage.setItem(KEYS.ADHERENCE_HISTORY, JSON.stringify(INITIAL_ADHERENCE_HISTORY));
        return INITIAL_ADHERENCE_HISTORY;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ADHERENCE_HISTORY;
    }
  }

  static saveAdherenceHistory(history: DailyAdherenceLog[]): void {
    localStorage.setItem(KEYS.ADHERENCE_HISTORY, JSON.stringify(history));
    this.enqueueSync('batch_save', 'adherence_history', history);
  }

  static getAdherenceMetrics(graceWindowMinutes: number = 30): ReminderAdherenceMetrics {
    const reminders = this.getReminders();
    const history = this.getAdherenceHistory();
    return calculateReminderAdherenceMetrics(reminders, history, graceWindowMinutes);
  }

  static deleteReminder(id: string): Reminder[] {
    const list = this.getReminders().filter(r => r.id !== id);
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(list));
    this.enqueueSync('delete', 'reminders', { id });
    return list;
  }

  static getGameSessions(): GameSession[] {
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static recordGameSession(session: GameSession): void {
    const list = this.getGameSessions();
    const updated = [session, ...list];
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(updated));
    this.enqueueSync('record', 'game_sessions', session);
    this.updateDailyScoreRollup(session);
  }

  private static updateDailyScoreRollup(session: GameSession): void {
    const dailyScores = this.getDailyScores();
    const todayStr = session.date;
    const existingIndex = dailyScores.findIndex(d => d.date === todayStr);

    if (existingIndex >= 0) {
      const existing = dailyScores[existingIndex];
      const newCount = existing.sessionsCount + 1;
      const newAvg = Math.round((existing.averageScore * existing.sessionsCount + session.score) / newCount);
      dailyScores[existingIndex] = {
        ...existing,
        averageScore: newAvg,
        sessionsCount: newCount,
      };
    } else {
      dailyScores.push({
        date: todayStr,
        displayDate: 'TODAY',
        averageScore: session.score,
        sessionsCount: 1,
      });
    }

    localStorage.setItem(KEYS.DAILY_SCORES, JSON.stringify(dailyScores));
  }

  static getDailyScores(): DailyScore[] {
    try {
      const data = localStorage.getItem(KEYS.DAILY_SCORES);
      if (!data) {
        localStorage.setItem(KEYS.DAILY_SCORES, JSON.stringify(INITIAL_DAILY_SCORES));
        return INITIAL_DAILY_SCORES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DAILY_SCORES;
    }
  }

  static getAlerts(): CaregiverAlert[] {
    try {
      const data = localStorage.getItem(KEYS.ALERTS);
      if (!data) {
        localStorage.setItem(KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
        return INITIAL_ALERTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ALERTS;
    }
  }

  static acknowledgeAlert(id: string): CaregiverAlert[] {
    const alerts = this.getAlerts().map(a => a.id === id ? { ...a, acknowledged: true } : a);
    localStorage.setItem(KEYS.ALERTS, JSON.stringify(alerts));
    return alerts;
  }

  static getCareNotes(): CaregiverNote[] {
    try {
      const data = localStorage.getItem(KEYS.NOTES);
      if (!data) {
        localStorage.setItem(KEYS.NOTES, JSON.stringify(INITIAL_CARE_NOTES));
        return INITIAL_CARE_NOTES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CARE_NOTES;
    }
  }

  static addCareNote(note: CaregiverNote): CaregiverNote[] {
    const notes = [note, ...this.getCareNotes()];
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    this.enqueueSync('create', 'care_notes', note);
    return notes;
  }

  static getSyncQueue(): SyncQueueItem[] {
    try {
      const data = localStorage.getItem(KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static enqueueSync(action: string, entity: string, payload: any) {
    const queue = this.getSyncQueue();
    const item: SyncQueueItem = {
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      action,
      entity,
      payload,
      createdAt: Date.now(),
      status: 'pending',
    };
    queue.push(item);
    localStorage.setItem(KEYS.SYNC_QUEUE, JSON.stringify(queue));
  }

  static flushSyncQueue(): number {
    const count = this.getSyncQueue().length;
    localStorage.setItem(KEYS.SYNC_QUEUE, JSON.stringify([]));
    return count;
  }

  static getCaregiverPin(): string {
    return localStorage.getItem(KEYS.PIN) || '1234';
  }

  static logCaregiverAccess(): string {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logStr = `Caregiver accessed app today at ${time}`;
    localStorage.setItem(KEYS.ACCESS_LOGS, logStr);
    return logStr;
  }

  static getLastCaregiverAccess(): string {
    return localStorage.getItem(KEYS.ACCESS_LOGS) || 'Caregiver accessed today at 9:15 AM';
  }

  static getSelectedLanguage(): LanguageCode {
    return (localStorage.getItem(KEYS.LANG) as LanguageCode) || 'as';
  }

  static setSelectedLanguage(lang: LanguageCode) {
    localStorage.setItem(KEYS.LANG, lang);
  }

  static getUserProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      if (!data) {
        // Seed with default profile so initial session has complete demo data
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USER_PROFILE));
        this.saveRegisteredUser(DEFAULT_USER_PROFILE);
        return DEFAULT_USER_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  }

  static saveUserProfile(profile: UserProfile): UserProfile {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(profile));
    if (profile.language) {
      this.setSelectedLanguage(profile.language as LanguageCode);
    }
    this.saveRegisteredUser(profile);
    this.enqueueSync('save', 'user_profile', profile);
    return profile;
  }

  static getRegisteredUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(KEYS.REGISTERED_USERS);
      if (!data) {
        return [DEFAULT_USER_PROFILE, DEMO_MIZORAM_PROFILE];
      }
      const users: UserProfile[] = JSON.parse(data);
      if (!users.some(u => u.id === DEFAULT_USER_PROFILE.id)) {
        users.unshift(DEFAULT_USER_PROFILE);
      }
      if (!users.some(u => u.id === DEMO_MIZORAM_PROFILE.id)) {
        users.push(DEMO_MIZORAM_PROFILE);
      }
      return users;
    } catch {
      return [DEFAULT_USER_PROFILE, DEMO_MIZORAM_PROFILE];
    }
  }

  private static saveRegisteredUser(profile: UserProfile) {
    const users = this.getRegisteredUsers();
    const idx = users.findIndex(u => u.phone === profile.phone || u.id === profile.id);
    let updated: UserProfile[];
    if (idx >= 0) {
      updated = [...users];
      updated[idx] = profile;
    } else {
      updated = [profile, ...users];
    }
    localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(updated));
  }

  static loginUser(phone: string, pin: string): UserProfile | null {
    const cleanPhone = phone.replace(/\D/g, '');
    const users = this.getRegisteredUsers();
    const found = users.find(u => {
      const userPhoneClean = u.phone.replace(/\D/g, '');
      const matchPhone = userPhoneClean.endsWith(cleanPhone) || cleanPhone.endsWith(userPhoneClean);
      const matchPin = !pin || u.pin === pin;
      return matchPhone && matchPin;
    });

    if (found) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(found));
      if (found.language) {
        this.setSelectedLanguage(found.language as LanguageCode);
      }
      return found;
    }
    return null;
  }

  static logoutUser(): void {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}
