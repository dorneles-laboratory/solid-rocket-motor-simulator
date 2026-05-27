interface DocumentData {
  slug: string;
  title: string;
  author: string;
  lastEdited: string;
  group: string;
  version: string;
  readingTime: string;
  tags: string[];
  content: string;
  index: { title: string; slug: string }[];
}

export const MOCK_GETTING_STARTED: DocumentData = {
  slug: 'primeiros-passos',
  title: 'Primeiros Passos com o SRM TAU',
  author: 'Equipe de Engenharia',
  lastEdited: '2026-05-26',
  group: 'Começando',
  version: 'v0.1.5',
  readingTime: '2 min',
  tags: ['Tutorial', 'Início Rápido', 'Fundamentos'],
  index: [
    { title: 'Bem-vindo', slug: 'bem-vindo' },
    { title: 'Início Rápido', slug: 'inicio-rapido' },
    { title: 'Conceitos Principais', slug: 'conceitos-principais' },
    { title: 'Unidades', slug: 'unidades' }
  ],
  content: `
# Bem-vindo
<a id="bem-vindo"></a>

Bem-vindo ao Solid Rocket Motor **(SRM)**, uma suíte de simulação termoquímica para o design de motores-foguete a propelente sólido.

# Início Rápido
<a id="inicio-rapido"></a>

1. **Criar um Novo Projeto** — Clique em "Novo Projeto" na barra lateral para iniciar o design de um novo motor.
2. **Definir a Geometria da Carcaça** — Insira o diâmetro e o comprimento da câmara na grade de propriedades.
3. **Configurar o Grão Propelente** — Defina o diâmetro externo, o diâmetro do núcleo e o comprimento do grão.
4. **Projetar o Bocal** — Especifique o diâmetro da garganta e os ângulos de convergência e divergência.
5. **Executar a Simulação** — Clique em "Executar Simulação" para calcular as métricas de desempenho.

# Conceitos Principais
<a id="conceitos-principais"></a>

* **Carcaça (Casing):** O invólucro do motor que contém o propelente e suporta a pressão estrutural da câmara.
* **Grão Propelente:** A mistura sólida de combustível e oxidante que queima para produzir empuxo.
* **Bocal (Nozzle):** A seção convergente-divergente projetada para acelerar os gases de exaustão.

# Unidades
<a id="unidades"></a>

Todas as dimensões físicas estão em **milímetros (mm)** por padrão. As medições de pressão são expressas em **MPa**, e as forças em **Newtons (N)**.
  `
};