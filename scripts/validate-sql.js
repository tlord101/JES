const pg = require('pgsql-parser');
const fs = require('fs');
const path = require('path');

async function main() {
  await pg.loadModule();
  const { parseSync } = pg;
  const dir = path.join(__dirname, '..', 'supabase', 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  let bad = 0;
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), 'utf8');
    try {
      parseSync(sql);
      console.log(`OK   ${f}`);
    } catch (e) {
      bad++;
      const msg = String(e.message || e).split('\n')[0];
      console.log(`FAIL ${f}: ${msg.slice(0, 200)}`);
    }
  }
  console.log(bad === 0 ? '\nAll migration files parse cleanly.' : `\n${bad} file(s) failed to parse.`);
  process.exit(bad === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
