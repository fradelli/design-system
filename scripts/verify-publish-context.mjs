const requiredContext = {
  GITHUB_ACTIONS: "true",
  GITHUB_EVENT_NAME: "push",
  GITHUB_REPOSITORY: "fradelli/design-system",
  GITHUB_REF: "refs/heads/main",
};

for (const [name, expected] of Object.entries(requiredContext)) {
  if (process.env[name] !== expected) {
    console.error(`Publishing denied: ${name} does not match the release context.`);
    process.exit(1);
  }
}

if (!process.env.NODE_AUTH_TOKEN) {
  console.error("Publishing denied: ephemeral registry credential is missing.");
  process.exit(1);
}

console.log("Publishing context validated for main in fradelli/design-system.");
