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
        model: 'gemini-3.8-flash',
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
  const { message, languageCode = 'as', patientId = 'patient-aita-001', elderName = 'Aita', context = {} } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'A user message is required' });
  }

  const bhashiniProfile = getBhashiniProfile(languageCode);
  const ai = getGemini();

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

  if (ai) {
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.7,
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
        console.warn(`[Gemini + Bhashini] ${modelName} call failed, trying fallback:`, err?.message || err);
      }
    }
  }

  // Graceful conversational fallback with culturally grounded local language response
  const fallbackReplies: Record<string, string> = {
    as: `মই আপোনাৰ কথা অতি মৰমেৰে বুজি পাইছোঁ, ${effectiveName}। মই সদায় আপোনাৰ কাষতে আছোঁ। আপুনি আপোনাৰ ঘৰত সম্পূর্ণ নিৰাপদ আৰু সকলো ভালে আছে।`,
    brx: `आं नोंथांनि रावखौ बुजिदों, ${effectiveName}। आं नोंथांनि लोगोआवनो दं। नोंथाङा गावनि नख’राव गाहाम दं।`,
    mni: `ঐহাক্না অদোমগী ৱাফম খঙলে, ${effectiveName}। ঐহাক মতম পুম্বদা অদোমগা লোয়ননা লৈরি। অদোম অপাম্বদা লৈরি।`,
    lus: `I thu sawi ka hria e, ${effectiveName}. I kiangah ka awm reng a nia. Hahdam deuh khan awm rawh aw.`,
    kha: `Nga sngewthuh ia phi, ${effectiveName}. Nga don ryngkat bad phi barabor. Phi long kaba shngain ha la iing.`,
    grt: `Anga nang·ni aganako kni·a, ${effectiveName}. Anga nang· baksa donga. Nang· nokode kema nama donga.`,
    trp: `Ang nini kok khnaui tong, ${effectiveName}. Ang nini logote tong. Nini nogo nwng bwrwi thungba kaham tong.`,
    nag: `Moi apuni kotha buji pailo, ${effectiveName}. Moi apuni lagot asey. Kiba chinta nakoribo, sob bhal asey.`,
    ne: `मैले हजुरको कुरा बुझें, ${effectiveName} हजुर। म सधैं हजुरको साथमा छु। हजुर आफ्नै घरमा सुरक्षित हुनुहुन्छ।`,
    hi: `मैं आपकी बात समझ रही हूँ, ${effectiveName} जी। मैं हर पल आपके साथ हूँ। आप अपने घर में सुरक्षित हैं और सब बहुत अच्छा चल रहा है।`,
    en: `I hear you warmly, ${effectiveName}. I am right here by your side. You are completely safe at home, and everything is taken care of.`,
  };

  const reply = fallbackReplies[languageCode] || fallbackReplies.en;

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

