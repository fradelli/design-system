---
title: Plano de implementação da KAN-222
doc-type: implementation-guide
status: implemented
last-reviewed: 2026-09-08
owners:
  - frontend
  - design-system
related-issue: KAN-222
related-repository: fradelli/design-system
---

# KAN-222 — scaffold e validação de `@fradelli/ui`

## Status do documento

- **Situação:** implementado e validado localmente na branch
  `codex/KAN-222-scaffold-fradelli-ui`.

- **Escopo:** criar a fundação técnica de um package ESM mínimo, instalável e verificável, sem
  implementar ainda a fundação visual ou componentes.
- **Card:** `KAN-222 — [Design System] Scaffold and validate the @fradelli/ui package`.
- **Épico:** `KAN-219 — [Platform] Shared Design System`.
- **Repositório:** [fradelli/design-system](https://github.com/fradelli/design-system).
- **Branch recomendada:** `codex/KAN-222-scaffold-fradelli-ui`.
- **Base:** `main`, depois da integração da KAN-223.
- **Prontidão do plano:** aprovado e executado.
- **Prontidão da implementação:** `npm run ci` aprovado no repositório real, incluindo o lockfile,
  a allowlist do tarball e as fixtures consumidoras.
- **Evidência usada:** KAN-222, ADR 0001, políticas de governança, estado atual do repositório,
  manifests atuais de Sandicts e Kaizen, npm registry e documentação oficial de npm, TypeScript,
  GitHub Actions, GitHub Packages e Changesets.
- **Fora do escopo:** tokens DTCG, Inter em runtime, Tailwind, Storybook, primitives, publicação,
  secrets, instalação nos apps e qualquer domínio.

## Resultado esperado

Ao final, `@fradelli/ui@0.0.0` poderá ser empacotado localmente como um único tarball contendo
JavaScript ESM, declarações TypeScript e um entrypoint CSS vazio e válido. Esse mesmo artefato será
instalado por fixtures que reproduzem os dois consumidores atuais:

- npm + TypeScript 6 + React 19.2.7, representando Sandicts;
- pnpm + TypeScript 7 + React 19.2.8, representando Kaizen.

O package não será publicado. Um guard explícito bloqueará `npm publish` até a KAN-226.

## Diagnóstico atual

1. O repositório já existe e contém apenas README, ADR, governança e `AGENTS.md`. A frase “criar
   `fradelli/design-system`” no card deve ser atualizada durante a execução para “configurar o
   repositório existente”.
2. KAN-223 está em revisão; suas PRs precisam ser integradas antes do scaffold.
3. O link Jira está invertido: atualmente KAN-222 aparece bloqueando KAN-223. A dependência lógica
   correta é KAN-223 bloquear KAN-222.
4. Sandicts usa Node 24, npm 11, TypeScript 6 e React 19.2.7; Kaizen usa Node 24.20, pnpm 11,
   TypeScript 7 e React 19.2.8.
5. `typescript-eslint@8.70.0` aceita TypeScript abaixo de 6.1. Por isso, o repositório usará
   TypeScript 6.0.3 para lint/build e validará as declarações também com TypeScript 7.0.2 na fixture
   Kaizen.

## Decisões técnicas

### Build sem bundler

Usar `tsc` com `module` e `moduleResolution` em `NodeNext`. Não adicionar tsup, Rollup ou outro
bundler nesta história. O package começa vazio e o compilador já produz ESM e declarações, reduzindo
configuração e preservando diretivas como `"use client"` quando os componentes chegarem na KAN-220.

Imports relativos futuros devem usar a extensão de saída `.js` no código-fonte. Isso evita
declarações que funcionam apenas com `moduleResolution: bundler`.

### API pública mínima

O entrypoint raiz terá somente `export {}`. Não criar constantes ou helpers temporários que
precisariam ser removidos como breaking change.

Exports iniciais:

| Subpath                     | Artefato                            | Estado                       |
| --------------------------- | ----------------------------------- | ---------------------------- |
| `@fradelli/ui`              | `dist/index.js` + `dist/index.d.ts` | módulo ESM vazio             |
| `@fradelli/ui/styles.css`   | `dist/styles.css`                   | Cascade Layer vazia e válida |
| `@fradelli/ui/package.json` | `package.json`                      | metadata para tooling        |

O CSS conterá somente a declaração da layer pública. Tokens e integração Tailwind pertencem à
KAN-221.

### Empacotamento

- `files` permite somente `dist`;
- npm inclui automaticamente `package.json`, README e CHANGELOG;
- `sideEffects` preserva `dist/styles.css`;
- `react` e `react-dom` são peers em `>=19.2.7 <20` e dev dependencies exatas;
- não existe dependency de Next.js;
- `license` será `UNLICENSED`, coerente com a decisão atual de não incluir `LICENSE`;
- `publishConfig` aponta para GitHub Packages com acesso `restricted`;
- `private: true` não será usado, pois impediria a publicação futura;
- `prepublishOnly` falha deliberadamente com mensagem apontando para KAN-226.

### Validação do artefato real

O gate não valida apenas `dist`. Ele cria um tarball uma vez e usa o mesmo arquivo para:

1. comparar uma allowlist exata de arquivos;
2. executar Publint em modo estrito;
3. executar Are the Types Wrong no perfil estrito;
4. rejeitar alias `@/`, Next.js e referências aos domínios consumidores dentro de `dist`;
5. instalar nas fixtures npm e pnpm;
6. resolver o entrypoint JS, o CSS e as declarações;
7. confirmar peers satisfeitos e uma versão única de React/React DOM.

### Versionamento e publicação

Changesets será configurado em modo single-package, base `main` e acesso `restricted`. O CHANGELOG
começa sem release publicada. Não haverá workflow de release nem credencial nesta história; isso
pertence à KAN-226.

## Versões propostas

Snapshot verificado em 2026-09-08:

| Item                 | Versão/intervalo            | Motivo                                             |
| -------------------- | --------------------------- | -------------------------------------------------- |
| Node                 | `24.20.0`                   | mínimo comum explícito dos consumidores            |
| npm do repositório   | `11.19.0`                   | linha 11 estável e compatível com o fluxo Sandicts |
| TypeScript           | `6.0.3`                     | compatível com `typescript-eslint` e Sandicts      |
| ESLint               | `10.10.0`                   | versão atual                                       |
| `@eslint/js`         | `10.0.1`                    | config oficial correspondente                      |
| `typescript-eslint`  | `8.70.0`                    | suporta ESLint 10 e TypeScript até 6.0             |
| Prettier             | `3.9.6`                     | versão atual                                       |
| Vitest               | `5.0.0`                     | suporta Node 24                                    |
| Changesets CLI       | `3.0.2`                     | versão atual                                       |
| Publint              | `0.3.24`                    | valida conteúdo e metadata do package              |
| Are the Types Wrong  | `0.18.5`                    | valida resolução ESM/TypeScript do tarball         |
| React dev            | `19.2.8`                    | versão atual; não será empacotado                  |
| React peer           | `>=19.2.7 <20`              | cobre Sandicts 19.2.7 e Kaizen 19.2.8              |
| pnpm da fixture      | `11.25.0`                   | reproduz o package manager do Kaizen               |
| npm da fixture       | `11.13.0`                   | reproduz o package manager do Sandicts             |
| `actions/checkout`   | SHA `3d3c42e...` (`v7.0.1`) | action imutável                                    |
| `actions/setup-node` | SHA `8207627...` (`v7.0.0`) | action imutável                                    |

Todas as versões de ferramenta devem ser exatas no manifest e no lockfile. Não usar `latest` nem
intervalos para dev dependencies.

## Ordem de implementação

| Ordem | Ação     | Caminho                                | Propósito                                                       |
| ----: | -------- | -------------------------------------- | --------------------------------------------------------------- |
|     1 | Create   | `.gitattributes`                       | normalizar LF em Windows e CI                                   |
|     2 | Create   | `.editorconfig`                        | padronizar encoding, indentação e newline                       |
|     3 | Create   | `.gitignore`                           | excluir build, cache, tarball e secrets locais                  |
|     4 | Create   | `.npmrc`                               | fixar comportamento npm e mapear o scope sem token              |
|     5 | Create   | `.nvmrc`                               | fixar Node 24.20.0                                              |
|     6 | Create   | `package.json`                         | definir package, exports, peers, scripts e publicação bloqueada |
|     7 | Generate | `package-lock.json`                    | árvore reprodutível gerada por npm 11.19.0                      |
|     8 | Create   | `tsconfig.json`                        | typecheck estrito e resolução NodeNext                          |
|     9 | Create   | `tsconfig.build.json`                  | emitir ESM e declarações para `dist`                            |
|    10 | Create   | `src/index.ts`                         | entrypoint ESM deliberadamente vazio                            |
|    11 | Create   | `src/styles/styles.css`                | entrypoint CSS mínimo sem tokens                                |
|    12 | Create   | `src/index.test.ts`                    | smoke do módulo vazio                                           |
|    13 | Create   | `scripts/copy-styles.mjs`              | copiar CSS para o artefato                                      |
|    14 | Create   | `scripts/block-publish.mjs`            | impedir publicação antes da KAN-226                             |
|    15 | Create   | `scripts/validate-package.mjs`         | gerar e inspecionar um único tarball                            |
|    16 | Create   | `scripts/test-package-fixtures.mjs`    | instalar o tarball com npm e pnpm                               |
|    17 | Create   | `eslint.config.mjs`                    | lint de TS e scripts Node                                       |
|    18 | Create   | `vitest.config.ts`                     | testes rápidos em ambiente Node                                 |
|    19 | Create   | `prettier.config.mjs`                  | formato compartilhado                                           |
|    20 | Create   | `.prettierignore`                      | excluir artefatos gerados                                       |
|    21 | Create   | `fixtures/npm-consumer/package.json`   | espelhar toolchain do Sandicts                                  |
|    22 | Create   | `fixtures/npm-consumer/tsconfig.json`  | validar tipos com TypeScript 6                                  |
|    23 | Create   | `fixtures/npm-consumer/smoke.mjs`      | resolver JS e CSS com npm                                       |
|    24 | Create   | `fixtures/npm-consumer/typecheck.ts`   | consumir declarações publicadas                                 |
|    25 | Create   | `fixtures/pnpm-consumer/package.json`  | espelhar toolchain do Kaizen                                    |
|    26 | Create   | `fixtures/pnpm-consumer/tsconfig.json` | validar tipos com TypeScript 7                                  |
|    27 | Create   | `fixtures/pnpm-consumer/smoke.mjs`     | resolver JS e CSS com pnpm                                      |
|    28 | Create   | `fixtures/pnpm-consumer/typecheck.ts`  | consumir declarações publicadas                                 |
|    29 | Create   | `.changeset/config.json`               | governar SemVer futuro                                          |
|    30 | Create   | `.changeset/README.md`                 | explicar quando uma PR exige Changeset                          |
|    31 | Create   | `CHANGELOG.md`                         | registrar que ainda não há release                              |
|    32 | Create   | `.github/workflows/ci.yml`             | executar todos os gates no Linux                                |
|    33 | Create   | `.github/pull_request_template.md`     | exigir impacto público e validação do tarball                   |
|    34 | Edit     | `README.md`                            | documentar scaffold, comandos e ausência de release             |
|    35 | Edit     | `AGENTS.md`                            | registrar comandos e proibição de editar `dist`/tarballs        |
|    36 | Setting  | proteção de `main`                     | exigir PR e CI; bloquear force-push e exclusão                  |
|    37 | Edit     | Jira KAN-222                           | remover “criar repo” e anexar PR/evidências                     |

## Mudanças detalhadas por arquivo

### 1–5. Higiene e runtime

#### `.gitattributes` — Create

**Conteúdo contratual:** `* text=auto eol=lf`, com exceções binárias quando elas surgirem. Evita
novos commits corretivos de final de linha.

#### `.editorconfig` — Create

**Contrato:** UTF-8, LF, newline final, dois espaços para JSON/YAML/Markdown e quatro somente quando
um formato exigir. Markdown preserva trailing spaces.

#### `.gitignore` — Create

**Allow/deny:** ignorar `node_modules`, `dist`, `.tmp`, `coverage`, `storybook-static`, `*.tgz`,
logs e `.env*`. Não ignorar docs, fixtures ou lockfile raiz.

#### `.npmrc` — Create

**Contrato:** `save-exact=true`, `engine-strict=true` e
`@fradelli:registry=https://npm.pkg.github.com`. Não registrar `_authToken`, nem mesmo como valor de
exemplo. A autenticação de release será criada pela `actions/setup-node` na KAN-226.

#### `.nvmrc` — Create

**Valor:** `24.20.0`.

**Verificação do grupo:** checkout novo respeita LF; `nvm use` seleciona a versão esperada; busca
por `authToken`, `ghp_`, `github_pat_` e `npm_` não retorna credenciais.

### 6–7. Manifest e lockfile

#### `package.json` — Create

**Campos obrigatórios:**

- `name: "@fradelli/ui"`, `version: "0.0.0"`, `type: "module"`;
- `license: "UNLICENSED"` e links de repository/homepage/issues;
- `files: ["dist"]` e `sideEffects: ["./dist/styles.css"]`;
- `exports` para `.`, `./styles.css` e `./package.json`;
- `types: "./dist/index.d.ts"`;
- `engines.node: ">=24.20.0 <25"` e `packageManager: "npm@11.19.0"`;
- React/React DOM somente em peers e dev dependencies;
- dev dependencies exatas da tabela de versões;
- scripts `format`, `format:check`, `lint`, `typecheck`, `test`, `test:watch`, `clean`, `build`,
  `pack:check`, `fixtures:check`, `audit`, `ci`, `changeset`, `version`, `prepack` e
  `prepublishOnly`;
- `publishConfig.registry` para GitHub Packages e `access: "restricted"`;
- ausência de `private: true`, dependency de Next.js e script de publish.

**Ordem dos scripts:** `ci` executa format check → lint → typecheck → testes → build/pack → fixtures
→ audit. `prepack` executa build. `prepublishOnly` executa apenas o bloqueio explícito.

#### `package-lock.json` — Generate

Gerar somente com `npm@11.19.0` após o manifest final. Nunca editar manualmente.

**Verificação:** `npm ci` funciona em checkout limpo; `npm ls react react-dom` mostra peers
satisfeitos e nenhum Next.js.

### 8–12. TypeScript, ESM, CSS e teste mínimo

#### `tsconfig.json` — Create

Usar `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`,
`isolatedModules`, `module: NodeNext`, `moduleResolution: NodeNext`, `target: ES2022`, JSX React e
`noEmit`.

#### `tsconfig.build.json` — Create

Estender o config base, habilitar `declaration`, desabilitar `noEmit`, usar `rootDir: src`,
`outDir: dist` e excluir testes/stories. Não emitir sourcemaps no primeiro tarball para manter a
allowlist mínima.

#### `src/index.ts` — Create

Conteúdo final planejado: somente `export {};`. Nenhuma API temporária.

#### `src/styles/styles.css` — Create

Conteúdo funcional planejado: uma Cascade Layer pública vazia, acompanhada de comentário indicando
que KAN-221 incluirá tokens gerados. Não declarar cores, fontes ou Tailwind.

#### `src/index.test.ts` — Create

Importar `./index.js` e afirmar que o namespace não expõe chaves. Isso impede que o scaffold ganhe
API especulativa.

**Verificação do grupo:** `npm run typecheck`, `npm test` e `npm run build` produzem exatamente
`dist/index.js`, `dist/index.d.ts` e `dist/styles.css`.

### 13–16. Scripts do package

#### `scripts/copy-styles.mjs` — Create

Copiar `src/styles/styles.css` para `dist/styles.css` usando `node:fs/promises`. Falhar se o
CSS-fonte ou `dist` não existir.

#### `scripts/block-publish.mjs` — Create

Encerrar com código diferente de zero e mensagem: publicação pertence à KAN-226. Não ler ambiente
nem token.

#### `scripts/validate-package.mjs` — Create

Responsabilidades:

1. limpar somente `.tmp/package` por caminho absoluto derivado do repo;
2. executar `npm pack --dry-run --json --ignore-scripts`;
3. comparar os caminhos com a allowlist de seis arquivos;
4. confirmar que todos os destinos de `exports` existem;
5. inspecionar `dist` contra aliases/imports proibidos;
6. criar um tarball real em `.tmp/package`;
7. executar `publint run <tarball> --strict`;
8. executar `attw <tarball> --profile strict`;
9. imprimir o caminho do único artefato aprovado.

Allowlist inicial:

```text
package/CHANGELOG.md
package/README.md
package/dist/index.d.ts
package/dist/index.js
package/dist/styles.css
package/package.json
```

#### `scripts/test-package-fixtures.mjs` — Create

Copiar cada fixture para `.tmp/fixtures`, instalar o mesmo `.tgz` com seu package manager, executar
typecheck/smoke e analisar `list --json` para confirmar uma única versão de React e React DOM. O
script falha se houver zero ou mais de um tarball, peer inválido, export ausente ou versão
duplicada.

**Segurança:** remoções recursivas ficam restritas a `.tmp/package` e `.tmp/fixtures`, ambos
resolvidos e validados dentro da raiz do repositório.

### 17–20. Qualidade estática

#### `eslint.config.mjs` — Create

Aplicar ESLint recomendado aos scripts `.mjs` e typescript-eslint strict/stylistic type-checked aos
arquivos TS. Ignorar somente artefatos gerados. Não desabilitar regras em massa para fazer o
scaffold passar.

#### `vitest.config.ts` — Create

Ambiente Node, testes em `src/**/*.test.ts`, sem jsdom e sem coverage obrigatório enquanto não
existirem componentes.

#### `prettier.config.mjs` e `.prettierignore` — Create

Fixar LF e formato do repositório. Ignorar `dist`, `.tmp`, coverage, `storybook-static`, tarballs e
lockfiles de fixture gerados temporariamente.

### 21–28. Fixtures consumidoras

Cada fixture contém `package.json`, `tsconfig.json`, `smoke.mjs` e `typecheck.ts`. Nenhuma contém
domínio, Next.js ou lockfile versionado.

#### `fixtures/npm-consumer/*` — Create

- npm `11.13.0`, TypeScript `6.0.3`, React/React DOM `19.2.7`;
- `typecheck.ts` faz import side-effect de `@fradelli/ui` para resolver os tipos;
- `smoke.mjs` importa o módulo, confirma namespace vazio, resolve `@fradelli/ui/styles.css` e lê a
  layer pública.

#### `fixtures/pnpm-consumer/*` — Create

- pnpm `11.25.0`, TypeScript `7.0.2`, React/React DOM `19.2.8`;
- executa o mesmo contrato, provando que o tarball não depende do package manager que o construiu.

Lockfiles temporários são produzidos dentro de `.tmp`; não são fonte do package. O lockfile raiz
continua sendo o único lockfile versionado nesta história.

### 29–31. Changesets e changelog

#### `.changeset/config.json` — Create

Configurar schema oficial, changelog padrão, `commit: false`, arrays `fixed` e `linked` vazios,
`access: restricted`, `baseBranch: main`, `updateInternalDependencies: patch` e nenhum package
ignorado.

#### `.changeset/README.md` — Create

Explicar patch/minor/major, quais mudanças documentais não exigem Changeset e que publicação
continua bloqueada até KAN-226.

#### `CHANGELOG.md` — Create

Título `@fradelli/ui` e aviso de que nenhuma versão foi publicada. Não inventar uma entrada `0.1.0`.

### 32–33. GitHub

#### `.github/workflows/ci.yml` — Create

- gatilhos em PR e push para `main`;
- `permissions: contents: read`;
- concurrency com cancelamento de execução obsoleta;
- Ubuntu e timeout de 15 minutos;
- checkout e setup-node pinados pelos SHAs completos verificados;
- Node lido de `.nvmrc`, cache npm, `npm ci` e `npm run ci`;
- sem `packages: write`, secrets ou etapa de publicação.

#### `.github/pull_request_template.md` — Create

Exigir Jira, impacto público, classificação SemVer, Changeset ou justificativa, resultado do
tarball/fixtures e confirmação de ausência de domínio/secrets.

### 34–35. Documentação existente

#### `README.md` — Edit

Atualizar o estado para “scaffold instalável localmente, ainda não publicado”, documentar
requisitos, comandos de desenvolvimento, conteúdo do tarball, fixtures e mapa
KAN-221/KAN-220/KAN-226. Não adicionar comando de instalação por registry antes da primeira release.

#### `AGENTS.md` — Edit

Adicionar a sequência obrigatória `npm ci`/`npm run ci`, proibir edição de `dist`, `.tmp`, tarballs
e lockfile manual, exigir o mesmo tarball nas duas fixtures e manter o bloqueio de publicação.

### 36–37. Configuração externa e Jira

Depois que CI existir, proteger `main` para exigir PR e o job do package, impedir force-push e
exclusão. Como há um único desenvolvedor, não exigir aprovação de outra pessoa, o que bloquearia o
fluxo solo.

Atualizar KAN-222 com o repositório existente, PR, commit, comandos executados e resultado da
allowlist. A história vai para In Review, não diretamente para Concluído.

## Sequência de commits recomendada

1. `[KAN-222] chore(repository): establish package toolchain`
2. `[KAN-222] build(package): add ESM and tarball validation`
3. `[KAN-222] test(package): add npm and pnpm consumer fixtures`
4. `[KAN-222] ci(package): enforce scaffold quality gates`
5. `[KAN-222] docs(package): document local package workflow`

Uma única PR pode conter esses commits porque todos pertencem ao mesmo scaffold, mas cada commit
deve deixar o repositório em um estado compreensível.

## Validação durante a implementação

```powershell
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run pack:check
npm run fixtures:check
npm run audit
npm run ci
git diff --check
```

Resultados esperados:

- tarball com somente os seis caminhos permitidos;
- Publint e Are the Types Wrong sem warning/error;
- JS, `.d.ts` e CSS resolvidos nas duas fixtures;
- React e React DOM presentes uma vez por fixture;
- ausência de Next.js, alias `@/`, tokens, components ou domínio em `dist`;
- `npm publish --dry-run` continua bloqueado por `prepublishOnly`;
- CI remoto repete o resultado local.

## Matriz dos critérios do Jira

| Critério                                              | Evidência planejada                       |
| ----------------------------------------------------- | ----------------------------------------- |
| `npm pack --dry-run` contém somente arquivos públicos | comparação automática com allowlist       |
| Tarball contém ESM, tipos e CSS                       | allowlist + import/leitura nas fixtures   |
| Nenhum alias `@/` no artefato                         | scan recursivo de `dist`                  |
| Next.js/consumidores ausentes                         | manifest assertion + scan de `dist`       |
| Uma cópia de React                                    | análise do JSON de `npm ls` e `pnpm list` |
| CI executa gates e inspeciona tarball                 | workflow único executando `npm run ci`    |

## Critérios de aceite complementares

- [x] KAN-223 está integrada antes do início da implementação.
- [x] Todos os arquivos da ordem de implementação foram tratados.
- [x] O package não expõe API temporária.
- [x] O tarball exato passa nos dois package managers e nas duas versões de TS.
- [x] Publicação está bloqueada sem impedir `npm pack`.
- [x] Nenhuma credencial ou dado pessoal foi adicionado.
- [x] Nenhuma cor, fonte, token, Tailwind, Storybook ou component foi antecipado.
- [ ] `main` possui proteção compatível com desenvolvimento solo.
- [ ] KAN-222 contém todas as evidências e fica In Review.

## Riscos e controles

| Risco                                      | Controle                                             |
| ------------------------------------------ | ---------------------------------------------------- |
| validar `dist` mas publicar outro conteúdo | fixtures usam o mesmo `.tgz` aprovado                |
| API provisória virar contrato              | entrypoint com somente `export {}`                   |
| React duplicado                            | peers + duas fixtures + análise da árvore            |
| tipos funcionarem só em TS7                | fixture Sandicts executa TS6                         |
| config TS funcionar só com bundler         | emissão e consumo NodeNext                           |
| package publicado por acidente             | `prepublishOnly` bloqueante até KAN-226              |
| secret vazar em repo público               | `.npmrc` sem token e CI sem permissão de packages    |
| script apagar caminho amplo                | remoções limitadas e validadas dentro de `.tmp`      |
| KAN-222 absorver KAN-221/KAN-220           | ausência de Tailwind, tokens, Storybook e components |
| desenvolvimento solo ficar bloqueado       | proteção sem aprovação externa obrigatória           |

## Rollback

Antes de qualquer publicação, rollback é reverter a PR da KAN-222. Não apagar o repositório nem
reescrever histórico. Como nenhum consumidor será alterado e nenhuma versão será publicada, não
existe rollback operacional nos apps.

## Dependências e pendências

### Bloqueantes para implementar

1. integrar as PRs da KAN-223 e concluir seu contrato;
2. aprovar este plano;
3. corrigir ou desconsiderar operacionalmente o link Jira invertido sem mudar a dependência lógica.

### Não bloqueantes para o planejamento

- a licença pública pode continuar pendente, pois `UNLICENSED` representa a decisão atual;
- tokens e Storybook serão definidos na KAN-221;
- componentes serão migrados na KAN-220;
- secrets e release serão configurados na KAN-226.

## Fontes oficiais consultadas

- [npm package.json](https://docs.npmjs.com/files/package.json/)
- [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/)
- [TypeScript — TSConfig](https://www.typescriptlang.org/tsconfig/)
- [TypeScript — escolha de opções para bibliotecas](https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options)
- [GitHub Actions — Node.js](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs)
- [GitHub Packages — npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Changesets](https://github.com/changesets/changesets)
- [Are the Types Wrong CLI](https://github.com/arethetypeswrong/arethetypeswrong.github.io/tree/main/packages/cli)
- [Publint](https://publint.dev/)
