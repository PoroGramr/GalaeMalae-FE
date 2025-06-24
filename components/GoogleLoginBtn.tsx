import { GoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from 'react'
import { useRouter } from 'next/navigation';

export const GoogleLoginBtn = () => {
  const router = useRouter();
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID!}>
        <GoogleLogin
        onSuccess={async (response) => {
            console.log(response);
            // 로그인 성공 시 response라는 이름으로 값이 돌아옴
            const { credential } = response;
            if (credential) {
                try {
                    const res = await fetch('http://localhost:8000/api/v1/auth/google/decode', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ credential }),
                    });
                    const data = await res.json();
                    console.log('서버에서 받은 JWT:', data);
                    router.push('/home');
                } catch (e) {
                    console.error('서버 요청 실패:', e);
                }
            }
        }}
        onError={() => {
            console.log('Login Failed');
            // 로그인 실패 시 Login Failed가 console로 출력
        }}
        width="500px"
        />
    </GoogleOAuthProvider>
  )
}

export default GoogleLoginBtn 