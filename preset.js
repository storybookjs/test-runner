function config(entry = []) {
  return [...entry, require.resolve("./dist/esm/preset/preview")];
}

function managerEntries(entry = []) {
  return [...entry, require.resolve("./dist/esm/preset/manager")];
}

module.exports = {
  managerEntries,
  config,
};
