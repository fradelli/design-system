# Repository instructions

## Contexto obrigatório

- Leia `docs/decisions/0001-shared-design-system-foundation.md` antes de mudar
  arquitetura, API pública, tokens ou ownership.
- Leia o documento correspondente em `docs/governance/` antes de admitir um
  componente ou classificar um release.
- Escreva documentação normativa em português do Brasil e mantenha nomes de API
  em inglês.

## Fronteiras

- Este repositório compartilha identidade, tokens, primitives e padrões visuais
  sem domínio.
- Não adicione reservas, quadras, treinos, dieta, hábitos, tarefas, páginas,
  rotas, autenticação, API, i18n, providers, logos ou arte de produto.
- Não adicione dependência de Next.js. React e React DOM devem permanecer peers.
- Não crie flags de produto como `product`, `sandictsVariant` ou
  `kaizenVariant`.
- Não adicione dependência, abstraction ou componente sem consumidor e
  justificativa verificável.

## Segurança e publicação

- Nunca versione tokens, credenciais, `.env`, `.npmrc` autenticado, caminhos
  pessoais ou dados de usuário.
- O repositório é público. Revise novos arquivos assumindo leitura externa.
- Versões publicadas são imutáveis; use patch corretivo ou rollback no
  consumidor.

## Entrega

- Relacione branches, commits e PRs ao card Jira correspondente, usando o padrão
  `codex/KAN-123-descricao` quando aplicável.
- Classifique mudanças públicas segundo SemVer e inclua Changeset quando a
  automação existir.
- Valide formatação, lint, tipos, testes, build e tarball conforme os scripts
  disponíveis. O gate completo é `npm run ci`; para mudanças apenas documentais,
  execute ao menos `npm run format:check` e `git diff --check`.
- Não edite `dist/`, `.tmp/`, tarballs ou lockfiles de fixtures manualmente. São
  artefatos gerados e não devem ser versionados.
- Mantenha imports relativos do source compatíveis com NodeNext, incluindo a
  extensão `.js` quando houver módulo relativo emitido.
- Nunca edite `src/styles/tokens.generated.css` manualmente. Altere os arquivos
  DTCG em `tokens/` e execute `npm run tokens:build`.
- A publicação está intencionalmente bloqueada até a KAN-226. Não remova o
  `prepublishOnly` nem adicione tokens ou permissão `packages: write` antes dela.
- Um novo ADR substitui uma decisão aceita; não reescreva silenciosamente o
  histórico arquitetural.
