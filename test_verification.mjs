import { calculateReturnProbability, classifyCustomerSegment, calculateDaysSince } from './src/lib/rfmEngine.ts';
import { generateDemoCustomers, DEMO_CAMPAIGNS, DEMO_AUTOMATIONS } from './src/lib/demoData.ts';
import { generateTenantAiInsights, generateCampaignWithAi, calculateCommercialPotential } from './src/lib/aiEngine.ts';

console.log('=== INICIANDO BATERIA DE TESTES DE INTEGRIDADE DO RECUPERAIA ===\n');

// TESTE 1: Motor RFM & Probabilidade de Retorno
console.log('1. Testando Motor RFM e Probabilidade de Retorno...');
const prob1 = calculateReturnProbability(15, 6, 450, 18);
const seg1 = classifyCustomerSegment(15, 6, 450, prob1);
console.log(`   - Cliente Frequente (15 dias, 6 pedidos, R$ 450): Probabilidade=${prob1}%, Segmento=${seg1}`);
if (seg1 !== 'vip') throw new Error('Falha no teste VIP!');

const prob2 = calculateReturnProbability(65, 2, 140, 18);
const seg2 = classifyCustomerSegment(65, 2, 140, prob2);
console.log(`   - Cliente Inativo (65 dias, 2 pedidos, R$ 140): Probabilidade=${prob2}%, Segmento=${seg2}`);
if (seg2 !== 'inactive') throw new Error('Falha no teste Inativo!');

const prob3 = calculateReturnProbability(98, 1, 75, 18);
const seg3 = classifyCustomerSegment(98, 1, 75, prob3);
console.log(`   - Cliente Perdido (98 dias, 1 pedido, R$ 75): Probabilidade=${prob3}%, Segmento=${seg3}`);
if (seg3 !== 'lost') throw new Error('Falha no teste Perdido!');

// TESTE 2: Geração da Base Demo (Pizzaria Bella Massa)
console.log('\n2. Testando Base Demonstrativa (~500 clientes da Pizzaria Bella Massa)...');
const demoCustomers = generateDemoCustomers();
console.log(`   - Total de clientes gerados: ${demoCustomers.length}`);
if (demoCustomers.length !== 500) throw new Error(`Esperado 500 clientes, obtido ${demoCustomers.length}`);

const inactives = demoCustomers.filter(c => c.segment === 'inactive');
const vips = demoCustomers.filter(c => c.segment === 'vip');
const atRisk = demoCustomers.filter(c => c.segment === 'at_risk');
const highOpp = demoCustomers.filter(c => c.segment === 'high_opportunity');
const news = demoCustomers.filter(c => c.segment === 'new');
const lost = demoCustomers.filter(c => c.segment === 'lost');

console.log(`   - Distribuição RFM Realista:`);
console.log(`     * Inativos: ${inactives.length}`);
console.log(`     * VIP: ${vips.length}`);
console.log(`     * Em Risco: ${atRisk.length}`);
console.log(`     * Alta Oportunidade: ${highOpp.length}`);
console.log(`     * Novos: ${news.length}`);
console.log(`     * Perdidos: ${lost.length}`);

// TESTE 3: Regra de Honestidade da IA (Requisito 11 e 27)
console.log('\n3. Testando Regra de Honestidade da Inteligência RecuperaIA...');
const emptyInsights = generateTenantAiInsights([], [], 'pizzeria');
console.log(`   - Base vazia: hasSufficientData=${emptyInsights.hasSufficientData}`);
console.log(`   - Mensagem de transparência: "${emptyInsights.message}"`);
if (emptyInsights.hasSufficientData !== false) throw new Error('IA deve recusar gerar dados inventados em base vazia!');

const realInsights = generateTenantAiInsights(demoCustomers, DEMO_CAMPAIGNS, 'pizzeria');
console.log(`   - Base preenchida: hasSufficientData=${realInsights.hasSufficientData}`);
console.log(`   - Quantidade de diagnósticos gerados: ${realInsights.insights.length}`);
if (realInsights.insights.length < 3) throw new Error('IA deveria gerar insights para base completa!');

// TESTE 4: Assistente Criador de Campanhas com IA
console.log('\n4. Testando Criador de Campanhas com IA (Requisito 13)...');
const campaignAi = generateCampaignWithAi({
  objective: 'Recuperar clientes que não compram há 60 dias',
  segmentType: 'pizzeria',
  targetAudience: 'inactive'
});
console.log(`   - Título sugerido: "${campaignAi.title}"`);
console.log(`   - Horário ideal: "${campaignAi.bestSendTime}"`);
console.log(`   - Preview do texto com variáveis:\n     "${campaignAi.messageTemplate.split('\n')[0]}"`);
if (!campaignAi.messageTemplate.includes('{nome}') || !campaignAi.messageTemplate.includes('{dias_sem_comprar}')) {
  throw new Error('Template da IA deve incluir variáveis {nome} e {dias_sem_comprar}!');
}

// TESTE 5: Calculadora Comercial e Disclaimer Obrigatório (Requisito 28)
console.log('\n5. Testando Calculadora Comercial e Disclaimer Obrigatório (Requisito 28)...');
const sim = calculateCommercialPotential({
  customerCount: 2000,
  averageTicket: 80,
  inactivePercentage: 30
});
console.log(`   - Inativos simulados: ${sim.inactiveCount}`);
console.log(`   - Dinheiro deixado na mesa: R$ ${sim.inactiveMoneyTotal.toLocaleString('pt-BR')}`);
console.log(`   - Recuperação projetada 2%: R$ ${sim.recoveredRevenue2Pct.toLocaleString('pt-BR')} (${sim.recoveredCount2Pct} clientes)`);
console.log(`   - Disclaimer obrigatório: "${sim.disclaimer.substring(0, 50)}..."`);
if (!sim.disclaimer.includes('ESTIMATIVA — NÃO É GARANTIA DE RESULTADO')) {
  throw new Error('Disclaimer obrigatório ausente!');
}

console.log('\n=============================================================');
console.log('✅ TODOS OS TESTES PASSARAM COM 100% DE SUCESSO E CONFORMIDADE!');
console.log('=============================================================');
