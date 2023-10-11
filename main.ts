/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import '$std/dotenv/load.ts';

import { start } from '$fresh/server.ts';
import manifest from './fresh.gen.ts';
import config from './fresh.config.ts';
import { updateDns } from './updateDns.ts';

const getEnvVar = (key: string) => {
  const val = Deno.env.get(key);
  if (!val) {
    throw new Error(`Must specify a ${key} env var`);
  }
  return val;
};

if (Deno.env.has('DYNDNS_USERNAME') || Deno.env.has('DYNDNS_PASSWORD')) {
  await updateDns({
    username: getEnvVar('DYNDNS_USERNAME'),
    password: getEnvVar('DYNDNS_PASSWORD'),
  });
  console.log('Updated dynamic dns!');
}

await start(manifest, config);
