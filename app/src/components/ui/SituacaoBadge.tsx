import {
  CheckCircle2,
  Clock,
  ClipboardList,
  FileClock,
  Gavel,
  Hammer,
  HelpCircle,
  PauseCircle,
  type LucideIcon,
} from 'lucide-react';
import type { SituacaoIntervencao } from '../../types';

interface SituacaoConfig {
  classes: string;
  Icon: LucideIcon;
  /** Cor sólida equivalente (mesmo hex do texto da etiqueta), para uso nos gráficos. */
  hex: string;
}

// Cores portadas 1:1 de css/styles.css (.etiqueta--*) do protótipo estático original,
// para que o badge e os gráficos usem exatamente a mesma cor para a mesma situação.
// validate_palette.js reprova este conjunto como paleta categórica livre (algumas
// cores abaixo do piso de croma, par paralisada/atrasada com ΔE baixo) — mas aqui
// as cores são um "status palette" institucional já fixado (badge com ícone + texto
// em todo o site, nunca cor isolada), não uma paleta nova a ser escolhida; manter os
// hex existentes preserva a identidade visual do protótipo aprovado.
const situacaoConfig: Record<SituacaoIntervencao, SituacaoConfig> = {
  'Em planejamento': {
    classes: 'bg-[#eef1f6] text-[#40506b] border-[#c3cbdb]',
    Icon: ClipboardList,
    hex: '#40506b',
  },
  'Em licitação': {
    classes: 'bg-[#f1e7fb] text-[#5b2d90] border-[#d9c0ef]',
    Icon: Gavel,
    hex: '#5b2d90',
  },
  'Em execução': {
    classes: 'bg-brand-blue-50 text-brand-blue-800 border-[#bcdcef]',
    Icon: Hammer,
    hex: '#0b3a63',
  },
  'Concluída': {
    classes: 'bg-brand-green-50 text-brand-green-700 border-[#a9e0c6]',
    Icon: CheckCircle2,
    hex: '#1f7a5c',
  },
  'Atrasada': {
    classes: 'bg-[#fef0dc] text-[#8a5300] border-[#f0cf94]',
    Icon: Clock,
    hex: '#8a5300',
  },
  'Paralisada': {
    classes: 'bg-[#fbe6e6] text-[#9c2b2b] border-[#f0bcbc]',
    Icon: PauseCircle,
    hex: '#9c2b2b',
  },
  'Aguardando informação': {
    classes: 'bg-[#f1f1f1] text-[#555555] border-[#d8d8d8]',
    Icon: HelpCircle,
    hex: '#555555',
  },
  'Aguardando validação': {
    classes: 'bg-[#fdf6d8] text-[#7a5c00] border-[#eaddaa]',
    Icon: FileClock,
    hex: '#7a5c00',
  },
};

export function SituacaoBadge({ situacao, className = '' }: { situacao: SituacaoIntervencao; className?: string }) {
  const config = situacaoConfig[situacao];
  if (!config) return null;
  const { classes, Icon } = config;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${classes} ${className}`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {situacao}
    </span>
  );
}

export function situacaoColorHex(situacao: SituacaoIntervencao): string {
  return situacaoConfig[situacao]?.hex ?? '#555555';
}

export function situacaoIcon(situacao: SituacaoIntervencao): LucideIcon {
  return situacaoConfig[situacao]?.Icon ?? HelpCircle;
}

export const SITUACOES_VALIDAS = Object.keys(situacaoConfig) as SituacaoIntervencao[];
