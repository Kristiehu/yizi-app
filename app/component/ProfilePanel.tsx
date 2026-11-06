'use client';
import { useState, useEffect } from 'react';

export interface Profile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  solarDate: string;
  timeIndex: number;
}

interface ProfilePanelProps {
  profiles: Profile[];
  currentId: string;
  onSelectProfile: (id: string) => void;
  onSaveProfile: (profile: Profile, isEditing: boolean) => void;
  onDeleteProfile: (id: string) => void;
}

export default function ProfilePanel({
  profiles,
  currentId,
  onSelectProfile,
  onSaveProfile,
  onDeleteProfile,
}: ProfilePanelProps) {
  const currentProfile = profiles.find(p => p.id === currentId) || profiles[0];

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('1995-08-18');
  const [newGender, setNewGender] = useState<'male' | 'female'>('male');
  const [newTimeIndex, setNewTimeIndex] = useState(4);

  useEffect(() => {
    if (currentProfile) {
      setNewName(currentProfile.name);
      setNewDate(currentProfile.solarDate);
      setNewGender(currentProfile.gender);
      setNewTimeIndex(currentProfile.timeIndex);
      setIsEditing(false);
    }
  }, [currentId, currentProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const profileData: Profile = {
      id: isEditing ? currentId : Date.now().toString(),
      name: newName,
      gender: newGender,
      solarDate: newDate,
      timeIndex: Number(newTimeIndex),
    };

    onSaveProfile(profileData, isEditing);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md space-y-4">
      {/* 档案切换头部 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-md font-semibold text-purple-300">👤 档案管理</h2>
          <p className="text-xs text-slate-400">切换或管理您的亲友紫微命盘档案</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            value={currentId} 
            onChange={(e) => onSelectProfile(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white px-3 py-1.5 rounded-lg text-sm w-full sm:w-auto focus:outline-none focus:border-purple-500"
          >
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.solarDate})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 编辑/新增表单 */}
      <div className="border-t border-slate-700/60 pt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-slate-300">
            {isEditing ? `✏️ 修改当前档案: ${currentProfile?.name}` : '➕ 添加新档案'}
          </span>
          <div className="space-x-2">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-xs bg-blue-600/80 hover:bg-blue-500 px-2 py-1 rounded transition"
              >
                修改当前
              </button>
            )}
            {isEditing && (
              <button 
                onClick={() => setIsEditing(false)}
                className="text-xs bg-slate-600 hover:bg-slate-500 px-2 py-1 rounded transition"
              >
                取消
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="姓名" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm text-white"
            />
            <select 
              value={newGender} 
              onChange={(e) => setNewGender(e.target.value as 'male' | 'female')}
              className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm text-white"
            >
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input 
              type="date" 
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm text-white"
            />
            <select 
              value={newTimeIndex}
              onChange={(e) => setNewTimeIndex(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm text-white"
            >
              {Array.from({ length: 13 }).map((_, i) => (
                <option key={i} value={i}>时辰索引 {i}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-1.5 rounded-lg text-sm font-medium transition">
              {isEditing ? '保存修改' : '确认添加'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => onDeleteProfile(currentId)}
                className="bg-red-600/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm transition"
              >
                删除
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}