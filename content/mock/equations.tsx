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

export const MOCK_EQUATIONS: DocumentData = {
  slug: 'equacoes',
  title: 'Equações de Desempenho do Motor',
  author: 'Equipe de Engenharia',
  lastEdited: '2026-05-27',
  group: 'Equações',
  version: 'v0.1.5',
  readingTime: '3 min',
  tags: ['Matemática', 'Física', 'Termodinâmica'],
  index: [
    { title: 'Equação de Empuxo', slug: 'equacao-empuxo' },
    { title: 'Taxa de Queima', slug: 'taxa-queima' },
    { title: 'Impulso Específico', slug: 'impulso-especifico' }
  ],
  content: `
# Equação de Empuxo
<a id="equacao-empuxo"></a>

O empuxo produzido por um motor-foguete a propelente sólido é dado por:

$$
F = \\dot{m} \\cdot V_e + (P_e - P_a) \\cdot A_e
$$

Onde:
- **$F$** = Força de empuxo (N)
- **$\\dot{m}$** = Taxa de fluxo de massa (kg/s)  
- **$V_e$** = Velocidade de exaustão (m/s)
- **$P_e$** = Pressão de saída (Pa)
- **$P_a$** = Pressão ambiente (Pa)
- **$A_e$** = Área de saída (m²)

# Taxa de Queima
<a id="taxa-queima"></a>

A taxa de queima de um propelente sólido segue a lei de Vieille (frequentemente associada a Saint-Venant):

$$
r = a \\cdot P_c^n
$$

Onde:
- **$r$** = Taxa de queima (mm/s)
- **$a$** = Coeficiente da taxa de queima
- **$P_c$** = Pressão da câmara (MPa)
- **$n$** = Expoente de pressão

# Impulso Específico
<a id="impulso-especifico"></a>

O Impulso Específico mede a eficiência do motor em gerar empuxo por quantidade de propelente consumido:

$$
I_{sp} = \\frac{F}{\\dot{m} \\cdot g_0}
$$

Onde **$g_0$** = 9.80665 m/s² (aceleração da gravidade padrão).
  `
};