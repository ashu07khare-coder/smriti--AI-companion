import {
  DbUser,
  DbCareCircleLink,
  DbReminder,
  DbCognitiveExercise,
  DbExerciseTranslation,
  DbExerciseSession,
  DbDailyActivityLog,
  DbDailyScore,
  DbCognitiveTrend,
  DbCaregiverAlert,
  DbCareAction,
} from './types';

export class MemoryDatabase {
  users: DbUser[] = [];
  careCircleLinks: DbCareCircleLink[] = [];
  reminders: DbReminder[] = [];
  exercises: DbCognitiveExercise[] = [];
  translations: DbExerciseTranslation[] = [];
  sessions: DbExerciseSession[] = [];
  dailyActivityLogs: DbDailyActivityLog[] = [];
  dailyScores: DbDailyScore[] = [];
  cognitiveTrends: DbCognitiveTrend[] = [];
  alerts: DbCaregiverAlert[] = [];
  careActions: DbCareAction[] = [];
  syncChangelog: Array<{
    id: number;
    patientId: string;
    entityType: string;
    entityId: string;
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    payload: any;
    serverVersion: number;
    createdAt: string;
  }> = [];
  currentServerVersion: number = 100;

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Demo Users
    this.users = [
      {
        id: 'patient-aita-001',
        phone: '+919876543210',
        hashedPin: '1234',
        role: 'elder',
        name: 'Bonti Khound',
        preferredName: 'Aita',
        languageCode: 'as',
        createdAt: '2026-08-01T00:00:00.000Z',
        updatedAt: '2026-09-14T00:00:00.000Z',
        version: 1,
      },
      {
        id: 'caregiver-ananya-002',
        phone: '+919876543211',
        hashedPin: '1234',
        role: 'caregiver',
        name: 'Ananya Khound',
        preferredName: 'Ananya',
        languageCode: 'en',
        createdAt: '2026-08-01T00:00:00.000Z',
        updatedAt: '2026-09-14T00:00:00.000Z',
        version: 1,
      },
      {
        id: 'asha-rina-003',
        phone: '+919876543212',
        hashedPin: '1234',
        role: 'asha',
        name: 'Rina Das (ASHA)',
        preferredName: 'Rina Didi',
        languageCode: 'as',
        createdAt: '2026-08-01T00:00:00.000Z',
        updatedAt: '2026-09-14T00:00:00.000Z',
        version: 1,
      },
    ];

    // 2. Care Circle Links
    this.careCircleLinks = [
      {
        id: 'link-001',
        patientId: 'patient-aita-001',
        memberId: 'caregiver-ananya-002',
        relationship: 'Daughter',
        permissionLevel: 'full_manage',
        canReceiveAlerts: true,
        callCount: 14,
        createdAt: '2026-08-01T00:00:00.000Z',
        updatedAt: '2026-09-14T00:00:00.000Z',
        version: 1,
      },
      {
        id: 'link-002',
        patientId: 'patient-aita-001',
        memberId: 'asha-rina-003',
        relationship: 'Community Health Worker (ASHA)',
        permissionLevel: 'view_trends_and_alerts',
        canReceiveAlerts: true,
        callCount: 4,
        createdAt: '2026-08-01T00:00:00.000Z',
        updatedAt: '2026-09-14T00:00:00.000Z',
        version: 1,
      },
    ];

    // 3. Cognitive Exercises
    this.exercises = [
      {
        id: 'image-card-matching',
        name: 'Image & Card Matching',
        category: 'memory',
        supportedLevels: ['gentle', 'easy', 'steady', 'deeper'],
        isActive: true,
      },
      {
        id: 'pattern-recall',
        name: 'Pattern Recall',
        category: 'executive_function',
        supportedLevels: ['easy', 'medium', 'hard'],
        isActive: true,
      },
    ];

