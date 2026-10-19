# Evidências da padronização de componentes — 19/10/2026

## Entrega local

Implementação na branch `codex/shared-glass-foundation`, preservando o candidato anterior. O pacote continua em `0.4.0` até o fluxo de Changesets definir a versão. Nenhuma publicação, PR, commit ou migração de aplicativo foi executada nesta etapa.

A ADR 0002 existente, sobre primitives nativos, foi preservada. Os novos registros de vidro e composição são as ADRs 0003 e 0004, eliminando a colisão de numeração no candidato não publicado.

## Resultado por achado

| Achado                         | Implementação e evidência                                                                                                                                                                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Card sem recuo lateral         | Raiz com padding por densidade, gerado por tokens; slots sem duplicação. LayoutContracts compara glass/solid, padrão/compacto, título direto, entrelinha e geometria.                                                                                                           |
| Alert sobreposto               | Coluna de conteúdo e fluxo explícitos com/sem ícone; ação em linha reservada. Testadas cinco variantes, texto longo, ausência de título/descrição e caixas sem interseção.                                                                                                      |
| PendingButton comprimido       | Estados sobrepostos em grid participam do dimensionamento; spinner não encolhe. Testados recuos em quatro tamanhos, troca de estado sem salto de largura e nome acessível. Tamanhos de ícone têm exemplo próprio.                                                               |
| Sheet fechado e lado incorreto | Display condicionado a open e reset de insets por lado. Testados quatro lados, fechamento, ocultação e retorno do foco.                                                                                                                                                         |
| Confirmação sem separação      | Content organiza regiões com gap; título usa papel de painel; altura limitada e rolagem. Testados intervalo após animação, foco inicial seguro, cancelamento e retorno.                                                                                                         |
| Switch sem fundo marcado       | Referência corrigida para a chave de cor do tema. Story controlada interativa testa estado e cor computada após transição.                                                                                                                                                      |
| Badge esticado                 | Altura intrínseca, alinhamento e texto quebrável. Testados vizinho mais alto e rótulo extenso.                                                                                                                                                                                  |
| Tipografia divergente          | Papéis completos de display, seção, card, corpo, interface e rótulo; tema mapeia utilitários de interface para tokens. Foundations demonstra os papéis efetivos.                                                                                                                |
| Demais famílias                | Label com entrelinha; Field com recuos, min-width e separador sem remendo opaco; RadioGroup com aparência base, uma entrada por Tab e validade nativa required corrigida; Popover com cálculo puro, limites e observação de resize/scroll; Slot mescla classes, eventos e refs. |

## Catálogo

18 famílias em pastas próprias sob `src/stories/components/`, organizadas alfabeticamente em Components. Foundations apresenta tokens e materiais; Patterns contém o formulário de integração. Glass é superfície de Card, não uma família paralela. O catálogo tem 49 stories após os exemplos adicionais de tamanhos de ícone.

## Verificações executadas

- `npm run ci` passou: formato, lint, tipos, 41 testes unitários em 15 arquivos, verificação determinística de tokens, build do Storybook, 46 stories no Chromium, build do pacote, allowlist, publint, resolução de tipos e fixtures npm/pnpm com um único React.
- Auditoria do repositório do pacote: zero vulnerabilidades.
- Catálogo de 46 stories: 138 cenários passaram em Chromium, Firefox e WebKit a 1280 px e outros 138 a 320 px.
- Cenários críticos de Card, Alert/AlertDialog, Sheet, PendingButton, Popover e Field: 57 cenários passaram a 375 px e 57 a 768 px, nos três navegadores.
- Os exemplos finais de Button/PendingButton com ícone passaram nos três navegadores a 320 px: 24 cenários. Lint, tipos, build do catálogo e tarball foram repetidos após essa inclusão.
- Revisão visual no Storybook confirmou alertas sem sobreposição, catálogo por família e recuos de Card. A verificação automática de acessibilidade está habilitada; no material translúcido há resultado inconclusivo que exige avaliação humana de contraste sobre o fundo real.
- `git diff --check` e busca de padrões de segredos, whitespace residual e caracteres inválidos abrangem arquivos novos e modificados.

