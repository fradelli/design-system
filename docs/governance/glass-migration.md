# Migração para a linguagem visual de vidro

## Estado

Release 0.5.0 preparada a partir de `0.4.0`, com publicação e adoção por etapas conforme a [ADR 0005](../decisions/0005-staged-glass-release.md). Implementa a [ADR 0003](../decisions/0003-shared-glass-visual-language.md). O Changeset registra uma minor incompatível em `0.x`; não fixa antecipadamente seu número.

## Contrato público

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@fradelli/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Resumo</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo com vidro por padrão.</CardContent>
</Card>;

<Card surface="solid" size="sm">
  Conteúdo denso ou card interno.
</Card>;
```

Card continua uma div informativa, sem role interativo nem tabIndex automático. O recuo agora pertence à raiz: 24 px no tamanho padrão e 16 px em `sm`, com gaps de 16 e 12 px. Header, Content e Footer não acrescentam padding lateral. Todas as superfícies compartilham essa geometria. `data-size` e `data-surface` permitem inspeção.

### Migração do espaçamento

- Remover compensações locais nos slots quando o objetivo era acompanhar o recuo padrão. Não somar `px-6` em Header/Content/Footer ao novo padding da raiz.
- Overrides explícitos na raiz continuam possíveis; revisar `p-0`, `px-0`, margens negativas e mídias que ocupam toda a largura.
- Títulos diretos passam a receber o recuo da raiz. `sm` fica compacto também horizontalmente.
- Button permite quebra de texto e usa altura mínima nas variantes textuais; tamanhos de ícone continuam fixos. Revisar alinhamentos que dependiam de altura rígida.
- AlertAction passa a ocupar uma linha própria após a mensagem, reservando espaço e evitando sobreposição em telas estreitas.
- PendingButton considera as larguras dos dois estados. Para `size="icon*"`, o nome pendente é acessível e apenas o spinner fica visível.
- As stories ficam em `Components/Card`, com superfícies e densidades; `Components/Glass` e `Components/Primitives` foram substituídos por famílias próprias.

Classes CSS públicas, disponíveis ao importar `@fradelli/ui/styles.css`:

| Classe                      | Responsabilidade                                    |
| --------------------------- | --------------------------------------------------- |
| `fd-surface-glass`          | Fundo com 80%, borda, sombra e blur de 12px         |
| `fd-surface-glass-elevated` | Fundo elevado com 94%, borda, sombra e blur de 12px |
| `fd-text-card`              | Título 20/28px, peso 700, tracking -0.015em         |
| `fd-text-section`           | Título 24/32px, peso 700, tracking -0.025em         |
| `fd-text-display`           | Título principal 32/40px, peso 700                  |
| `fd-text-interface`         | Texto de interface 14/20px, peso 400                |
| `fd-text-label`             | Rótulo 14/20px, peso 500                            |
| `fd-text-body`              | Texto editorial 16/24px, peso 400                   |

As superfícies não aplicam raio, padding, largura de borda ou hover por conta própria. Card acrescenta transição e borda em hover sem torná-lo clicável. Classes utilitárias do consumidor podem sobrescrever os estilos da camada de componentes, inclusive estados semânticos de borda.

Os tokens `--fd-surface-*` e `--fd-text-*` são gerados dos arquivos em `tokens/`. A paleta opaca `--fd-color-*` permanece. CardTitle e SheetTitle passam a usar a hierarquia de card; Input passa de transparente para superfície elevada a 60%. Button, Badge, estados de erro e demais controles mantêm a paleta e a semântica existentes.

## Acessibilidade e custo visual

O vidro só é habilitado com suporte a blur e color-mix. Sem suporte, o fundo é opaco. O atributo `data-fd-transparency="reduce"` no html oferece opt-out sem provider; preferência de redução de transparência e cores forçadas também removem blur. Escolher `surface="solid"` para regiões densas e cards dentro de painéis já desfocados.

Não depender do blur para hierarquia. Conferir contraste sobre o resultado composto, navegação por teclado, zoom e textos longos. A redução de movimento não substitui a de transparência. Manter a ordem WebKit/padrão de backdrop-filter no CSS gerado.

## Passos por consumidor

1. Instalar o artefato candidato pelo fluxo de fixtures e verificar CSS, exports, peers e build; referências temporárias não entram nos lockfiles finais.
2. Portfólio: comparar a referência aprovada antes de remover as classes locais de vidro e tipografia; preservar o hover com movimento em seu wrapper e revisar padding.
3. Kaizen: migrar cards e overrides reais, mantendo estados de treino, agenda e formulários; avaliar listas longas e temporizadores sem mudar domínio.
4. Sandicts: revisar fontes, paleta e política visual; integrar o pacote e revisar geradores que reintroduzem valores antigos. Identidade dos logos permanece local. Não basta substituir CSS gerado.
5. Registrar comparação visual, contraste, desempenho, teclado e fallback por aplicativo antes de seu upgrade. A primeira publicação usa o portfólio como consumidor validado, conforme a ADR 0005.
6. Após publicação autorizada, fixar a versão nos aplicativos e atualizar seus lockfiles em PRs separadas, respeitando o fluxo de cada projeto.

As [evidências do candidato](glass-validation.md) registram os comandos executados e as pendências reais.

## Gates e limites

Executar `npm run ci` no pacote e os gates aplicáveis de cada consumidor. Storybook inclui superfícies opacas, elevadas, fundos variados, campos inválidos e composição aninhada. Esses exemplos não substituem validação das telas reais nem comprovam suporte em todos os navegadores.

A publicação 0.5.0 usa evidência do pacote e do portfólio, autorizada explicitamente na ADR 0005. Kaizen e Sandicts exigem migrações e validações próprias antes de adotar essa versão. Publicar somente pelo workflow Release. Reversão exige voltar código, CSS, manifesto e lockfile do consumidor como unidade; nunca sobrescrever versão publicada.

## Composição de overlays nativos

Sheet e AlertDialog usam `dialog.showModal()` e o backdrop nativo. Seus componentes Portal preservam a composição sem criar uma segunda camada de portal; SheetOverlay não desenha um elemento adicional e AlertDialogOverlay é compatibilidade sem uma camada visual própria. A aparência do backdrop está no Content/CSS nativo. Popover.Content cria seu próprio portal no body; Popover.Portal preserva a composição.

Popover limita a caixa ao viewport, acompanha resize/scroll e mudanças de tamanho, e pode inverter o lado quando o lado oposto comporta o conteúdo. Cor, posição e material não alteram a semântica de diálogo. Apps continuam responsáveis por nomes, rótulos e conteúdo.

## Validação de RadioGroup em formulários

Inputs internos preservam required e FormData. Em erro nativo, o grupo direciona o foco ao primeiro item habilitado visível e suprime o balão do input interno oculto. O aplicativo apresenta sua mensagem localizada com FieldError/onInvalid e associa a descrição ao grupo. O Design System não injeta texto de validação. Em grupos controlados, o aplicativo continua responsável por atualizar value e por tratar reset do formulário.

## Foco compartilhado

Controles do pacote mantêm seu indicador de foco próprio e não recebem um segundo outline global. Elementos nativos sem esse tratamento usam o fallback global por tokens. Evitar adicionar outro ring/outline no wrapper de um controle; revisar o resultado no CSS compilado.
