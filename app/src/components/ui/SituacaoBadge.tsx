import { CheckCircle2, ClipboardList, FileClock, Hammer, PauseCircle, type LucideIcon } from 'lucide-react';
import type { SituacaoIntervencao } from '../../types';

interface SituacaoConfig {
  classes: string;
  Icon: LucideIcon;
  /**
   * Mesmo valor de `text-situacao-*` do tema, repetido como hex porque Recharts
   * e Leaflet recebem cor por propriedade JS, não por classe CSS. É a única
   * duplicação de cor que sobrou, e é deliberada.
   */
  hex: string;
}

// As 5 situações declaradas pelos órgãos na página oficial do IRM. Cada uma tem
// cor + ícone + texto — a situação nunca é comunicada só por cor (WCAG 2.2 AA).
// Famílias: licitação/pré-contratual → cinza-azulado e âmbar; execução → azul;
// próximo do fim → verde; pendente de terceiro → vermelho-tijolo.
const situacaoConfig: Record<SituacaoIntervencao, SituacaoConfig> = {
  'Em licitação': {
    classes: 'bg-situacao-licitacao-bg text-situacao-licitacao border-situacao-licitacao-borda',
    Icon: ClipboardList,
    hex: '#40506b',
  },
  'Em andamento': {
    classes: 'bg-situacao-andamento-bg text-situacao-andamento border-situacao-andamento-borda',
    Icon: Hammer,
    hex: '#0b3a63',
  },
  'Conclusão em breve': {
    classes: 'bg-situacao-conclusao-bg text-situacao-conclusao border-situacao-conclusao-borda',
    Icon: CheckCircle2,
    hex: '#1f7a5c',
  },
  'Baixa de cláusula suspensiva': {
    classes: 'bg-situacao-clausula-bg text-situacao-clausula border-situacao-clausula-borda',
    Icon: FileClock,
    hex: '#8a5a12',
  },
  'Aguardando manifestação': {
    classes: 'bg-situacao-aguardando-bg text-situacao-aguardando border-situacao-aguardando-borda',
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
