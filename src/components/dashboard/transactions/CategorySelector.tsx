import React, { useState } from 'react';
import { X, Search, ChevronRight } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../../types';

interface CategorySelectorProps {
    type: 'income' | 'expense';
    selectedCategory: string;
    onSelect: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
    type,
    selectedCategory,
    onSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const selectedCategoryData = categories.find(c => c.id === selectedCategory);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (id: string) => {
        onSelect(id);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <>
            {/* Trigger Button */}
            <div className="relative">
                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                    Categoria
                </label>
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-left flex items-center justify-between group transition-all hover:bg-gray-800 hover:border-gray-600"
                >
                    <div className="flex items-center gap-3">
                        {selectedCategoryData ? (
                            <>
                                <span className="text-xl">{selectedCategoryData.icon}</span>
                                <span className="text-white font-medium">{selectedCategoryData.name}</span>
                            </>
                        ) : (
                            <span className="text-gray-500">Selecione uma categoria</span>
                        )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors rotate-90" />
                </button>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    {/* Click outside listener */}
                    <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>

                    <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[80vh] animate-scaleIn">
                        {/* Header */}
                        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white">Categorias</h3>
                                <p className="text-sm text-gray-400">Classifique sua {type === 'income' ? 'receita' : 'despesa'}</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-gray-800 bg-gray-800/20">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Buscar categoria..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none text-sm placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {filteredCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleSelect(category.id)}
                                        className={`
                                    flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200
                                    ${selectedCategory === category.id
                                                ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                                                : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600 hover:scale-[1.02]'
                                            }
                                `}
                                    >
                                        <span className="text-3xl filter drop-shadow-md">{category.icon}</span>
                                        <span className={`text-sm font-medium ${selectedCategory === category.id ? 'text-blue-400' : 'text-gray-300'}`}>
                                            {category.name}
                                        </span>
                                    </button>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        Nenhuma categoria encontrada
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CategorySelector;
