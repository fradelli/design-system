---
title: Plano de implementação da KAN-226
doc-type: implementation-guide
status: planned
last-reviewed: 2026-09-08
owners:
  - frontend
  - design-system
related-issue: KAN-226
related-repository: fradelli/design-system
---

# KAN-226 — automatizar versionamento e publicação de `@fradelli/ui`

## Status do documento

- **Escopo:** habilitar releases privadas, imutáveis e auditáveis de `@fradelli/ui` no GitHub
  Packages usando Changesets e GitHub Actions.
- **Card:** `KAN-226`; o título exato do Jira deve ser confirmado quando a integração Atlassian
  estiver autenticada novamente.
- **Repositório:** [fradelli/design-system](https://github.com/fradelli/design-system).
- **Branch recomendada:** `codex/KAN-226-automate-package-release`.
- **Base:** `main` no commit `1d695cb`, depois dos merges de KAN-221 e KAN-220.
- **Prontidão do plano:** `Ready`.
- **Evidência usada:** ADR 0001, governança de releases, manifest e workflows atuais, configuração
  remota do GitHub, dois Changesets pendentes e planos de adoção do Sandicts e Kaizen.
- **Fora do escopo:** instalar o package nos consumidores, alterar componentes/tokens, publicar em
  npmjs.org, tornar o package público, criar calendário compartilhado ou armazenar PAT no projeto.

## Resultado esperado

Ao final, todo merge em `main` executará os gates do package e seguirá um de dois caminhos:

```text
PR de feature com Changeset
  -> merge em main
  -> workflow cria/atualiza a PR de versão
  -> CI + revisão da PR de versão
  -> merge em main
  -> workflow publica no GitHub Packages
  -> tag imutável + GitHub Release
  -> Sandicts e Kaizen escolhem quando instalar a versão exata
```

A primeira PR de versão deve consolidar os dois Changesets minor já presentes. Partindo de
`0.0.0`, o resultado esperado é `@fradelli/ui@0.1.0`. A versão só é publicada depois do merge da
PR de versão; a PR técnica da KAN-226 não chama `npm publish` diretamente.

## Diagnóstico confirmado

| Item                         | Estado atual                                    | Consequência para KAN-226                                  |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| Package no registry          | inexistente; a API retorna `404`                | a execução será o primeiro publish                         |
| Versão do manifest           | `0.0.0`                                         | Changesets calcula `0.1.0` pelos minors pendentes          |
| Changesets                   | dois arquivos `minor`                           | foundations e primitives entram juntos no primeiro release |
| Registry                     | `https://npm.pkg.github.com`                    | configuração já aponta ao destino correto                  |
| Publicação                   | bloqueada por `scripts/block-publish.mjs`       | substituir o bloqueio por um guard de contexto             |
| Permissões padrão de Actions | `read`                                          | manter o padrão mínimo do repositório                      |
| Actions criando PR           | bloqueado pela política da organização          | owner deve habilitar antes do merge da PR técnica          |
| Proteção de `main`           | PR, CI, histórico linear e conversas resolvidas | a PR de versão também passará pelo gate                    |
| Exclusão de branch no merge  | habilitada                                      | conferir a exclusão da branch da KAN-226 e da release      |
| Secrets de release           | nenhum necessário                               | usar somente o `GITHUB_TOKEN` efêmero                      |

## Decisões técnicas

### Uma automação, dois comportamentos

Usar `changesets/action` em pushes para `main`:

1. com Changesets pendentes, criar ou atualizar uma única PR de versão;
2. sem Changesets pendentes, após o merge da PR de versão, executar `changeset publish`;
3. criar a tag e o GitHub Release somente depois de publicação bem-sucedida.

O action será fixado pelo SHA de `v2.1.2`:
`ae32849d5ba541f9ae29e40e22a623bc13562f51`. Não usar `@main`, `@v2` ou versão flutuante.

### Autenticação sem segredo persistente

- O workflow recebe `contents: write`, `pull-requests: write` e `packages: write` somente no
  arquivo de release.
- Publicação usa `${{ secrets.GITHUB_TOKEN }}` emitido para a própria execução.
- Não criar `NPM_TOKEN`, PAT, `.env` ou `_authToken` versionado.
- A `.npmrc` atual permanece somente com o mapeamento público do scope.
- O workflow não recebe `id-token: write`: proveniência/trusted publishing do npmjs.org não faz
  parte de uma publicação no GitHub Packages.

### Publicação permitida somente no contexto correto

O `prepublishOnly` deixa de bloquear toda publicação e passa a validar quatro condições:

- execução dentro do GitHub Actions;
- evento `push`;
- repositório `fradelli/design-system`;
- ref `refs/heads/main`;
- presença de `NODE_AUTH_TOKEN`, sem ler ou imprimir seu valor.

Isso preserva uma barreira contra `npm publish` local ou publicação a partir de PR/fork. O registry,
scope e repository continuam fixados no `package.json` e na `.npmrc`.

### Gate antes de publicar

O workflow de release repetirá `npm run ci` antes do action. Isso é intencional: o CI comum e o
release são execuções paralelas após o merge, portanto aguardar apenas o outro workflow criaria uma
corrida. A publicação deve provar por conta própria formatação, lint, tipos, testes, Storybook,
tarball, fixtures e auditoria.

### Visibilidade e acesso

O primeiro package do npm registry no GitHub nasce privado. Como ele fica ligado a um repositório
público pelo campo `repository`, após o primeiro publish é obrigatório revisar a tela do package:

1. confirmar visibilidade `Private`;
2. desligar herança de acesso do repositório público;
3. manter `fradelli/design-system` com acesso administrativo para Actions;
4. conceder `Read` em **Manage Actions access** a `fradelli/reactjs-sandicts-web` e
   `fradelli/kaizen-app`;
5. não conceder `Write` aos consumidores.

Esse ajuste não instala nada nos apps; apenas prepara credenciais efêmeras de leitura para as PRs
de adoção posteriores.

## Ordem de implementação

| Ordem | Ação         | Caminho/alvo                                                       | Propósito                                               |
| ----: | ------------ | ------------------------------------------------------------------ | ------------------------------------------------------- |
|     1 | Setting      | GitHub Actions > General                                           | permitir que o action abra a PR de versão               |
|     2 | Branch       | `codex/KAN-226-automate-package-release`                           | isolar a implementação a partir de `main` atualizado    |
|     3 | Rename/Edit  | `scripts/block-publish.mjs` → `scripts/verify-publish-context.mjs` | trocar bloqueio absoluto por guard seguro               |
|     4 | Create       | `src/testing/publish-context.test.ts`                              | testar sucesso e recusas do guard                       |
|     5 | Create       | `src/testing/release-configuration.test.ts`                        | proteger registry, scripts, permissões e SHA do action  |
|     6 | Edit         | `package.json`                                                     | adicionar `release` e apontar `prepublishOnly` ao guard |
|     7 | Create       | `.github/workflows/release.yml`                                    | criar/atualizar PR de versão e publicar                 |
|     8 | Create       | `docs/governance/releasing.md`                                     | documentar operação, primeiro release e recuperação     |
|     9 | Edit         | `.changeset/README.md`                                             | substituir texto provisório pelo processo real          |
|    10 | Edit         | `CHANGELOG.md`                                                     | remover aviso temporário que ficaria obsoleto           |
|    11 | Edit         | `README.md`                                                        | documentar distribuição e consumo autenticado           |
|    12 | Edit         | `AGENTS.md`                                                        | substituir bloqueio KAN-226 pelas regras definitivas    |
|    13 | Validate     | local + PR                                                         | executar o gate integral sem publicar                   |
|    14 | Merge        | PR técnica KAN-226                                                 | acionar criação automática da PR de versão              |
|    15 | Review/Merge | PR de versão                                                       | aprovar `0.1.0`, changelog e remoção dos Changesets     |
|    16 | Setting      | package `@fradelli/ui`                                             | fixar visibilidade privada e acessos dos consumidores   |
|    17 | Evidence     | GitHub/Jira                                                        | registrar package, tag, release, workflow e rollback    |

## Mudanças detalhadas

### 1. Configuração do GitHub Actions

**Ação:** solicitar ao owner da organização a alteração da política e confirmar a configuração
remota antes do primeiro merge.

O repositório atualmente retorna:

```json
{
  "default_workflow_permissions": "read",
  "can_approve_pull_request_reviews": false
}
```

Uma tentativa no nível do repositório retorna `409` porque a organização não permite esse recurso.
O owner deve habilitar **Allow GitHub Actions to create and approve pull requests** em
`fradelli` → **Settings** → **Actions** → **General**. Depois, manter o default do repositório como
`read` e habilitar a opção local:

```powershell
gh api --method PUT repos/fradelli/design-system/actions/permissions/workflow `
  -f default_workflow_permissions=read `
  -F can_approve_pull_request_reviews=true
```

Verificação:

```powershell
gh api repos/fradelli/design-system/actions/permissions/workflow
```

Esperado: `default_workflow_permissions` continua `read` e
`can_approve_pull_request_reviews` passa a `true`. O workflow declara permissões maiores somente no
job de release. Não integrar a PR técnica enquanto o retorno continuar `false`.

### 2. `scripts/verify-publish-context.mjs`

**Ação:** renomear `scripts/block-publish.mjs` e substituir seu conteúdo integralmente.

```js
const requiredContext = {
  GITHUB_ACTIONS: "true",
  GITHUB_EVENT_NAME: "push",
  GITHUB_REPOSITORY: "fradelli/design-system",
  GITHUB_REF: "refs/heads/main",
};

for (const [name, expected] of Object.entries(requiredContext)) {
  if (process.env[name] !== expected) {
    console.error(`Publicação recusada: ${name} não corresponde ao contexto de release.`);
    process.exit(1);
  }
}

if (!process.env.NODE_AUTH_TOKEN) {
  console.error("Publicação recusada: credencial efêmera do registry ausente.");
  process.exit(1);
}

console.log("Contexto de publicação validado para main em fradelli/design-system.");
```

O script não imprime valores recebidos, não aceita fallback e não conhece PAT. A mensagem identifica
a condição inválida sem expor a credencial.

### 3. `src/testing/publish-context.test.ts`

**Ação:** criar.

```ts
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = fileURLToPath(
  new URL("../../scripts/verify-publish-context.mjs", import.meta.url),
);

const validEnvironment = {
  ...process.env,
  GITHUB_ACTIONS: "true",
  GITHUB_EVENT_NAME: "push",
  GITHUB_REPOSITORY: "fradelli/design-system",
  GITHUB_REF: "refs/heads/main",
  NODE_AUTH_TOKEN: "non-secret-test-value",
};

function run(overrides: NodeJS.ProcessEnv = {}) {
  return spawnSync(process.execPath, [scriptPath], {
    encoding: "utf8",
    env: { ...validEnvironment, ...overrides },
  });
}

const invalidContexts: Array<[string, NodeJS.ProcessEnv]> = [
  ["execução local", { GITHUB_ACTIONS: "false" }],
  ["pull request", { GITHUB_EVENT_NAME: "pull_request" }],
  ["outro repositório", { GITHUB_REPOSITORY: "fradelli/fork" }],
  ["outra ref", { GITHUB_REF: "refs/heads/feature" }],
  ["sem token", { NODE_AUTH_TOKEN: "" }],
];

describe("publish context guard", () => {
  it("aceita somente o workflow de push em main", () => {
    const result = run();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Contexto de publicação validado");
  });

  it.each(invalidContexts)("recusa %s", (_scenario, environment) => {
    const result = run(environment);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Publicação recusada");
    expect(result.stdout).not.toContain("non-secret-test-value");
    expect(result.stderr).not.toContain("non-secret-test-value");
  });
});
```

O teste entra automaticamente no projeto unitário por estar sob `src/**/*.test.ts` e continua fora
do build público por `tsconfig.build.json`.

### 4. `src/testing/release-configuration.test.ts`

**Ação:** criar.

O teste lê o manifest e o workflow como artefatos de configuração e protege os invariantes de
release: registry restrito, scripts exatos, permissões necessárias, action pinado por SHA,
`GITHUB_TOKEN` efêmero e ausência de gatilho manual.

```ts
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const repositoryRoot = new URL("../../", import.meta.url);

describe("release configuration", () => {
  it("keeps publication on GitHub Packages behind the release guard", async () => {
    const packageJson = JSON.parse(
      await readFile(new URL("package.json", repositoryRoot), "utf8"),
    ) as {
      publishConfig: { access: string; registry: string };
      scripts: Record<string, string>;
    };

    expect(packageJson.publishConfig).toEqual({
      access: "restricted",
      registry: "https://npm.pkg.github.com",
    });
    expect(packageJson.scripts.release).toBe("changeset publish");
    expect(packageJson.scripts.prepublishOnly).toBe("node scripts/verify-publish-context.mjs");
  });

  it("pins actions and grants write permissions only in the release workflow", async () => {
    const workflow = await readFile(
      new URL(".github/workflows/release.yml", repositoryRoot),
      "utf8",
    );

    expect(workflow).toContain("contents: write");
    expect(workflow).toContain("pull-requests: write");
    expect(workflow).toContain("packages: write");
    expect(workflow).toContain("changesets/action@ae32849d5ba541f9ae29e40e22a623bc13562f51");
    expect(workflow).toContain("NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}");
    expect(workflow).not.toContain("workflow_dispatch");
  });
});
```

### 5. `package.json`

**Ação:** editar somente scripts; nenhum dependency novo e nenhuma alteração manual no lockfile.

Trecho final:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "npm run test:unit",
    "test:unit": "vitest run --project unit",
    "test:storybook": "vitest run --project storybook",
    "test:watch": "vitest",
    "clean": "node -e \"import('node:fs/promises').then(({rm}) => rm('dist', { recursive: true, force: true }))\"",
    "tokens:build": "node scripts/build-tokens.mjs",
    "tokens:check": "node scripts/build-tokens.mjs --check",
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build --output-dir storybook-static",
    "build": "npm run clean && npm run tokens:check && tsc -p tsconfig.build.json && node scripts/copy-styles.mjs",
    "pack:check": "npm run build && node scripts/validate-package.mjs",
    "fixtures:check": "node scripts/test-package-fixtures.mjs",
    "audit": "npm audit --audit-level=high",
    "ci": "npm run format:check && npm run lint && npm run typecheck && npm run test:unit && npm run tokens:check && npm run storybook:build && npm run test:storybook && npm run pack:check && npm run fixtures:check && npm run audit",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "changeset publish",
    "prepack": "npm run build",
    "prepublishOnly": "node scripts/verify-publish-context.mjs"
  }
}
```

Na implementação, preservar todos os demais campos exatamente como estão. Como não há alteração de
dependência ou metadata capturada no lockfile, `package-lock.json` não deve mudar.

### 6. `.github/workflows/release.yml`

**Ação:** criar.

```yaml
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write
  packages: write

