---
title: Plano de implementação da KAN-220
doc-type: implementation-guide
status: implemented
last-reviewed: 2026-09-08
owners:
  - frontend
  - design-system
related-issue: KAN-220
related-repository: fradelli/design-system
---

# KAN-220 — primitives compartilhados e portabilidade do package

## Status do documento

- **Card:** `KAN-220 — [Design System] Migrate and test shared UI primitives`.
- **Repositório:** [fradelli/design-system](https://github.com/fradelli/design-system).
- **Branch proposta:** `codex/KAN-220-shared-primitives`.
- **Base:** `main`, depois dos merges da KAN-222 e da KAN-221.
- **Prontidão técnica:** implementada e validada localmente.
- **Prontidão para execução:** concluída em `codex/KAN-220-shared-primitives`, empilhada sobre a KAN-221.
- **Fonte dos contratos:** componentes em produção no Sandicts, ADR 0001 e checklist de admissão.
- **Fora do escopo:** adoção no Sandicts/Kaizen, calendário, shell, navegação, páginas,
  `PageState`, `PendingButton`, `StatusBadge` e qualquer significado de domínio.

## Resultado esperado

O package publicará `cn`, `Alert`, `Badge`, `Button`, `Card`, `Field`, `Input`, `Label`,
`Separator`, `Sheet` e `Skeleton` por subpaths explícitos. As APIs partirão dos componentes já
validados no Sandicts, com nomes visuais e sem imports de rota, autenticação, i18n, providers,
schemas ou DTOs.

O tarball será a unidade real de validação. As fixtures npm e pnpm importarão todos os subpaths,
renderizarão primitives estáticos no servidor, montarão o `Sheet` em DOM e processarão as classes
Tailwind com `@source` apontando para o artefato instalado.

## Decisões arquiteturais

### 1. Subpaths são a API pública

Os consumidores importarão diretamente:

```tsx
import { Button } from "@fradelli/ui/button";
import { Field, FieldDescription, FieldLabel } from "@fradelli/ui/field";
import { Input } from "@fradelli/ui/input";
import { cn } from "@fradelli/ui/cn";
```

`@fradelli/ui` continuará sem reexportar o catálogo. Isso impede que um import de conveniência
misture boundaries de cliente e servidor e torna explícito qual primitive entrou no bundle.

### 2. Código validado é migrado; semântica de produto não é

O ponto de partida é a implementação atual de
`apps/reactjs-sandicts-web/src/components/ui`. A migração conserva variantes e composição pública,
mas realiza estas adaptações obrigatórias:

- substituir aliases `@/` por imports relativos com extensão `.js`;
- trocar tokens locais por aliases `--fd-*`/Tailwind definidos pela KAN-221;
- remover `dark:` redundante, pois o primeiro release é dark-first;
- manter copy no consumidor, inclusive `closeLabel` obrigatório no `SheetContent`;
- não adicionar props `product`, `sport`, `routine`, `status` ou equivalentes;
- não migrar wrappers compartilhados do Sandicts.

### 3. Dependências Radix granulares

Usar `@radix-ui/react-slot`, `@radix-ui/react-label`, `@radix-ui/react-separator` e
`@radix-ui/react-dialog` em vez do package agregador `radix-ui`. Assim, cada subpath carrega apenas
o comportamento necessário. `@phosphor-icons/react` fornece o ícone de fechar do `Sheet`;
`class-variance-authority`, `clsx` e `tailwind-merge` sustentam variantes e `cn`.

Esses packages são dependências de runtime de `@fradelli/ui`. React e React DOM permanecem apenas
em `peerDependencies` e `devDependencies`.

### 4. Boundary de cliente mínimo e verificável

Somente arquivos que dependem de primitives Radix com comportamento no browser recebem
`"use client"`: `Label`, `Separator` e `Sheet`. `Alert`, `Badge`, `Button`, `Card`, `Field`,
`Input` e `Skeleton` não recebem a diretiva. `Button` e `Badge` preservam `asChild` por meio de
`Slot`, sem transformar o catálogo inteiro em um único entrypoint de cliente.

Um teste inspeciona os arquivos emitidos e falha se a diretiva aparecer fora da allowlist. Uma
fixture usa `react-dom/server` para provar que os entrypoints estáticos renderizam sem DOM.

### 5. CSS é compartilhado; o consumidor informa o scan

Os componentes mantêm classes Tailwind estáticas no JavaScript emitido. O consumidor Tailwind 4
importa o CSS do package e declara a fonte instalada:

```css
@import "tailwindcss";
@import "@fradelli/ui/styles.css";
@source "../node_modules/@fradelli/ui/dist";
```

Não haverá strings de classe construídas dinamicamente. Variantes usam mapas/CVA com valores
literais, permitindo detecção pelo scanner. As tarefas de adoção documentarão o caminho relativo
correto de cada app.

### 6. Acessibilidade é parte do contrato

- `Sheet` mantém modal, Escape, foco inicial, retenção de foco e retorno ao trigger via Radix.
- `SheetContent.closeLabel` continua obrigatório; o package não escolhe idioma.
- `FieldLabel`, `FieldDescription`, `FieldError` e `Input` preservam props nativas para associações
  explícitas com `htmlFor`, `id`, `aria-describedby` e `aria-invalid`.
- `Skeleton` continua decorativo com `aria-hidden` e respeita reduced motion.
- cor nunca é a única forma de comunicar estados de Alert ou Badge.

Não será criado um provider ou contexto de formulário apenas para gerar IDs automaticamente.

## API pública admitida

| Subpath       | Exports                                                  | Contrato preservado                                              |
| ------------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| `./cn`        | `cn`                                                     | composição de `ClassValue` com merge Tailwind                    |
| `./alert`     | `Alert`, `AlertAction`, `AlertDescription`, `AlertTitle` | variantes `default`, `success`, `warning`, `info`, `destructive` |
| `./badge`     | `Badge`, `badgeVariants`                                 | variantes atuais e `asChild`                                     |
| `./button`    | `Button`, `buttonVariants`                               | variantes e tamanhos atuais, `asChild`                           |
| `./card`      | `Card` e suas seis partes                                | tamanhos `default` e `sm`                                        |
| `./field`     | `Field` e suas oito partes                               | orientação, legend, descrição e erros deduplicados               |
| `./input`     | `Input`                                                  | props nativas de `input`                                         |
| `./label`     | `Label`                                                  | props acessíveis do Radix Label                                  |
| `./separator` | `Separator`                                              | orientação e modo decorativo do Radix                            |
| `./sheet`     | `Sheet` e suas nove partes                               | lados, overlay, portal e fechamento acessível                    |
| `./skeleton`  | `Skeleton`                                               | placeholder decorativo e reduced motion                          |

Os tipos públicos continuam inferidos dos componentes e são emitidos em `.d.ts`; nenhum tipo de
Sandicts ou Kaizen aparece nas assinaturas.

## Dependências propostas

Versões consultadas em 2026-09-08 e que devem ser revalidadas ao iniciar a implementação:

| Package                       |   Versão | Classificação |
| ----------------------------- | -------: | ------------- |
| `@radix-ui/react-slot`        |  `1.3.3` | dependency    |
| `@radix-ui/react-label`       | `2.1.15` | dependency    |
| `@radix-ui/react-separator`   | `1.1.15` | dependency    |
| `@radix-ui/react-dialog`      | `1.1.23` | dependency    |
| `@phosphor-icons/react`       | `2.1.10` | dependency    |
| `class-variance-authority`    |  `0.7.1` | dependency    |
| `clsx`                        |  `2.1.1` | dependency    |
| `tailwind-merge`              |  `3.6.0` | dependency    |
| `@testing-library/react`      | `16.3.3` | devDependency |
| `@testing-library/user-event` | `14.6.7` | devDependency |
| `@testing-library/jest-dom`   |  `7.0.1` | devDependency |
| `jsdom`                       | `30.0.1` | devDependency |

## Inventário de arquivos

### Criar

```text
src/lib/cn.ts
src/lib/cn.test.ts
src/components/{alert,badge,button,card,field,input,label,separator,sheet,skeleton}/index.tsx
src/components/primitives.test.tsx
src/components/sheet/sheet.test.tsx
src/stories/components/Primitives.stories.tsx
src/testing/public-exports.test.ts
src/testing/client-boundaries.test.ts
.changeset/bright-primitives-arrive.md
```

### Editar

```text
package.json
package-lock.json
tsconfig.build.json
vitest.config.ts
scripts/validate-package.mjs
scripts/test-package-fixtures.mjs
fixtures/npm-consumer/package.json
fixtures/npm-consumer/{input.css,smoke.mjs,typecheck.ts}
fixtures/pnpm-consumer/package.json
fixtures/pnpm-consumer/{input.css,smoke.mjs,typecheck.ts}
README.md
docs/implementation/kan-220-shared-primitives-implementation-guide.md
```

`src/index.ts` permanece vazio e documenta que imports de components devem usar subpaths.

## Ordem de implementação

| Ordem | Ação                                           | Resultado                                |
| ----: | ---------------------------------------------- | ---------------------------------------- |
|     1 | integrar KAN-222 e KAN-221 em `main`           | scaffold, tokens e Storybook disponíveis |
|     2 | criar `codex/KAN-220-shared-primitives`        | branch isolada e rastreável              |
|     3 | instalar dependências fixadas                  | lockfile reprodutível                    |
|     4 | migrar e testar `cn`                           | base comum sem alias de app              |
|     5 | migrar estáticos: Alert, Card, Input, Skeleton | primeiro corte server-compatible         |
|     6 | migrar variantes: Badge e Button               | CVA e `asChild` preservados              |
|     7 | migrar formulário: Label, Separator e Field    | composição e associações acessíveis      |
|     8 | migrar Sheet                                   | único primitive modal do corte           |
|     9 | adicionar subpaths e build completo            | contratos públicos emitidos              |
|    10 | criar stories e testes de interação/a11y       | estados documentados e exercitados       |
|    11 | ampliar validação de tarball/fixtures          | portabilidade npm/pnpm comprovada        |
|    12 | documentar consumo e adicionar changeset minor | release e adoção preparadas              |
|    13 | executar gate completo                         | evidências para PR e Jira                |

## Mudanças detalhadas

### 1. `package.json` e build TypeScript

Adicionar os onze subpaths com condições `types` e `import`. Exemplo normativo:

```json
"./button": {
  "types": "./dist/components/button/index.d.ts",
  "import": "./dist/components/button/index.js"
},
"./cn": {
  "types": "./dist/lib/cn.d.ts",
  "import": "./dist/lib/cn.js"
}
```

Os demais seguem exatamente o mesmo padrão. `tsconfig.build.json` passa a incluir `src/**/*.ts` e
`src/**/*.tsx`, excluindo tests e stories. O build mantém ESM NodeNext, declarations e imports
internos relativos terminados em `.js`.

`sideEffects` continua contendo somente `./dist/styles.css`. Não marcar componentes como side
effects.

### 2. Migração de `cn` e componentes

Copiar os arquivos do Sandicts mantendo separação entre implementação, estilos e tipos. Durante a
migração:

1. substituir cada `@/lib/utils` por `../../lib/cn.js`;
2. substituir imports entre primitives por submódulos relativos, nunca pelo package publicado;
3. mapear `card`, `popover`, `accent`, `muted`, `primary`, `destructive`, `input` e `ring` aos
   aliases gerados pela KAN-221;
4. revisar contrastes de hover, disabled e destructive no canvas dark;
5. manter todos os `data-slot` atuais para CSS, testes e composição;
6. preservar `className` como escape hatch visual;
7. remover qualquer exemplo, comentário ou nome associado a Sandicts.

Não mover arquivos diretamente do repositório consumidor. O Sandicts continua intacto até sua
tarefa de adoção, permitindo rollback simples.

### 3. Testes unitários e de boundary

Cada primitive recebe teste focado, sem duplicar o que Storybook cobre visualmente:

- `Alert`/`Badge`: variantes, papel semântico passado pelo consumidor e conteúdo longo;
- `Button`: botão nativo, disabled, `asChild`, foco e tamanhos;
- `Card`: partes, ordem livre e tamanhos;
- `Field`/`Input`/`Label`: label por nome acessível, descrição, erro, invalid e fieldset/legend;
- `Separator`: horizontal, vertical e decorativo;
- `Skeleton`: `aria-hidden` e classe `motion-reduce`;
- `Sheet`: abrir por teclado, Escape, close label, foco inicial e retorno ao trigger.

`client-boundaries.test.ts` lê os módulos emitidos e aceita `"use client"` somente na allowlist.
`public-exports.test.ts` compara os exports declarados com os arquivos `.d.ts` e `.js` gerados.

Testes DOM usam o ambiente jsdom somente onde necessário. Testes de build/exports continuam em
Node, evitando tornar toda a suíte dependente do browser.

### 4. Stories

Cada primitive terá stories para as combinações aplicáveis:

- variantes e tamanhos;
- disabled e loading demonstrado por composição do consumidor;
- erro e invalid;
- conteúdo longo e viewport estreito;
- interação de teclado e foco;
- reduced motion.

Stories usam copy neutra, como “Save changes”, “Additional information” e “Example category”. Não
usar reserva, quadra, dieta, hábito ou tarefa. O addon a11y da KAN-221 continua com falha em
violações.

### 5. Tarball e allowlist

`scripts/validate-package.mjs` mantém a lista exata de arquivos runtime/type emitidos,
`styles.css`, manifests e documentação. O validador:

1. compara `npm pack --dry-run --json` com a allowlist;
2. confirma que todo target de `exports` existe;
3. percorre o `dist` procurando aliases `@/`, Next.js, Sandicts, Kaizen e imports sem extensão;
4. executa Publint e Are the Types Wrong no `.tgz`;
5. confirma que React/React DOM não entraram em `dependencies`.

A allowlist não usa `dist/**` genérico: qualquer arquivo inesperado falha o gate.

### 6. Fixtures npm e pnpm

Cada fixture instala exatamente o mesmo `.tgz` e deve:

- importar os onze subpaths;
- executar typecheck sem path alias;
- renderizar Alert, Badge, Button, Card, Field, Input e Skeleton com `react-dom/server`;
- montar e interagir com Sheet em jsdom;
- importar `styles.css`;
- processar um CSS de entrada Tailwind 4 com `@source` sobre o `dist` instalado;
- verificar no CSS final classes representativas de variante, foco e reduced motion;
- provar uma única cópia de React e React DOM.

O script continua criando e removendo somente `.tmp/package` e `.tmp/fixtures`.

### 7. Documentação e Changeset

README recebe:

- tabela de subpaths e exemplos de import;
- import único de `@fradelli/ui/styles.css`;
- configuração `@source` para Tailwind 4;
- responsabilidade do consumidor por carregar Inter;
- regra de manter copy/i18n no app;
- exemplo de Field com IDs acessíveis;
- exemplo de Sheet com `closeLabel` localizado.

O changeset é `minor`, pois adiciona a primeira API pública de componentes:

```markdown
---
"@fradelli/ui": minor
---

Adiciona helper `cn` e os primeiros primitives compartilhados, com subpaths explícitos, stories,
testes de acessibilidade e validação em consumidores npm e pnpm.
```

## Procedimento de validação

### Testes rápidos durante a implementação

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
```

### Catálogo e acessibilidade

```bash
npm run storybook:build
npm run test:storybook
```

Revisar manualmente todos os primitives em 320px e 1280px, usando teclado e preferência de reduced
motion.

### Artefato distribuível

```bash
npm run pack:check
npm run fixtures:check
npm run audit
```

Inspecionar o `.tgz`, não apenas `src`. Os mesmos bytes do tarball devem ser usados pelas duas
fixtures.

### Gate final

```bash
npm run ci
git diff --check
```

Esperado: todos os checks locais e o workflow `Validate package` passam, sem vulnerabilidade
high/critical.

## Critérios de aceite operacionais

- [ ] KAN-222 e KAN-221 estão integradas em `main` antes da branch.
- [ ] Os onze subpaths resolvem JS e tipos a partir do tarball.
- [ ] O root `@fradelli/ui` não cria barrel do catálogo.
- [ ] React/React DOM permanecem peers e existe uma única cópia em cada fixture.
- [ ] Nenhum módulo importa Next.js, alias de app, rota, provider, i18n, DTO ou domínio.
- [ ] Variantes usam somente tokens compartilhados da KAN-221.
- [ ] Componentes estáticos renderizam no servidor sem DOM.
- [ ] Diretivas `use client` estão restritas à allowlist revisada.
- [ ] Sheet passa abertura, Escape, foco inicial, retenção e retorno de foco.
- [ ] Field/Input demonstram label, descrição e erro associados.
- [ ] Skeleton e animações do Sheet respeitam reduced motion.
- [ ] Todas as variantes, estados e conteúdo longo existem no Storybook e passam axe.
- [ ] npm e pnpm compilam o mesmo `.tgz`, inclusive classes descobertas por `@source`.
- [ ] Tarball contém somente a allowlist exata.
- [ ] Changeset minor e evidências estão registrados na PR e na KAN-220.
- [ ] A opção `delete_branch_on_merge` permanece habilitada no repositório.

## Commits sugeridos

1. `[KAN-220] feat(ui): add shared static primitives`
2. `[KAN-220] feat(ui): add form and overlay primitives`
3. `[KAN-220] test(ui): cover accessibility and client boundaries`
4. `[KAN-220] test(package): validate primitive subpaths in fixtures`
5. `[KAN-220] docs(ui): document primitive consumption`

## Rollback

Antes da publicação, reverter a PR da KAN-220. Depois da publicação, criar changeset patch que
corrija o problema ou nova versão que depreque a API; nunca substituir a mesma versão do package.
Como os apps ainda não são alterados nesta tarefa, o rollback não exige mudanças em Sandicts ou
Kaizen.

## Dependências e riscos

### Bloqueantes

Nenhum para a implementação empilhada. A KAN-222 está em `main`, o plano foi aprovado e a branch
parte do commit validado da KAN-221. A PR da KAN-220 deve permanecer apontada para a branch da
KAN-221 até a fundação ser integrada.

### Riscos controlados

| Risco                                  | Controle                                          |
| -------------------------------------- | ------------------------------------------------- |
| classes ausentes no consumidor         | fixture Tailwind com `@source` sobre o tarball    |
| hidratação excessiva                   | subpaths, root vazio e teste de client boundaries |
| duas cópias de React                   | peers + inspeção npm/pnpm                         |
| API contaminada por domínio            | checklist de admissão + busca no `dist`           |
| regressão acessível no Sheet           | interação real de teclado e foco                  |
| divergência do Sandicts durante adoção | migração sem remover código local nesta tarefa    |

### Inconsistência no Jira

Os links atuais de dependência aparecem invertidos. A ordem lógica é
`KAN-222 → KAN-221 → KAN-220 → adoção nos apps`. Este plano não altera links do Jira; corrigir
relações existentes exige autorização separada.

## Fontes técnicas

- [ADR 0001 — Fundação do Design System compartilhado](../decisions/0001-shared-design-system-foundation.md)
- [Checklist de admissão de componentes](../governance/component-admission.md)
- [Plano da KAN-221](./kan-221-dark-foundations-implementation-guide.md)
- [Radix Dialog — acessibilidade e foco](https://www.radix-ui.com/primitives/docs/components/dialog)
- [Radix Composition — `asChild`](https://www.radix-ui.com/primitives/docs/guides/composition)
- [React — diretiva `use client`](https://react.dev/reference/rsc/use-client)
- [Tailwind CSS — detecção de classes e `@source`](https://tailwindcss.com/docs/detecting-classes-in-source-files)
