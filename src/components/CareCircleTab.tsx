import React, { useState } from 'react';
import { DailyScore, CaregiverAlert, CareCircleMember, CaregiverNote, UserProfile, LanguageCode, Reminder, DailyAdherenceLog } from '../types';
import { INITIAL_CARE_CIRCLE, INITIAL_CARE_NOTES, INITIAL_REMINDERS, INITIAL_ADHERENCE_HISTORY } from '../data/mockData';
import { ReminderAdherenceDashboard } from './ReminderAdherenceDashboard';
import { bhashiniVoice } from '../utils/bhashiniVoice';
import { getTranslation } from '../utils/translations';
import { getCareCircleUiStrings } from '../utils/localizationHelpers';
import {
  Heart,
  Phone,
  HelpCircle,
  Check,
  AlertCircle,
  Bell,
  Send,
  Share2,
  Calendar,
  Sparkles,
  User,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  X,
  Users
} from 'lucide-react';

interface CareCircleTabProps {
  dailyScores: DailyScore[];
  alerts: CaregiverAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onOpenCaregiverMode: () => void;
  lastSyncTime?: string;
  currentUser?: UserProfile | null;
  currentLanguage?: LanguageCode;
  reminders?: Reminder[];
  adherenceHistory?: DailyAdherenceLog[];
  onToggleReminder?: (id: string, customCompletedAt?: string) => void;
}

