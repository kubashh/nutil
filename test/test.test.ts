import { FileSync, spawnSync } from ".."

spawnSync({ cmd: [`clear`] })
spawnSync({ cmd: [`-h`], engine: `runtimes` })
spawnSync({ cmd: [`-h`], engine: `pm` })

spawnSync({
  cmd: [`ls`],
  cwd: `test`,
  // runtime: true,
})

const f = FileSync(`workspace/tdt/tsest.json`)
f.write(`{"a":false}`)
console.log(f.json())
console.log(f.text())
