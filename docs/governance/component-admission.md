# Admissão de componentes

Este checklist protege `@fradelli/ui` de dependências de produto e abstrações
prematuras. Primitives fundamentais podem ser adicionados quando necessários;
padrões compostos precisam de uso real em Sandicts e Kaizen.

## Checklist obrigatório

Um candidato só entra no package quando todas as respostas aplicáveis forem
“sim”:

1. O nome descreve uma função visual, não um conceito de negócio?
2. As props não importam DTO, schema, rota, permissão ou status de um app?
3. O componente funciona sem Next.js e sem provider do consumidor?
4. Diferenças entre produtos são resolvidas por composição, slots, tokens ou
   `className`, sem flags de produto?
5. Existe uso real nos dois produtos, salvo no caso de primitive fundamental?
6. Teclado, foco, disabled, loading, erro e reduced motion são testáveis?
7. A API pode ser mantida e evoluída segundo SemVer?
8. O componente não determina copy, navegação, autorização ou regras de negócio?

Qualquer prop como `product`, `sandictsVariant` ou `kaizenVariant` reprova a
admissão. O ajuste deve permanecer no consumidor ou ser resolvido por composição.

## Exemplos iniciais

| Candidato | Decisão inicial | Motivo |
| --- | --- | --- |
| `Button` | Admitir | Primitive visual fundamental, sem domínio |
| `StatusBadge` | Manter local | O mapeamento de status ainda pertence aos apps; somente o primitive genérico pode ser reavaliado |
| `Calendar` | Manter local | Agenda, eventos, permissões e ações ainda têm composições de domínio diferentes |
| Tokens categóricos | Admitir | O package oferece as cores; cada app define seu significado |

## Registro da decisão

Toda admissão de padrão composto deve registrar na PR:

- consumidores e links dos dois usos reais;
- API pública proposta;
- estados e critérios de acessibilidade;
- dependências adicionadas;
- estratégia de migração e rollback;
- classificação SemVer.

Se o segundo uso exigir muitas exceções, a conclusão correta pode ser manter
duas composições locais sobre primitives compartilhados.

