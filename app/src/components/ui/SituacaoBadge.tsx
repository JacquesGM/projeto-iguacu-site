import { CheckCircle2, ClipboardList, Hammer, PauseCircle, type LucideIcon } from 'lucide-react';
import type { SituacaoIntervencao } from '../../types';

interface SituacaoConfig {
  classes: string;
  Icon: LucideIcon;
  /** Cor sólida equivalente (mesmo hex do texto da etiqueta), para uso nos gráficos. */
  hex: string;
}

// Os 4 status vêm da extração BI/INFOVIA (Dados_BI.xlsx) — vocabulário real,
// não mais os 8 valores hipotéticos do prompt original. Cores mantidas na
// mesma família das etiquetas anteriores (planejamento→cinza-azulado,
// execução→azul, concluído→verde, suspenso→vermelho) para continuidade
// visual, sempre com ícone + texto (nunca cor isolada).
const situacaoConfig: Record<SituacaoIntervencao, SituacaoConfig> = {
  'Fase de Projeto': {
    classes: 'bg-[#eef1f6] text-[#40506b] border-[#c3cbdb]',
    Icon: ClipboardList,
    hex: '#40506b',
  },
  'Em Execução': {
    classes: 'bg-brand-blue-50 text-brand-blue-800 border-[#bcdcef]',
    Icon: Hammer,
    hex: '#0b3a63',
  },
  'Concluído': {
    classes: 'bg-brand-green-50 text-brand-green-700 border-[#a9e0c6]',
    Icon: CheckCircle2,
    hex: '#1f7a5c',
  },
  'Suspenso': {
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
