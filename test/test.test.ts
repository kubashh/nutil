import { FileSync, spawnSync } from ".."

spawnSync({ cmd: [`clear`] })

spawnSync({
  cmd: [`ls`],
  cwd: `test`,
  // runtime: true,
})

const f = FileSync(`tt/tdt/tsest.json`)
f.write(`{"a":false}`)
console.log(f.json())
console.log(f.text())
