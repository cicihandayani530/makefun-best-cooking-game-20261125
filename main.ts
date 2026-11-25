// main.ts — Seoul Table Grill submission entrypoint, written for this
// entry. It stages the playable game folder and the screenshot set into
// whatever output directory the harness points it at, then hands that
// directory to the kit library so it can emit the scoring dossier with
// the exact caps this bounty enforces.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const target = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(target, { recursive: true });
cpSync(join(here, 'game'), join(target, 'game'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  mkdirSync(join(target, 'screenshots'), { recursive: true });
  cpSync(join(here, 'screenshots'), join(target, 'screenshots'), { recursive: true });
}
const dossier = buildDossier(target, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(target, 'dossier.json'), dossier);
