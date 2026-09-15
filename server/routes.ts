import { Router, Request, Response } from 'express';
import { db } from './store';
import { executeNightlyScoring } from './scoringEngine';
import { SyncDeltaRequest, SyncDeltaResponse, DbExerciseSession, DbReminder } from './types';
import { getSupabase, isSupabaseConfigured } from './supabase';
import { getGemini, isGeminiConfigured } from './gemini';
import { buildBhashiniGeminiSystemPrompt, getBhashiniProfile, BHASHINI_PROFILES } from './bhashiniLayer';

export const apiRouter = Router();

// ============================================================================
// 1. HEALTH & METADATA
// ============================================================================
apiRouter.get('/health', async (req: Request, res: Response) => {
  const supabaseActive = isSupabaseConfigured();
  let supabaseConnected = false;

  if (supabaseActive) {
    try {
      const sb = getSupabase();
      if (sb) {
        const { error } = await sb.from('users').select('count', { count: 'exact', head: true });
        supabaseConnected = !error;
      }
    } catch {
      supabaseConnected = false;
    }
  }

  const geminiAvailable = isGeminiConfigured();

  res.json({
    status: 'ok',
    service: 'Smriti Cognitive Care Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: supabaseActive
      ? (supabaseConnected ? 'Supabase PostgreSQL (Connected)' : 'Supabase PostgreSQL (Configured, Connecting...)')
      : 'PostgreSQL-Ready In-Memory Store (Supabase-Compatible)',
    supabase: {
      configured: supabaseActive,
      connected: supabaseConnected,
      url: process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.slice(0, 16)}...` : null,
    },
    ai: {
      gemini: {
        configured: geminiAvailable,
        model: 'gemini-3.6-flash',
      },
      bhashiniLayer: {
        active: true,
        supportedLanguages: Object.keys(BHASHINI_PROFILES),
      },
    },
  });
});

apiRouter.get('/overview', (req: Request, res: Response) => {
  res.json({
    name: 'Smriti Platform Backend',
    description: 'Cognitive gaming and memory assistance API for elderly dementia care in NER India',
    endpoints: [
      { method: 'POST', path: '/api/v1/auth/request-otp', desc: 'Request phone OTP' },
      { method: 'POST', path: '/api/v1/auth/verify-otp', desc: 'Verify OTP (any 4 digits accepted for hackathon demo)' },
      { method: 'POST', path: '/api/v1/sync', desc: 'Incremental delta sync for offline-first clients' },
      { method: 'POST', path: '/api/v1/activity/ping', desc: 'Daily app-opened ping with activeMinutes' },
      { method: 'GET', path: '/api/v1/exercises', desc: 'Exercise bank with multilingual translations (as, en, hi, bn)' },
      { method: 'POST', path: '/api/v1/exercises/sessions', desc: 'Submit session record (Image Matching or Pattern Recall)' },
      { method: 'GET', path: '/api/v1/patients/:patientId/reminders', desc: 'List reminders with timeliness metadata' },
      { method: 'PATCH', path: '/api/v1/patients/:patientId/reminders/:id', desc: 'Toggle reminder with on-time/late stamp' },
      { method: 'GET', path: '/api/v1/patients/:patientId/trends', desc: '7-day rolling average, baseline & sub-scores' },
      { method: 'GET', path: '/api/v1/patients/:patientId/alerts', desc: 'De-duplicated clinical alerts' },
      { method: 'POST', path: '/api/v1/care-actions', desc: 'Log "Call Aita" or "Share with ASHA"' },
      { method: 'POST', path: '/api/v1/jobs/nightly-scoring', desc: 'Trigger the nightly scoring algorithm on demand' },
    ],
  });
});

// ============================================================================
// 2. AUTHENTICATION & OTP
// ============================================================================
apiRouter.post('/auth/request-otp', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Simulate OTP generation
  const requestId = `req_${Date.now()}`;
  return res.json({
    success: true,
    message: 'OTP sent successfully (Hackathon demo: enter any 4-digit code e.g. 1234 or 4826)',
    requestId,
    phone,
    demoOtp: '1234',
  });
});

apiRouter.post('/auth/verify-otp', async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  // For Hackathon Demo: accept ANY 4-digit OTP!
  const otpClean = String(otp).trim();
  if (otpClean.length !== 4 || !/^\d{4}$/.test(otpClean)) {
    return res.status(400).json({ error: 'OTP must be a 4-digit number' });
  }

  let user: any = null;
  const sb = getSupabase();

  if (sb) {
    try {
      const { data, error } = await sb.from('users').select('*').eq('phone', phone).single();
      if (!error && data) {
        user = {
          id: data.id,
          phone: data.phone,
          role: data.role,
          name: data.name,
          preferredName: data.preferred_name,
          languageCode: data.language_code,
        };
      }
    } catch {
      // fallback to memory
    }
  }

  // Find or create in memory if not retrieved from Supabase
  if (!user) {
    user = db.users.find(u => u.phone === phone);
  }

  if (!user) {
    // Auto-create new caregiver or elder user for demo convenience
    user = {
      id: `user-${Date.now()}`,
      phone,
      role: 'caregiver',
      name: 'Family Member',
      preferredName: 'Caregiver',
      languageCode: 'as',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    db.users.push(user);

    // Also persist to Supabase if connected
    if (sb) {
      sb.from('users').insert({
        id: user.id,
        phone: user.phone,
        role: user.role,
        name: user.name,
        preferred_name: user.preferredName,
        language_code: user.languageCode,
      }).then();
    }
  }

  // Token
  const token = `smriti_jwt_${Buffer.from(`${user.id}:${user.role}:${Date.now()}`).toString('base64')}`;

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      preferredName: user.preferredName,
      language: user.languageCode,
    },
  });
});

// ============================================================================
// 3. OFFLINE-FIRST DELTA SYNC
// ============================================================================
apiRouter.post('/sync', (req: Request, res: Response) => {
  const body = req.body as SyncDeltaRequest;
  const lastServerVersion = Number(body.lastServerVersion) || 0;
  const clientChanges = body.clientChanges || [];
  const syncedClientIds: string[] = [];

  // 1. Process client offline queued changes
  for (const item of clientChanges) {
    if (item.entity === 'reminders') {
      const idx = db.reminders.findIndex(r => r.id === item.id);
      if (idx >= 0) {
        db.reminders[idx] = { ...db.reminders[idx], ...item.payload, updatedAt: new Date().toISOString() };
        db.logChange(db.reminders[idx].patientId, 'reminders', item.id, 'UPDATE', db.reminders[idx]);
      } else {
        const newRem: DbReminder = {
          id: item.id || `rem-${Date.now()}`,
          patientId: item.payload.patientId || 'patient-aita-001',
          title: item.payload.title || 'Untitled Reminder',
          subtitle: item.payload.subtitle,
          scheduledTime: item.payload.scheduledTime || item.payload.time || '09:00 AM',
          scheduledDate: item.payload.scheduledDate || new Date().toISOString().split('T')[0],
          category: item.payload.category || 'activity',
          recurrence: item.payload.recurrence || 'Daily',
          voicePromptText: item.payload.voicePromptText || item.payload.voice_prompt_text,
          localAudioId: item.payload.localAudioId || item.payload.audio_file_path,
          completed: !!item.payload.completed,
          completedAt: item.payload.completedAt,
          completionStatus: item.payload.completionStatus || (item.payload.completed ? 'on_time' : 'pending'),
          responseDelayMinutes: item.payload.responseDelayMinutes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        };
        db.reminders.push(newRem);
        db.logChange(newRem.patientId, 'reminders', newRem.id, 'INSERT', newRem);
      }
      syncedClientIds.push(item.id);
    } else if (item.entity === 'exercise_sessions') {
      const p = item.payload;
      const sess: DbExerciseSession = {
        id: item.id || `sess-${Date.now()}`,
        patientId: p.patientId || 'patient-aita-001',
        exerciseId: p.exerciseId,
        level: p.level,
        durationSeconds: p.durationSeconds || 120,
        completed: p.completed !== false,
        sessionScore: p.sessionScore || 80,
        startedAt: p.startedAt || new Date().toISOString(),
        completedAt: p.completedAt || new Date().toISOString(),
        details: {
          pairsTotal: p.pairsTotal,
          movesTaken: p.movesTaken,
          hintsUsed: p.hintsUsed,
          gridSize: p.gridSize,
          roundsCompleted: p.roundsCompleted,
          roundResults: p.roundResults,
          totalMistakes: p.totalMistakes,
        },
        createdAt: new Date().toISOString(),
        version: 1,
      };
      db.sessions.push(sess);
      db.logChange(sess.patientId, 'exercise_sessions', sess.id, 'INSERT', sess);
      syncedClientIds.push(item.id);

      const sb = getSupabase();
      if (sb) {
        sb.from('exercise_sessions').upsert({
          id: sess.id,
          patient_id: sess.patientId,
          exercise_id: sess.exerciseId,
          level: sess.level,
          duration_seconds: sess.durationSeconds,
          completed: sess.completed,
          session_score: sess.sessionScore,
          started_at: sess.startedAt,
          completed_at: sess.completedAt,
          details: sess.details,
          version: sess.version,
        }).then();
      }
    }
  }

  // 2. Query changes that occurred on the server since client's lastServerVersion
  const serverChanges = db.syncChangelog
    .filter(c => c.serverVersion > lastServerVersion)
    .map(c => ({
      entity: c.entityType,
      action: c.action,
      id: c.entityId,
      payload: c.payload,
      serverVersion: c.serverVersion,
    }));

  const response: SyncDeltaResponse = {
    newServerVersion: db.currentServerVersion,
    serverChanges,
    syncedClientIds,
  };

  return res.json(response);
});

// ============================================================================
// 4. DAILY ACTIVITY PING (APP-OPENED EVENT)
// ============================================================================
apiRouter.post('/activity/ping', (req: Request, res: Response) => {
  const { patientId = 'patient-aita-001', activeMinutes = 5 } = req.body;
  const today = new Date().toISOString().split('T')[0];

  let log = db.dailyActivityLogs.find(l => l.patientId === patientId && l.logDate === today);
  if (log) {
    log.appOpened = true;
    log.activeMinutes += Number(activeMinutes) || 1;
    log.sessionCount += 1;
    log.updatedAt = new Date().toISOString();
  } else {
    log = {
      id: `log-${today}-${patientId}`,
      patientId,
      logDate: today,
      remindersScheduled: db.reminders.filter(r => r.patientId === patientId).length,
      remindersCompleted: db.reminders.filter(r => r.patientId === patientId && r.completed).length,
      remindersOnTime: db.reminders.filter(r => r.patientId === patientId && r.completionStatus === 'on_time').length,
      remindersLate: db.reminders.filter(r => r.patientId === patientId && r.completionStatus === 'late').length,
      remindersMissed: 0,
      exerciseSessionIds: [],
      appOpened: true,
      activeMinutes: Number(activeMinutes) || 5,
      sessionCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    db.dailyActivityLogs.push(log);
  }

  return res.json({
    success: true,
    today,
    appOpened: log.appOpened,
    activeMinutes: log.activeMinutes,
  });
});

// ============================================================================
// 5. COGNITIVE EXERCISES & SESSIONS
// ============================================================================
apiRouter.get('/exercises', (req: Request, res: Response) => {
  const lang = (req.query.lang as string) || 'as';

  const result = db.exercises.map(ex => {
    const translation = db.translations.find(t => t.exerciseId === ex.id && t.languageCode === lang)
      || db.translations.find(t => t.exerciseId === ex.id && t.languageCode === 'en')
      || db.translations.find(t => t.exerciseId === ex.id);

    return {
      id: ex.id,
      name: ex.name,
      category: ex.category,
      supportedLevels: ex.supportedLevels,
      localized: translation ? {
        title: translation.title,
        instructionText: translation.instructionText,
        voicePromptText: translation.voicePromptText,
      } : null,
    };
  });

  return res.json({ exercises: result });
});

apiRouter.post('/exercises/sessions', (req: Request, res: Response) => {
  const body = req.body;
  const { exerciseId, patientId = 'patient-aita-001', level, startedAt, completedAt, durationSeconds, completed } = body;

  if (!exerciseId || !level) {
    return res.status(400).json({ error: 'exerciseId and level are required' });
  }

  // Calculate normalized performance score
  let score = 80;
  if (exerciseId === 'image-card-matching') {
    const pairs = Number(body.pairsTotal) || 3;
    const moves = Number(body.movesTaken) || pairs * 2;
    const hints = Number(body.hintsUsed) || 0;
    // Efficiency: minimal moves is pairs * 2
    const optimalMoves = pairs * 2;
    const efficiency = Math.max(0.4, Math.min(1.0, optimalMoves / Math.max(optimalMoves, moves)));
    score = Math.round(efficiency * 85 + (hints === 0 ? 15 : 5));
  } else if (exerciseId === 'pattern-recall') {
    const rounds = Number(body.roundsCompleted) || 3;
    const mistakes = Number(body.totalMistakes) || 0;
    score = Math.max(40, Math.min(100, Math.round((rounds * 25) - (mistakes * 10))));
  }

  const session: DbExerciseSession = {
    id: `sess-${Date.now()}`,
    patientId,
    exerciseId,
    level,
    durationSeconds: Number(durationSeconds) || 120,
    completed: completed !== false,
    sessionScore: score,
    startedAt: startedAt || new Date(Date.now() - 120000).toISOString(),
    completedAt: completedAt || new Date().toISOString(),
    details: { ...body },
    createdAt: new Date().toISOString(),
    version: 1,
  };

  db.sessions.push(session);
  db.logChange(patientId, 'exercise_sessions', session.id, 'INSERT', session);

  // Also record in today's daily activity log
  const today = session.completedAt.split('T')[0];
  const log = db.dailyActivityLogs.find(l => l.patientId === patientId && l.logDate === today);
  if (log) {
    log.exerciseSessionIds.push(session.id);
    log.activeMinutes += Math.round(session.durationSeconds / 60);
    log.sessionCount++;
  }

  return res.status(201).json({
    success: true,
    session,
    normalizedScore: score,
  });
});

// ============================================================================
// 6. DAILY PLAN & REMINDERS
// ============================================================================
apiRouter.get('/patients/:patientId/reminders', (req: Request, res: Response) => {
  const { patientId } = req.params;
  const list = db.reminders.filter(r => r.patientId === patientId);
  return res.json({ reminders: list });
});

apiRouter.post('/patients/:patientId/reminders', (req: Request, res: Response) => {
  const { patientId } = req.params;
  const b = req.body;

  const newRem: DbReminder = {
    id: `rem-${Date.now()}`,
    patientId,
    title: b.title,
    subtitle: b.subtitle,
    scheduledTime: b.scheduledTime || b.time || '09:00 AM',
    scheduledDate: b.scheduledDate || new Date().toISOString().split('T')[0],
    category: b.category || 'activity',
    recurrence: b.recurrence || 'Daily',
    voicePromptText: b.voicePromptText,
    localAudioId: b.localAudioId,
    completed: false,
    completionStatus: 'pending',
    createdByRole: b.createdByRole || 'caregiver',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  };

  db.reminders.push(newRem);
  db.logChange(patientId, 'reminders', newRem.id, 'INSERT', newRem);

  return res.status(201).json({ reminder: newRem });
});

apiRouter.patch('/patients/:patientId/reminders/:id', (req: Request, res: Response) => {
  const { patientId, id } = req.params;
  const idx = db.reminders.findIndex(r => r.id === id && r.patientId === patientId);
  if (idx < 0) {
    return res.status(404).json({ error: 'Reminder not found' });
  }

  const existing = db.reminders[idx];
  const { completed, completedAt, completionStatus, responseDelayMinutes } = req.body;

  const updated: DbReminder = {
    ...existing,
    completed: completed !== undefined ? completed : existing.completed,
    completedAt: completedAt !== undefined ? completedAt : existing.completedAt,
    completionStatus: completionStatus || (completed ? 'on_time' : 'pending'),
    responseDelayMinutes: responseDelayMinutes !== undefined ? responseDelayMinutes : existing.responseDelayMinutes,
    updatedAt: new Date().toISOString(),
  };

  db.reminders[idx] = updated;
  db.logChange(patientId, 'reminders', updated.id, 'UPDATE', updated);

  return res.json({ reminder: updated });
});

// ============================================================================
// 7. COGNITIVE TRENDS, DAILY SCORES & ALERTS
// ============================================================================
apiRouter.get('/patients/:patientId/trends', (req: Request, res: Response) => {
  const { patientId } = req.params;
  const trends = db.cognitiveTrends.filter(t => t.patientId === patientId);
  const latestTrend = trends[trends.length - 1];

  const scores = db.dailyScores
    .filter(s => s.patientId === patientId)
    .sort((a, b) => b.scoreDate.localeCompare(a.scoreDate))
    .slice(0, 14);

  return res.json({
    patientId,
    latestTrend: latestTrend || null,
    recentScores: scores,
  });
});

apiRouter.get('/patients/:patientId/alerts', (req: Request, res: Response) => {
  const { patientId } = req.params;
  const alerts = db.alerts.filter(a => a.patientId === patientId);
  return res.json({ alerts });
});

// ============================================================================
// 8. CARE ACTIONS ("Call Aita" & "Share with ASHA")
// ============================================================================
apiRouter.post('/care-actions', (req: Request, res: Response) => {
  const { patientId = 'patient-aita-001', actorId = 'caregiver-ananya-002', actionType, recipientPhone, summary } = req.body;

  if (!actionType) {
    return res.status(400).json({ error: 'actionType is required' });
  }

  const action = {
    id: `action-${Date.now()}`,
    patientId,
    actorId,
    actionType,
    recipientPhone,
    summary,
    createdAt: new Date().toISOString(),
  };

  db.careActions.push(action);

  const sb = getSupabase();
  if (sb) {
    sb.from('care_actions').insert({
      id: action.id,
      patient_id: action.patientId,
      actor_id: action.actorId,
      action_type: action.actionType,
      recipient_phone: action.recipientPhone,
      summary: action.summary,
    }).then();
  }

  // If "Share with ASHA", also add note or notification
  if (actionType === 'SHARE_WITH_ASHA') {
    db.alerts.unshift({
      id: `alert-asha-${Date.now()}`,
      patientId,
      episodeKey: `share_asha_${Date.now()}`,
      title: 'Weekly Summary Shared with ASHA Worker',
      message: summary || 'Weekly adherence and cognitive trend summary sent to Rina Das (ASHA).',
      severity: 'info',
      triggerMetric: 'user_action',
      status: 'acknowledged',
      createdAt: new Date().toISOString(),
    });
  }

  return res.status(201).json({ success: true, action });
});

// ============================================================================
// 9. NIGHTLY SCORING JOB TRIGGER (MANUAL OR CRON)
// ============================================================================
apiRouter.post('/jobs/nightly-scoring', (req: Request, res: Response) => {
  const targetDate = (req.body.targetDate as string) || new Date().toISOString().split('T')[0];
  const result = executeNightlyScoring(targetDate);
  return res.json({
    success: true,
    targetDate,
    result,
  });
});

// ============================================================================
// 10. SMRITI AI CONVERSATION (GEMINI + BHASHINI LAYER)
// ============================================================================
apiRouter.get('/ai/languages', (req: Request, res: Response) => {
  return res.json({
    supportedLanguages: Object.values(BHASHINI_PROFILES),
  });
});

apiRouter.post('/ai/chat', async (req: Request, res: Response) => {
  const {
    message,
    languageCode = 'as',
    patientId = 'patient-aita-001',
    elderName = 'Aita',
    context = {},
    history = [],
    apiKey,
  } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'A user message is required' });
  }

  const bhashiniProfile = getBhashiniProfile(languageCode);
  const explicitKey = (apiKey as string) || (req.headers['x-gemini-api-key'] as string);
  const ai = getGemini(explicitKey);

  // Find user / patient info
  const user = db.users.find(u => u.id === patientId);
  const effectiveName = elderName || user?.preferredName || user?.name || 'Aita';

  // Gather care circle and reminders for dementia grounding
  const reminders = db.reminders.filter(r => r.patientId === patientId);
  const familySummary = (db.careCircleLinks || [])
    .filter(l => l.patientId === patientId)
    .map(l => {
      const m = db.users.find(u => u.id === l.memberId);
      return `${m?.name || 'Family member'} (${l.relationship})`;
    })
    .join(', ');

  const todayReminders = reminders
    .slice(0, 4)
    .map(r => `${r.title} at ${r.scheduledTime} (${r.completed ? 'completed' : 'pending'})`)
    .join(', ');

  const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const systemInstruction = buildBhashiniGeminiSystemPrompt(languageCode, effectiveName, {
    familySummary: familySummary || context.familySummary,
    todayReminders: todayReminders || context.todayReminders,
    timeOfDay: currentTimeStr,
  });

  // Prepare multi-turn history for Gemini
  const recentHistory = Array.isArray(history)
    ? history.slice(-6).map((h: any) => ({
        role: h.sender === 'patient' || h.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(h.text || h.content || '') }],
      })).filter(h => h.parts[0].text.trim().length > 0)
    : [];

  const contents = [
    ...recentHistory,
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ];

  if (ai) {
    // Active Gemini API models
    const modelsToTry = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-2.5-flash'];
    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents as any,
          config: {
            systemInstruction,
            temperature: 0.85,
          },
        });

        const responseText = response.text || '';
        if (responseText.trim()) {
          return res.json({
            reply: responseText.trim(),
            model: modelName,
            source: 'gemini_with_bhashini_layer',
            bhashini: {
              languageCode: bhashiniProfile.code,
              languageName: bhashiniProfile.name,
              bhashiniCode: bhashiniProfile.bhashiniCode,
              script: bhashiniProfile.script,
              nativeName: bhashiniProfile.nativeName,
            },
          });
        }
      } catch (err: any) {
        console.warn(`[Gemini + Bhashini] ${modelName} call error:`, err?.message || err);
      }
    }
  }

  // Diverse, natural local grounding response generator
  const q = message.toLowerCase().trim();
  const today = new Date();
  const fullDate = today.toLocaleDateString(languageCode === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const hour = today.getHours();
  const timeGreeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  let reply = '';

  // 1. Exact Time Inquiries
  const isTimeQuery =
    q.includes('what time') ||
    q.includes("what's the time") ||
    q.includes('tell me the time') ||
    q.includes('current time') ||
    q.includes('time kya') ||
    q.includes('kitne baje') ||
    q.includes('समय क्या') ||
    q.includes('कितने बजे') ||
    q.includes('কিমান বাজি') ||
    q.includes('সময় কিমান');

  // 2. Exact Date / Day Inquiries
  const isDateQuery =
    q.includes('what day') ||
    q.includes('which day') ||
    q.includes('what date') ||
    q.includes('which date') ||
    q.includes("what's today's date") ||
    q.includes('today date') ||
    q.includes('aaj kaun sa din') ||
    q.includes('aaj kya din') ||
    q.includes('aaj ki tarikh') ||
    q.includes('दिन कौन सा') ||
    q.includes('तारीख क्या') ||
    q.includes('आज क्या दिन') ||
    q.includes('কি বাৰ') ||
    q.includes('কি তাৰিখ') ||
    q.includes('আজি কি বাৰ');

  // 1. Time / Clock queries
  if (isTimeQuery) {
    if (languageCode === 'hi') {
      const timeReplies = [
        `अभी समय ${currentTimeStr} हो रहा है, ${effectiveName} जी। सब कुछ बहुत शांत, सुरक्षित और अपने सही समय पर है।`,
        `घड़ी में अभी ठीक ${currentTimeStr} बज रहे हैं। आप आराम से बैठिए, सब बहुत व्यवस्थित है।`,
        `इस समय ${currentTimeStr} हो रहे हैं, ${effectiveName} जी। आपके सारे काम समय के अनुसार चल रहे हैं।`,
      ];
      reply = timeReplies[Math.floor(Math.random() * timeReplies.length)];
    } else if (languageCode === 'as') {
      const timeReplies = [
        `এতিয়া সময় হৈছে ${currentTimeStr}। আপোনাৰ সকলো কাম সুন্দৰভাৱে চলি আছে, ${effectiveName}।`,
        `ঘড়ীত এতিয়া ঠিক ${currentTimeStr} বাজিছে। আপোনাৰ ঘৰখন অতি শান্ত আৰু নিৰাপদ।`,
      ];
      reply = timeReplies[Math.floor(Math.random() * timeReplies.length)];
    } else {
      reply = `It is currently ${currentTimeStr}, ${effectiveName}. Everything is calm, safe, and right on schedule.`;
    }
  }
  // 2. Date / Day queries
  else if (isDateQuery) {
    if (languageCode === 'hi') {
      reply = `आज ${fullDate} है, ${effectiveName} जी। आज का दिन बहुत प्यारा और सुखद है। आप अपने प्यारे घर में बिल्कुल सुरक्षित हैं।`;
    } else if (languageCode === 'as') {
      reply = `আজি ${fullDate}। বতৰটো অতি শান্ত আৰু আপোনাৰ ঘৰখন নিৰাপদ আৰু মৰমেৰে ভৰা, ${effectiveName}।`;
    } else {
      reply = `Today is ${fullDate}, ${effectiveName}. It is a bright, peaceful day and you are completely safe at home.`;
    }
  }
  // 3. Medicine queries
  else if (q.includes('medicine') || q.includes('pill') || q.includes('दवाई') || q.includes('दवा') || q.includes('औषध') || q.includes('ঔষধ')) {
    const nextMed = reminders.find(r => !r.completed && r.category === 'medicine');
    if (nextMed) {
      if (languageCode === 'hi') {
        reply = `आपकी अगली दवाई का समय ${nextMed.scheduledTime} पर है (${nextMed.title})। जब समय होगा, मैं आपको प्यार से याद दिला दूँगी। आप बिल्कुल निश्चिंत रहिए।`;
      } else if (languageCode === 'as') {
        reply = `আপোনাৰ ঔষধৰ সময় ${nextMed.scheduledTime} বজাত (${nextMed.title})। সময় হলে মই নিজে মৰমেৰে সোঁৱৰাই দিম, ${effectiveName}।`;
      } else {
        reply = `Your next scheduled medicine is at ${nextMed.scheduledTime} (${nextMed.title}). I will gently remind you when it's time, ${effectiveName}.`;
      }
    } else {
      if (languageCode === 'hi') {
        reply = `आपकी आज की सभी आवश्यक दवाइयों की देखभाल व्यवस्थित है, ${effectiveName} जी। आपका परिवार पूरी तरह ध्यान रख रहा है।`;
      } else if (languageCode === 'as') {
        reply = `আপোনাৰ আজিৰ ঔষধৰ সকলো ব্যৱস্থা সঠিক হৈ আছে, ${effectiveName}। কোনো চিন্তা কৰিব নালাগে।`;
      } else {
        reply = `All your scheduled medicines are in order, ${effectiveName}. Everything is well organized.`;
      }
    }
  }
  // 4. Family / Loved ones queries
  else if (q.includes('family') || q.includes('son') || q.includes('daughter') || q.includes('rahul') || q.includes('ananya') || q.includes('परिवार') || q.includes('পৰিয়াল') || q.includes('बेटा') || q.includes('बेटी')) {
    const fNames = familySummary || 'राहुल, अनन्य और पूरा परिवार';
    if (languageCode === 'hi') {
      reply = `आपके परिवार में ${fNames} आपसे बहुत गहरा प्यार करते हैं, ${effectiveName} जी। वे हमेशा आपकी सलामती और खुशी के लिए सोचते हैं।`;
    } else if (languageCode === 'as') {
      reply = `আপোনাৰ পৰিয়ালৰ সকলোৱে আপোনাক হৃদয়ভৰি মৰম কৰে, ${effectiveName}। তেওঁলোকে সঘনাই আপোনাৰ যত্ন লৈ থাকে।`;
    } else {
      reply = `Your family loves you very much, ${effectiveName}. They are always thinking of you and checking in.`;
    }
  }
  // 5. Feelings / Loneliness / Anxiousness
  else if (q.includes('lonely') || q.includes('sad') || q.includes('alone') || q.includes('afraid') || q.includes('डर') || q.includes('उदास') || q.includes('अकेला') || q.includes('ভয়') || q.includes('মন বেয়া') || q.includes('অকলে')) {
    if (languageCode === 'hi') {
      reply = `आप बिल्कुल अकेले नहीं हैं, ${effectiveName} जी। मैं हर पल आपके साथ बैठी हूँ, और आपके चाहने वाले हमेशा आपके दिल के पास हैं। एक गहरी शांत सांस लीजिए, सब बहुत अच्छा है।`;
    } else if (languageCode === 'as') {
      reply = `আপুনি অকলে নাই, ${effectiveName}। মই সদায় আপোনাৰ লগত আছোঁ। আপোনাৰ ঘৰখন সুৰক্ষিত আৰু মৰমেৰে ভৰি আছে। মনটো শান্ত কৰক।`;
    } else {
      reply = `You are never alone, ${effectiveName}. I am right here with you, and your loved ones cherish you dearly. Take a gentle breath, you are safe and warm.`;
    }
  }
  // 6. Food / Tea / Hydration
  else if (q.includes('tea') || q.includes('chai') || q.includes('food') || q.includes('eat') || q.includes('চা') || q.includes('ভাত') || q.includes('चाय') || q.includes('खाना') || q.includes('भूख')) {
    if (languageCode === 'hi') {
      reply = `एक कप गरम ताज़ा चाय या हल्का नाश्ता आपके मन को बहुत सुकून देगा, ${effectiveName} जी। थोड़ा गुनगुना पानी भी ज़रूर पीजिएगा।`;
    } else if (languageCode === 'as') {
      reply = `একাচাহ গৰম সুগন্ধি চাহ খালে মনটো বৰ ভাল লাগিব, ${effectiveName}। লগত অকণমান পানীও খাই লওক।`;
    } else {
      reply = `A warm, fresh cup of tea or a light meal sounds wonderful, ${effectiveName}. Make sure to take a few gentle sips of water too.`;
    }
  }
  // 7. General Conversational Variety
  else {
    const conversationalTemplates: Record<string, string[]> = {
      hi: [
        `नमस्ते ${effectiveName} जी! आपकी आवाज़ सुनकर बहुत खुशी हुई। सब कुछ बहुत सुखद चल रहा है। क्या आप किसी खास बात के बारे में बात करना चाहते हैं?`,
        `मैं आपकी बात बहुत ध्यान से सुन रही हूँ, ${effectiveName} जी। आपके साथ बात करना मुझे हमेशा बहुत सुकून देता है। आज आपका मन कैसा है?`,
        `आप बहुत अच्छे और शांत माहौल में हैं, ${effectiveName} जी। आपका परिवार और मैं हमेशा आपके साथ हैं। क्या मैं आपको कोई प्यारी सी बात सुनाऊँ?`,
        `हाँ ${effectiveName} जी, मैं आपकी बात समझ रही हूँ। आप आराम से बैठिए और बताइए, आगे क्या करने का मन है?`,
      ],
      as: [
        `নমস্কাৰ ${effectiveName}! আপোনাৰ মাতটো শুনি মনটো বৰ ভাল লাগিল। আপুনি ঘৰত সম্পূর্ণ নিৰাপদ আৰু আৰামত আছে। আজি মনটো কেনে লাগিছে?`,
        `মই আপোনাৰ কথা অতি মনোযোগেৰে শুনি আছোঁ, ${effectiveName}। আপোনাৰ সংগ পাই মই বৰ আনন্দিত। কিবা কথা পাতিব বিচাৰে নেকি?`,
        `আপোনাৰ ঘৰখন অতি শান্ত আৰু সুৰক্ষিত, ${effectiveName}। সকলোৱে আপোনাক অতি মৰম কৰে। মই সদায় আপোনাৰ কাষতেই আছোঁ।`,
      ],
      en: [
        `Hello ${effectiveName}! It is wonderful to hear your voice. Everything is calm and peaceful here today. How are you feeling right now?`,
        `I am listening closely to you, ${effectiveName}. Being here with you brings so much warmth. Tell me more about what is on your mind today.`,
        `You are completely safe and comfortable at home, ${effectiveName}. Your loved ones care for you deeply, and I am right here by your side.`,
      ],
    };

    const pool = conversationalTemplates[languageCode] || conversationalTemplates.en;
    reply = pool[Math.floor(Math.random() * pool.length)];
  }

  return res.json({
    reply,
    model: 'smriti-grounding-engine',
    source: 'bhashini_grounding_fallback',
    bhashini: {
      languageCode: bhashiniProfile.code,
      languageName: bhashiniProfile.name,
      bhashiniCode: bhashiniProfile.bhashiniCode,
      script: bhashiniProfile.script,
      nativeName: bhashiniProfile.nativeName,
    },
  });
});

