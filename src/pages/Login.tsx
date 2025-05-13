import { useState } from 'react';
import { Wallet } from 'lucide-react';
import Features from '../components/Features';
import AuthModal from '../components/AuthModal';

const Login = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Wallet className="h-8 w-8 text-emerald-500" />
            <h1 className="text-4xl font-bold text-white">MoneyHub</h1>
          </div>
          <p className="text-lg text-gray-400">
            Solução simples para você organizar suas finanças!
          </p>
        </div>

        <div className="space-y-4">
          <button
            className="w-full py-3 px-4 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 font-medium transition-colors"
            onClick={() => {
              setAuthType('login');
              setAuthModalOpen(true);
            }}
          >
            Entre, se já possui conta
          </button>
          <button
            className="w-full py-3 px-4 rounded-md text-emerald-500 border border-emerald-500 bg-transparent hover:bg-emerald-950 font-medium transition-colors"
            onClick={() => {
              setAuthType('signup');
              setAuthModalOpen(true);
            }}
          >
            Primeiro acesso? Cadastre-se
          </button>
        </div>

        <Features />
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        type={authType}
      />
    </div>
  );
};

export default Login;
