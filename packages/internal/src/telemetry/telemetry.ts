import { spawn } from 'child_process'
import path from 'path'

// wrap a function in this call to get a telemetry hit including how long it took
export const timedTelemetry = async (
  argv: Array<string>,
  func: (...args: any[]) => any
) => {
  if (process.env.REDWOOD_DISABLE_TELEMETRY || process.env.DO_NOT_TRACK) {
    return
  }

  const start = new Date()
  const result = await func.call(this)
  const duration = new Date().getTime() - start.getTime()

  spawn(
    process.execPath,
    [
      path.join(__dirname, 'sendTelemetry.js'),
      '--argv',
      JSON.stringify(argv),
      '--duration',
      duration.toString(),
    ],
    { detached: true, stdio: 'ignore' }
  ).unref()

  return result
}

export const telemetryError = async (argv: Array<string>, error: any) => {
  spawn(
    process.execPath,
    [
      path.join(__dirname, 'sendTelemetry.js'),
      '--argv',
      JSON.stringify(argv),
      '--error',
      JSON.stringify(error),
    ],
    { detached: true, stdio: 'ignore' }
  ).unref()
}

// used as yargs middleware when any command is invoked
export const telemetryMiddleware = async () => {
  if (process.env.REDWOOD_DISABLE_TELEMETRY || process.env.DO_NOT_TRACK) {
    return
  }

  spawn(
    process.execPath,
    [
      path.join(__dirname, 'sendTelemetry.js'),
      '--argv',
      JSON.stringify(process.argv),
    ]
    //{ detached: true, stdio: 'ignore' }
  )
}
