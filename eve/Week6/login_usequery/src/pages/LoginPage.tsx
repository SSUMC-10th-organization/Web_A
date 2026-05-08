import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLogo from '../assets/GoogleLogo'; 

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/lplist'); 
    } catch (err) {
      alert("로그인 정보를 확인해주세요.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-black p-6">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#0a0a0a] border border-[#1a1a1a] p-10 rounded-3xl space-y-6 shadow-2xl">
        <h1 className="text-3xl font-black text-center text-white mb-10">로그인</h1>
        
        <button 
          type="button" 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition active:scale-95"
        >
          <GoogleLogo />
          <span>구글 로그인</span>
        </button>

        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-gray-600 text-sm font-bold">OR</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        <input 
          type="email" placeholder="이메일" required
          className="w-full bg-[#111] border border-[#222] px-5 py-4 rounded-xl text-white outline-none focus:border-pink-500 transition"
          value={email} onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="비밀번호" required
          className="w-full bg-[#111] border border-[#222] px-5 py-4 rounded-xl text-white outline-none focus:border-pink-500 transition"
          value={password} onChange={e => setPassword(e.target.value)}
        />

        <button type="submit" className="w-full bg-pink-500 py-4 rounded-xl font-bold text-white hover:bg-pink-600 transition">
          로그인
        </button>
      </form>
    </div>
  );
}