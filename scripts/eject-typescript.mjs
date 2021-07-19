#!/usr/bin/env zx

// Copy TS files and delete src
await $`cp -r ./src ./srcTS`;
await $`rm -rf ./src`;
await $`mkdir ./src`;

// Convert TS code to JS
await $`babel --no-babelrc --presets @babel/preset-typescript ./srcTS -d ./src --extensions \".js,.jsx,.ts,.tsx\" --ignore "./srcTS/typings.d.ts"`;

// Format the newly created .js files
await $`prettier --write ./src`;

// Add in minimal files required for the TS build setup
await $`touch ./src/dummy.ts`;
await $`printf "export {};" >> ./src/dummy.ts`;

await $`touch ./src/typings.d.ts`;
await $`printf 'declare module "global";' >> ./src/typings.d.ts`;

// Clean up
await $`rm -rf ./srcTS`;

console.log(
  chalk.green.bold`
TypeScript Ejection complete!`,
  chalk.green`
Addon code converted with JS. The TypeScript build setup is still available in case you want to adopt TypeScript in the future.
`
);