concurrency:
  group: release-main
  cancel-in-progress: false

jobs:
  release:
    name: Version or publish package
    if: github.repository == 'fradelli/design-system'
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - name: Checkout
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0
          persist-credentials: false
      - name: Setup Node.js
        uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version-file: .nvmrc
          cache: npm
          registry-url: https://npm.pkg.github.com
          scope: "@fradelli"
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Chromium
        run: npx playwright install --with-deps chromium
      - name: Validate releasable package
        run: npm run ci
      - name: Create version pull request or publish
        uses: changesets/action@ae32849d5ba541f9ae29e40e22a623bc13562f51 # v2.1.2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          publish-script: npm run release
          version-script: npm run version
          commit-message: "[KAN-226] chore(release): version @fradelli/ui"
          pr-title: "[KAN-226] Version @fradelli/ui"
          pr-base-branch: main
          create-github-releases: true
          push-git-tags: true
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Notas de integração:

- não adicionar `workflow_dispatch`; uma falha operacional é retomada pelo **Re-run failed jobs**
  da mesma execução, preservando o evento `push` esperado pelo guard;
- `cancel-in-progress: false` impede que um novo merge interrompa uma publicação em andamento;
- `persist-credentials: false` é compatível com o action, que usa a API do GitHub;
- o workflow de CI atual permanece separado e somente com `contents: read`.

