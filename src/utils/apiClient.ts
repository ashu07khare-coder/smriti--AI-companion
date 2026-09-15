/**
 * Smriti API Client
 * Connects the offline-first frontend to the Express backend API (/api/v1/*).
 * Gracefully handles offline states when network is intermittent.
 */

const API_BASE = '/api/v1';

export interface VerifyOtpResult {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    phone: string;
    role: string;
    name: string;
    preferredName?: string;
    language?: string;
  };
  error?: string;
}

export const smritiApi = {
  /**
   * Health check
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Request 4-digit OTP via phone
   */
  async requestOtp(phone: string): Promise<{ success: boolean; message: string; demoOtp?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: 'Network offline. Using offline simulation.', demoOtp: '1234' };
    }
  },

  /**
   * Verify 4-digit OTP (for hackathon demo, accepts any 4-digit code)
   */
  async verifyOtp(phone: string, otp: string): Promise<VerifyOtpResult> {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      return await res.json();
    } catch (err: any) {
      // Offline fallback: accept any 4-digit OTP
      if (/^\d{4}$/.test(otp.trim())) {
        return {
          success: true,
          token: `offline_token_${Date.now()}`,
          user: {
            id: `user-${Date.now()}`,
            phone,
            role: 'elder',
            name: 'Bonti Khound',
            preferredName: 'Aita',
            language: 'as',
          },
        };
      }
      return { success: false, error: 'Failed to verify OTP' };
    }
  },

  /**
   * Daily activity ping (app-opened event with active minutes)
   */
  async pingActivity(patientId: string = 'patient-aita-001', activeMinutes: number = 5): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/activity/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, activeMinutes }),
      });
      return await res.json();
    } catch {
      return { offline: true };
    }
  },

  /**
   * Incremental Delta Sync
   */
  async syncDelta(lastServerVersion: number, clientChanges: any[]): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastServerVersion, clientChanges }),
      });
      return await res.json();
    } catch {
      return { offline: true, newServerVersion: lastServerVersion, serverChanges: [], syncedClientIds: [] };
    }
  },

  /**
   * Fetch 7-day rolling cognitive trends, baseline, and daily scores
   */
  async fetchTrends(patientId: string = 'patient-aita-001'): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/trends`);
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Record Care Action ("Call Aita", "Share with ASHA")
   */
  async recordCareAction(actionType: 'CALL_ELDER' | 'SHARE_WITH_ASHA', summary?: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/care-actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 'patient-aita-001',
          actorId: 'caregiver-ananya-002',
          actionType,
          summary,
        }),
      });
      return await res.json();
    } catch {
      return { offline: true, actionType, summary };
    }
  },

  /**
   * Trigger Nightly Scoring Job (Manual or scheduled)
   */
  async triggerNightlyScoring(targetDate?: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/jobs/nightly-scoring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDate }),
      });
      return await res.json();
    } catch {
      return { offline: true };
    }
  },
};
