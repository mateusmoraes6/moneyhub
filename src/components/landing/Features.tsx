const features = [
  {
    icon: "📊",
    title: "Gestão Financeira Simples",
    description: "Acompanhe receitas e despesas de forma intuitiva com visualizações claras e objetivas."
  },
  {
    icon: "📈",
    title: "Relatórios Detalhados",
    description: "Visualize seu progresso financeiro com gráficos interativos e análises personalizadas."
  },
  {
    icon: "🎯",
    title: "Metas Financeiras",
    description: "Estabeleça objetivos claros e acompanhe seu progresso rumo à independência financeira."
  },
  {
    icon: "📱",
    title: "Acesso em Qualquer Lugar",
    description: "Use em qualquer dispositivo, com seus dados sempre seguros e sincronizados na nuvem."
  }
];

const Features = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
    {features.map((feature, idx) => (
      <div
        key={idx}
        className="group p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-emerald-900/20 transition-all duration-300 border border-gray-800 hover:border-emerald-500/50 relative overflow-hidden animate-fade-in-up hover:-translate-y-1 hover:shadow-[0_20px_25px_-5px_rgba(16,185,129,0.1),0_10px_10px_-5px_rgba(16,185,129,0.04)]"
        style={{ animationDelay: `${idx * 200}ms` }}
      >
        {/* Decorative element */}
        <div className="absolute -right-12 -top-12 w-24 h-24 bg-emerald-600/5 rounded-full group-hover:bg-emerald-600/10 transition-all duration-500"></div>
        
        <div className="flex flex-col h-full">
          <div className="text-3xl mb-5 p-3 bg-gray-800/50 rounded-xl w-max">
            {feature.icon}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
            {feature.title}
          </h3>
          
          <p className="mt-2 text-gray-400 leading-relaxed flex-grow">
            {feature.description}
          </p>
          
          <div className="mt-4 w-12 h-0.5 bg-emerald-500/30 group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>
    ))}
  </div>
);

export default Features;