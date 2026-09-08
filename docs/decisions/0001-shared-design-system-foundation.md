# ADR 0001 — Fundação do Design System compartilhado

- **Status:** aceito
- **Data:** 2026-09-07
- **Decisores:** frontend/design-system
- **História:** [KAN-223](https://sandicts.atlassian.net/browse/KAN-223)

## Contexto

Sandicts e Kaizen são produtos relacionados, desenvolvidos pelo mesmo owner e
com agendas como elemento relevante. Eles precisam compartilhar identidade e
qualidade visual sem acoplar seus domínios ou seus ciclos de entrega.

Copiar estilos entre repositórios produziria divergência. Um monorepo uniria
ciclos que hoje são independentes. Um package que conhecesse reservas, dieta ou
tarefas criaria uma camada `common` difícil de evoluir. Precisamos, portanto, de
uma fonte normativa pequena e de fronteiras verificáveis.

## Decisão

O repositório `fradelli/design-system` é a fonte normativa do Design System. Ele
terá inicialmente um único package, `@fradelli/ui`, com versões fixadas
independentemente por Sandicts e Kaizen.

~~~text
fradelli/design-system
  └─ @fradelli/ui
       ├─ Sandicts
       └─ Kaizen
~~~

O primeiro release será dark-first. Isso define a prioridade de implementação,
não proíbe um modo light futuro. Inter variável será a família proporcional
comum. Os aplicativos carregam a fonte uma vez no root, expõem
`--font-inter` e o package somente referencia essa variável com fallback de
sistema; o package não depende de `next/font` nem distribui binários da fonte.

## Ownership

| Item | Owner | Observação |
| --- | --- | --- |
| Tokens semânticos, tipografia, radius, foco e motion | `@fradelli/ui` | Contrato visual sem domínio |
| Status visuais genéricos | `@fradelli/ui` | `success`, `warning`, `info` e `destructive` |
| Primitives e seus testes de acessibilidade | `@fradelli/ui` | Ex.: Button, Input, Alert e Dialog |
| Padrão visual comprovado em dois produtos | `@fradelli/ui` | Sujeito ao checklist de admissão |
| Logo, nome, metadata e artwork | aplicativo | Identidade específica do produto |
| Shell, página, rota e composição de feature | aplicativo | Inclui agenda composta |
| Reserva, quadra, treino, dieta, hábito e tarefa | aplicativo | Domínio nunca é exportado pelo package |
| API, persistência, query, i18n e autenticação | aplicativo | Integrações permanecem locais |
| Mapeamento entre categoria e significado de negócio | aplicativo | O package fornece cor, não semântica de domínio |

## Fundação visual

### Tipografia

Inter variável é usada por papel, sem famílias concorrentes:

| Papel | Peso inicial |
| --- | ---: |
| Body | 400 |
| Label e navegação | 500 |
| Ênfase e ações | 600 |
| Títulos | 700 |
| Display e wordmark textual | 800 |

Uma fonte monoespaçada do sistema pode continuar sendo usada quando a semântica
exigir alinhamento técnico de caracteres.

### Cores

Os valores abaixo são o contrato inicial a ser convertido em tokens e validado
pela KAN-221. Eles não autorizam CSS duplicado nos consumidores.

| Papel | Valor inicial |
| --- | --- |
| Background | `#0B0B0C` |
| Surface | `#141416` |
| Elevated | `#1C1C1F` |
| Border | `#2B2B30` |
| Foreground | `#F4F4F5` |
| Muted foreground | `#9B9BA3` |
| Brand red | `#F07878` |
| Primary yellow | `#F2CF63` |

A paleta categórica contém oito cores pastéis:

| Categoria visual | Valor inicial |
| --- | --- |
| Yellow | `#F2CF63` |
| Orange | `#F0A866` |
| Red | `#F07878` |
| Pink | `#E58AB7` |
| Purple | `#B79AF2` |
| Blue | `#7DA7F2` |
| Cyan | `#65C8D0` |
| Green | `#7BC8A4` |

Esses nomes descrevem aparência, não domínio. Sandicts decide, por exemplo,
qual categoria representa uma modalidade; Kaizen decide qual representa dieta
ou treino. Cor sempre deve ser acompanhada por texto, ícone ou outro indicador.

`brand` e `destructive` são tokens diferentes mesmo quando ambos parecem
vermelhos. Identidade não pode carregar automaticamente a semântica de erro.

## Contrato técnico

- React e React DOM serão peer dependencies.
- TypeScript, Tailwind CSS 4, shadcn/ui sobre Radix Nova e Phosphor formam a
  direção técnica inicial.
- O package não depende de Next.js e preserva os limites necessários para React
  Server Components.
- Tokens-fonte seguirão o formato DTCG e gerarão CSS determinístico.
- CSS, helper `cn` e componentes serão expostos por subpaths explícitos.
- Storybook documentará foundations, estados e variantes.
- O calendário completo permanece local até existirem dois usos reais e uma
  API sem domínio demonstrável. Primitives menores de data podem ser avaliados
  separadamente.

Nenhuma dessas ferramentas está configurada pela KAN-223. A implementação
pertence às histórias KAN-222, KAN-221, KAN-220 e KAN-226.

## Distribuição e evolução

O package começará privado no GitHub Packages, embora este repositório seja
público. Nenhuma credencial será versionada. Os consumidores instalam uma versão
exata e escolhem quando atualizar; publicar uma versão não atualiza os apps.

Usaremos Semantic Versioning e Changesets. Enquanto a API estiver em `0.x`,
mudanças incompatíveis continuam exigindo changelog e guia de migração. O marco
`1.0.0` exige uso validado pelos dois consumidores, API pública revisada e
processo de release estável.

As regras detalhadas vivem em
[`versioning-and-releases.md`](../governance/versioning-and-releases.md).

## Admissão de componentes

Primitives básicos podem nascer no package. Padrões compostos só entram depois
de uso real em dois produtos e aprovação do
[`component-admission.md`](../governance/component-admission.md). Flags como
`product`, `sandictsVariant` ou `kaizenVariant` indicam uma abstração inadequada.

## Alternativas rejeitadas

- **Copiar estilos entre apps:** produz fontes de verdade divergentes.
- **Unir os produtos em monorepo:** acopla ciclos de entrega sem necessidade.
- **Criar vários packages agora:** adiciona versionamento sem owners ou ciclos
  distintos comprovados.
- **Compartilhar páginas ou domínio:** transforma o package visual em camada de
  negócio.
- **Extrair um calendário completo no primeiro release:** antecipa uma API antes
  de conhecermos os dois usos reais.

## Consequências e riscos

A decisão reduz duplicação visual e permite evolução independente por versão.
Em troca, exige disciplina de release, teste do artefato real, revisão de
breaking changes e manutenção temporária de compatibilidade durante migrações.

Os principais riscos são abstração prematura, dependência acidental de Next.js,
duas cópias de React, classes Tailwind não detectadas e divergência de tokens.
Eles serão controlados por checklist de admissão, peers, fixtures de consumidor,
`@source` explícito e geração determinística.

## Revisão e substituição

Esta decisão deve ser revisada se surgirem ciclos de release realmente
independentes, um terceiro consumidor com requisitos incompatíveis ou a
necessidade comprovada de separar tokens de componentes. Uma mudança estrutural
deve criar um novo ADR que declare substituir este; não se altera silenciosamente
uma decisão já usada por releases.
