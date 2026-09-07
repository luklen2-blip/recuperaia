import { SegmentType } from '../types';

export interface SegmentInfo {
  id: SegmentType;
  label: string;
  icon: string;
  orderTerm: string;         // 'pedidos', 'consultas', 'atendimentos', 'compras'
  itemTerm: string;          // 'pratos', 'procedimentos', 'produtos', 'serviços'
  defaultOffer: string;      // 'Borda recheada grátis ou 15% OFF', 'Desconto especial'
  averageCycleDays: number;  // Ciclo médio padrão de recompra
}

export const SEGMENT_CONFIGS: Record<SegmentType, SegmentInfo> = {
  restaurant: {
    id: 'restaurant',
    label: 'Restaurante',
    icon: 'Utensils',
    orderTerm: 'pedidos',
    itemTerm: 'pratos',
    defaultOffer: 'Sobremesa cortesia ou 15% OFF no próximo almoço/jantar',
    averageCycleDays: 21,
  },
  pizzeria: {
    id: 'pizzeria',
    label: 'Pizzaria',
    icon: 'Pizza',
    orderTerm: 'pedidos',
    itemTerm: 'pizzas',
    defaultOffer: 'Borda recheada grátis ou refrigerante 2L de cortesia',
    averageCycleDays: 18,
  },
  burger: {
    id: 'burger',
    label: 'Hamburgueria',
    icon: 'Beef',
    orderTerm: 'pedidos',
    itemTerm: 'burgers e combos',
    defaultOffer: 'Batata frita rústica grátis no pedido',
    averageCycleDays: 14,
  },
  bakery: {
    id: 'bakery',
    label: 'Padaria & Confeitaria',
    icon: 'Croissant',
    orderTerm: 'compras',
    itemTerm: 'pães e doces',
    defaultOffer: 'Café expresso de presente na sua próxima visita',
    averageCycleDays: 7,
  },
  confectionery: {
    id: 'confectionery',
    label: 'Confeitaria Artesanal',
    icon: 'Cake',
    orderTerm: 'pedidos',
    itemTerm: 'bolos e doces',
    defaultOffer: '10% OFF na sua encomenda especial',
    averageCycleDays: 30,
  },
  beauty_salon: {
    id: 'beauty_salon',
    label: 'Salão de Beleza',
    icon: 'Sparkles',
    orderTerm: 'atendimentos',
    itemTerm: 'procedimentos',
    defaultOffer: 'Hidratação profunda de cortesia no corte ou coloração',
    averageCycleDays: 35,
  },
  barbershop: {
    id: 'barbershop',
    label: 'Barbearia',
    icon: 'Scissors',
    orderTerm: 'cortes',
    itemTerm: 'serviços',
    defaultOffer: 'Cerveja gelada + finalização premium de cortesia',
    averageCycleDays: 20,
  },
  clinic: {
    id: 'clinic',
    label: 'Clínica Médica',
    icon: 'Stethoscope',
    orderTerm: 'consultas',
    itemTerm: 'consultas e exames',
    defaultOffer: 'Checkup preventivo de retorno agendado com prioridade',
    averageCycleDays: 90,
  },
  dentistry: {
    id: 'dentistry',
    label: 'Odontologia',
    icon: 'Activity',
    orderTerm: 'consultas',
    itemTerm: 'tratamentos',
    defaultOffer: 'Profilaxia e limpeza semestral com condição exclusiva',
    averageCycleDays: 180,
  },
  physiotherapy: {
    id: 'physiotherapy',
    label: 'Fisioterapia & Pilates',
    icon: 'HeartPulse',
    orderTerm: 'sessões',
    itemTerm: 'sessões',
    defaultOffer: 'Avaliação postural de reavaliação gratuita',
    averageCycleDays: 30,
  },
  fitness: {
    id: 'fitness',
    label: 'Academia & Studio',
    icon: 'Dumbbell',
    orderTerm: 'mensalidades',
    itemTerm: 'planos e treinos',
    defaultOffer: '1 semana de treinos com amigo convidado grátis',
    averageCycleDays: 30,
  },
  pet_shop: {
    id: 'pet_shop',
    label: 'Pet Shop & Veterinária',
    icon: 'Dog',
    orderTerm: 'visitas',
    itemTerm: 'banhos e rações',
    defaultOffer: 'Tosa higiênica grátis no pacote de banho',
    averageCycleDays: 21,
  },
  auto_repair: {
    id: 'auto_repair',
    label: 'Oficina Mecânica',
    icon: 'Wrench',
    orderTerm: 'revisões',
    itemTerm: 'serviços',
    defaultOffer: 'Check-up de 25 itens e alinhamento cortesia na revisão',
    averageCycleDays: 180,
  },
  retail: {
    id: 'retail',
    label: 'Loja / Varejo',
    icon: 'ShoppingBag',
    orderTerm: 'compras',
    itemTerm: 'produtos',
    defaultOffer: 'Cupom de R$ 25 na sua próxima compra acima de R$ 100',
    averageCycleDays: 45,
  },
  services: {
    id: 'services',
    label: 'Prestador de Serviços',
    icon: 'Briefcase',
    orderTerm: 'contratos',
    itemTerm: 'serviços',
    defaultOffer: 'Diagnóstico técnico gratuito no seu próximo chamado',
    averageCycleDays: 60,
  },
  real_estate: {
    id: 'real_estate',
    label: 'Imobiliária',
    icon: 'Home',
    orderTerm: 'visitas',
    itemTerm: 'imóveis',
    defaultOffer: 'Curadoria exclusiva de imóveis abaixo do valor de mercado',
    averageCycleDays: 120,
  },
  education: {
    id: 'education',
    label: 'Escolas & Cursos',
    icon: 'GraduationCap',
    orderTerm: 'matrículas',
    itemTerm: 'cursos e oficinas',
    defaultOffer: 'Workshop gratuito e isenção de taxa de matrícula',
    averageCycleDays: 90,
  },
  other: {
    id: 'other',
    label: 'Outro Negócio',
    icon: 'Building2',
    orderTerm: 'pedidos',
    itemTerm: 'produtos/serviços',
    defaultOffer: 'Condição especial exclusiva para clientes cadastrados',
    averageCycleDays: 30,
  }
};

export const getSegmentInfo = (segment: SegmentType): SegmentInfo => {
  return SEGMENT_CONFIGS[segment] || SEGMENT_CONFIGS.other;
};
