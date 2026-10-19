# ADR 0005 — Liberação de vidro por etapas de consumo

- **Status:** aceita pelo mantenedor
- **Data:** 2026-10-19
- **História:** KAN-226
- **Decisão:** substitui somente o requisito da ADR 0003 de validar os três aplicativos antes da primeira publicação; preserva os contratos das ADRs 0001, 0003 e 0004.

## Contexto e autorização

O pacote e o catálogo foram validados; o portfólio foi migrado ao candidato e revisado pelo mantenedor. Kaizen e Sandicts seguem fora desta entrega.

Em 19/10/2026, o mantenedor autorizou explicitamente a exceção para publicar a versão 0.5.0 após validar o pacote e o portfólio, deixando a migração e a validação de Kaizen e Sandicts para entregas futuras. A decisão é registrada também na PR de versão #14.

## Decisão

Liberar a minor incompatível 0.5.0 com validação do pacote e evidência do portfólio. Os aplicativos fixam versões independentes: publicar o pacote não atualiza Kaizen ou Sandicts. Esses consumidores precisam de suas próprias migrações, validações e autorizações antes de instalar a nova versão.

Não se declara aprovação de telas, contraste, desempenho ou compatibilidade desses dois produtos. A exceção limita-se à primeira publicação desta evolução e não dispensa os checks técnicos do pacote.

## Evidências e limites

- `npm run ci` passou no pacote 0.5.0: 43 testes unitários, 49 stories Chromium, tokens, build, tarball, fixtures npm/pnpm com uma única instância de React e auditoria da árvore raiz sem achados.
- A CI da PR passou após alinhar manifesto e lockfile em 0.5.0: execução 39306694188.
- No portfólio, o gate local passou com 19 testes e build de produção. Cards foram conferidos em 320 px nos dois idiomas e em 375, 640 e 768 px em inglês, sem overflow interno; links e organização das habilidades foram exercitados por teclado.
- Zoom real de 200%, matriz de preferências de transparência e simulação de envio válido permanecem limitações da revisão do consumidor. Não houve envio de email.
- A fixture de ferramenta Tailwind mantém quatro avisos altos preexistentes, descritos nas evidências do pacote; isso não altera o resultado da auditoria da árvore raiz.

## Operação e reversão

Publicar exclusivamente pelo workflow Release e Changesets. O portfólio instalará a versão exata publicada e repetirá instalação limpa e CI antes da promoção.

Reverter consumidores pelo conjunto de código, CSS, manifesto e lockfile. Uma correção do pacote usa nova versão imutável; não sobrescrever nem excluir versões publicadas.
