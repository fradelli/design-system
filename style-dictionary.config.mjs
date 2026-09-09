const buildPath = process.env.FRADELLI_TOKENS_BUILD_PATH ?? "src/styles/";

export default {
  source: ["tokens/**/*.json"],
  usesDtcg: true,
  platforms: {
    css: {
      prefix: "fd",
      transformGroup: "css",
      buildPath: buildPath.endsWith("/") ? buildPath : `${buildPath}/`,
      files: [
        {
          destination: "tokens.generated.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            selector: ":root",
            showFileHeader: false,
          },
        },
      ],
    },
  },
};
