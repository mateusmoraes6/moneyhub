import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import Features from '../components/Features';
import AuthModal from '../components/AuthModal';
import { motion } from 'framer-motion';

const Login = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden">
      {/* Fundo com efeito de partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-circuit-pattern opacity-[0.03]"></div>
        
        {/* Círculos de gradiente animados */}
        <motion.div 
          className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-emerald-600/10 to-transparent"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute -bottom-96 -right-96 w-[800px] h-[800px] rounded-full bg-gradient-to-l from-emerald-600/10 to-transparent"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Header flutuante com efeito de glass */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 bg-gray-950/80 backdrop-blur-lg shadow-md' : 'py-4 bg-transparent'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Wallet className="h-7 w-7 text-emerald-500" />
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold text-white"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              MoneyHub
            </motion.h1>
          </div>
          
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              className="px-5 py-2 rounded-full text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/20 font-medium text-sm"
              onClick={() => {
                setAuthType('login');
                setAuthModalOpen(true);
              }}
            >
              Entrar
            </button>
          </motion.div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-16 px-4">
          <div className="max-w-4xl w-full space-y-10 text-center relative z-10">
            {/* Hero Content */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div 
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Wallet className="h-10 w-10 text-white" />
              </motion.div>
              
              {/* Título principal responsivo melhorado */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight px-4">
                <span className="inline-block">Finanças</span>{' '}
                <span className="relative inline-block mt-2 sm:mt-0">
                  <span className="text-emerald-500">simplificadas</span>
                  <span className="absolute bottom-1 left-0 w-full h-[3px] bg-emerald-500/30"></span>
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                Solução intuitiva para Organizar suas finanças pessoais com facilidade.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <motion.button
                className="w-full sm:w-auto py-4 px-8 rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/20 text-lg relative overflow-hidden group"
                onClick={() => {
                  setAuthType('signup');
                  setAuthModalOpen(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Comece Agora</span>
                <span className="absolute inset-0 w-full h-full bg-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="absolute -inset-x-16 top-0 -bottom-14 rotate-12 transform -translate-x-full group-hover:translate-x-full ease-out duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent"></span>
              </motion.button>
              
              <motion.button
                className="w-full sm:w-auto py-4 px-8 rounded-2xl text-emerald-500 border-2 border-emerald-500/30 hover:border-emerald-500/70 bg-transparent hover:bg-emerald-950 font-medium transition-all duration-300 text-lg"
                onClick={() => {
                  setAuthType('login');
                  setAuthModalOpen(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Já tenho conta
              </motion.button>
            </motion.div>
          </div>

          {/* Scroll indicator - Melhorado para aparecer apenas no topo */}
          {/* <AnimatePresence>
            {showScrollIndicator && (
              <motion.div 
                className="fixed bottom-16  transform -translate-x-1/2 cursor-pointer z-30"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ 
                  opacity: { duration: 0.3 },
                  y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                }}
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="bg-gray-900/70 backdrop-blur-sm p-3 rounded-full shadow-lg">
                  <ChevronDown className="h-4 w-4 text-emerald-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence> */}
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div 
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Fique no controle do seu dinheiro
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Descubra como o MoneyHub pode tornar o gerenciamento financeiro uma tarefa simples.
              </p>
            </motion.div>
            
            <Features />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500">© {new Date().getFullYear()} MoneyHub. Todos os direitos reservados.</p>
          </div>
        </footer>
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        type={authType}
      />
    </div>
  );
};

export default Login;
