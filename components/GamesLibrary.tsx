
import React, { useState, useMemo } from 'react';
import { 
  Gamepad2, Search, Cpu, Zap, Clock, ChevronRight, ExternalLink, Trophy, Ghost, 
  Map, Star, X, DollarSign, ShieldCheck, HelpCircle, Activity, Sword, Flame, 
  Book, Box, Car, Sun, Skull, Target, Crosshair, Users, HardDrive, Terminal
} from 'lucide-react';

interface Game {
  id: string;
  name: string;
  category: 'Competitivo' | 'Casual' | 'RPG' | 'Ferramenta';
  isFree: boolean;
  platform: 'Steam' | 'Multi' | 'Epic';
  icon: React.ElementType;
  news: string;
  optimization: string;
  minReq: string;
  idealConfig: string;
}

const GAMES_DATA: Game[] = [
  // --- COMPETITIVOS ---
  { id: 'cs2', name: 'Counter-Strike 2', category: 'Competitivo', isFree: true, platform: 'Steam', icon: Target, news: 'Nova atualização de balanceamento no Premier.', optimization: 'Use "Reflex Low Latency" em On+Boost e desative o MSAA.', minReq: 'i5-2500K, 8GB RAM, GTX 1060', idealConfig: 'Ryzen 7 7800X3D, 32GB RAM, RTX 4070' },
  { id: 'valorant', name: 'Valorant', category: 'Competitivo', isFree: true, platform: 'Multi', icon: Crosshair, news: 'Novo episódio traz mudanças no mapa Abyss.', optimization: 'Priorize FPS alto sobre qualidade; desative V-Sync.', minReq: 'i3-4150, 4GB RAM, GT 730', idealConfig: 'i5-13600K, 16GB RAM, RTX 3060' },
  { id: 'apex', name: 'Apex Legends', category: 'Competitivo', isFree: true, platform: 'Steam', icon: Trophy, news: 'Evento de coleção "Lendas Urbanas" ativo.', optimization: 'Reduza a qualidade das texturas para poupar VRAM.', minReq: 'i3-6300, 6GB RAM, GT 640', idealConfig: 'Ryzen 5 5600, 16GB RAM, RTX 3070' },
  { id: 'fortnite', name: 'Fortnite', category: 'Competitivo', isFree: true, platform: 'Epic', icon: Star, news: 'Colaboração com Marvel retorna com novos modos.', optimization: 'Use o Modo Desempenho (Alpha) para máximo de frames.', minReq: 'i3-3225, 4GB RAM, Intel HD 4000', idealConfig: 'i7-12700K, 32GB RAM, RTX 4080' },
  { id: 'pubg', name: 'PUBG: Battlegrounds', category: 'Competitivo', isFree: true, platform: 'Steam', icon: Target, news: 'Novo mapa destrutível em fase de testes.', optimization: 'Mantenha "Distância de Visualização" no Alto e o resto no Muito Baixo.', minReq: 'i5-4430, 8GB RAM, GTX 960', idealConfig: 'i7-10700K, 16GB RAM, RTX 3060 Ti' },
  { id: 'warzone', name: 'Call of Duty: Warzone', category: 'Competitivo', isFree: true, platform: 'Multi', icon: Target, news: 'Integração com o novo Black Ops anunciada.', optimization: 'Ative o DLSS em "Performance" para ganhar 30% de FPS.', minReq: 'i5-6600K, 8GB RAM, GTX 960', idealConfig: 'i9-14900K, 64GB RAM, RTX 4090' },
  { id: 'r6', name: 'Rainbow Six Siege', category: 'Competitivo', isFree: false, platform: 'Steam', icon: ShieldCheck, news: 'Operação Deadly Omen foca em novos gadgets.', optimization: 'Use a API Vulkan para melhor aproveitamento de CPU.', minReq: 'i3-560, 6GB RAM, GTX 460', idealConfig: 'i5-12400, 16GB RAM, RTX 3060' },
  { id: 'overwatch2', name: 'Overwatch 2', category: 'Competitivo', isFree: true, platform: 'Steam', icon: Zap, news: 'Novo herói suporte chega na Temporada 12.', optimization: 'Reduza a escala de renderização para 75% em PCs fracos.', minReq: 'i3-4160, 6GB RAM, GTX 600', idealConfig: 'i7-11700K, 16GB RAM, RTX 3070' },
  { id: 'tarkov', name: 'Escape from Tarkov', category: 'Competitivo', isFree: false, platform: 'Multi', icon: Skull, news: 'Wipe de verão traz novas missões de início.', optimization: 'Exige 32GB de RAM para evitar stutters em mapas grandes como Streets.', minReq: 'i5-6600, 16GB RAM, GTX 1060', idealConfig: 'Ryzen 7 5800X3D, 32GB RAM, RTX 3080' },
  { id: 'lol', name: 'League of Legends', category: 'Competitivo', isFree: true, platform: 'Multi', icon: Flame, news: 'Vanguard agora é obrigatório para rodar o jogo.', optimization: 'Desative as sombras para ganhar estabilidade em teamfights.', minReq: 'i3-530, 2GB RAM, Intel HD 4600', idealConfig: 'PC Básico com 8GB RAM' },
  { id: 'deadlock', name: 'Deadlock', category: 'Competitivo', isFree: true, platform: 'Steam', icon: Ghost, news: 'O novo segredo da Valve está dominando os testes.', optimization: 'Mantenha drivers da NVIDIA atualizados (Game Ready específico).', minReq: 'i5-9400, 16GB RAM, GTX 1660', idealConfig: 'i7-13700, 32GB RAM, RTX 3080' },
  { id: 'rocketleague', name: 'Rocket League', category: 'Competitivo', isFree: true, platform: 'Epic', icon: Car, news: 'Novos itens de personalização de carros esportivos.', optimization: 'Desative "World Detail" para foco total na bola.', minReq: 'i3-2100, 4GB RAM, GTS 450', idealConfig: 'i5-10400, 8GB RAM, GTX 1650' },
  { id: 'eafc24', name: 'EA Sports FC 24/26', category: 'Competitivo', isFree: false, platform: 'Multi', icon: Trophy, news: 'Atualização de elenco pós-janela de transferências.', optimization: 'Trave em 60 FPS se houver oscilações nas cutscenes.', minReq: 'i5-6600K, 8GB RAM, GTX 1050 Ti', idealConfig: 'i7-12700K, 16GB RAM, RTX 3060' },
  
  // --- RPG / MMO ---
  { id: 'eldenring', name: 'Elden Ring', category: 'RPG', isFree: false, platform: 'Steam', icon: Sword, news: 'DLC Shadow of the Erdtree é o maior sucesso da FromSoftware.', optimization: 'Desative o Ray Tracing; o ganho visual é baixo para o custo de performance.', minReq: 'i5-8400, 12GB RAM, GTX 1060', idealConfig: 'Ryzen 7 5800X, 32GB RAM, RTX 3080' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', category: 'RPG', isFree: false, platform: 'Steam', icon: Cpu, news: 'A caminho da sequência "Project Orion".', optimization: 'Use Frame Generation (DLSS 3) para dobrar a fluidez.', minReq: 'i7-6700, 12GB RAM, GTX 1060', idealConfig: 'i9-13900K, 32GB RAM, RTX 4090' },
  { id: 'baldursgate3', name: 'Baldur’s Gate 3', category: 'RPG', isFree: false, platform: 'Steam', icon: Book, news: 'Larian Studios trabalha em suporte oficial a mods.', optimization: 'Use o modo Vulkan se estiver em placas AMD.', minReq: 'i5-4690, 8GB RAM, GTX 970', idealConfig: 'i7-13700K, 32GB RAM, RTX 4070' },
  { id: 'wow', name: 'World of Warcraft', category: 'RPG', isFree: false, platform: 'Multi', icon: Map, news: 'A saga Worldsoul começa com The War Within.', optimization: 'Limpe seus Addons; eles são a principal causa de FPS baixo.', minReq: 'i5-3450, 8GB RAM, GTX 760', idealConfig: 'Ryzen 7 7800X3D, 32GB RAM' },
  { id: 'genshin', name: 'Genshin Impact', category: 'RPG', isFree: true, platform: 'Multi', icon: Sun, news: 'Nova região de Natlan expande o mapa.', optimization: 'Limite os frames em 60 para evitar picos de temperatura.', minReq: 'i5-i7, 8GB RAM, GT 1030', idealConfig: 'i5-12400, 16GB RAM, RTX 3050' },
  { id: 'pathofexile', name: 'Path of Exile 2', category: 'RPG', isFree: true, platform: 'Steam', icon: Flame, news: 'Beta fechado revela sistema de combate renovado.', optimization: 'Exige SSD NVMe para carregar os milhares de efeitos de partículas.', minReq: 'i5-10400, 16GB RAM, RTX 2060', idealConfig: 'i7-13700K, 32GB RAM, RTX 4070' },
  
  // --- CASUAL / SOBREVIVÊNCIA ---
  { id: 'minecraft', name: 'Minecraft', category: 'Casual', isFree: false, platform: 'Multi', icon: Box, news: 'Snapshot nova adiciona mecânicas de Redstone.', optimization: 'Instale o mod Sodium ou Optifine; ganho de até 200% FPS.', minReq: 'i3-3210, 4GB RAM, Intel HD 4000', idealConfig: 'i5-12400, 16GB RAM, RTX 3060 (para Shaders)' },
  { id: 'roblox', name: 'Roblox', category: 'Casual', isFree: true, platform: 'Multi', icon: Gamepad2, news: 'Novos shaders de iluminação global em teste.', optimization: 'Use o "Roblox FPS Unlocker" para passar de 60 FPS.', minReq: 'Dual Core, 2GB RAM, Onboard', idealConfig: 'PC Moderno, 8GB RAM' },
  { id: 'palworld', name: 'Palworld', category: 'Casual', isFree: false, platform: 'Steam', icon: Ghost, news: 'Adição de arenas PvP e novos Pals.', optimization: 'Reduza a distância de renderização de objetos distantes.', minReq: 'i5-3570K, 16GB RAM, GTX 1050', idealConfig: 'i7-11700, 32GB RAM, RTX 3070' },
  { id: 'helldivers2', name: 'Helldivers 2', category: 'Casual', isFree: false, platform: 'Steam', icon: Zap, news: 'Novas ordens de liberação planetária recebidas.', optimization: 'Desative o Depth of Field para maior nitidez em combate.', minReq: 'i7-4790K, 8GB RAM, GTX 1050 Ti', idealConfig: 'i7-12700, 16GB RAM, RTX 3070' },
  { id: 'lethalcompany', name: 'Lethal Company', category: 'Casual', isFree: false, platform: 'Steam', icon: Skull, news: 'Update de Versão 50 traz novos interiores.', optimization: 'Use o mod "HD Company" para melhorar o visual sem pesar.', minReq: 'i5-7400, 8GB RAM, GTX 1050', idealConfig: 'i5-10400, 16GB RAM' },
  { id: 'stardew', name: 'Stardew Valley', category: 'Casual', isFree: false, platform: 'Steam', icon: Sun, news: 'Update 1.6 expandiu as fazendas de forma massiva.', optimization: 'Roda em qualquer hardware moderno sem problemas.', minReq: '2GHz CPU, 2GB RAM', idealConfig: 'Qualquer PC' },
  { id: 'gta5', name: 'GTA V / FiveM', category: 'Casual', isFree: false, platform: 'Multi', icon: Car, news: 'Nova DLC de verão para o modo Online.', optimization: 'No FiveM, limpe o cache semanalmente para evitar quedas.', minReq: 'i5-3470, 4GB RAM, GTX 660', idealConfig: 'i7-9700, 16GB RAM, RTX 2060' },

  // --- FERRAMENTAS ---
  { id: 'wallpaper', name: 'Wallpaper Engine', category: 'Ferramenta', isFree: false, platform: 'Steam', icon: Star, news: 'Suporte a wallpapers HDR aprimorado.', optimization: 'Configure para "Pausar" enquanto outros jogos estão abertos.', minReq: 'i3, 4GB RAM, Onboard', idealConfig: '8GB RAM para wallpapers complexos' },
  { id: 'obs', name: 'OBS Studio', category: 'Ferramenta', isFree: true, platform: 'Steam', icon: Terminal, news: 'Versão 30.2 foca em encoders AV1.', optimization: 'Use o NVENC se tiver placa NVIDIA para streamar sem lag.', minReq: 'Quad Core, 8GB RAM, GPU DX10', idealConfig: 'i7+ , 16GB RAM, RTX 30-series' },
  { id: 'soundpad', name: 'Soundpad', category: 'Ferramenta', isFree: false, platform: 'Steam', icon: HelpCircle, news: 'Novas atualizações de interface.', optimization: 'Baixo consumo de CPU, ideal para trolls ou sons de imersão.', minReq: 'Qualquer PC', idealConfig: 'Qualquer PC' },
  { id: 'vtube', name: 'VTube Studio', category: 'Ferramenta', isFree: true, platform: 'Steam', icon: Users, news: 'Novos filtros de tracking facial.', optimization: 'Use tracking por iPhone/Android para aliviar a CPU do PC.', minReq: 'i5, 8GB RAM, GTX 1050', idealConfig: 'i7, 16GB RAM, RTX 3060' },
  { id: 'crosshairx', name: 'Crosshair X', category: 'Ferramenta', isFree: false, platform: 'Steam', icon: Crosshair, news: 'Novas miras da comunidade.', optimization: 'Mantenha como sobreposição de jogo; baixíssimo delay.', minReq: 'Qualquer PC', idealConfig: 'Qualquer PC' },

  // --- OUTROS JOGOS LISTADOS (RESUMIDOS) ---
  { id: 'rust', name: 'Rust', category: 'Casual', isFree: false, platform: 'Steam', icon: Flame, news: 'Wipe mensal com novas armas.', optimization: 'Exige SSD obrigatoriamente para carregar o mapa.', minReq: 'i7-3770, 16GB RAM, GTX 670', idealConfig: 'i7-12700, 32GB RAM, RTX 3070' },
  { id: 'dayz', name: 'DayZ', category: 'Casual', isFree: false, platform: 'Steam', icon: Skull, news: 'Novos itens médicos e doenças.', optimization: 'Desative "Vignette" para ver melhor no escuro.', minReq: 'i5-4430, 8GB RAM, GTX 760', idealConfig: 'i7-8700, 16GB RAM, RTX 2060' },
  { id: 'sims4', name: 'The Sims 4', category: 'Casual', isFree: true, platform: 'Multi', icon: Users, news: 'Novo pacote de expansão focado em romance.', optimization: 'Mantenha o número de mods sob controle; eles pesam no loading.', minReq: 'i3-3220, 4GB RAM, Onboard', idealConfig: 'i5, 16GB RAM, GTX 1050' },
  { id: 'hollow', name: 'Hollow Knight: Silksong', category: 'Casual', isFree: false, platform: 'Steam', icon: Ghost, news: 'Ainda em desenvolvimento. Comunidade aguardando.', optimization: 'Deverá rodar bem em hardware básico como o primeiro jogo.', minReq: 'TBD', idealConfig: 'TBD' },
  { id: 'warframe', name: 'Warframe', category: 'RPG', isFree: true, platform: 'Steam', icon: Sword, news: 'Nova quest cinematográfica Lotus Eaters.', optimization: 'Use o modo DX12 para melhor performance em CPUs multicore.', minReq: 'i5, 8GB RAM, GTX 1050', idealConfig: 'i7, 16GB RAM, RTX 3060' },
  { id: 'terraria', name: 'Terraria', category: 'Casual', isFree: false, platform: 'Steam', icon: Box, news: 'Update 1.4.5 sendo finalizado.', optimization: 'Roda em qualquer máquina com pelo menos 4GB de RAM.', minReq: 'Qualquer Dual Core', idealConfig: 'Qualquer Quad Core' }
];

// Gerador de ícones baseado em tipo
function DynamicIcon({ type, ...props }: { type: any, [key: string]: any }) {
  const Icon = type;
  return <Icon {...props} />;
}

const GamesLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'Todos' | 'Competitivo' | 'Casual' | 'RPG' | 'Ferramenta'>('Todos');
  const [onlyFree, setOnlyFree] = useState(false);
  const [onlySteam, setOnlySteam] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const filteredGames = useMemo(() => {
    return GAMES_DATA.filter(game => {
      const matchCat = activeCategory === 'Todos' || game.category === activeCategory;
      const matchFree = onlyFree ? game.isFree : true;
      const matchSteam = onlySteam ? game.platform === 'Steam' : true;
      const matchSearch = game.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchFree && matchSteam && matchSearch;
    });
  }, [activeCategory, onlyFree, onlySteam, search]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
            Central de <span className="text-green-500">Jogos</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-2 max-w-xl leading-relaxed">
            Explorar requisitos, dicas de cada jogo e o "Jornal do Gamer"
          </p>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 backdrop-blur-md">
          {(['Todos', 'Competitivo', 'RPG', 'Casual', 'Ferramenta'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Filtros e Busca */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-green-500 transition-colors" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar jogo..."
            className="w-full bg-slate-900/40 border border-white/5 rounded-[2rem] py-5 pl-16 pr-8 text-sm outline-none focus:ring-2 focus:ring-green-500/30 focus:bg-slate-900/80 transition-all font-medium placeholder:text-slate-700 shadow-inner"
          />
        </div>
        <div className="lg:col-span-4 flex gap-2">
           <button 
             onClick={() => setOnlyFree(!onlyFree)}
             className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border font-bold text-[10px] uppercase tracking-widest transition-all ${
               onlyFree ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-slate-900/40 border-white/5 text-slate-500 hover:bg-slate-800'
             }`}
           >
             <DollarSign className="w-4 h-4" /> Grátis
           </button>
           <button 
             onClick={() => setOnlySteam(!onlySteam)}
             className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border font-bold text-[10px] uppercase tracking-widest transition-all ${
               onlySteam ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-slate-900/40 border-white/5 text-slate-500 hover:bg-slate-800'
             }`}
           >
             <Terminal className="w-4 h-4" /> Steam Only
           </button>
        </div>
      </div>

      {/* Grid de Jogos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div 
            key={game.id} 
            onClick={() => setSelectedGame(game)}
            className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 group cursor-pointer hover:border-green-500/40 transition-all hover:translate-y-[-4px] shadow-2xl relative overflow-hidden flex flex-col"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl shadow-inner ${
                game.category === 'Competitivo' ? 'bg-red-500/10 text-red-400' :
                game.category === 'RPG' ? 'bg-purple-500/10 text-purple-400' :
                game.category === 'Ferramenta' ? 'bg-blue-500/10 text-blue-400' :
                'bg-green-500/10 text-green-400'
              }`}>
                <DynamicIcon type={game.icon} className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${game.isFree ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                   {game.isFree ? 'Grátis' : 'Premium'}
                 </span>
                 <span className="text-[9px] font-mono text-slate-600 uppercase font-bold">{game.platform}</span>
              </div>
            </div>

            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2 group-hover:text-green-500 transition-colors">
              {game.name}
            </h3>
            <div className="flex items-center gap-2 text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-6">
              <Clock className="w-3 h-3" /> Jornal atualizado hoje
            </div>

            <div className="mt-auto flex items-center justify-between">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                 Abrir Informações <ChevronRight className="w-4 h-4 text-green-500" />
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Jornal de Info */}
      {selectedGame && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSelectedGame(null)}></div>
          <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh]">
            
            {/* Sidebar do Modal */}
            <div className="w-full md:w-80 bg-slate-950 p-8 flex flex-col border-r border-white/5">
              <div className="p-6 bg-green-500/10 rounded-[2rem] border border-green-500/20 mb-6 flex items-center justify-center">
                <DynamicIcon type={selectedGame.icon} className="w-16 h-16 text-green-400" />
              </div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 leading-tight">
                {selectedGame.name}
              </h2>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="bg-slate-800 text-slate-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {selectedGame.category}
                </span>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${selectedGame.isFree ? 'bg-green-500 text-slate-950' : 'bg-blue-600 text-white'}`}>
                  {selectedGame.isFree ? 'Grátis' : 'Premium'}
                </span>
              </div>
              
              <div className="mt-auto space-y-4">
                <button className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 uppercase italic tracking-tighter text-sm">
                  Baixar Oficial <ExternalLink className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="w-full bg-white/5 hover:bg-white/10 text-slate-400 font-bold py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest"
                >
                  Fechar Painel
                </button>
              </div>
            </div>

            {/* Conteúdo do Jornal */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Últimas do Jornal</h3>
                </div>
                <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5 border-l-4 border-l-blue-500">
                  <p className="text-slate-300 font-medium leading-relaxed italic">"{selectedGame.news}"</p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Otimização Turbo</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/20 p-6 rounded-3xl border border-white/5">
                    <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">Performance Boost</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{selectedGame.optimization}</p>
                  </div>
                  <div className="bg-slate-800/20 p-6 rounded-3xl border border-white/5">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Dica ITX Gamer</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">Verifique se o modo de jogo do Windows está ativo para este título.</p>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <HardDrive className="w-5 h-5 text-slate-500" />
                    <h3 className="text-sm font-black text-slate-300 italic uppercase tracking-tighter">Requisitos Mínimos</h3>
                  </div>
                  <div className="bg-black/20 p-6 rounded-3xl border border-white/5 font-mono text-xs text-slate-500 leading-relaxed">
                    {selectedGame.minReq}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-5 h-5 text-green-500" />
                    <h3 className="text-sm font-black text-green-500 italic uppercase tracking-tighter">Setup Ideal (Ultra)</h3>
                  </div>
                  <div className="bg-green-500/5 p-6 rounded-3xl border border-green-500/20 font-mono text-xs text-green-400 leading-relaxed shadow-inner">
                    {selectedGame.idealConfig}
                  </div>
                </div>
              </section>

              {/* Banner ITX Gamer */}
              <div className="p-8 bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h4 className="text-white font-black uppercase italic tracking-tighter text-lg mb-2">Upgrade na ITXGAMER?</h4>
                  <p className="text-slate-400 text-xs font-medium">Este jogo pede mais do que o seu PC aguenta? Fale com nossos consultores agora mesmo.</p>
                </div>
                <a href="https://www.itxgamer.com.br" target="_blank" className="bg-white text-indigo-950 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">Ver Promoções</a>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedGame(null)}
              className="absolute top-8 right-8 p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesLibrary;
