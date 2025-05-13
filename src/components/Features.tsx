const features = [
  {
    icon: "📊",
    title: "Gestão Financeira Simples",
    description: "Acompanhe receitas e despesas de forma intuitiva."
  },
  {
    icon: "📈",
    title: "Relatórios Detalhados",
    description: "Visualize seu progresso financeiro com gráficos e análises."
  },
  {
    icon: "🎯",
    title: "Metas Financeiras",
    description: "Estabeleça e acompanhe suas metas de economia."
  },
  {
    icon: "📱",
    title: "Acesso em Qualquer Lugar",
    description: "Use em qualquer dispositivo, sempre sincronizado."
  }
];

const Features = () => (
  <div className="mt-12 px-4 lg:px-8">
    <h2 className="text-2xl font-semibold text-white mb-6 text-center">
      O que você pode fazer com o MoneyHub?
    </h2>
    <div className="flex flex-wrap gap-6 max-w-5xl mx-auto justify-center">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="flex items-start p-6 lg:p-8 bg-gray-900 rounded-lg shadow hover:shadow-emerald-900/10 transition-shadow border border-emerald-500/20 hover:border-emerald-500/40"
        >
          <span className="text-2xl mr-6">{feature.icon}</span>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Features;