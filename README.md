# Fradelli Design System

Fonte compartilhada da identidade visual e dos primitives usados por Sandicts,
Kaizen e futuros produtos do ecossistema Fradelli.

## Estado atual

Este repositório contém somente o contrato arquitetural e as regras de
governança aprovadas na [KAN-223](https://sandicts.atlassian.net/browse/KAN-223).
Ainda não existe package publicado, código de componente, tokens executáveis ou
comando de instalação.

O scaffold técnico será criado na KAN-222. O contrato planejado é um único
package versionado chamado `@fradelli/ui`, publicado inicialmente como package
privado no GitHub Packages.

## Consumidores

- [Sandicts](https://github.com/fradelli/reactjs-sandicts-web): agendamento e
  gestão de esportes.
- [Kaizen](https://github.com/fradelli/kaizen-app): organização da vida pessoal,
  rotina saudável, dieta e tarefas.

Cada aplicativo mantém suas páginas, features, regras de negócio, integrações,
marca e ciclo de release. O Design System compartilha somente identidade,
tokens, primitives e padrões visuais sem domínio.

## Fonte normativa

- [ADR 0001 — Fundação do Design System compartilhado](docs/decisions/0001-shared-design-system-foundation.md)
- [Admissão de componentes](docs/governance/component-admission.md)
- [Versionamento e releases](docs/governance/versioning-and-releases.md)

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

