/*──────────────────────────────────────────────────────────
 *  🧩 NeoBot - Powered by NeoShiroko Labs
 *──────────────────────────────────────────────────────────
 *  🌐 Website  : https://www.neolabsofficial.my.id
 *  💬 WhatsApp : https://s.id/contact-zass
 *  📺 YouTube  : https://www.youtube.com/@ZassOnee
 *  📡 Panel Murah   : pteroku-desu.zass.cloud
 *
 *  [ ! ] Jangan Hapus Wm Bggg
 *──────────── © 2025 Zass Onee. All rights reserved.───────────────────
 */
const gradient = require("gradient-string");
const figlet = require("figlet");
const matrix = () => {
  const chars = "0123456789ABCDEF艹炎光";
  const columns = process.stdout.columns || 80;
  const rows = process.stdout.rows || 24;
  const drops = Array(columns).fill(0);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const colorLevels = [
    '\x1b[2;32m', // green dim
    '\x1b[0;32m', // green normal
    '\x1b[1;32m', // green bright
  ];

  const draw = () => {
    console.clear();
    let output = Array(rows).fill('').map(() => Array(columns).fill(' '));

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const level = Math.floor(Math.random() * colorLevels.length);
      const row = drops[i];

      if (row < rows && Math.random() > 0.2) {
        output[row][i] = `${colorLevels[level]}${char}\x1b[0m`;
        drops[i]++;
      } else {
        drops[i] = 0;
      }
    }

    // Merge and print
    const rendered = output.map(line => line.join('')).join('\n');
    console.log(rendered);

    // Flash Neo flare logo randomly
    if (Math.random() < 0.07) {
      const center = Math.floor(columns / 2) - 10;
      const line = '=== NEO FLARE ===';
      process.stdout.cursorTo(center, Math.floor(rows / 2));
      process.stdout.write('\x1b[1;36m' + line + '\x1b[0m');
    }
  };

  return new Promise(resolve => {
    const interval = setInterval(draw, 100);
    setTimeout(() => {
      clearInterval(interval);
      console.clear();

      // Logo Neo Flare
      console.log(gradient.instagram(figlet.textSync("Neo Flare", { font: "ANSI Shadow" })))
      console.log('                     \x1b[1;33mNeo Flare v4.0.0\x1b[0m by Zass Desuta\n');

      console.log('\x1b[1m\x1b[35m==== THANKS TO ====\x1b[0m');
      console.log('\x1b[32m✔\x1b[0m Allah SWT');
      console.log('\x1b[32m✔\x1b[0m Zass Desuta');
      console.log('\x1b[32m✔\x1b[0m Sunaookami Shiroko');
      console.log('\x1b[32m✔\x1b[0m Developer OpenAI & Baileys');
      console.log('\x1b[32m✔\x1b[0m Subscriber & Pengguna Setia');
      console.log('\x1b[32m✔\x1b[0m Yang Udah Support Proyek Ini');

      console.log('\n\x1b[1m\x1b[36m==== KONTAK DEVELOPER ====\x1b[0m');
      console.log('\x1b[33m• YouTube:\x1b[0m NeoShiroko Labs');
      console.log('\x1b[33m• Developer:\x1b[0m https://zass.cloud');
      console.log('\x1b[33m• Channel:\x1b[0m https://zass.cloud/wa/channel/neoshiroko_labs');
      console.log('\x1b[33m• Website:\x1b[0m neolabsofficial.my.id');

      console.log('\n\x1b[36m[ Neo Flare Bot is Starting... ]\x1b[0m\n');
      resolve();
    }, 2000);
  });
};

module.exports = matrix;