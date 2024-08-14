import fs from "node:fs";
import prettier from "prettier";

const pobDependencies = JSON.parse(
  fs.readFileSync("node_modules/pob-dependencies/package.json")
);

const path = "./default.json";
const config = JSON.parse(fs.readFileSync(path));

const excludePkgNames = [
  "@pob/root",
  "@pob/commitlint-config",
  "@pob/pretty-pkg",
  "@pob/lerna-light",
  "prettier",
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

config.packageRules[1].packageNames = Object.keys(
  pobDependencies.devDependencies
).filter(
  (pkgName) =>
    !pkgName.startsWith("@babel") &&
    !pkgName.startsWith("babel-") &&
    !pkgName.startsWith("@types") &&
    !excludePkgNames.includes(pkgName) &&
    !isEslintDep(pkgName)
);

const formattedConfig = await prettier.format(JSON.stringify(config, null, 2), {
  filepath: "default.json",
  printWidth: 80,
});

fs.writeFileSync("./default.json", formattedConfig);
