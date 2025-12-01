import fs from "fs"
import path from "path"
import child_process from "child_process"

function FileSync(path: string) {
  return new CFileSync(path)
}

class CFileSync {
  path

  constructor(path: string) {
    this.path = path
  }

  text() {
    return String(fs.readFileSync(this.path))
  }

  json() {
    if (!this.exists()) return {}
    return JSON.parse(this.text())
  }

  write(text: string) {
    const arr = this.path.split(`/`)
    for (let i = 1; i < arr.length; i++) {
      const dir = arr.slice(0, i).join(`/`)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    }
    fs.writeFileSync(this.path, text)
  }

  exists() {
    return fs.existsSync(this.path)
  }

  delete() {
    fs.unlinkSync(this.path)
  }
}

const runtimes = [`bun`, `node`, `deno`]
const pms = [`bun`, `npm`, `yarn`, `pnpm`]
const all = [...runtimes, ...pms]
let validRuntime: string | null = null

export function spawnSync({ engine, cmd, ...options }: spawnSyncOptions) {
  let firstArg = ``
  if (engine) {
    if (engine === `pm`) getValidRuntime(pms)
    else if (engine === `runtimes`) getValidRuntime(runtimes)
    else if (engine === `all`) getValidRuntime(all)
    else getValidRuntime(runtimes)
    firstArg = validRuntime!
  } else {
    firstArg = cmd[0]
    cmd.splice(1)
  }

  if (cmd.length > 0) child_process.spawnSync(firstArg, cmd, options)
  else child_process.spawnSync(firstArg, options)
}

function getValidRuntime(runtimes: string[]) {
  if (validRuntime) return
  for (const rt of runtimes) {
    try {
      const a = child_process.spawnSync(rt, {
        timeout: 5,
      })

      if (a.status === 0) {
        validRuntime = rt
        return
      }
    } catch {}
  }

  Err(`No valid runtime, runtimes:`, runtimes)
}

export function Err(...args: any[]): never {
  console.error(...args)
  process.exit()
}

export { fs, path, child_process, FileSync }

// Types

type spawnSyncOptions = {
  cmd: string[]
  cwd?: string
  engine?: `pm` | `runtimes` | `all` | string[]
  stdio?: child_process.StdioOptions
  timeout?: number
  killSignal?: number | Signals | undefined
}

type Signals =
  | "SIGABRT"
  | "SIGALRM"
  | "SIGBUS"
  | "SIGCHLD"
  | "SIGCONT"
  | "SIGFPE"
  | "SIGHUP"
  | "SIGILL"
  | "SIGINT"
  | "SIGIO"
  | "SIGIOT"
  | "SIGKILL"
  | "SIGPIPE"
  | "SIGPOLL"
  | "SIGPROF"
  | "SIGPWR"
  | "SIGQUIT"
  | "SIGSEGV"
  | "SIGSTKFLT"
  | "SIGSTOP"
  | "SIGSYS"
  | "SIGTERM"
  | "SIGTRAP"
  | "SIGTSTP"
  | "SIGTTIN"
  | "SIGTTOU"
  | "SIGUNUSED"
  | "SIGURG"
  | "SIGUSR1"
  | "SIGUSR2"
  | "SIGVTALRM"
  | "SIGWINCH"
  | "SIGXCPU"
  | "SIGXFSZ"
  | "SIGBREAK"
  | "SIGLOST"
  | "SIGINFO"
