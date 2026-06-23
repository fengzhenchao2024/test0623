import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onKeyChange: (key: string) => void;
}

export default function ApiKeyInput({ apiKey, onKeyChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState<boolean>(true); // Default show plain text as requested: "允许明文用户输入"

  return (
    <div 
      id="api-key-container"
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-lg text-xs"
    >
      <div className="flex items-center gap-1.5 text-slate-400 font-medium whitespace-nowrap">
        <Key className="w-3.5 h-3.5 text-indigo-400" />
        <span>Seedance 2.0 API Key:</span>
      </div>

      <div className="relative flex items-center flex-1 sm:w-48">
        <input
          id="api-key-input"
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => onKeyChange(e.target.value)}
          placeholder="请输入以 sd_ 开头的 API 密钥..."
          className="w-full bg-slate-950 text-slate-100 placeholder-slate-600 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500/80 focus:border-indigo-500 text-xs font-mono transition-all pr-8"
        />
        <button
          id="toggle-api-key-visibility"
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-2 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
          title={showKey ? "隐藏密钥" : "明文显示"}
        >
          {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex items-center gap-1.5 px-1 font-mono whitespace-nowrap">
        {apiKey.trim() ? (
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            已配置
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            未配置
          </span>
        )}
      </div>
    </div>
  );
}
