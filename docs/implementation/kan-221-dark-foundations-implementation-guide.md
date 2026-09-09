---
title: Plano de implementação da KAN-221
doc-type: implementation-guide
status: implemented
last-reviewed: 2026-09-08
owners:
  - frontend
  - design-system
related-issue: KAN-221
related-repository: fradelli/design-system
---

# KAN-221 — tokens dark, Inter e Storybook Foundations

## Status do documento

- **Escopo:** implementar a primeira fundação visual versionada de `@fradelli/ui`, sem criar ou
  migrar componentes.
- **Card:** `KAN-221 — [Design System] Implement dark tokens, Inter, and Storybook foundations`.
- **Repositório:** [fradelli/design-system](https://github.com/fradelli/design-system).
- **Branch proposta:** `codex/KAN-221-dark-foundations`.
- **Base:** `main`, somente depois do merge da
  [PR #1 da KAN-222](https://github.com/fradelli/design-system/pull/1).
- **Prontidão técnica:** implementada e validada localmente.
- **Prontidão para execução:** concluída em `codex/KAN-221-dark-foundations` após o merge da KAN-222.
- **Evidência usada:** KAN-221, ADR 0001, scaffold da PR #1, manifests e estilos atuais de
  Sandicts e Kaizen e documentação oficial listada ao final.
- **Fora do escopo:** Button/Input/Dialog, helper `cn`, Radix/shadcn, Phosphor, calendário,
  publicação no GitHub Packages e instalação nos aplicativos.

## Resultado esperado

Ao final, os arquivos DTCG serão a única fonte editável dos valores visuais. O build produzirá um
único `dist/styles.css` com variáveis CSS estáveis, base dark-first e aliases opcionais para
Tailwind 4. O mesmo CSS funcionará em um consumidor sem Tailwind, como o Kaizen atual, e em um
consumidor Tailwind 4, como o Sandicts.

O Storybook documentará cores, tipografia, espaçamento, radius e foco. Testes unitários verificarão
aliases e contraste; testes Storybook em Chromium verificarão renderização e acessibilidade.

## Decisões arquiteturais

### 1. DTCG é a fonte; CSS é artefato

Os valores vivem apenas em `tokens/*.json`, usando `$type`, `$value`, `$description` e aliases
`{caminho.do.token}`. `src/styles/tokens.generated.css` é versionado para revisão humana, mas nunca
editado manualmente. `tokens:check` gera uma cópia temporária e falha se houver qualquer diferença.

O formato seguirá o relatório DTCG 2025.10. Style Dictionary será somente o tradutor; ele não será
uma segunda fonte de valores.

### 2. Primitivos e semânticos permanecem separados

- `tokens/primitives.json`: valores brutos de cor, tamanho, peso e duração.
- `tokens/semantic.dark.json`: nomes que os produtos consomem, sempre por alias.

Componentes e aplicativos usam tokens semânticos. Nomes de aparência, como `category.blue`, não
recebem significado de domínio. Sandicts decide qual cor representa um esporte e Kaizen decide qual
cor representa treino ou dieta.

### 3. Namespace CSS público

Todos os tokens gerados recebem o prefixo `--fd-*`. Isso evita colisão com os tokens locais atuais
do Sandicts (`--background`, `--primary`, etc.) e permite uma migração progressiva.

Exemplos:

```css
--fd-color-background: var(--fd-primitive-color-neutral-950);
--fd-color-primary: var(--fd-primitive-color-yellow-solid);
--fd-color-category-cyan-subtle: var(--fd-primitive-color-cyan-subtle);
```

### 4. Tailwind é integração opcional

`src/styles/styles.css` terá `@theme inline` para mapear tokens `--fd-*` aos namespaces de utility do
Tailwind 4. `tailwindcss` será um peer opcional: Sandicts pode gerar utilities; Kaizen continua
recebendo as variáveis e os estilos base sem instalar Tailwind imediatamente.

O package não distribui a paleta padrão completa do Tailwind e não cria `tailwind.config.*`.

### 5. Inter é contrato, não binário

O package referencia:

```css
var(--font-inter, "Inter"), ui-sans-serif, system-ui, sans-serif
```

Cada aplicativo carrega Inter uma vez no root e popula `--font-inter`. Não entram `next/font`,
`@fontsource/inter`, Google Fonts ou arquivos WOFF no package.

### 6. Storybook é isolado de Next.js

Storybook usa React + Vite. O catálogo não depende de Sandicts, Kaizen ou Next.js. O addon de
acessibilidade roda com `a11y.test = "error"`, e o addon Vitest executa as stories em Chromium no
CI.

## Contrato visual proposto

### Superfícies e conteúdo

| Token semântico            | Valor resolvido | Uso                       |
| -------------------------- | --------------- | ------------------------- |
| `color.background`         | `#0B0B0C`       | fundo principal           |
| `color.surface`            | `#141416`       | cards e painéis           |
| `color.surfaceElevated`    | `#1C1C1F`       | popovers e elevação       |
| `color.surfaceInteractive` | `#242428`       | hover/controle discreto   |
| `color.border`             | `#2B2B30`       | separação estrutural      |
| `color.foreground`         | `#F4F4F5`       | texto principal           |
| `color.mutedForeground`    | `#9B9BA3`       | texto secundário          |
| `color.primary`            | `#F2CF63`       | ação principal amarela    |
| `color.primaryForeground`  | `#15130B`       | conteúdo sobre primary    |
| `color.brand`              | `#F07878`       | identidade coral/vermelha |
| `color.brandForeground`    | `#1C0D0D`       | conteúdo sobre brand      |
| `color.focusRing`          | `#F2CF63`       | foco visível              |

`border` é estrutural e pode ser deliberadamente sutil. Elementos interativos e foco não podem
depender somente dele; `focusRing` deve atingir o contraste não textual mínimo.

### Categorias para agendas

Cada categoria expõe quatro papéis:

- `solid`: fundo principal de evento/chip;
- `subtle`: fundo tonal de baixa ênfase;
- `foreground`: texto/ícone sobre `solid`;
- `border`: contorno identificável contra o background dark.

| Categoria | Solid     | Subtle    | Foreground | Border    |
| --------- | --------- | --------- | ---------- | --------- |
| Yellow    | `#F2CF63` | `#312C20` | `#151515`  | `#968140` |
| Orange    | `#F0A866` | `#312720` | `#151515`  | `#946942` |
| Red       | `#F07878` | `#312123` | `#151515`  | `#944C4D` |
| Pink      | `#E58AB7` | `#2F232B` | `#151515`  | `#8E5773` |
| Purple    | `#B79AF2` | `#292533` | `#151515`  | `#726196` |
| Blue      | `#7DA7F2` | `#222733` | `#151515`  | `#4F6996` |
| Cyan      | `#65C8D0` | `#1F2B2E` | `#151515`  | `#417C82` |
| Green     | `#7BC8A4` | `#212B28` | `#151515`  | `#4E7C67` |

Os tons `subtle` são misturas sRGB de 13% do pastel sobre `surface`; os tons `border` usam 60% do
pastel sobre `background`. Os valores finais ficam explícitos no DTCG, evitando cálculos diferentes
entre browsers.

### Estados semânticos

| Estado      | Solid             | Subtle            | Foreground        | Border            |
| ----------- | ----------------- | ----------------- | ----------------- | ----------------- |
| Success     | aliases de Green  | aliases de Green  | aliases de Green  | aliases de Green  |
| Warning     | aliases de Yellow | aliases de Yellow | aliases de Yellow | aliases de Yellow |
| Info        | aliases de Blue   | aliases de Blue   | aliases de Blue   | aliases de Blue   |
| Destructive | `#FF6673`         | `#35191E`         | `#19080B`         | `#A3424A`         |

`destructive` tem valores próprios e nunca aponta para `brand`, ainda que ambos estejam na família
vermelha. Isso impede que uma futura mudança da identidade altere automaticamente erros e exclusões.

### Tipografia

| Papel            | Peso | Token CSS                   |
| ---------------- | ---: | --------------------------- |
| Body             |  400 | `--fd-font-weight-body`     |
| Label/navigation |  500 | `--fd-font-weight-label`    |
| Emphasis/action  |  600 | `--fd-font-weight-emphasis` |
| Heading          |  700 | `--fd-font-weight-heading`  |
| Display/brand    |  800 | `--fd-font-weight-display`  |

O primeiro corte não cria uma escala completa de títulos. Ele documenta família, pesos e uma escala
base suficiente para Storybook: `12/16`, `14/20`, `16/24`, `20/28`, `24/32` e `32/40` pixels.

### Espaço, radius, foco e motion

| Grupo  | Valores iniciais                                                                |
| ------ | ------------------------------------------------------------------------------- |
| Space  | `0`, `4`, `8`, `12`, `16`, `24`, `32`, `48` px                                  |
| Radius | `4`, `6`, `8`, `12`, `16`, `999` px                                             |
| Focus  | largura `2px`, offset `2px`, cor `focusRing`                                    |
| Motion | `120ms` fast, `180ms` normal, `240ms` slow, easing `cubic-bezier(0.2, 0, 0, 1)` |

## Dependências propostas

Versões consultadas em 2026-09-08 e que devem ser revalidadas no início da implementação:

| Package                      | Versão proposta | Papel                        | Runtime do consumidor? |
| ---------------------------- | --------------: | ---------------------------- | ---------------------- |
| `style-dictionary`           |         `5.5.3` | gerar CSS DTCG               | não                    |
| `tailwindcss`                |         `4.3.3` | contrato `@theme` e catálogo | peer opcional + dev    |
| `@tailwindcss/vite`          |         `4.3.3` | processar Storybook          | não                    |
| `storybook`                  |        `10.6.0` | CLI do catálogo              | não                    |
| `@storybook/react-vite`      |        `10.6.0` | renderer isolado             | não                    |
| `@storybook/addon-a11y`      |        `10.6.0` | axe no catálogo/CI           | não                    |
| `@storybook/addon-vitest`    |        `10.6.0` | stories como testes          | não                    |
| `vite`                       |         `8.2.2` | build do Storybook           | não                    |
| `@vitejs/plugin-react`       |         `6.1.1` | React no Vite                | não                    |
| `@vitest/browser-playwright` |        `4.1.11` | Vitest browser mode          | não                    |
| `playwright`                 |        `1.63.0` | Chromium no CI               | não                    |

Não adicionar `@fontsource/inter`, `next`, `shadcn`, `radix-ui`, Phosphor ou bibliotecas de cor nesta
tarefa.

## Ordem de implementação

| Ordem | Ação          | Arquivo                                                                | Finalidade                                          |
| ----: | ------------- | ---------------------------------------------------------------------- | --------------------------------------------------- |
|     1 | Merge         | PR #1 / `main`                                                         | garantir scaffold e gates da KAN-222                |
|     2 | Create branch | Git                                                                    | `codex/KAN-221-dark-foundations` a partir de `main` |
|     3 | Edit          | `package.json`                                                         | dependências, scripts e peer opcional Tailwind      |
|     4 | Generate      | `package-lock.json`                                                    | lockfile npm 11.19.0                                |
|     5 | Create        | `tokens/primitives.json`                                               | valores visuais brutos em DTCG                      |
|     6 | Create        | `tokens/semantic.dark.json`                                            | aliases públicos dark-first                         |
|     7 | Create        | `style-dictionary.config.mjs`                                          | geração CSS determinística com prefixo `fd`         |
|     8 | Create        | `scripts/build-tokens.mjs`                                             | modo write e modo check                             |
|     9 | Generate      | `src/styles/tokens.generated.css`                                      | snapshot revisável dos tokens                       |
|    10 | Edit          | `src/styles/styles.css`                                                | base dark, Inter e `@theme inline`                  |
|    11 | Edit          | `scripts/copy-styles.mjs`                                              | embutir tokens no único CSS do tarball              |
|    12 | Create        | `src/tokens/token-test-utils.ts`                                       | carregar e resolver DTCG nos testes                 |
|    13 | Create        | `src/tokens/tokens.test.ts`                                            | validar aliases, grupos e sincronização             |
|    14 | Create        | `src/tokens/contrast.test.ts`                                          | validar pares WCAG reais                            |
|    15 | Create        | `vite.config.ts`                                                       | React + Tailwind para Storybook                     |
|    16 | Create        | `.storybook/main.ts`                                                   | catálogo React/Vite e addons                        |
|    17 | Create        | `.storybook/preview.ts`                                                | dark canvas e a11y como erro                        |
|    18 | Create        | `.storybook/preview.css`                                               | importar Tailwind e estilos do package              |
|    19 | Create        | `.storybook/vitest.setup.ts`                                           | annotations de teste das stories                    |
|    20 | Edit          | `vitest.config.ts`                                                     | projetos unit e storybook/browser                   |
|    21 | Create        | `src/stories/foundations/foundations.css`                              | layout sem domínio do catálogo                      |
|    22 | Create        | `src/stories/foundations/Foundations.stories.tsx`                      | cores, tipo, espaço, radius e foco                  |
|    23 | Edit          | `.github/workflows/ci.yml`                                             | instalar Chromium e executar Storybook              |
|    24 | Edit          | `.prettierignore`                                                      | excluir CSS gerado da formatação manual             |
|    25 | Create        | `.changeset/calm-clocks-glow.md`                                       | classificar a primeira API visual como minor        |
|    26 | Edit          | `README.md`                                                            | documentar geração, consumo e ownership da fonte    |
|    27 | Edit          | `AGENTS.md`                                                            | proibir edição manual do CSS gerado                 |
|    28 | Edit          | `docs/implementation/kan-221-dark-foundations-implementation-guide.md` | registrar execução e evidências                     |

## Mudanças detalhadas

### 1. `package.json` e `package-lock.json`

**Ação:** editar o manifesto e regenerar o lockfile.

Adicionar os scripts:

```json
{
  "tokens:build": "node scripts/build-tokens.mjs",
  "tokens:check": "node scripts/build-tokens.mjs --check",
  "storybook": "storybook dev -p 6006",
  "storybook:build": "storybook build --output-dir storybook-static",
  "test:unit": "vitest run --project unit",
  "test:storybook": "vitest run --project storybook"
}
```

Alterar os fluxos existentes:

```text
test = npm run test:unit
build = clean → tokens:check → tsc → copy-styles
ci = format → lint → typecheck → test:unit → tokens:check → storybook:build →
     test:storybook → pack:check → fixtures:check → audit
```

Adicionar `tailwindcss: ">=4.3.0 <5"` em `peerDependencies` e marcá-lo como opcional em
`peerDependenciesMeta`. Todas as dependências da tabela anterior ficam em `devDependencies` com
versão exata.

**Por quê:** o CSS comum permanece consumível sem Tailwind, enquanto projetos Tailwind recebem uma
API de utilities oficialmente declarada.

**Verificação:** `npm install` não pode alterar React/React DOM para dependencies, introduzir Next.js
ou produzir vulnerabilidades high/critical.

### 2. `tokens/primitives.json`

**Ação:** criar.

O arquivo deve conter somente valores brutos, organizados nestes grupos DTCG:

```text
primitive.color.neutral.*
primitive.color.yellow|orange|red|pink|purple|blue|cyan|green.solid|subtle|border
primitive.color.ink.default|brand|primary|destructive
primitive.color.destructive.solid|subtle|border
primitive.font.family.sans
primitive.font.weight.400|500|600|700|800
primitive.font.size.12|14|16|20|24|32
primitive.font.lineHeight.16|20|24|28|32|40
primitive.space.0|1|2|3|4|6|8|12
primitive.radius.xs|sm|md|lg|xl|full
primitive.focus.width|offset
primitive.motion.duration.fast|normal|slow
primitive.motion.easing.standard
```

Cada cor usa `$type: "color"` e a forma DTCG 2025.10 com `colorSpace: "srgb"`, `components` e
`hex`. Dimensões usam `{ "value": número, "unit": "px" }`; duração usa `ms`; easing usa
`cubicBezier`.

**Por quê:** manter todos os números e cores fora do CSS elimina duas fontes de verdade.

**Verificação:** Style Dictionary deve carregar o arquivo sem warning de tipo ou token duplicado.

### 3. `tokens/semantic.dark.json`

**Ação:** criar.

Todos os `$value` deste arquivo devem ser aliases. O contrato público mínimo é:

```text
color.background|surface|surfaceElevated|surfaceInteractive
color.foreground|mutedForeground|border|input
color.primary|primaryForeground|brand|brandForeground|focusRing
color.category.<8 cores>.solid|subtle|foreground|border
color.status.success|warning|info|destructive.solid|subtle|foreground|border
font.family.sans
font.weight.body|label|emphasis|heading|display
font.size.xs|sm|md|lg|xl|2xl
font.lineHeight.xs|sm|md|lg|xl|2xl
space.0|1|2|3|4|6|8|12
radius.xs|sm|md|lg|xl|full
focus.width|offset|color
motion.duration.fast|normal|slow
motion.easing.standard
```

Exemplo normativo:

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "color": {
    "$type": "color",
    "background": {
      "$value": "{primitive.color.neutral.950}",
      "$description": "Fundo principal dark-first."
    },
    "brand": {
      "$value": "{primitive.color.red.solid}",
      "$description": "Identidade coral compartilhada; não representa erro."
    },
    "destructive": {
      "solid": {
        "$value": "{primitive.color.destructive.solid}"
      }
    }
  }
}
```

O conteúdo completo deve refletir integralmente as tabelas deste plano; nenhuma categoria pode ter
menos de quatro papéis.

**Verificação:** o teste de aliases percorre recursivamente o documento e falha para literal em
arquivo semântico, referência inexistente ou ciclo.

### 4. `style-dictionary.config.mjs`

**Ação:** criar.

Conteúdo planejado:

```js
const buildPath = process.env.FRADELLI_TOKENS_BUILD_PATH ?? "src/styles/";

export default {
  source: ["tokens/**/*.json"],
  usesDtcg: true,
  platforms: {
    css: {
      prefix: "fd",
      transformGroup: "css",
      buildPath: buildPath.endsWith("/") ? buildPath : `${buildPath}/`,
      files: [
        {
          destination: "tokens.generated.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            selector: ":root",
            showFileHeader: false,
            sort: "name",
          },
        },
      ],
    },
  },
};
```

**Por quê:** `showFileHeader: false` remove timestamp; `sort: "name"` e versões fixas tornam o
resultado reprodutível; `outputReferences` preserva a relação entre tokens quando possível.

**Verificação:** duas execuções consecutivas produzem os mesmos bytes.

### 5. `scripts/build-tokens.mjs`

**Ação:** criar.

Responsabilidades exatas:

1. aceitar somente nenhum argumento ou `--check`;
2. no modo build, executar o CLI fixado do Style Dictionary para `src/styles/`;
3. no modo check, gerar em `.tmp/tokens/`, comparar bytes com o arquivo versionado e não alterar
   source;
4. remover somente `.tmp/tokens/`, nunca `.tmp` inteiro;
5. exibir `npm run tokens:build` como correção quando houver divergência.

O CLI deve ser chamado por `process.execPath` e pelo caminho
`node_modules/style-dictionary/bin/style-dictionary.js`, mantendo compatibilidade Windows/Linux e o
mesmo padrão dos validadores da KAN-222.

**Verificação:** alterar temporariamente um token deve fazer `npm run tokens:check` falhar; executar
`npm run tokens:build` e restaurar o valor deve recuperar o estado limpo.

### 6. `src/styles/tokens.generated.css`

**Ação:** gerar e versionar.

O arquivo deve começar com `:root`, conter somente custom properties `--fd-*` e preservar LF. Não
deve conter data, caminho local ou comentário manual.

**Verificação:** `npm run tokens:check` retorna zero e `git diff --exit-code` permanece limpo.

### 7. `src/styles/styles.css`

**Ação:** substituir o placeholder da KAN-222.

Estrutura final:

```css
@import "./tokens.generated.css" layer(fradelli-ui.tokens);

