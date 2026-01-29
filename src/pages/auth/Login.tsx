import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Mail, Lock, Eye, EyeOff, Wallet, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
            throw new Error('Email ou senha incorretos.');
          }
          throw signInError;
        }

        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Tech Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-full bg-circuit-pattern opacity-[0.02]"></div>
      </div>

      {/* Main Glass Card */}
      <div className="w-full max-w-[420px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 animate-scale-in" style={{ animationDelay: '200ms' }}>
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div className="text-center animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">MoneyHub</h1>
            <p className="text-gray-400 text-sm font-medium tracking-wide">
              Organizando Finanças
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={isForgotPassword ? handleResetPassword : handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-center animate-fadeIn">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-200 text-sm text-center animate-fadeIn">
              {successMessage}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {isForgotPassword ? 'Enviar Instruções' : isSignUp ? 'Criar Conta' : 'Acessar Conta'}
                </span>
                {!isForgotPassword && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </>
            )}
          </button>

        </form>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col items-center gap-4 text-sm">
          {!isForgotPassword && (
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 font-medium"
            >
              {isSignUp ? (
                <>Já tem uma conta? <span className="text-white">Faça login</span></>
              ) : (
                <>Novo por aqui? <span className="text-white">Crie sua conta</span></>
              )}
            </button>
          )}

          {!isSignUp && (
            <button
              onClick={() => {
                if (isForgotPassword) {
                  setIsForgotPassword(false);
                  setError(null);
                  setSuccessMessage(null);
                } else {
                  setIsForgotPassword(true);
                  setError(null);
                  setSuccessMessage(null);
                }
              }}
              className="text-gray-500 hover:text-gray-300 transition-colors text-xs"
            >
              {isForgotPassword ? '← Voltar para o login' : 'Esqueceu sua senha?'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