    // Multilingual Translations (Assamese, English, Bengali, Hindi)
    this.translations = [
      {
        id: 'trans-001',
        exerciseId: 'image-card-matching',
        languageCode: 'as',
        title: 'ছবি আৰু কাৰ্ড মিলোৱা (Memory Lane)',
        instructionText: 'একে ছবিৰ কাৰ্ড দুখন বিচাৰি উলিয়াওক।',
        voicePromptText: 'আইতা, একেধৰণৰ কাৰ্ড দুখনত চুই দিয়ক।',
      },
      {
        id: 'trans-002',
        exerciseId: 'image-card-matching',
        languageCode: 'en',
        title: 'Image & Card Matching',
        instructionText: 'Tap two matching cards to pair them up.',
        voicePromptText: 'Aita, gently tap two matching cards.',
      },
      {
        id: 'trans-003',
        exerciseId: 'pattern-recall',
        languageCode: 'as',
        title: 'নক্সা মনত ৰখা (Pattern Recall)',
        instructionText: 'ৰঙীন বাকচকেইটা মনত ৰাখি ক্ৰম অনুসৰি চুই দিয়ক।',
        voicePromptText: 'নক্সাটো মনত ৰাখক আৰু তাৰ পাছত চুই দিয়ক।',
      },
      {
        id: 'trans-004',
        exerciseId: 'pattern-recall',
        languageCode: 'en',
        title: 'Pattern Recall',
        instructionText: 'Watch the light sequence and tap the tiles in order.',
        voicePromptText: 'Remember the pattern and tap the boxes.',
      },
    ];

    // 4. Reminders with Timeliness & Grace Window
    this.reminders = [
      {
        id: 'rem-001',
        patientId: 'patient-aita-001',
        title: 'Morning Blood Pressure Medicine',
        subtitle: 'Amlodipine 5mg with a cup of warm water',
        scheduledTime: '08:30 AM',
        scheduledDate: '2026-09-14',
        category: 'medicine',
        recurrence: 'Daily',
        voicePromptText: 'আইতা, ৰাতিপুৱাৰ প্ৰেচাৰৰ ঔষধ খোৱাৰ সময় হ’ল।',
        completed: true,
        completedAt: '2026-09-14T08:38:00.000Z',
        completionStatus: 'on_time',
        responseDelayMinutes: 8,
        createdByRole: 'caregiver',
        createdAt: '2026-09-14T00:00:00.000Z',
        updatedAt: '2026-09-14T08:38:00.000Z',
        version: 1,
      },
      {
        id: 'rem-002',
        patientId: 'patient-aita-001',
        title: 'Midday Hydration',
        subtitle: 'Glass of warm lemon water',
        scheduledTime: '11:30 AM',
        scheduledDate: '2026-09-14',
        category: 'hydration',
        recurrence: 'Daily',
        voicePromptText: 'আইতা, এগিলাচ পানী খাই লওক।',
        completed: true,
        completedAt: '2026-09-14T11:35:00.000Z',
        completionStatus: 'on_time',
        responseDelayMinutes: 5,
        createdByRole: 'caregiver',
        createdAt: '2026-09-14T00:00:00.000Z',
        updatedAt: '2026-09-14T11:35:00.000Z',
        version: 1,
      },
      {
        id: 'rem-003',
        patientId: 'patient-aita-001',
        title: 'Afternoon Brain Games',
        subtitle: 'Play 5 minutes of Card Matching or Pattern Recall',
        scheduledTime: '03:00 PM',
        scheduledDate: '2026-09-14',
        category: 'activity',
        recurrence: 'Daily',
        voicePromptText: 'আইতা, আহক অলপ খেল খেলি মনটো সতেজ কৰোঁ।',
        completed: false,
        completionStatus: 'pending',
        createdByRole: 'caregiver',
        createdAt: '2026-09-14T00:00:00.000Z',
        updatedAt: '2026-09-14T00:00:00.000Z',
        version: 1,
      },
      {
        id: 'rem-004',
        patientId: 'patient-aita-001',
        title: 'Evening Walk in Courtyard',
        subtitle: '15 minutes gentle strolling with Diti',
        scheduledTime: '05:30 PM',
        scheduledDate: '2026-09-14',
        category: 'activity',
        recurrence: 'Daily',
        completed: false,
        completionStatus: 'pending',
        createdByRole: 'caregiver',
        createdAt: '2026-09-14T00:00:00.000Z',
        updatedAt: '2026-09-14T00:00:00.000Z',
        version: 1,
      },
    ];