@layer fradelli-ui.tokens, fradelli-ui.base;

:root {
  color-scheme: dark;
}

@theme inline {
  --color-background: var(--fd-color-background);
  --color-surface: var(--fd-color-surface);
  --color-surface-elevated: var(--fd-color-surface-elevated);
  --color-foreground: var(--fd-color-foreground);
  --color-muted-foreground: var(--fd-color-muted-foreground);
  --color-border: var(--fd-color-border);
  --color-primary: var(--fd-color-primary);
  --color-primary-foreground: var(--fd-color-primary-foreground);
  --color-brand: var(--fd-color-brand);
  --color-focus-ring: var(--fd-color-focus-ring);
  --font-sans: var(--fd-font-family-sans);
  --radius-sm: var(--fd-radius-sm);
  --radius-md: var(--fd-radius-md);
  --radius-lg: var(--fd-radius-lg);
}

@layer fradelli-ui.base {
  body {
    color: var(--fd-color-foreground);
    background: var(--fd-color-background);
    font-family: var(--fd-font-family-sans);
  }

  :focus-visible {
    outline: var(--fd-focus-width) solid var(--fd-focus-color);
    outline-offset: var(--fd-focus-offset);
  }
}
```

Na implementação, `@theme inline` também lista status e todas as categorias. Ele não cria classes de
componente nem redefine Preflight.

**Verificação:** a fixture npm lê `color-scheme: dark`, `--fd-color-background` e
`--fd-font-family-sans`; a fixture pnpm continua resolvendo o subpath CSS.

### 8. `scripts/copy-styles.mjs`

**Ação:** editar.

O script deve substituir exatamente o primeiro `@import "./tokens.generated.css" ...;` pelo conteúdo
gerado antes de escrever `dist/styles.css`. Se a importação estiver ausente ou repetida, deve falhar.

**Por quê:** o tarball mantém um único arquivo CSS, como definido pela KAN-222, sem import relativo
quebrado.

**Verificação:** `dist/styles.css` não contém `tokens.generated.css`, contém os tokens `--fd-*` e a
allowlist continua com seis arquivos.

### 9. Testes de tokens

**Arquivos:**

- `src/tokens/token-test-utils.ts`;
- `src/tokens/tokens.test.ts`;
- `src/tokens/contrast.test.ts`.

O utilitário deve:

- carregar JSON com `node:fs`;
- indexar tokens pelo caminho DTCG;
- resolver aliases com detecção de ciclo;
- extrair `hex` somente de cor sRGB;
- calcular luminância relativa WCAG sem dependência externa.

`tokens.test.ts` deve provar:

- nenhum literal em `semantic.dark.json`;
- todos os aliases resolvem;
- existem exatamente oito categorias;
- cada categoria possui `solid`, `subtle`, `foreground` e `border`;
- `brand` e `status.destructive` não apontam para o mesmo primitive;
- pesos tipográficos resolvem para `400`, `500`, `600`, `700`, `800`;
- CSS versionado coincide com a geração.

`contrast.test.ts` deve testar:

| Par                                  |  Mínimo |
| ------------------------------------ | ------: |
| foreground / background              |   `7:1` |
| mutedForeground / background         | `4.5:1` |
| primaryForeground / primary          | `4.5:1` |
| brandForeground / brand              | `4.5:1` |
| status foreground / status solid     | `4.5:1` |
| category foreground / category solid | `4.5:1` |
| category solid / category subtle     | `4.5:1` |
| category border / background         |   `3:1` |
| focusRing / background               |   `3:1` |

**Verificação:** o nome do token e a razão calculada devem aparecer no erro, permitindo corrigir o
par exato.

### 10. Storybook e Vite

**Arquivos:**

- `vite.config.ts`;
- `.storybook/main.ts`;
- `.storybook/preview.ts`;
- `.storybook/preview.css`;
- `.storybook/vitest.setup.ts`;
- `vitest.config.ts`.

Configuração obrigatória:

```ts
// .storybook/main.ts
import type { StorybookConfig } from "@storybook/react-vite";

