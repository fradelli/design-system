# Publicação do Storybook

## Escopo

O site público do catálogo é `https://fradelli.github.io/design-system/`. A hospedagem usa GitHub Pages, com GitHub Actions como origem. O catálogo acompanha main e pode mostrar mudanças ainda não distribuídas em uma versão do pacote. Publicação de pacote permanece exclusivamente no workflow Release; este fluxo não executa npm publish.

## Fluxo

1. PRs executam o check Validate package, sem upload ou deploy de Pages.
2. Em push para main ou execução manual nessa branch, o job validate instala as dependências e executa npm run ci.
3. Depois do gate aprovado, o job envia storybook-static como artefato github-pages, com retenção de sete dias.
4. O job Publish Storybook depende de validate, usa o environment github-pages e publica exatamente esse artefato.
5. A URL efetiva é registrada no environment pelo output da ação de deploy.

As execuções de main são serializadas pelo grupo de concorrência do CI; não se cancela uma publicação em andamento para iniciar outra. PRs continuam cancelando execuções anteriores da própria ref. Execuções pendentes intermediárias podem ser substituídas pela mais recente. Nenhuma execução de PR recebe permissões de publicação.

## Configuração do repositório

- Pages: origem GitHub Actions, sem domínio customizado inicialmente.
- Environment github-pages: política de branches customizada permitindo somente main.
- Token do workflow: contents read no padrão; pages write e id-token write apenas no job deploy.
- Ações oficiais configure-pages v6.0.0, upload-pages-artifact v5.0.0 e deploy-pages v5.0.1 fixadas por SHA. Não há PAT ou segredo novo para hospedar o site.

O build usa caminhos relativos para manager, iframe e assets. Não se força uma base global que altere desenvolvimento ou testes. A configuração deve ser revista caso um caminho absoluto seja introduzido futuramente. storybook-static continua ignorado e não é commitado.

## Verificação

- Confirmar o check Validate package e o job Publish Storybook aprovados no commit publicado.
- Abrir a página e links diretos de stories sob /design-system/?path=..., recarregando-os.
- Verificar Foundations, Card, PendingButton, Alert, Sheet, Popover e Patterns/Form, incluindo interações e teclado.
- Conferir manager, iframe, CSS, JavaScript e ícones sem erros de caminho; verificar a prévia móvel.
- Conferir que exemplos demonstrativos não executam operações reais de email, conta ou produto.
- Registrar SHA, execução e URL no diário de entrega. Não registrar tokens ou dados de autenticação.

## Execução manual e recuperação

Para repetir a publicação da versão atual, executar o workflow CI por workflow_dispatch com ref main. O gate completo será repetido antes do deploy. Dispatch em outra branch não publica.

Uma falha de validação ou build impede o upload/deploy e preserva o último site publicado. Para recuperar uma versão anterior, preferir uma PR de reversão para main, com CI e nova publicação. Não usar force push nem desativar checks. Se for necessária uma republicação exata de artefato anterior, revisar o run e a retenção e executar pelo procedimento suportado pelo GitHub, com autorização correspondente; a execução manual padrão publica a main atual.

## Versionamento e limites

Este fluxo e sua documentação não alteram API, estilos ou comportamento da biblioteca e dispensam Changeset. Alterações de componentes/tokens continuam exigindo sua classificação própria. O site público não concede acesso ao pacote privado e não atualiza aplicativos.

O catálogo usa o ambiente de fonte disponível; a família Inter é fornecida pelo consumidor ou cai no fallback configurado. Avaliação com leitores de tela e telas reais dos consumidores permanece parte da adoção do Design System.

## Validação da configuração inicial

O gate local passou com 43 testes unitários e 49 exemplos em Chromium, além de tokens, build, tarball, fixtures npm/pnpm e auditoria do repositório com zero achados. A fixture de CSS mantém os alertas preexistentes registrados no histórico. A estrutura YAML e as permissões foram conferidas; testes de configuração verificam dependência de validação e ausência de permissões de deploy no job de PR.

O build estático foi servido em /design-system/ e inspecionado no navegador: Card e PendingButton carregaram, a interação de carregamento funcionou e o link direto preservou a seleção após recarregar. O backend Pages está configurado por workflow, com HTTPS e branch main exclusiva no environment. O primeiro deployment público deve ser confirmado pela execução de main.
