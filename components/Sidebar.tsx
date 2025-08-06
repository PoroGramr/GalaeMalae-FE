"use client";

import { useEffect, useState } from "react";

interface User {
  email: string;
  name: string;
}

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      fetch("https://api.galaemalae.com/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("인증 실패");
          return res.json();
        })
        .then((data) => setUser(data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="w-64 h-screen bg-gray-800 text-white p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">사용자 정보</h2>
        {user ? (
          <div className="space-y-2">
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-300">이메일</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="text-sm text-gray-300">이름</div>
              <div className="font-medium">{user.name}</div>
            </div>
          </div>
        ) : (
          <div className="text-red-400">로그인이 필요합니다</div>
        )}
      </div>
      
      <div className="border-t border-gray-600 pt-4">
        <nav className="space-y-2">
          <a href="/home" className="block px-3 py-2 rounded hover:bg-gray-700 transition-colors">
            홈
          </a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-700 transition-colors">
            설정
          </a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-gray-700 transition-colors">
            로그아웃
          </a>
        </nav>
      </div>
    </div>
  );
} 