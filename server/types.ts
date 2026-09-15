export type UserRole = 'elder' | 'caregiver' | 'asha' | 'family';
export type CarePermission = 'view_only' | 'can_call' | 'view_trends_and_alerts' | 'full_manage';
export type ReminderCategory = 'medicine' | 'activity' | 'hydration' | 'meal' | 'voice';
export type CompletionStatus = 'pending' | 'on_time' | 'late' | 'missed';
export type TrendDirection = 'rising' | 'stable' | 'declining';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface DbUser {
  id: string;
  phone: string;
  hashedPin?: string;
  role: UserRole;
  name: string;
  preferredName?: string;
  languageCode: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface DbCareCircleLink {
  id: string;
  patientId: string;
  memberId: string;
  relationship: string;
  permissionLevel: CarePermission;
  canReceiveAlerts: boolean;
  callCount: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface DbReminder {
  id: string;
  patientId: string;
  title: string;
  subtitle?: string;
  scheduledTime: string;
  scheduledDate: string; // YYYY-MM-DD
  category: ReminderCategory;
  recurrence?: string;
  voicePromptText?: string;
  localAudioId?: string;
  completed: boolean;
  completedAt?: string;
  completionStatus: CompletionStatus;
  responseDelayMinutes?: number;
  createdByRole?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface DbCognitiveExercise {
  id: string;
  name: string;
  category: string;
  supportedLevels: string[];
  isActive: boolean;
}

export interface DbExerciseTranslation {
  id: string;
  exerciseId: string;
  languageCode: string;
  title: string;
  instructionText: string;
  voicePromptText?: string;
}

export interface DbExerciseSession {
  id: string;
  patientId: string;
  exerciseId: string;
  level: string;
  durationSeconds: number;
  completed: boolean;
  sessionScore: number;
  startedAt: string;
  completedAt: string;
  details: Record<string, any>;
  createdAt: string;
  version: number;
}

export interface DbDailyActivityLog {
  id: string;
  patientId: string;
  logDate: string; // YYYY-MM-DD
  remindersScheduled: number;
  remindersCompleted: number;
  remindersOnTime: number;
  remindersLate: number;
  remindersMissed: number;
  exerciseSessionIds: string[];
  appOpened: boolean;
  activeMinutes: number;
  sessionCount: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface DbDailyScore {
  id: string;
  patientId: string;
  scoreDate: string; // YYYY-MM-DD
  adherenceScore: number | null;
  cognitiveScore: number | null;
  engagementScore: number | null;
  compositeScore: number;
  weightsUsed: {
    adherence: number;
    cognitive: number;
    engagement: number;
  };
  createdAt: string;
}

export interface DbCognitiveTrend {
  id: string;
  patientId: string;
  trendDate: string; // YYYY-MM-DD
  rolling7dComposite: number;
  rolling7dAdherence: number | null;
  rolling7dCognitive: number | null;
  rolling7dEngagement: number | null;
  baselineComposite: number;
  baselineDaysCounted: number;
  compositeTrend: TrendDirection;
  adherenceTrend: TrendDirection;
  cognitiveTrend: TrendDirection;
  engagementTrend: TrendDirection;
  createdAt: string;
}

export interface DbCaregiverAlert {
  id: string;
  patientId: string;
  episodeKey: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  triggerMetric: string;
  status: 'active' | 'resolved' | 'acknowledged';
  createdAt: string;
  resolvedAt?: string;
}

export interface DbCareAction {
  id: string;
  patientId: string;
  actorId: string;
  actionType: 'CALL_ELDER' | 'SHARE_WITH_ASHA';
  recipientPhone?: string;
  summary?: string;
  createdAt: string;
}

export interface SyncDeltaRequest {
  lastServerVersion: number;
  clientChanges: Array<{
    entity: 'reminders' | 'exercise_sessions' | 'care_circle' | 'daily_activity';
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    id: string;
    payload: any;
  }>;
}

export interface SyncDeltaResponse {
  newServerVersion: number;
  serverChanges: Array<{
    entity: string;
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    id: string;
    payload: any;
    serverVersion: number;
  }>;
  syncedClientIds: string[];
}
