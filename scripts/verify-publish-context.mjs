const requiredContext = {
  GITHUB_ACTIONS: "true",
  GITHUB_EVENT_NAME: "push",
  GITHUB_REPOSITORY: "fradelli/design-system",
  GITHUB_REF: "refs/heads/main",
};

for (const [name, expected] of Object.entries(requiredContext)) {
  if (process.env[name] !== expected) {
    console.error(`Publicação recusada: ${name} não corresponde ao contexto de release.`);
    process.exit(1);
  }
}

if (!process.env.NODE_AUTH_TOKEN) {
  console.error("Publicação recusada: credencial efêmera do registry ausente.");
  process.exit(1);
}

console.log("Contexto de publicação validado para main em fradelli/design-system.");
