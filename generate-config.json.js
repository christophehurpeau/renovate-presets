import fs from "node:fs";
import { format } from "oxfmt";

const pobDependencies = JSON.parse(
  fs.readFileSync("node_modules/pob-dependencies/package.json"),
);

const path = "./default.json";
const config = JSON.parse(fs.readFileSync(path));

const excludePkgNames = [
  "@pob/root",
  "@pob/commitlint-config",
  "@pob/pretty-pkg",
  "@pob/lerna-light",
  "typescript",
  "semver",
  "repository-check-dirty",
  "jest",
  "jest-junit-reporter",
  "typedoc",
];

const isEslintDep = (dep) =>
  dep.startsWith("eslint") ||
  dep.startsWith("@pob/eslint") ||
  dep.startsWith("@typescript-eslint/");

if (config.packageRules[6].semanticCommitType !== "fix") {
  throw new Error(
    `Expected config.packageRules[6].semanticCommitType to be "fix" but got "${config.packageRules[6].semanticCommitType}"`,
  );
}

config.packageRules[6].matchPackageNames = Object.keys(
  pobDependencies.devDependencies,
).filter(
  (pkgName) =>
    !pkgName.startsWith("@babel") &&
    !pkgName.startsWith("babel-") &&
    !pkgName.startsWith("@types") &&
    !excludePkgNames.includes(pkgName) &&
    !isEslintDep(pkgName),
);

const { code: formattedConfig } = await format(
  "default.json",
  JSON.stringify(config, null, 2),
  { printWidth: 80 },
);

fs.writeFileSync("./default.json", formattedConfig);
