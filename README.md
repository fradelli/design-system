# Fradelli Design System

Fonte compartilhada da identidade visual e dos primitives usados por Sandicts,
Kaizen e futuros produtos do ecossistema Fradelli.

## Estado atual

Este repositório contém o contrato arquitetural, as regras de governança e o
package `@fradelli/ui`. A fundação visual é dark-first e inclui tokens de cor,
tipografia, espaçamento, radius, foco e motion, além dos primeiros primitives
compartilhados. O workflow de release está preparado para publicar o package
privadamente no GitHub Packages.

O scaffold da [KAN-222](https://sandicts.atlassian.net/browse/KAN-222) produz um
tarball ESM com declarações TypeScript e um entrypoint CSS explícito. A primeira
versão será criada por uma PR automática de Changesets; a integração do workflow
não publica diretamente a partir da PR técnica.

## Desenvolvimento

Use Node.js `24.20.0` e npm `11.19.0`:

```bash
npm ci
npm run ci
```

Os gates incluem formatação, lint, tipos, testes, build, inspeção do tarball,
compatibilidade com consumidores npm e pnpm e auditoria de dependências. Para
validar apenas o artefato instalável, execute `npm run pack:check`.

Mudanças públicas devem incluir sua intenção de versão:

```bash
npm run changeset
```

### Tokens e Storybook

Os arquivos `tokens/*.json` são a fonte editável. O CSS gerado é versionado para
revisão, mas não deve ser alterado manualmente:

```bash
npm run tokens:build
npm run tokens:check
npm run storybook
```

O consumidor importa o CSS uma vez:

```css
@import "@fradelli/ui/styles.css";
```

Em Tailwind CSS 4, importe também o framework e declare explicitamente o source
do package instalado. O caminho pode variar conforme a folha de estilo do app:

```css
@import "tailwindcss";
@import "@fradelli/ui/styles.css";
@source "../node_modules/@fradelli/ui/dist";
```

Cada aplicativo carrega Inter no root e define `--font-inter`. O package usa
fallbacks de sistema e não distribui arquivos da fonte.

### Components

Components e o helper `cn` são expostos somente por subpaths explícitos:

```tsx
import { Button } from "@fradelli/ui/button";
import { Field, FieldDescription, FieldLabel } from "@fradelli/ui/field";
import { Input } from "@fradelli/ui/input";
import { cn } from "@fradelli/ui/cn";
```

Os subpaths disponíveis são `alert`, `alert-dialog`, `badge`, `button`, `card`,
`cn`, `field`, `input`, `label`, `loading-region`, `pending-button`, `separator`,
`sheet`, `skeleton` e `status-badge`. O entrypoint raiz permanece vazio
intencionalmente para não unir boundaries de cliente e servidor.

Labels, descrições e erros são associados pelo consumidor com atributos HTML:

```tsx
<Field data-invalid="true">
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" aria-describedby="email-help email-error" aria-invalid="true" />
  <FieldDescription id="email-help">Used for account access.</FieldDescription>
  <FieldError id="email-error">Email is required.</FieldError>
</Field>
```

O `SheetContent` exige `closeLabel`. Essa copy deve vir do sistema de i18n do
aplicativo:

```tsx
<SheetContent closeLabel={messages.closePanel}>...</SheetContent>
```

## Consumidores

- [Sandicts](https://github.com/fradelli/reactjs-sandicts-web): agendamento e
  gestão de esportes.
- [Kaizen](https://github.com/fradelli/kaizen-app): organização da vida pessoal,
  rotina saudável, dieta e tarefas.

Cada aplicativo mantém suas páginas, features, regras de negócio, integrações,
marca e ciclo de release. O Design System compartilha somente identidade,
tokens, primitives e padrões visuais sem domínio.

## Releases

Releases usam Semantic Versioning e são produzidas exclusivamente pelo workflow
`Release`. Um merge com Changesets cria ou atualiza uma PR de versão; somente o
merge dessa PR publica no GitHub Packages e cria a tag e o GitHub Release.

Credenciais nunca são versionadas. O produtor usa o `GITHUB_TOKEN` efêmero, e
cada consumidor recebe apenas acesso de leitura ao package. Consulte o
[runbook de releases](docs/governance/releasing.md) para revisão, autenticação,
verificação e rollback.

## Fonte normativa

- [ADR 0001 — Fundação do Design System compartilhado](docs/decisions/0001-shared-design-system-foundation.md)
- [Admissão de componentes](docs/governance/component-admission.md)
- [Versionamento e releases](docs/governance/versioning-and-releases.md)
- [Operação de releases](docs/governance/releasing.md)

O ADR 0001 é a fonte normativa. Documentos nos aplicativos consumidores devem
apontar para ele, sem manter cópias independentes da decisão.

## Limites

Pertencem ao Design System: tokens, tipografia, radius, foco, motion, estados
visuais genéricos, primitives acessíveis e padrões comprovadamente comuns.

Não pertencem ao Design System: calendários completos, reservas, quadras,
treinos, dieta, hábitos, tarefas, rotas, autenticação, API, i18n, providers,
shells, páginas, logos ou arte específica de produto.

## Licença

Este repositório público ainda não possui um arquivo `LICENSE`. A visibilidade
do código-fonte não deve ser interpretada como concessão automática de direito
de reutilização. A política de licença será decidida antes de uma eventual
distribuição pública do package.
