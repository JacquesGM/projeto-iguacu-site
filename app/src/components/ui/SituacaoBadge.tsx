import { CheckCircle2, ClipboardList, FileClock, Hammer, PauseCircle, type LucideIcon } from 'lucide-react';
import type { SituacaoIntervencao } from '../../types';

interface SituacaoConfig {
  classes: string;
  Icon: LucideIcon;
  /** Cor sólida equivalente (mesmo hex do texto da etiqueta), para uso nos gráficos. */
  hex: string;
}

// As 5 situações declaradas pelos órgãos na página oficial do IRM. Cada uma tem
// cor + ícone + texto — a situação nunca é comunicada só por cor (WCAG 2.2 AA).
// Famílias: licitação/pré-contratual → cinza-azulado e âmbar; execução → azul;
// próximo do fim → verde; pendente de terceiro → vermelho-tijolo.
const situacaoConfig: Record<SituacaoIntervencao, SituacaoConfig> = {
  'Em licitação': {
    classes: 'bg-[#eef1f6] text-[#40506b] border-[#c3cbdb]',
    Icon: ClipboardList,
    hex: '#40506b',
  },
  'Em andamento': {
    classes: 'bg-brand-blue-50 text-brand-blue-800 border-[#bcdcef]',
    Icon: Hammer,
    hex: '#0b3a63',
  },
  'Conclusão em breve': {
    classes: 'bg-brand-green-50 text-brand-green-700 border-[#a9e0c6]',
    Icon: CheckCircle2,
    hex: '#1f7a5c',
  },
  'Baixa de cláusula suspensiva': {
    classes: 'bg-[#fdf3e3] text-[#8a5a12] border-[#eccf9c]',
    Icon: FileClock,
    hex: '#8a5a12',
  },
  'Aguardando manifestação': {
    classes: 'bg-[#fbe6e6] text-[#9c2b2b] border-[#f0bcbc]',
    Icon: PauseCircle,
    hex: '#9c2b2b',
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
  return situacaoConfig[situacao]?.Icon ?? ClipboardList;
}

export const SITUACOES_VALIDAS = Object.keys(situacaoConfig) as SituacaoIntervencao[];
