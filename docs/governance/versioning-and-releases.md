# Versionamento e releases

`@fradelli/ui` segue Semantic Versioning e usa Changesets para documentar a
intenção de cada mudança. A automação será criada em histórias posteriores; este
documento governa esse trabalho.

## Fase inicial `0.x`

Versões `0.x` permitem evolução rápida, mas não tornam breaking changes
silenciosos. Toda incompatibilidade exige Changeset, changelog, guia de migração
e validação nos consumidores afetados.

O release `1.0.0` só ocorre quando Sandicts e Kaizen consumirem o package, a API
pública estiver revisada e build, testes, pack e instalação do artefato real
forem estáveis.

## Classificação

| Mudança | Release |
| --- | --- |
| Correção interna sem alteração observável de contrato | Patch |
| Novo componente, export, token ou variante compatível | Minor |
| Remoção/renomeação de export, prop ou token | Major; em `0.x`, minor incompatível documentado |
| Alteração visual material no valor semântico de um token | Major; em `0.x`, minor incompatível documentado |
| Correção de contraste, foco ou comportamento acessível | Patch quando preserva a API; caso contrário, conforme a quebra |
| Nova deprecação sem remoção | Minor |
| Documentação sem efeito no artefato | Sem release, salvo se corrigir contrato publicado |

## Deprecação

Uma API pública deve ser marcada como deprecated no tipo e na documentação,
com alternativa e exemplo de migração. A remoção ocorre somente em release
incompatível posterior. Exceções de segurança exigem comunicação explícita e
podem reduzir o período de transição.

## Processo

1. A PR declara impacto público e classificação SemVer.
2. CI valida tokens, lint, tipos, testes, Storybook, build e package tarball.
3. O owner frontend/design-system aprova mudanças públicas ou incompatíveis.
4. A release produz versão imutável e changelog; nunca sobrescreve uma versão.
5. Cada app abre sua própria PR de upgrade e fixa a versão no lockfile.

Enquanto houver um único mantenedor, o owner nominal continua sendo
`frontend/design-system`; a aprovação ainda deve ficar registrada na PR.

## Rollback

Consumidores revertem para a versão exata anterior. Uma release defeituosa recebe
patch corretivo; nunca se sobrescreve ou republica o mesmo número de versão.

## Registry e credenciais

O package começa privado no GitHub Packages. Tokens de acesso vivem somente nos
ambientes apropriados e nunca em `.npmrc`, documentação, fixture, log ou commit.
Falha de autenticação deve interromper instalação/publicação; não existe fallback
para copiar código ou consumir uma versão flutuante.