As verificações geométricas aguardam o estado final das animações. A allowlist do tarball inclui os quatro arquivos emitidos dos dois módulos internos de posicionamento; eles não viram novos subpaths públicos. O build do Storybook mantém avisos de tamanho de chunks do próprio catálogo.

## Compatibilidade verificada por leitura

No portfólio, a camada local de vidro já acrescenta padding e o formulário de contato contém `px-0` e slots internos. Esses usos precisam de migração coordenada com o upgrade, para não perder o recuo do formulário. O portfólio permanece em sua versão instalada; a revisão não modificou seu código nem seu lockfile. As árvores de Kaizen e Sandicts não foram modificadas.

## Limites antes da publicação

- Revisão humana com Inter efetivamente carregada, leitor de tela e zoom real de 200%. O preview declara fallback de sistema; não é evidência de carregamento de Inter em todos os ambientes.
- Comparação e aceite nas telas reais dos consumidores, especialmente overrides de padding e altura; medição de desempenho nas composições reais.
- Contraste sobre fundos específicos, preferências do sistema e fallback em ambientes sem suporte, além dos testes já existentes para opt-out por atributo.
- A navegação sem seleção inicial e com item disabled foi verificada. O cenário adicional RequiredForm passou nos três navegadores (9 cenários da família), conferindo required sem seleção, foco de erro no primeiro item visível e FormData após selecionar. Isso não substitui revisão de mensagens localizadas com leitor de tela.
- A fixture npm-consumer ainda informa quatro achados altos na ferramenta `@tailwindcss/cli` e sua árvore. Esse aviso já estava documentado; o gate funcional não equivale à auditoria limpa da fixture. Não se aplicou correção forçada ou override sem avaliação.

Essas pendências não foram convertidas em alegações de aprovação. A publicação e as migrações continuam etapas próprias, após revisão do candidato.

## Correção adicional confirmada por cenário nativo

RequiredForm reproduziu validade indevidamente positiva nos três navegadores antes da correção: `readOnly` nos inputs internos retirava a participação na validação. Os inputs agora usam onChange para atualizar o grupo; invalid mantém foco no controle visível. A regressão passou em Chromium, Firefox e WebKit. O cenário passou nos três navegadores; o gate completo inclui a regressão.

## Foco sem duplicação

Controles com indicador próprio usam a marca interna de estilo `fd-focus-managed`, e o outline global fica como fallback para os demais elementos. Isso evita somar outline e ring no mesmo controle. Input mantém ring visível sem reduzir sua cor a 30%; estado inválido preserva a cor de erro. CompiledStyles confirmou outline ausente e ring presente no campo focado nos três navegadores (18 cenários da família Card).

## Encerramento técnico

A repetição final de `npm run ci` passou com `DS_BROWSERS=chromium,firefox,webkit` e `DS_VIEWPORT_WIDTH=320`: 41 testes unitários, 147 cenários de Storybook (49 por navegador), geração/verificação de tokens, build, tarball, fixtures npm/pnpm e auditoria do repositório com zero achados. A revisão final abrangeu 58 arquivos novos/alterados, sem padrões de segredos, caracteres inválidos ou whitespace residual; links relativos dos documentos novos foram conferidos.

O último ajuste foi apenas de metadados do catálogo: galerias comparativas não exibem controles sem efeito; os controles ficam nos Playgrounds editáveis. Lint, tipos e build do Storybook passaram novamente após esse ajuste, sem mudanças adicionais no artefato da biblioteca.

O candidato está pronto para revisão local, com as pendências de publicação e de validação humana explicitadas acima.

## Idioma do catálogo — revisão de 19/10/2026

Todos os exemplos visíveis do Storybook foram uniformizados em inglês. Foram traduzidos os casos restantes de PendingButton, Alert, Badge, Card, Label e Popover, mantendo conteúdo longo para exercitar a composição. O teste do botão agora espera Saving changes e continua verificando estabilidade de largura.

Passaram formato, lint, tipos, 20 testes dos exemplos afetados em Chromium, build do Storybook e git diff --check. A inspeção do exemplo Interactive confirmou Pending state e Saving changes. A busca pelos textos portugueses remanescentes no diretório de stories não encontrou ocorrências. A alteração é restrita ao catálogo/testes, sem mudança de API ou artefato público da biblioteca.
