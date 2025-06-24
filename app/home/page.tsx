"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    fetch("http://localhost:8000/api/v1/auth/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("인증 실패");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setError("인증되지 않았습니다."));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">환영합니다! 구글 로그인에 성공하셨습니다.</h1>
      {user ? (
        <div className="text-xl">
          <div>이메일: {user.email}</div>
          <div>이름: {user.name}</div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>정보를 불러오는 중...</div>
      )}
    </div>
  );
} 