"use client"

import React, { useState, useEffect } from 'react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    let characters = charset;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;
    
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      generatedPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setPassword(generatedPassword);
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    alert("تم نسخ كلمة السر!");
  };

  return (
    <div className="p-8" dir="rtl">
      <div className="max-w-xl mx-auto bg-white border rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">مولد كلمات السر القوية</h2>
        
        <div className="relative mb-6">
          <input 
            type="text" 
            readOnly 
            value={password}
            className="w-full p-4 bg-gray-100 border rounded-xl text-center font-mono text-xl tracking-wider text-blue-700"
          />
          <button 
            onClick={copyToClipboard}
            className="mt-2 w-full text-sm text-blue-600 font-bold hover:underline"
          >نسخ النص</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-2">طول كلمة السر: {length}</label>
            <input 
              type="range" min="8" max="32" value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="w-4 h-4" />
              <span>أرقام</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="w-4 h-4" />
              <span>رموز</span>
            </label>
          </div>

          <button 
            onClick={generatePassword}
            className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
          >توليد كلمة سر جديدة</button>
        </div>
      </div>
    </div>
  );
}