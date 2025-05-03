import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, X, LogIn } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login com Google');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateEmail(email)) {
      setError('Por favor, insira um endereço de email válido');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (resetError) throw resetError;

      setSuccessMessage('Se uma conta existir com este email, você receberá instruções para redefinir sua senha.');
    } catch (err) {
      setError('Não foi possível enviar o email de redefinição de senha. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateEmail(email)) {
      setError('Por favor, insira um endereço de email válido');
      return;
    }

    if (!validatePassword(password)) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            throw new Error('Este email já está registrado. Por favor, faça login.');
          }
          throw signUpError;
        }
        
        setSuccessMessage('Conta criada com sucesso! Você já pode fazer login.');
        setIsSignUp(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
          }
          throw signInError;
        }

        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
    setIsForgotPassword(false);
    setIsSignUp(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-md p-6 relative animate-fadeIn">
        <button
          onClick={() => {
            onClose();
            resetState();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {isForgotPassword 
            ? 'Recuperar senha'
            : isSignUp 
              ? 'Criar conta' 
              : 'Entrar'}
        </h2>

        {successMessage && (
          <div className="p-3 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-emerald-300 text-sm mb-4">
            {successMessage}
          </div>
        )}

        {!isForgotPassword && (
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors mb-4 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>
        )}

        {!isForgotPassword && (
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-400 bg-gray-900">ou</span>
            </div>
          </div>
        )}

        <form onSubmit={isForgotPassword ? handleResetPassword : handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 bg-gray-800 border rounded-lg text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all ${
                  error && error.includes('email') ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 bg-gray-800 border rounded-lg text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all ${
                    error && error.includes('senha') ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {isSignUp && 'A senha deve ter pelo menos 6 caracteres'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? 'Carregando...' 
              : isForgotPassword
                ? 'Enviar email de recuperação'
                : isSignUp 
                  ? 'Criar conta' 
                  : 'Entrar'}
          </button>

          <div className="text-center space-y-2">
            {!isForgotPassword && (
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isSignUp ? 'Já tem uma conta? Entre' : 'Não tem uma conta? Cadastre-se'}
              </button>
            )}
            
            {!isSignUp && !isForgotPassword && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="block w-full text-sm text-gray-400 hover:text-white transition-colors"
              >
                Esqueceu sua senha?
              </button>
            )}

            {isForgotPassword && (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Voltar ao login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;