### 7. `docs/governance/releasing.md`

**Ação:** criar runbook operacional.

O documento deve conter, nesta ordem:

1. pré-condições: Changeset na PR pública, CI verde e impacto SemVer revisado;
2. fluxo automático feature PR → version PR → publish;
3. checklist da PR de versão: versão, changelog, Changesets removidos e CI;
4. verificação do package, tag e GitHub Release;
5. configuração única de visibilidade e Actions access após o primeiro publish;
6. autenticação local somente no perfil do usuário com PAT classic `read:packages`;
7. consumo em CI com `GITHUB_TOKEN` e `packages: read` depois do acesso explícito;
8. recuperação por reexecução do workflow quando a versão ainda não foi publicada;
9. rollback por patch corretivo no produtor ou versão exata anterior no consumidor;
10. proibição de sobrescrever, apagar ou republicar uma versão existente.

Comandos seguros de verificação, executados em ambiente já autenticado:

```powershell
npm view '@fradelli/ui@0.1.0' name version dist-tags `
  --registry=https://npm.pkg.github.com
gh release view '@fradelli/ui@0.1.0' --repo fradelli/design-system
git ls-remote --tags origin '@fradelli/ui@0.1.0'
```

Não incluir valor de token, exemplo de PAT ou `.npmrc` autenticado no runbook.

### 8. `.changeset/README.md`

**Ação:** substituir o conteúdo integralmente.

```markdown
# Changesets