export const CareCircleTab: React.FC<CareCircleTabProps> = ({
  dailyScores,
  alerts,
  onAcknowledgeAlert,
  onOpenCaregiverMode,
  lastSyncTime,
  currentUser,
  currentLanguage = 'as',
  reminders = INITIAL_REMINDERS,
  adherenceHistory = INITIAL_ADHERENCE_HISTORY,
  onToggleReminder,
}) => {
  const t = getTranslation(currentLanguage);
  const circleUi = getCareCircleUiStrings(currentLanguage);
  const [showTrendHelp, setShowTrendHelp] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [showCallModal, setShowCallModal] = useState<boolean>(false);
  const [callingTarget, setCallingTarget] = useState<{ name: string; phone: string; role: string }>({
    name: currentUser?.preferredName || 'Aita',
    phone: currentUser?.phone || '+91 98765 43210',
    role: 'Elder Companion',
  });
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);
  const [ashaSharedToast, setAshaSharedToast] = useState(false);

  const activeAlert = alerts.find(a => !a.acknowledged);

  const elderDisplay = currentUser?.preferredName || 'Aita';
  const caregiverName = currentUser?.caregiverName || 'Priya Barua';
  const caregiverPhone = currentUser?.caregiverPhone || '+91 98765 00001';
  const caregiverRelation = currentUser?.caregiverRelation || 'Daughter (Primary Caregiver)';

  const familyName = currentUser?.familyMemberName || 'Arjun Barua';
  const familyPhone = currentUser?.familyMemberPhone || '+91 98765 00002';
  const familyRelation = currentUser?.familyMemberRelation || 'Son (Guwahati)';

  // Compute SVG coordinates for the cognitive trend chart
  const chartWidth = 320;
  const chartHeight = 150;
  const minY = 35;
  const maxY = 85;

  const points = dailyScores.map((score, idx) => {
    const x = 20 + (idx / (dailyScores.length - 1)) * (chartWidth - 40);
    const normalizedScore = Math.max(minY, Math.min(maxY, score.averageScore));
    const y = chartHeight - 20 - ((normalizedScore - minY) / (maxY - minY)) * (chartHeight - 40);
    return { x, y, score };
  });

  const pathData = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  const handleShareWithAsha = (alertId: string) => {
    bhashiniVoice.playGentleTone('chime');
    setAshaSharedToast(true);
    onAcknowledgeAlert(alertId);
    setTimeout(() => setAshaSharedToast(false), 3000);
  };

  const handleTriggerCall = (name: string, phone: string, role: string) => {
    setCallingTarget({ name, phone, role });
    setShowCallModal(true);
    bhashiniVoice.playGentleTone('chime');
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-32 pt-2 space-y-6 animate-in fade-in duration-300">
      {/* Top Header Row */}
      <div className="flex items-start justify-between">
        <div>
          <div className="tracking-[0.18em] uppercase text-[10px] font-bold text-[#173C36]/60">
            {t.circle.eyebrow}
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#173C36] leading-tight mt-0.5">
            {t.circle.headline}
          </h1>
          <p className="text-xs text-[#173C36]/70 mt-0.5 font-medium">
            {elderDisplay} · {currentUser?.districtArea || 'Majuli'}, {currentUser?.stateRegion || 'Assam'}
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#173C36]/80 pt-1">
          <span className="w-2 h-2 rounded-full bg-[#2F9E76]" />
          <span>{circleUi.syncedToday(lastSyncTime)}</span>
        </div>
      </div>

      {/* Alert Peach Card */}
      {activeAlert && (
        <div className="rounded-[28px] bg-[#FDECDA] border border-[#F6A860]/30 p-5 shadow-xs transition-all space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#F6A860] text-white flex items-center justify-center font-bold shrink-0 text-base shadow-xs">
                !
              </div>

              <div>
                <h3 className="text-base font-display font-bold text-[#173C36] leading-tight">
                  {activeAlert.title}
                </h3>
                <p className="text-xs text-[#173C36]/80 mt-1 leading-relaxed">
                  {activeAlert.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setExpandedAlert(expandedAlert ? null : activeAlert.id)}
              className="p-1.5 text-[#173C36]/60 hover:text-[#173C36]"
              aria-label="Notification details"
            >
              <Bell className="w-4 h-4 text-[#C4641B]" />
            </button>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => handleShareWithAsha(activeAlert.id)}
              className="px-4 py-2 rounded-full bg-[#173C36] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-[#1f4e46]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.circle.shareAsha}</span>
            </button>

            <button
              onClick={() => onAcknowledgeAlert(activeAlert.id)}
              className="px-3.5 py-2 rounded-full bg-white/70 border border-[#173C36]/10 text-xs font-semibold text-[#173C36] hover:bg-white"
            >
              {t.circle.acknowledge}
            </button>
          </div>

          {ashaSharedToast && (
            <div className="p-2.5 rounded-xl bg-[#E1F5EE] border border-[#2F9E76]/30 text-xs font-bold text-[#2F9E76] text-center animate-in fade-in">
              {t.circle.ashaSharedSuccess}
            </div>
          )}
        </div>
      )}

      {/* REGISTERED CAREGIVER & FAMILY MEMBER CONTACTS */}
      <div className="rounded-[28px] bg-[#FFFDF6] border border-[#173C36]/5 p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2F9E76]" />
            <h3 className="text-base font-display font-bold text-[#173C36]">
              {t.circle.registeredContacts}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-[#2F9E76] bg-[#E1F5EE] px-2.5 py-0.5 rounded-full">
            {t.circle.speedDial}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Primary Caregiver Card */}
          <div className="p-3.5 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#C4641B] px-2 py-0.5 rounded-full bg-[#FDECDA]">
                  {t.circle.caregiverLabel}
                </span>
                <span className="text-[11px] font-semibold text-[#173C36]/60">
                  {caregiverRelation}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#173C36] mt-1.5">
                {caregiverName}
              </h4>
              <p className="text-xs font-semibold text-[#173C36]/75 mt-0.5">
                {caregiverPhone}
              </p>
            </div>

            <button
              onClick={() => handleTriggerCall(caregiverName, caregiverPhone, 'Caregiver')}
              className="w-full py-2 rounded-full bg-[#173C36] text-white text-xs font-bold hover:bg-[#1f4e46] flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#F5C244]" />
              <span>{t.circle.callCaregiver}</span>
            </button>
          </div>

          {/* Family Member Card */}
          <div className="p-3.5 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#2A6DB5] px-2 py-0.5 rounded-full bg-[#E3EFFC]">
                  {t.circle.familyMemberLabel}
                </span>
                <span className="text-[11px] font-semibold text-[#173C36]/60">
                  {familyRelation}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#173C36] mt-1.5">
                {familyName}
              </h4>
              <p className="text-xs font-semibold text-[#173C36]/75 mt-0.5">
                {familyPhone}
              </p>
            </div>

            <button
              onClick={() => handleTriggerCall(familyName, familyPhone, 'Family Member')}
              className="w-full py-2 rounded-full bg-[#173C36] text-white text-xs font-bold hover:bg-[#1f4e46] flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#F5C244]" />
              <span>{t.circle.callFamily}</span>
            </button>
          </div>
        </div>
      </div>

      {/* REMINDER & TASK ADHERENCE (THE FOUR METRIC BUCKETS) */}
      <ReminderAdherenceDashboard
        reminders={reminders}
        history={adherenceHistory}
        onToggleReminder={onToggleReminder || (() => {})}
        elderName={elderDisplay}
        isCaregiverView={true}
      />

      {/* Cognitive Trend Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-bold text-[#173C36]">
                {t.circle.cognitiveTrend}
              </h2>
              <button
                onClick={() => setShowTrendHelp(!showTrendHelp)}
                className="w-6 h-6 rounded-full text-[#173C36]/60 hover:text-[#173C36] flex items-center justify-center"
                aria-label="About cognitive trend"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#173C36]/70 mt-0.5 font-medium">
              {t.circle.personalBaseline}
            </p>
          </div>
        </div>

        {showTrendHelp && (
          <div className="p-3.5 bg-[#FFFDF6] border border-[#173C36]/10 rounded-2xl text-xs text-[#173C36]/80 leading-relaxed space-y-1 animate-in fade-in">
            <p className="font-bold text-[#173C36]">{circleUi.howTrendsWork}</p>
            <p>
              {circleUi.howTrendsDesc(elderDisplay)}
            </p>
          </div>
        )}

        {/* Trend Line Chart Card */}
        <div className="rounded-[28px] bg-[#FFFDF6] border border-[#173C36]/5 p-5 shadow-xs relative">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-[#173C36]/60 mb-2">
            <span>{circleUi.rollingBaseline}</span>
            <span className="text-[#2F9E76]">{t.circle.normBaseline}</span>
          </div>

          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 overflow-visible"
            >
              {[
                { label: '80', val: 80 },
                { label: '60', val: 60 },
                { label: '40', val: 40 },
              ].map(grid => {
                const yPos = chartHeight - 20 - ((grid.val - minY) / (maxY - minY)) * (chartHeight - 40);
                return (
                  <g key={grid.label}>
                    <line
                      x1="30"
                      y1={yPos}
                      x2={chartWidth - 10}
                      y2={yPos}
                      stroke="rgba(23, 60, 54, 0.08)"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x="10"
                      y={yPos + 4}
                      fontSize="10"
                      fill="#173C36"
                      opacity="0.5"
                      fontFamily="system-ui"
                    >
                      {grid.label}
                    </text>
                  </g>
                );
              })}

              <rect
                x="30"
                y={chartHeight - 20 - ((76 - minY) / (maxY - minY)) * (chartHeight - 40)}
                width={chartWidth - 40}
                height="14"
                fill="rgba(245, 194, 68, 0.12)"
                rx="4"
              />

              <path
                d={pathData}
                fill="none"
                stroke="#173C36"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={i === points.length - 1 ? 5 : 3.5}
                  fill={i === points.length - 1 ? '#F5C244' : '#173C36'}
                  stroke="#FFFDF6"
                  strokeWidth="2"
                  className="cursor-pointer hover:scale-125 transition-transform"
                  onClick={() => setSelectedPointIdx(i)}
                />
              ))}
            </svg>

            <div className="flex justify-between px-6 pt-1 text-[11px] font-bold text-[#173C36]/50 uppercase tracking-wider">
              <span>{circleUi.monthJul}</span>
              <span>{circleUi.monthAug}</span>
              <span className="text-[#173C36] font-extrabold">{circleUi.thisWeek}</span>
            </div>
          </div>

          {selectedPointIdx !== null && (
            <div className="mt-3 p-3 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 text-xs flex items-center justify-between animate-in fade-in">
              <div>
                <span className="font-bold text-[#173C36]">
                  {dailyScores[selectedPointIdx].displayDate}:
                </span>{' '}
                <span>{dailyScores[selectedPointIdx].averageScore} pts</span>{' '}
                <span className="text-[10px] text-[#173C36]/60">
                  {circleUi.gamesPlayed(dailyScores[selectedPointIdx].sessionsCount)}
                </span>
              </div>
              <button
                onClick={() => setSelectedPointIdx(null)}
                className="text-xs text-[#173C36]/60 font-bold"
              >
                {circleUi.close}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activity Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-[#173C36]">
            {t.circle.todayActivity}
          </h2>
          <span className="text-xs font-bold text-[#173C36]/70 uppercase tracking-wider">
            {circleUi.active}
          </span>
        </div>

        <div className="rounded-[24px] bg-[#FFFDF6] border border-[#173C36]/5 p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#2F9E76] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#173C36]">
                {t.circle.exerciseCompleted}
              </h3>
              <p className="text-xs text-[#173C36]/70">
                {circleUi.activitiesSummary}
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#173C36]/40">
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>
      </div>

      {/* Primary Action: Direct Call to Elder Button */}
      <div
        onClick={() => handleTriggerCall(currentUser?.elderName || 'Minati Barua', currentUser?.phone || '+91 98765 43210', 'Elder')}
        className="rounded-[28px] bg-[#173C36] text-white p-4.5 flex items-center justify-between shadow-md cursor-pointer hover:bg-[#1f4e46] active:scale-[0.99] transition-all"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-white/15 text-[#F5C244] flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">
              {t.circle.callElder(elderDisplay)}
            </h3>
            <p className="text-xs text-white/75">
              {circleUi.directVoiceConnection} · {currentUser?.phone || '+91 98765 43210'}
            </p>
          </div>
        </div>

        <div className="px-4 py-1.5 rounded-full bg-[#F5C244] text-[#173C36] text-xs font-bold shadow-xs">
          {circleUi.connect}
        </div>
      </div>

      {/* Simulated Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF6] rounded-[32px] p-6 max-w-sm w-full shadow-2xl border border-[#173C36]/10 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F9E76]">
                {t.circle.directVoiceConnect}
              </span>
              <button
                onClick={() => setShowCallModal(false)}
                className="w-8 h-8 rounded-full bg-[#FFFBEF] flex items-center justify-center text-[#173C36]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#173C36] text-[#F5C244] flex items-center justify-center mx-auto shadow-md animate-pulse">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-[#173C36]">
                {circleUi.calling(callingTarget.name)}
              </h3>
              <p className="text-xs font-bold text-[#2F9E76]">
                {callingTarget.phone}
              </p>
              <p className="text-xs text-[#173C36]/70">
                {circleUi.voiceBridgeDesc}
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  bhashiniVoice.playGentleTone('chime');
                  setShowCallModal(false);
                }}
                className="flex-1 py-3 rounded-full bg-[#2F9E76] text-white text-xs font-bold"
              >
                {t.circle.startDirectCall}
              </button>
              <button
                onClick={() => setShowCallModal(false)}
                className="px-5 py-3 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 text-xs font-bold text-[#173C36]"
              >
                {t.circle.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
