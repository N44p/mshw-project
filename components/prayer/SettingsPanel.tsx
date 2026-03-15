"use client"; // ⚠️ يجب أن يكون في أعلى الملف

import { useState, useEffect } from "react";

export default function SettingsPanel() {
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  useEffect(() => {
    setNotifyEnabled(localStorage.getItem("notifyEnabled") === "true");
  }, []);

  async function toggleNotify() {
    if (!notifyEnabled) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setNotifyEnabled(true);
        localStorage.setItem("notifyEnabled", "true");
      }
    } else {
      setNotifyEnabled(false);
      localStorage.setItem("notifyEnabled", "false");
    }
  }

  return (
    <button
      onClick={toggleNotify}
      className="bg-indigo-600 px-4 py-2 rounded-xl text-white hover:bg-indigo-700 transition"
    >
      {notifyEnabled ? "إيقاف الإشعارات" : "تشغيل الإشعارات"}
    </button>
  );
}