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

// TODO
const excludeDirs = [`node_modules`, `package.json`]
// Function to recursively scan files in a directory
export function scanFiles(dirPath: string) {
  if (excludeDirs.includes(dirPath)) return []
  if (!fs.existsSync(dirPath)) {
    Err(`Directory '${dirPath}' does not exist.`)
  }
  const filesList: string[] = [] // Array to store file paths

  // Read contents of the directory
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file) // Get the full file path

    // Check if it's a directory
    if (fs.statSync(fullPath).isDirectory()) {
      // Recursively scan subdirectories
      filesList.push(...scanFiles(fullPath))
    } else {
      // It's a file, add it to the list
      filesList.push(fullPath)
    }
  })

  return filesList
}

const runtimes = new Set([`bun`, `node`, `deno`])
const pms = new Set([`bun`, `npm`, `yarn`, `pnpm`])
const all = new Set([...runtimes, ...pms])
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

function getValidRuntime(runtimes: Set<string>) {
  if (validRuntime) return
  for (const rt of runtimes) {
    console.log(rt)
    try {
      const a = child_process.spawnSync(rt, {
        timeout: 5,
        stdio: `ignore`,
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
