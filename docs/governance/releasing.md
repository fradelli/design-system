# Operação de releases

Este runbook aplica a política de
[`versioning-and-releases.md`](versioning-and-releases.md) ao package `@fradelli/ui`. Releases são
produzidas exclusivamente pelo workflow `Release`, a partir de `main`, com Changesets.

## Pré-condições

Toda PR que altere API, estilos ou comportamento público deve:

1. classificar o impacto SemVer;
2. incluir um Changeset criado por `npm run changeset`;
3. passar em `npm run ci`;
4. preservar React e React DOM como peer dependencies;
5. não incluir domínio de produto, credenciais ou artefatos gerados.

Mudanças documentais ou internas sem efeito no artefato podem omitir o Changeset quando a
justificativa estiver registrada na PR.

## Fluxo automático

1. A PR de implementação é integrada em `main`.
2. O workflow `Release` executa novamente todos os gates.
3. Havendo Changesets, o workflow cria ou atualiza uma única PR de versão.
4. A PR de versão atualiza `package.json`, `package-lock.json` e `CHANGELOG.md`, e remove os
   Changesets consumidos.
5. O owner revisa a versão, o changelog e o CI antes do merge.
6. O merge da PR de versão executa o workflow novamente.
7. Sem Changesets pendentes, `changeset publish` publica a versão no GitHub Packages.
8. O workflow cria a tag e o GitHub Release correspondentes.

A PR de implementação nunca executa `npm publish` diretamente. Uma versão publicada é imutável e
não pode ser sobrescrita.

## Revisão da PR de versão

Antes do merge, confirme:

- a classificação agregada produz a versão esperada;
- o changelog descreve todas as mudanças públicas;
- somente Changesets já integrados foram consumidos;
- o lockfile acompanha a versão raiz;
- não há mudanças inesperadas de source ou configuração;
- o check `Validate package` está verde.

## Verificação pós-release

Em uma sessão já autenticada para o GitHub Packages:

```powershell
npm view '@fradelli/ui@0.1.0' name version dist-tags `
  --registry=https://npm.pkg.github.com
gh release view '@fradelli/ui@0.1.0' --repo fradelli/design-system
git ls-remote --tags origin '@fradelli/ui@0.1.0'
```

Substitua `0.1.0` pela versão criada. Package, tag e GitHub Release devem apontar para a mesma
versão.

## Configuração após o primeiro publish

O primeiro publish cria o package privado. Em `fradelli` → **Packages** → `ui` →
**Package settings**:

1. confirme a visibilidade **Private**;
2. desative **Inherit access from repository** para não herdar acesso do repositório público;
3. confirme `fradelli/design-system` como `Admin` em **Manage Actions access**;
4. conceda `Read` a `fradelli/reactjs-sandicts-web`;
5. conceda `Read` a `fradelli/kaizen-app`;
6. não conceda `Write` aos consumidores.

O acesso prepara os workflows consumidores, mas não instala nem atualiza o package nos apps.

## Autenticação

O workflow produtor usa somente o `GITHUB_TOKEN` efêmero com `packages: write`. Nenhum PAT ou
secret específico do registry é necessário no repositório.

Desenvolvimento local que precise ler o package usa autenticação no perfil do usuário, fora do
projeto, com PAT classic limitado a `read:packages`. Nunca registre token, `_authToken`, `.env` ou
`.npmrc` autenticado no Git, na documentação ou em logs.

Workflows consumidores usam `GITHUB_TOKEN` com `packages: read` somente depois de receberem acesso
explícito ao package. Falha de autenticação deve interromper a instalação; não existe fallback por
cópia de source, tarball permanente ou versão flutuante.

## Recuperação e rollback

Se o workflow falhar antes do upload, corrija a causa e use **Re-run failed jobs** na mesma
execução. Não crie tag ou versão manual.

Se uma versão defeituosa já foi publicada:

1. não delete nem republique o mesmo número;
2. crie uma correção com Changeset patch;
3. publique uma nova versão pelo fluxo normal;
4. nos consumidores afetados, fixe temporariamente a última versão exata conhecida como boa.

Se apenas o acesso de um consumidor falhar, corrija **Manage Actions access**. Não torne o package
público e não adicione PAT ao repositório consumidor.