const config = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: "@storybook/react-vite",
} satisfies StorybookConfig;

export default config;
```

```ts
// .storybook/preview.ts
import type { Preview } from "@storybook/react-vite";

import "./preview.css";

const preview = {
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
  },
} satisfies Preview;

export default preview;
```

```css
/* .storybook/preview.css */
@import "tailwindcss";
@import "../src/styles/styles.css";
@source "../src";
```

`vitest.config.ts` mantém um projeto `unit` em Node e adiciona um projeto `storybook` com
`storybookTest`, `@vitest/browser-playwright`, Chromium e headless. O setup aplica
`setProjectAnnotations` conforme o arquivo gerado pelo addon oficial.

**Verificação:** `npm run storybook:build` gera o catálogo e `npm run test:storybook` renderiza todas
as stories em Chromium com axe configurado para falhar violações.

### 11. Story Foundations

**Arquivos:**

- `src/stories/foundations/Foundations.stories.tsx`;
- `src/stories/foundations/foundations.css`.

O arquivo TSX exporta cinco stories: `Colors`, `Typography`, `Spacing`, `Radius` e `Focus`. Não recebe
args de produto e não mostra logo. Cada swatch exibe nome do token, papel e valor computado; cada
amostra tipográfica exibe peso/tamanho/line-height; foco usa controles reais acessíveis.

As categorias são demonstradas como eventos genéricos (`Category yellow`, etc.), sem nomes de
esporte, dieta ou tarefa.

**Verificação:** todas as stories constam na navegação `Foundations`, renderizam em 320px e 1280px e
passam no addon a11y.

### 12. CI, Changeset e documentação

**Arquivos:**

- `.github/workflows/ci.yml`;
- `.prettierignore`;
- `.changeset/calm-clocks-glow.md`;
- `README.md`;
- `AGENTS.md`.

O CI instala apenas Chromium antes de `npm run ci`:

```yaml
- name: Install Playwright Chromium
  run: npx playwright install --with-deps chromium