// ============================================================================
// 11. BHASHINI PROXY ENDPOINTS (ASR, TRANSLATION, TTS)
// ============================================================================
apiRouter.post('/bhashini/translate', async (req: Request, res: Response) => {
  const { text, sourceLanguage = 'as', targetLanguage = 'en' } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text to translate is required' });
  }

  const bhashiniApiKey = process.env.BHASHINI_API_KEY || process.env.BHASHINI_INFERENCE_API_KEY;
  const bhashiniUserId = process.env.BHASHINI_USER_ID;

  // 1. If real Bhashini credentials exist, call Bhashini Dhruva pipeline
  if (bhashiniApiKey) {
    try {
      const response = await fetch('https://dhruva-api.bhashini.gov.in/services/inference/pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: bhashiniApiKey,
          ...(bhashiniUserId ? { userID: bhashiniUserId } : {}),
        },
        body: JSON.stringify({
          pipelineTasks: [
            {
              taskType: 'translation',
              config: {
                language: {
                  sourceLanguage,
                  targetLanguage,
                },
              },
            },
          ],
          inputData: {
            input: [{ source: text }],
          },
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        const translation = data?.pipelineResponse?.find((t: any) => t.taskType === 'translation')?.output?.[0]?.target;
        if (translation) {
          return res.json({ translatedText: translation, source: 'bhashini_direct' });
        }
      }
    } catch (err) {
      console.warn('[Server Bhashini Proxy] Direct call error, falling back to Gemini:', err);
    }
  }

  // 2. High-accuracy Indic language translation fallback via Gemini
  const ai = getGemini();
  if (ai) {
    try {
      const prompt = `Translate the following text accurately from ${sourceLanguage} to ${targetLanguage}.
Provide ONLY the translated text without any explanation, quotes, or preamble:
${text}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      const translated = response.text?.trim();
      if (translated) {
        return res.json({
          translatedText: translated,
          source: 'gemini_indic_translator',
        });
      }
    } catch (err) {
      console.warn('[Server Bhashini Proxy] Gemini translation fallback error:', err);
    }
  }

  return res.json({ translatedText: text, source: 'verbatim' });
});

apiRouter.post('/bhashini/tts', async (req: Request, res: Response) => {
  const { text, languageCode = 'as', gender = 'female' } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required for TTS' });
  }

  const bhashiniApiKey = process.env.BHASHINI_API_KEY || process.env.BHASHINI_INFERENCE_API_KEY;
  const bhashiniUserId = process.env.BHASHINI_USER_ID;

  if (bhashiniApiKey) {
    try {
      const response = await fetch('https://dhruva-api.bhashini.gov.in/services/inference/pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: bhashiniApiKey,
          ...(bhashiniUserId ? { userID: bhashiniUserId } : {}),
        },
        body: JSON.stringify({
          pipelineTasks: [
            {
              taskType: 'tts',
              config: {
                language: { sourceLanguage: languageCode },
                gender,
              },
            },
          ],
          inputData: { input: [{ source: text }] },
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        const audio = data?.pipelineResponse?.find((t: any) => t.taskType === 'tts')?.audio?.[0];
        if (audio?.audioContent || audio?.audioUri) {
          return res.json({
            audioContent: audio.audioContent,
            audioUri: audio.audioUri,
            source: 'bhashini_direct_tts',
          });
        }
      }
    } catch (err) {
      console.warn('[Server Bhashini Proxy] Direct TTS error:', err);
    }
  }

  return res.json({ audioContent: null, source: 'client_synthesis_fallback' });
});

apiRouter.post('/bhashini/asr', async (req: Request, res: Response) => {
  const { audioContent, languageCode = 'as' } = req.body;
  if (!audioContent) {
    return res.status(400).json({ error: 'audioContent is required for ASR' });
  }

  const bhashiniApiKey = process.env.BHASHINI_API_KEY || process.env.BHASHINI_INFERENCE_API_KEY;
  const bhashiniUserId = process.env.BHASHINI_USER_ID;

  if (bhashiniApiKey) {
    try {
      const response = await fetch('https://dhruva-api.bhashini.gov.in/services/inference/pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: bhashiniApiKey,
          ...(bhashiniUserId ? { userID: bhashiniUserId } : {}),
        },
        body: JSON.stringify({
          pipelineTasks: [
            {
              taskType: 'asr',
              config: {
                language: { sourceLanguage: languageCode },
                audioFormat: 'wav',
                samplingRate: 16000,
              },
            },
          ],
          inputData: { audio: [{ audioContent }] },
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        const transcript = data?.pipelineResponse?.find((t: any) => t.taskType === 'asr')?.output?.[0]?.source;
        if (transcript) {
          return res.json({ transcript, source: 'bhashini_direct_asr' });
        }
      }
    } catch (err) {
      console.warn('[Server Bhashini Proxy] Direct ASR error:', err);
    }
  }

  return res.status(400).json({ error: 'ASR requires configured Bhashini credentials' });
});