    // 5. Seed 14 Days of Daily Scores & Logs (Establishing 14-day baseline ~78.5)
    const baseDate = new Date('2026-09-14T00:00:00.000Z');
    const demoDailyData = [
      { dayOffset: 13, adh: 100, cog: 78, eng: 75, comp: 81.9, open: true, mins: 25 },
      { dayOffset: 12, adh: 100, cog: 80, eng: 70, comp: 81.5, open: true, mins: 22 },
      { dayOffset: 11, adh: 75,  cog: 74, eng: 65, comp: 72.1, open: true, mins: 18 },
      { dayOffset: 10, adh: 100, cog: 82, eng: 80, comp: 86.9, open: true, mins: 28 },
      { dayOffset: 9,  adh: 100, cog: 76, eng: 72, comp: 80.2, open: true, mins: 20 },
      { dayOffset: 8,  adh: 100, cog: 75, eng: 70, comp: 79.3, open: true, mins: 21 },
      { dayOffset: 7,  adh: 100, cog: 79, eng: 75, comp: 82.4, open: true, mins: 24 },
      { dayOffset: 6,  adh: 100, cog: 77, eng: 70, comp: 80.2, open: true, mins: 20 },
      { dayOffset: 5,  adh: 75,  cog: 73, eng: 60, comp: 70.4, open: true, mins: 15 },
      { dayOffset: 4,  adh: 100, cog: 81, eng: 78, comp: 85.0, open: true, mins: 26 },
      { dayOffset: 3,  adh: 100, cog: 78, eng: 72, comp: 81.1, open: true, mins: 22 },
      { dayOffset: 2,  adh: 100, cog: 80, eng: 80, comp: 86.0, open: true, mins: 27 },
      { dayOffset: 1,  adh: 100, cog: 82, eng: 85, comp: 88.2, open: true, mins: 30 },
      { dayOffset: 0,  adh: 100, cog: 80, eng: 75, comp: 83.8, open: true, mins: 24 },
    ];

    for (const item of demoDailyData) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - item.dayOffset);
      const dateStr = d.toISOString().split('T')[0];

      this.dailyActivityLogs.push({
        id: `log-${dateStr}`,
        patientId: 'patient-aita-001',
        logDate: dateStr,
        remindersScheduled: 4,
        remindersCompleted: item.adh >= 100 ? 4 : 3,
        remindersOnTime: item.adh >= 100 ? 4 : 3,
        remindersLate: 0,
        remindersMissed: item.adh >= 100 ? 0 : 1,
        exerciseSessionIds: [`sess-${dateStr}-1`, `sess-${dateStr}-2`],
        appOpened: item.open,
        activeMinutes: item.mins,
        sessionCount: 2,
        createdAt: `${dateStr}T20:00:00.000Z`,
        updatedAt: `${dateStr}T20:00:00.000Z`,
        version: 1,
      });

      this.dailyScores.push({
        id: `score-${dateStr}`,
        patientId: 'patient-aita-001',
        scoreDate: dateStr,
        adherenceScore: item.adh,
        cognitiveScore: item.cog,
        engagementScore: item.eng,
        compositeScore: item.comp,
        weightsUsed: { adherence: 0.3, cognitive: 0.45, engagement: 0.25 },
        createdAt: `${dateStr}T22:00:00.000Z`,
      });
    }

    // 6. Cognitive Trend (Baseline = 81.0, Rolling 7d = 82.0, Trend = stable)
    this.cognitiveTrends.push({
      id: 'trend-2026-09-14',
      patientId: 'patient-aita-001',
      trendDate: '2026-09-14',
      rolling7dComposite: 82.0,
      rolling7dAdherence: 96.4,
      rolling7dCognitive: 78.7,
      rolling7dEngagement: 74.3,
      baselineComposite: 81.0,
      baselineDaysCounted: 14,
      compositeTrend: 'stable',
      adherenceTrend: 'stable',
      cognitiveTrend: 'stable',
      engagementTrend: 'stable',
      createdAt: '2026-09-14T22:00:00.000Z',
    });

    // 7. Caregiver Alerts
    this.alerts = [
      {
        id: 'alert-001',
        patientId: 'patient-aita-001',
        episodeKey: 'adherence_sep_11',
        title: 'Missed Hydration Reminder',
        message: 'Midday hydration reminder had no confirmation by 4:00 PM.',
        severity: 'warning',
        triggerMetric: 'adherence_drop',
        status: 'acknowledged',
        createdAt: '2026-09-11T16:15:00.000Z',
      },
    ];

    // 8. Care Actions Log
    this.careActions = [
      {
        id: 'action-001',
        patientId: 'patient-aita-001',
        actorId: 'caregiver-ananya-002',
        actionType: 'CALL_ELDER',
        recipientPhone: '+919876543210',
        summary: 'Checked in on morning medication and evening tea with family.',
        createdAt: '2026-09-13T17:30:00.000Z',
      },
    ];
  }

  // Helper to append changelog for delta sync
  logChange(patientId: string, entityType: string, entityId: string, action: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) {
    this.currentServerVersion++;
    this.syncChangelog.push({
      id: this.syncChangelog.length + 1,
      patientId,
      entityType,
      entityId,
      action,
      payload,
      serverVersion: this.currentServerVersion,
      createdAt: new Date().toISOString(),
    });
  }
}

export const db = new MemoryDatabase();