```

O Changeset é `minor`, pois introduz a primeira API visual pública que formará `0.1.0` quando a
KAN-226 habilitar release:

```markdown
---
"@fradelli/ui": minor
---

Adiciona a fundação visual dark-first com tokens DTCG, Inter por variável do consumidor e CSS
compatível com Tailwind 4.
```

O README documenta `tokens:build`, `tokens:check`, `storybook`, `storybook:build`, import de
`@fradelli/ui/styles.css` e responsabilidade do consumidor por `--font-inter`. O AGENTS proíbe editar
o CSS gerado e adicionar semântica de domínio às categorias.

## Procedimento de validação

### 1. Geração e validação estática

```bash
npm run tokens:build
npm run tokens:check
npm run format:check
npm run lint
npm run typecheck
git diff --check
```

Esperado: geração idempotente, nenhum warning e nenhum diff após `tokens:check`.

### 2. Testes focados

```bash
npm run test:unit
npm run storybook:build
npx playwright install chromium
npm run test:storybook
```

Esperado: aliases, grupos e contraste aprovados; cinco stories renderizadas em Chromium e sem
violação axe.

### 3. Artefato real e consumidores

```bash
npm run pack:check
npm run fixtures:check
npm run audit
```

Esperado:

- tarball ainda limitado a README, CHANGELOG, package.json, ESM, tipos e um CSS;
- `dist/styles.css` contém tokens e não contém import local quebrado;
- fixtures npm e pnpm resolvem CSS e mantêm uma única cópia de React;
- zero vulnerabilidades high/critical.

### 4. Gate completo

```bash
npm run ci
```

Esperado: o mesmo comando passa localmente e no check obrigatório `Validate package` da PR.

### 5. Revisão visual manual

1. Executar `npm run storybook`.
2. Abrir cada story de Foundations em 320px e 1280px.
3. Conferir que o canvas é dark desde o primeiro frame.
4. Navegar por teclado até o exemplo de foco.
5. Simular deuteranopia e acromatopsia no addon a11y.
6. Confirmar que categoria nunca é comunicada apenas pela cor.

## Critérios de aceite operacionais

- [ ] A PR #1/KAN-222 foi integrada antes da criação da branch.
- [ ] Todos os valores compartilhados existem somente em JSON DTCG.
- [ ] `tokens:check` detecta divergência sem modificar source.
- [ ] `color-scheme: dark` aparece no CSS empacotado.
- [ ] Oito categorias possuem `solid`, `subtle`, `foreground` e `border`.
- [ ] Brand e destructive têm primitives independentes.
- [ ] Todos os pares da matriz de contraste passam.
- [ ] Inter é referenciada via `--font-inter`, sem binários e sem Next.js.
- [ ] Storybook contém as cinco foundations e passa em Chromium/axe.
- [ ] Tailwind permanece peer opcional; a fixture npm sem Tailwind continua funcionando.
- [ ] Tarball mantém a allowlist de seis arquivos e um único CSS autocontido.
- [ ] `npm run ci`, GitHub Actions e `npm audit` passam.
- [ ] Changeset minor, PR e evidências são registrados na KAN-221.

## Commits sugeridos

1. `[KAN-221] feat(tokens): add dark DTCG foundation`
2. `[KAN-221] build(tokens): generate deterministic package CSS`
3. `[KAN-221] test(tokens): enforce aliases and contrast`
4. `[KAN-221] docs(storybook): add visual foundation catalog`
5. `[KAN-221] ci(storybook): validate foundations in Chromium`

## Rollback

Antes de qualquer publicação, rollback é reverter a PR da KAN-221. O consumidor não é alterado por
esta tarefa. Não apagar releases ou tags. Se o CSS quebrar apenas a integração Tailwind, reverter o
bloco `@theme` preservando os tokens `--fd-*` até a correção.

## Dependências e pendências

### Bloqueantes para implementar

Nenhum. O plano foi aprovado e a PR #1 da KAN-222 foi integrada antes da implementação.

### Ajuste de compatibilidade

O scaffold usava Vitest 5, mas `@storybook/addon-vitest@10.6.0` aceita Vitest 3 ou 4. A
implementação fixa Vitest e `@vitest/browser-playwright` em `4.1.11`, combinação aceita pelos peers
do addon e validada pelo gate completo.

### Inconsistência no Jira

Os links atuais representam KAN-221 bloqueando KAN-222 e KAN-220 bloqueando KAN-221. A sequência
lógica é o inverso: KAN-222 bloqueia KAN-221, que bloqueia KAN-220. Corrigir links exige excluir e
recriar relações existentes; isso deve ser autorizado separadamente antes da execução.

## Fontes técnicas

- [DTCG Design Tokens Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/)
- [Style Dictionary — CSS formats e referências](https://styledictionary.com/reference/hooks/formats/)
- [Tailwind CSS — theme variables e compartilhamento](https://tailwindcss.com/docs/theme)
- [Storybook React com Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite/)
- [Storybook Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon/)
- [Storybook accessibility tests](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [WCAG 2.2 — contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
