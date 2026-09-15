import React, { useState } from 'react';
import { FamilyMember, Reminder, CaregiverNote, SyncQueueItem } from '../types';
import { AppStorage } from '../utils/storage';
import { bhashiniVoice } from '../utils/bhashiniVoice';
import {
  ShieldCheck,
  Lock,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Clock,
  Send,
  RefreshCw,
  FileText,
  Check,
  Mic,
  Smile,
  AlertTriangle
} from 'lucide-react';

interface CaregiverModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUnlocked: boolean;
  onUnlockSuccess: () => void;
  familyMembers: FamilyMember[];
  reminders: Reminder[];
  onUpdateFamily: (members: FamilyMember[]) => void;
  onUpdateReminders: (reminders: Reminder[]) => void;
  onFlushSync: () => void;
}

export const CaregiverModeModal: React.FC<CaregiverModeModalProps> = ({
  isOpen,
  onClose,
  isUnlocked,
  onUnlockSuccess,
  familyMembers,
  reminders,
  onUpdateFamily,
  onUpdateReminders,
  onFlushSync,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeCaregiverTab, setActiveCaregiverTab] = useState<'photos' | 'reminders' | 'notes' | 'sync'>('photos');

  // New photo form state
  const [newPhotoName, setNewPhotoName] = useState('');
  const [newPhotoRelation, setNewPhotoRelation] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoVoice, setNewPhotoVoice] = useState('');
  const [newPhotoHint, setNewPhotoHint] = useState('');
  const [photoSavedToast, setPhotoSavedToast] = useState(false);

  // New reminder form state
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemTime, setNewRemTime] = useState('10:00 AM');
  const [newRemCategory, setNewRemCategory] = useState<'medicine' | 'activity' | 'hydration' | 'meal'>('medicine');

  // Care note state
  const [noteText, setNoteText] = useState('');
  const [noteSentToast, setNoteSentToast] = useState(false);

  if (!isOpen) return null;

  const handlePinDigit = (digit: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setPinError(false);

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handlePinDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
    setPinError(false);
  };

  const verifyPin = (pin: string) => {
    const expected = AppStorage.getCaregiverPin();
    if (pin === expected) {
      bhashiniVoice.playGentleTone('success');
      AppStorage.logCaregiverAccess();
      onUnlockSuccess();
      setPinInput('');
    } else {
      bhashiniVoice.playGentleTone('soft');
      setPinError(true);
      setPinInput('');
    }
  };

  const handleQuickUnlockDemo = () => {
    bhashiniVoice.playGentleTone('success');
    AppStorage.logCaregiverAccess();
    onUnlockSuccess();
  };

  // Add new family member
  const handleSaveFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoName.trim() || !newPhotoRelation.trim()) return;

    const sampleImages = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    ];

    const newMember: FamilyMember = {
      id: 'fam-' + Date.now(),
      name: newPhotoName.trim(),
      relationship: newPhotoRelation.trim(),
      photoUrl: newPhotoUrl.trim() || sampleImages[Math.floor(Math.random() * sampleImages.length)],
      voiceNoteText: newPhotoVoice.trim() || `Thinking of you, Aita! - ${newPhotoName}`,
      hint: newPhotoHint.trim() || `Your dear ${newPhotoRelation}`,
      addedBy: 'caregiver',
      addedAt: new Date().toISOString().split('T')[0],
    };

    const updated = AppStorage.saveFamilyMember(newMember);
    onUpdateFamily(updated);

    setNewPhotoName('');
    setNewPhotoRelation('');
    setNewPhotoUrl('');
    setNewPhotoVoice('');
    setNewPhotoHint('');
    setPhotoSavedToast(true);
    bhashiniVoice.playGentleTone('chime');
    setTimeout(() => setPhotoSavedToast(false), 2500);
  };

  const handleDeleteMember = (id: string) => {
    const updated = AppStorage.deleteFamilyMember(id);
    onUpdateFamily(updated);
    bhashiniVoice.playGentleTone('soft');
  };

  // Add reminder
  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemTitle.trim()) return;

    const newReminder: Reminder = {
      id: 'rem-' + Date.now(),
      title: newRemTitle.trim(),
      category: newRemCategory,
      subtitle: `${newRemCategory.toUpperCase()} · ${newRemTime}`,
      time: newRemTime,
      completed: false,
      recurrence: 'Daily',
      createdBy: 'caregiver',
    };

    const updated = AppStorage.saveReminder(newReminder);
    onUpdateReminders(updated);
    setNewRemTitle('');
    bhashiniVoice.playGentleTone('chime');
  };

  const handleDeleteReminder = (id: string) => {
    const updated = AppStorage.deleteReminder(id);
    onUpdateReminders(updated);
    bhashiniVoice.playGentleTone('soft');
  };

  // Send care note
  const handleSendCareNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    AppStorage.addCareNote({
      id: 'note-' + Date.now(),
      fromName: 'Priya (Daughter)',
      relation: 'Caregiver',
      message: noteText.trim(),
      timestamp: 'Just now',
    });

    setNoteText('');
    setNoteSentToast(true);
    bhashiniVoice.playGentleTone('chime');
    setTimeout(() => setNoteSentToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FFFDF6] rounded-[32px] w-full max-w-md shadow-2xl border border-[#173C36]/10 overflow-hidden my-auto animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#173C36]/10 flex items-center justify-between bg-[#FFFBEF]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#173C36] text-[#F5C244] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-[#173C36]">
                Caregiver Mode
              </h2>
              <p className="text-[11px] text-[#173C36]/70">
                {isUnlocked ? 'Priya Barua (Daughter) · Authorized' : 'Protected Caregiver Area'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#173C36]/10 flex items-center justify-center text-[#173C36] hover:bg-gray-50"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Authentication Gate (if locked) */}
        {!isUnlocked ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#FDF0BE] text-[#173C36] flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-display font-bold text-[#173C36]">
                Enter Caregiver PIN
              </h3>
              <p className="text-xs text-[#173C36]/70 mt-1">
                Ensures patient remains in calm, safe patient mode.
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="flex items-center justify-center gap-3 my-2">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all ${
                    pinInput.length > i
                      ? 'bg-[#173C36] scale-110'
                      : pinError
                      ? 'border-2 border-red-500 bg-red-100'
                      : 'border-2 border-[#173C36]/30 bg-white'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-xs font-bold text-red-600 animate-shake">
                Incorrect PIN. Default is 1234.
              </p>
            )}

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  onClick={() => handlePinDigit(num)}
                  className="w-16 h-12 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 text-lg font-bold text-[#173C36] hover:bg-[#F5C244]/20 active:scale-95 transition-all shadow-xs mx-auto flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => handlePinDigit('0')}
                className="w-16 h-12 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 text-lg font-bold text-[#173C36] hover:bg-[#F5C244]/20 active:scale-95 transition-all shadow-xs mx-auto flex items-center justify-center"
              >
                0
              </button>
              <button
                onClick={handlePinDelete}
                className="w-16 h-12 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 text-xs font-bold text-[#173C36] hover:bg-gray-100 active:scale-95 transition-all shadow-xs mx-auto flex items-center justify-center"
              >
                Del
              </button>
            </div>

            {/* Demo Instant Unlock Button */}
            <div className="pt-3 border-t border-[#173C36]/10">
              <button
                onClick={handleQuickUnlockDemo}
                className="text-xs font-bold text-[#2F9E76] underline hover:text-[#173C36]"
              >
                Quick Unlock (Demo PIN: 1234)
              </button>
            </div>
          </div>
        ) : (
          /* Caregiver Dashboard Content (when authenticated) */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex border-b border-[#173C36]/10 bg-[#FFFDF6] px-3 pt-2 text-xs font-bold overflow-x-auto no-scrollbar">
              {[
                { id: 'photos', label: 'Memory Lane' },
                { id: 'reminders', label: 'Reminders' },
                { id: 'notes', label: 'Love Notes' },
                { id: 'sync', label: 'Sync Queue' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCaregiverTab(tab.id as any)}
                  className={`px-3.5 py-2 whitespace-nowrap border-b-2 transition-all ${
                    activeCaregiverTab === tab.id
                      ? 'border-[#173C36] text-[#173C36]'
                      : 'border-transparent text-[#173C36]/60 hover:text-[#173C36]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
              {/* TAB 1: MEMORY LANE PHOTOS */}
              {activeCaregiverTab === 'photos' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#E1F5EE] rounded-2xl text-xs text-[#173C36] leading-relaxed">
                    <strong>Memory Lane feeds the 'Who Is This?' game:</strong> Photos you add here will appear automatically in Aita's slideshow and face recall games.
                  </div>

                  {photoSavedToast && (
                    <div className="p-2.5 rounded-xl bg-[#2F9E76] text-white text-xs font-bold text-center animate-in fade-in">
                      ✓ Family member added to Aita's device!
                    </div>
                  )}

                  {/* Add Photo Form */}
                  <form onSubmit={handleSaveFamilyMember} className="p-4 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#173C36]">
                      Add Family Member Photo
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Name (e.g. Natasha)"
                        value={newPhotoName}
                        onChange={e => setNewPhotoName(e.target.value)}
                        className="p-2.5 text-xs rounded-xl bg-white border border-[#173C36]/15 focus:outline-none focus:border-[#173C36]"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Relation (e.g. Granddaughter)"
                        value={newPhotoRelation}
                        onChange={e => setNewPhotoRelation(e.target.value)}
                        className="p-2.5 text-xs rounded-xl bg-white border border-[#173C36]/15 focus:outline-none focus:border-[#173C36]"
                        required
                      />
                    </div>

                    <input
                      type="url"
                      placeholder="Photo URL (leave blank for random family portrait)"
                      value={newPhotoUrl}
                      onChange={e => setNewPhotoUrl(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#173C36]/15 focus:outline-none focus:border-[#173C36]"
                    />

                    <input
                      type="text"
                      placeholder="Spoken voice note (e.g. 'Maa, thinking of you!')"
                      value={newPhotoVoice}
                      onChange={e => setNewPhotoVoice(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#173C36]/15 focus:outline-none focus:border-[#173C36]"
                    />

                    <input
                      type="text"
                      placeholder="Gentle memory hint for the game"
                      value={newPhotoHint}
                      onChange={e => setNewPhotoHint(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#173C36]/15 focus:outline-none focus:border-[#173C36]"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-[#173C36] text-white text-xs font-bold hover:bg-[#1f4e46] shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Memory Lane</span>
                    </button>
                  </form>

                  {/* Existing Family List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#173C36]/70 uppercase tracking-wider">
                      Current Photos ({familyMembers.length})
                    </h4>
                    {familyMembers.map(m => (
                      <div
                        key={m.id}
                        className="p-2.5 rounded-2xl bg-white border border-[#173C36]/10 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={m.photoUrl}
                            alt={m.name}
                            className="w-10 h-10 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-[#173C36]">{m.name}</p>
                            <p className="text-[11px] text-[#173C36]/70">{m.relationship}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteMember(m.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          aria-label="Delete member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: REMINDERS MANAGER */}
              {activeCaregiverTab === 'reminders' && (
                <div className="space-y-4">
                  <form onSubmit={handleSaveReminder} className="p-4 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#173C36]">
                      Schedule Remote Reminder
                    </h4>

                    <input
                      type="text"
                      placeholder="Title (e.g. Vitamin D tablet, Warm soup)"
                      value={newRemTitle}
                      onChange={e => setNewRemTitle(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-white border border-[#173C36]/15 focus:outline-none"
                      required
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newRemCategory}
                        onChange={e => setNewRemCategory(e.target.value as any)}
                        className="p-2.5 text-xs rounded-xl bg-white border border-[#173C36]/15 focus:outline-none"
                      >
                        <option value="medicine">Medicine</option>
                        <option value="hydration">Hydration / Water</option>
                        <option value="activity">Walk / Exercise</option>
                        <option value="meal">Meal</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Time (e.g. 2:30 PM)"
                        value={newRemTime}
                        onChange={e => setNewRemTime(e.target.value)}
                        className="p-2.5 text-xs rounded-xl bg-white border border-[#173C36]/15 focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-[#173C36] text-white text-xs font-bold shadow-xs hover:bg-[#1f4e46] flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Set Reminder</span>
                    </button>
                  </form>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#173C36]/70 uppercase tracking-wider">
                      Active Reminders
                    </h4>
                    {reminders.map(r => (
                      <div
                        key={r.id}
                        className="p-3 rounded-2xl bg-white border border-[#173C36]/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#173C36]">{r.title}</p>
                          <p className="text-[11px] text-[#173C36]/60">{r.subtitle}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {r.completed ? (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.completionStatus === 'late'
                                ? 'bg-[#FDECDA] text-[#C4641B]'
                                : 'bg-[#E1F5EE] text-[#1F8A5F]'
                            }`}>
                              {r.completionStatus === 'late' ? '✓ Done (Late)' : '✓ Done'}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-[#173C36]/5 text-[#173C36]/60 text-[10px] font-semibold">
                              Pending
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-[#FFFBEF] border border-[#173C36]/10 text-[10px] font-bold">
                            {r.time}
                          </span>
                          <button
                            onClick={() => handleDeleteReminder(r.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: LOVE NOTES */}
              {activeCaregiverTab === 'notes' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#FDF0BE]/60 rounded-2xl text-xs text-[#173C36]">
                    Love notes appear directly in Aita's notification bell and gentle start messages.
                  </div>

                  {noteSentToast && (
                    <div className="p-2.5 rounded-xl bg-[#2F9E76] text-white text-xs font-bold text-center animate-in fade-in">
                      ✓ Love note sent to Aita!
                    </div>
                  )}

                  <form onSubmit={handleSendCareNote} className="space-y-3">
                    <textarea
                      rows={3}
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      placeholder="Write a sweet message to Aita..."
                      className="w-full p-3 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/15 text-xs text-[#173C36] focus:outline-none"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-[#173C36] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#1f4e46]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Note</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: SYNC QUEUE */}
              {activeCaregiverTab === 'sync' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-[#FFFBEF] border border-[#173C36]/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-[#173C36]">
                      <span>Offline Sync Queue</span>
                      <span className="text-[#2F9E76]">SQLite Engine Active</span>
                    </div>
                    <p className="text-[#173C36]/70 leading-relaxed">
                      All local patient progress is stored on-device first for full privacy and offline reliability.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onFlushSync();
                      bhashiniVoice.playGentleTone('chime');
                    }}
                    className="w-full py-2.5 rounded-full bg-[#2F9E76] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#258261]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Flush & Push Pending Queue</span>
                  </button>

                  <div className="p-3 bg-white rounded-2xl border border-[#173C36]/10 text-xs space-y-1">
                    <p className="font-bold text-[#173C36]">Local Access Log:</p>
                    <p className="text-[#173C36]/70 text-[11px]">
                      {AppStorage.getLastCaregiverAccess()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Exit Caregiver Mode Footer Button */}
            <div className="p-3 bg-[#FFFBEF] border-t border-[#173C36]/10 flex items-center justify-between">
              <span className="text-[11px] text-[#173C36]/60">
                Backstage Caregiver Controls
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-full bg-[#173C36] text-[#F5C244] text-xs font-bold hover:bg-[#1f4e46]"
              >
                Exit to Patient View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
