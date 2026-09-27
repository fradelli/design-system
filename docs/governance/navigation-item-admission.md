# Admissão de NavigationItem

Primitive fundamental de link, não uma barra composta ou shell. Não conhece
rotas, providers, textos, permissões ou tipos de atividade. O consumidor atual
é a navegação responsiva do Kaizen; a exceção de primitive fundamental permite
admissão sem antecipar um segundo produto.

API: props nativas de anchor, `asChild` para composição, `className` e
`aria-current="page"` para o estado ativo. O consumidor deve fornecer nome
acessível quando o conteúdo visível for apenas um ícone. Ícones decorativos
recebem `aria-hidden`. Não há estado disabled artificial em um link; destinos
indisponíveis devem ser omitidos ou representados por texto no consumidor.

Foco visível, área mínima de 44 px, contraste pelos tokens existentes e reduced
motion. Estados ativos não dependem somente da cor: aria-current comunica o
destino atual. Phosphor já é dependência do pacote; os exports BarbellIcon e
ForkKnifeIcon mantêm nomes visuais, não nomes de domínio.

SemVer: minor compatível. Subpaths novos não alteram Button ou outros exports.
Rollback: consumidor mantém sua versão exata anterior. Release exclusivamente
pelo workflow Release em main; sem publicação local ou consumo de dist copiado.
