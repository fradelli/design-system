# Changesets

Mudanças que alterem API, estilos ou comportamento público devem incluir um Changeset e seguir
`docs/governance/versioning-and-releases.md`.

## Fluxo

1. Crie o Changeset na PR de implementação com `npm run changeset`.
2. Classifique a mudança como patch, minor ou major conforme a governança.
3. Depois do merge, o workflow `Release` cria ou atualiza a PR de versão.
4. Revise versão e changelog gerados antes de integrar essa PR.
5. O merge da PR de versão publica uma versão imutável no GitHub Packages.

Documentação e mudanças internas sem efeito no artefato podem registrar na PR por que não exigem
Changeset. Nunca edite uma versão já publicada nem execute publicação fora do workflow de `main`.
