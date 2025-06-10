// import React, { useState, useRef, useEffect } from 'react';
// // Importamos Account e Card dos tipos definidos globalmente
// import { Account, Card } from '../../types'; // Importamos dos tipos globais

// // Definimos um tipo união para os itens usando os tipos globais
// type Item = Account | Card;

// interface AccountCardSelectorProps {
//   type: 'account' | 'card';
//   items: Item[]; // Agora espera os tipos globais Account[] ou Card[]
//   selectedId?: number | string; // ID pode ser number ou string (depende dos mocks)
//   onSelect: (id: number | string) => void; // onSelect retorna o ID original
// }

// const AccountCardSelector: React.FC<AccountCardSelectorProps> = ({
//   type,
//   items,
//   selectedId,
//   onSelect,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Encontra o item selecionado usando o ID
//   const selectedItem = items.find(item => item.id == selectedId);

//   // Função para obter os dados de exibição (ícone e nome) usando os tipos globais
//   const getDisplayData = (item: Item) => {
//      const bankName = item.bank;
//      const iconUrl = `/icons/${bankName.toLowerCase().replace(/\s/g, '_')}.svg`;
//      const name = item.name; // Propriedade 'name' existe em ambos os tipos globais

//      let extraInfo = '';
//      if ('balance' in item) { // É uma Account
//         extraInfo = `Saldo: R$ ${item.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
//      } else if ('available_limit' in item) { // É um Card
//         extraInfo = `Limite disponível: R$ ${item.available_limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
//      }

//      // Determinamos a string de exibição baseada no tipo
//      const displayName = 'balance' in item ? item.bank : `${item.bank} - ${item.name}`;

//      return { bankName, iconUrl, name, extraInfo, displayName }; // Inclui displayName
//   };

//   const selectedItemData = selectedItem ? getDisplayData(selectedItem) : null;

//   // Fechar o dropdown quando clicar fora
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Label para o seletor */}
//       <label className="block text-sm font-medium text-gray-300 mb-1">
//         {type === 'account' ? 'Conta' : 'Cartão'}
//       </label>
//       {/* Botão de seleção que abre o dropdown */}
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-gray-600 focus:border-transparent flex items-center justify-between"
//       >
//          <div className="flex items-center space-x-3">
//           {selectedItemData?.iconUrl && (
//              <img
//                src={selectedItemData.iconUrl}
//                alt={selectedItemData.bankName}
//                className="w-6 h-6"
//                onError={(e) => { // Tratamento básico de erro de imagem
//                  e.currentTarget.style.display = 'none'; // Oculta a imagem que falhou
//                }}
//              />
//           )}
//           <span className={selectedItem ? 'text-white' : 'text-gray-400'}>
//             {selectedItemData
//               ? selectedItemData.displayName // Usa a nova propriedade displayName
//               : `Selecione ${type === 'account' ? 'uma conta' : 'um cartão'}`
//             }
//           </span>
//         </div>
//          {/* Seta para indicar que é clicável/abre algo */}
//          <svg 
//            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
//            fill="none" 
//            stroke="currentColor" 
//            viewBox="0 0 24 24"
//          >
//            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//          </svg>
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
//           <div className="p-2 space-y-2">
//             {items.map((item) => {
//               const itemData = getDisplayData(item);
//               return (
//                 <button
//                   key={item.id}
//                   type="button"
//                   onClick={() => {
//                     onSelect(item.id);
//                     setIsOpen(false);
//                   }}
//                   className="w-full p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-700 transition-colors duration-200"
//                 >
//                    {itemData.iconUrl && (
//                       <img
//                         src={itemData.iconUrl}
//                         alt={itemData.bankName}
//                         className="w-6 h-6"
//                         onError={(e) => {
//                           e.currentTarget.style.display = 'none'; 
//                         }}
//                       />
//                    )}
//                   <div className="flex-1 text-left">
//                      <p className="text-white font-medium">
//                         {itemData.displayName} {/* Usa a nova propriedade displayName */}
//                      </p>
//                      {itemData.extraInfo && (
//                        <p className="text-sm text-gray-400">{itemData.extraInfo}</p>
//                      )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountCardSelector; 