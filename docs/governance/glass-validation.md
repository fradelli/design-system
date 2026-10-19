# Evidências do candidato de vidro — 19/10/2026

## Escopo

Fundação implementada na branch local `codex/shared-glass-foundation`, baseada em `origin/main` no commit `b302e0e`, versão base `0.4.0`. Não houve commit, push, PR, publicação ou migração de aplicativo nesta etapa.

A implementação inclui tokens, classes compartilhadas, Card glass/solid, CardTitle, SheetTitle, fundo de Input, exemplos, testes e documentação. A paleta, os peers e os comportamentos de domínio permanecem fora desta mudança.

## Verificações recebidas

| Verificação                                | Resultado                                                                             |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| Instalação limpa `npm ci --ignore-scripts` | Passou após encerrar o servidor local que mantinha esbuild aberto no Windows          |
| `npm run ci`                               | Passou, incluindo todos os gates abaixo                                               |
| Formato, lint e tipos                      | Passaram                                                                              |
| Testes unitários                           | 37 passaram em 13 arquivos                                                            |
| Tokens                                     | Geração e verificação determinística passaram                                         |
| Build do Storybook                         | Passou; há aviso de tamanho dos chunks do catálogo                                    |
| Testes Storybook Chromium                  | 18 passaram em quatro arquivos, incluindo verificações de acessibilidade configuradas |
| Empacotamento                              | Build, publint e resolução de tipos nos modos suportados passaram                     |
| Fixtures npm/pnpm                          | Instalação, tipos, CSS e smoke passaram com uma única versão de React                 |
| Auditoria do repositório do pacote         | Zero vulnerabilidades após correções compatíveis                                      |
| Whitespace e padrões de segredos           | Revisados nos arquivos alterados, incluindo novos                                     |

O exemplo final de sobrescrita foi reforçado para usar o vidro padrão. Formato, build do Storybook e seus testes foram repetidos após esse ajuste. O CSS compilado comprova blur de 12px, raio de 16px, padding horizontal de 24px, título de 20px, sobrescrita por classes do consumidor, associação de erro ao campo, teclado e opt-out opaco.

Os novos estilos compartilhados ficam na camada CSS de componentes para que as utilities do consumidor tenham prioridade. A configuração de testes em navegador agora inclui o plugin Tailwind que já era usado no build; antes disso, o teste não exercitava as utilities compiladas.

## Correções necessárias para validar a base

A instalação inicial revelou duas dependências transitivas de desenvolvimento vulneráveis, já presentes na base:

| Pacote        | Antes  | Depois | Caminho e evidência                                              |
| ------------- | ------ | ------ | ---------------------------------------------------------------- |
| shell-quote   | 1.10.0 | 1.12.0 | Changesets → launch-editor; GHSA-pqg4-j6r4-53mv, crítico         |
| source-map-js | 1.2.1  | 1.2.2  | jsdom/css-tree e ferramentas Tailwind; GHSA-68fv-2mgg-jv7q, alto |

A simulação indicou somente essas duas atualizações compatíveis. Foram aplicadas pelo npm, sem overrides, edição manual do lockfile ou mudança no manifesto. O npm também alinhou a versão raiz do lockfile, que ainda declarava 0.3.0, à versão 0.4.0 já existente no manifesto da base. A instalação limpa e os gates foram repetidos.

## Pendências e limites

- O ambiente temporário npm-consumer tem quatro achados altos ligados a `@tailwindcss/cli` → `@parcel/watcher` → `micromatch` → `braces` (GHSA-vfj7-8cjw-p6xm). A auditoria dessa fixture foi consultada separadamente. O gate existente valida instalação e funcionamento, não executa uma auditoria obrigatória de cada fixture. Esses avisos não foram ocultados e não significam quatro vulnerabilidades no artefato distribuído. A correção exige avaliação própria da ferramenta; não foi aplicado audit fix com force.
- Falta validar o candidato nas telas reais de portfólio, Kaizen e Sandicts. Fixtures genéricas não substituem os consumidores.
- Faltam comparação visual aprovada, inventário final dos overrides, responsividade completa, zoom, desempenho e verificações em Firefox/WebKit.
- O fallback por preferência e por atributo está implementado; o teste Chromium confirma o atributo explícito. Não se declara teste automatizado de todas as preferências do sistema ou de navegadores sem suporte.
- Texto secundário sobre fundos claros pode exigir a superfície elevada ou opaca. A cobertura atual não garante contraste para qualquer imagem futura.
- Publicação deve aguardar as evidências de consumo e a revisão do conjunto. Não há versão nova publicada.

## Próxima etapa

Revisar os exemplos locais e usar o artefato candidato para comparar primeiro o portfólio com sua aparência aprovada. Migrar consumidores em entregas separadas, seguindo o guia de migração e o fluxo de cada repositório.

## Revisão posterior de consistência

A revisão posterior substitui os exemplos isolados de Glass pelo catálogo por família e corrige defeitos de geometria não cobertos pelos checks iniciais. As [evidências de padronização](component-consistency-validation.md) registram os novos contratos, testes em três navegadores e limites atuais. O texto anterior permanece como histórico da primeira etapa.