Mudanças que alterem API, estilos ou comportamento público devem incluir um Changeset e seguir
`docs/governance/versioning-and-releases.md`.

## Fluxo

1. Crie o Changeset na PR de implementação com `npm run changeset`.
2. Classifique a mudança como patch, minor ou major conforme a governança.
3. Depois do merge, o workflow `Release` cria ou atualiza a PR de versão.
4. Revise versão e changelog gerados antes de integrar essa PR.
5. O merge da PR de versão publica uma versão imutável no GitHub Packages.

Documentação e mudanças internas sem efeito no artefato podem registrar na PR por que não exigem
Changeset. Nunca edite uma versão já publicada nem execute publicação fora do workflow de `main`.
```

### 9. `CHANGELOG.md`

**Ação:** remover somente o aviso temporário de que a publicação está bloqueada.

Conteúdo antes da PR automática de versão:

```markdown
# Changelog

Todas as mudanças relevantes de `@fradelli/ui` são registradas neste arquivo pela automação de
Changesets.
```

A PR de versão será a única responsável por adicionar a seção `0.1.0`; não escrever essa seção na
PR técnica.

### 10. `README.md`

**Ação:** editar as seções `Estado atual` e `Desenvolvimento` e criar `Releases`.

Mudanças exatas de conteúdo:

- trocar “o package ainda não está publicado” por “o package é distribuído privadamente pelo
  GitHub Packages” somente depois da primeira publicação;
- durante a PR técnica, explicar que o workflow está habilitado e que a primeira versão será criada
  pela PR automática;
- documentar `npm run changeset`, sem expor autenticação;
- ligar `docs/governance/releasing.md`;
- manter a instalação dos consumidores fora do README até existir uma versão real;
- depois de `0.1.0`, mostrar instalação com versão exata, nunca `latest` ou caret.

Exemplo que só entra após a primeira publicação:

```bash
npm install --save-exact @fradelli/ui@0.1.0
```

### 11. `AGENTS.md`

**Ação:** substituir a regra temporária da KAN-226 por regras permanentes.

Texto final para o bloco de publicação:

```markdown
- Releases são feitas exclusivamente pelo workflow `Release`, a partir de `main`, com Changesets.
- Nunca execute `npm publish` localmente nem adicione PAT, `_authToken`, `.env` ou `.npmrc`
  autenticado ao repositório.
