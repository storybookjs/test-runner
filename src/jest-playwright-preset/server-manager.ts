import { spawn, type ChildProcess, type SpawnOptions } from 'child_process';
import net from 'net';
import http from 'http';
import https from 'https';
import type { JestProcessManagerOptions } from './types';

// Setup and teardown run in the same Jest process but are built as separate
// bundles, so module-local state would not be shared. Persist the spawned
// children on globalThis so teardown can find them.
const GLOBAL_KEY = '__storybook_test_runner_servers__';
type GlobalWithServers = typeof globalThis & {
  [GLOBAL_KEY]?: Map<string, ChildProcess>;
};
const globalScope = globalThis as GlobalWithServers;
const runningProcesses: Map<string, ChildProcess> =
  globalScope[GLOBAL_KEY] ?? (globalScope[GLOBAL_KEY] = new Map());

const POLL_INTERVAL_MS = 250;
const PROBE_TIMEOUT_MS = 1000;

function checkTcp(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const done = (result: boolean) => {
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(PROBE_TIMEOUT_MS);
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    socket.once('timeout', () => done(false));
  });
}

function checkHttp(
  protocol: 'http' | 'https' | 'http-get' | 'https-get',
  host: string,
  port: number,
  basePath: string
): Promise<boolean> {
  return new Promise((resolve) => {
    const isHttps = protocol.startsWith('https');
    const client = isHttps ? https : http;
    const method = protocol.endsWith('-get') ? 'GET' : 'HEAD';
    const req = client.request(
      { host, port, path: basePath || '/', method, timeout: PROBE_TIMEOUT_MS },
      (res) => {
        res.resume();
        resolve((res.statusCode ?? 0) < 500);
      }
    );
    req.once('error', () => resolve(false));
    req.once('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function waitForServer(options: JestProcessManagerOptions, timeoutMs: number): Promise<void> {
  const protocol = options.protocol ?? 'tcp';
  const host = options.host ?? 'localhost';
  const port = options.port ?? 3000;
  const basePath = options.basePath ?? '';
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const ok =
      protocol === 'tcp' || protocol === 'socket'
        ? await checkTcp(host, port)
        : await checkHttp(protocol, host, port, basePath);
    if (ok) return;
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  throw new Error('Server did not become ready in time');
}

async function setupSingle(options: JestProcessManagerOptions): Promise<void> {
  if (!options.command) {
    const error = new Error('You must define a command to run a server.');
    (error as NodeJS.ErrnoException).code = 'ERROR_NO_COMMAND';
    throw error;
  }

  const spawnOptions: SpawnOptions = {
    shell: true,
    stdio: options.debug ? 'inherit' : 'ignore',
    detached: process.platform !== 'win32',
    ...(options.options ?? {}),
  };

  const child = spawn(options.command, [], spawnOptions);
  // Detach the child from Node's event loop so Jest can exit cleanly after
  // tests complete. The reference is kept in runningProcesses so teardown
  // can still terminate it.
  child.unref();
  runningProcesses.set(options.command, child);

  const timeout = options.launchTimeout ?? 5000;

  try {
    await waitForServer(options, timeout);
  } catch {
    const error = new Error(
      `Timeout waiting for server to start.\nCommand: ${options.command}\nYou can set "serverOptions.launchTimeout" to increase the timeout.`
    );
    (error as NodeJS.ErrnoException).code = 'ERROR_TIMEOUT';
    throw error;
  }
}

export async function setup(
  options: JestProcessManagerOptions | JestProcessManagerOptions[]
): Promise<void> {
  const list = Array.isArray(options) ? options : [options];
  try {
    await Promise.all(list.map(setupSingle));
  } catch (err) {
    // Jest does not invoke globalTeardown when globalSetup throws, so any
    // servers that did start must be killed here to avoid orphaned processes.
    await teardown();
    throw err;
  }
}

function killChild(child: ChildProcess, signal: NodeJS.Signals): void {
  if (process.platform !== 'win32' && child.pid) {
    try {
      process.kill(-child.pid, signal);
      return;
    } catch {
      // Fallback to killing the direct child if the process group is gone.
    }
  }
  child.kill(signal);
}

export async function teardown(teardownMode?: string): Promise<void> {
  const signal: NodeJS.Signals = teardownMode === 'stop' ? 'SIGTERM' : 'SIGKILL';
  await Promise.all(
    Array.from(runningProcesses.values()).map(
      (child) =>
        new Promise<void>((resolve) => {
          if (child.exitCode !== null || child.signalCode !== null) {
            resolve();
            return;
          }
          child.once('exit', () => resolve());
          killChild(child, signal);
        })
    )
  );
  runningProcesses.clear();
}