- Toda mudança pública deve declarar impacto SemVer e incluir Changeset, salvo justificativa
  documental explícita na PR.
- Versões publicadas são imutáveis; corrija com nova versão e faça rollback nos consumidores pela
  versão exata anterior.
```

### 12. Arquivos deliberadamente inalterados

| Arquivo                    | Motivo                                                 |
| -------------------------- | ------------------------------------------------------ |
| `.npmrc`                   | já mapeia `@fradelli` sem token                        |
| `.changeset/config.json`   | já usa `main`, acesso `restricted` e Changesets 3      |
| `.github/workflows/ci.yml` | já é o gate read-only correto para PRs                 |
| `package-lock.json`        | nenhuma dependência ou campo lockado muda              |
| dois Changesets atuais     | são a fonte legítima da primeira versão minor          |
| `dist/**`                  | artefato gerado; nunca editar ou versionar manualmente |

## Sequência de commits recomendada

1. `[KAN-226] ci(release): automate package publication`
2. `[KAN-226] test(release): guard publish context`
3. `[KAN-226] docs(release): document versioning runbook`

A PR deve marcar **sem Changeset próprio**, com justificativa: a automação não altera API, estilo ou
comportamento do consumidor; os dois Changesets minor já existentes descrevem o conteúdo de
`0.1.0`.

## Validação da PR técnica

```powershell
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
npm run ci
npm publish --dry-run
git diff --check
```

Resultados esperados:

- todos os gates passam;
- testes do guard cobrem contexto válido e todas as recusas;
- `npm publish --dry-run` local falha em `prepublishOnly` antes de qualquer upload;
- o tarball continua com a allowlist atual e sem credencial;
- o diff não contém `NODE_AUTH_TOKEN` com valor, `_authToken`, PAT ou secret novo;
- PR técnica não altera `version`, não remove Changesets e não cria tag.

Validação estrutural adicional:

```powershell
git grep -n -E 'g[h]p_|g[i]thub_pat_|//npm\.pkg\.github\.com/:_[a]uthToken='
gh api repos/fradelli/design-system/actions/permissions/workflow
gh api repos/fradelli/design-system/branches/main/protection
```

A busca de secrets deve retornar vazia. A proteção deve continuar exigindo `Validate package`, sem
force-push nem exclusão de `main`.

## Validação da PR de versão

Antes do merge, conferir:

- `package.json` mudou de `0.0.0` para `0.1.0`;
- `package-lock.json` acompanha somente a versão raiz;
- `CHANGELOG.md` contém as entradas de foundations e primitives;
- os dois arquivos de Changeset foram removidos;
- nenhuma mudança de source foi adicionada à PR automática;
- `Validate package` está verde.

Após o merge, conferir:

```powershell
gh run list --repo fradelli/design-system --workflow Release --limit 3
gh release view '@fradelli/ui@0.1.0' --repo fradelli/design-system
git ls-remote --tags origin '@fradelli/ui@0.1.0'
```

Em ambiente autenticado para Packages:

```powershell
npm view '@fradelli/ui@0.1.0' name version `
  --registry=https://npm.pkg.github.com
```

Esperado: package, tag e release referenciam exatamente `0.1.0` e o workflow termina com sucesso.

## Configuração pós-primeiro publish

Como a configuração granular só existe depois que o package nasce:

1. abrir `fradelli` → **Packages** → `ui` → **Package settings**;
2. confirmar **Private**;
3. desmarcar **Inherit access from repository**;
4. em **Manage Actions access**, conferir `fradelli/design-system` como `Admin`;
5. adicionar `fradelli/reactjs-sandicts-web` com `Read`;
6. adicionar `fradelli/kaizen-app` com `Read`;
7. registrar evidência textual na KAN-226, sem screenshot de token ou configuração local;
8. não mudar o package para público.

## Critérios de aceite

- [ ] A opção para Actions criar PRs está habilitada, preservando permissões padrão `read`.
- [ ] A PR técnica passa em `npm run ci` e não publica nada.
- [ ] Publicação local e em PR/fork é recusada pelo guard.
- [ ] O workflow usa Actions pinadas por SHA e somente `GITHUB_TOKEN` efêmero.
- [ ] O merge da PR técnica cria uma única PR de versão.
- [ ] A PR de versão calcula `0.1.0`, atualiza changelog e consome os dois Changesets.
- [ ] O merge da PR de versão publica `@fradelli/ui@0.1.0` uma única vez.
- [ ] Tag e GitHub Release correspondentes são criadas.
- [ ] O package permanece privado e sem herança de acesso do repositório público.
- [ ] Design System mantém acesso administrativo; Sandicts e Kaizen recebem somente leitura.
- [ ] Nenhuma credencial aparece no Git, logs documentados ou artefato npm.
- [ ] As branches da KAN-226 e da PR de versão são excluídas após seus merges.
- [ ] Jira recebe links das duas PRs, workflow, versão, tag e evidência de validação.

## Riscos e controles

| Risco                                                     | Controle                                               |
| --------------------------------------------------------- | ------------------------------------------------------ |
| package ruim ser publicado enquanto o CI comum ainda roda | release executa seu próprio `npm run ci`               |
| workflow abrir PR com token excessivo                     | permissões declaradas só no workflow de release        |
| segredo persistente vazar                                 | usar `GITHUB_TOKEN`; nenhum secret de repositório      |
| publicação local acidental                                | `prepublishOnly` valida repo, evento, ref e token      |
| duas execuções publicarem juntas                          | concurrency fixa e `cancel-in-progress: false`         |
| versão ser sobrescrita                                    | registry imutável + Changesets + nova versão corretiva |
| package privado herdar acesso de repo público             | remover herança após o primeiro publish                |
| consumidor receber escrita                                | conceder somente `Read` em Manage Actions access       |
| branch automática ficar acumulada                         | configuração `delete_branch_on_merge` já habilitada    |
| primeira versão ignorar conteúdo existente                | preservar e consumir os dois Changesets minor          |

## Rollback e recuperação

### Antes da primeira publicação

Reverter a PR técnica. O guard antigo pode ser restaurado e o workflow removido sem impacto em
consumidores. Não apagar histórico nem desproteger `main`.

### Falha antes do upload

Corrigir a causa e reexecutar o job falho. Não editar versão/tag manualmente. Se a PR de versão
ainda estiver aberta, a correção entra em PR normal e o Changesets action a atualiza.

### Falha depois do upload

A versão publicada é imutável. Não deletar/republicar `0.1.0`. Criar uma correção com Changeset
patch e publicar `0.1.1`. Consumidores que já adotaram revertem para a versão exata anterior.

### Falha de acesso dos consumidores

Corrigir **Manage Actions access** do package; não tornar o package público, não copiar source e não
adicionar PAT ao repositório consumidor.

## Dependências e handoff

- KAN-221 e KAN-220 já estão em `main` e forneceram os Changesets do primeiro release.
- KAN-226 desbloqueia a adoção versionada no Sandicts e a E04-T08 no Kaizen.
- A homologação de tarball do Kaizen (E04-T07) pode validar o mesmo conteúdo antes do merge da PR de
  versão; a integração permanente espera `0.1.0` publicado.
- A autenticação Atlassian indisponível não bloqueia a engenharia, mas título, status e descrição
  exatos do card devem ser reconciliados antes de atualizar o Jira.

## Fontes oficiais

- [GitHub Packages — npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [GitHub Packages — acesso e visibilidade](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility)
- [Changesets Action](https://github.com/changesets/action)
- [Changesets](https://github.com/changesets/changesets)
