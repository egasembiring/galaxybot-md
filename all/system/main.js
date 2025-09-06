/*═══════════════════════════════════════════════════════
 *  ⌬  YT NeoShiroko Labs
 *═══════════════════════════════════════════════════════
 *  🌐  Website     : https://www.neolabsofficial.my.id
 *  ⌨︎  Developer   : https://zass.cloud
 *  ▶︎  YouTube     : https://www.youtube.com/@zassci_desu
 *  ⚙︎  Panel Murah : pteroku-desu.zass.cloud
 *
 *  ⚠︎  Mohon untuk tidak menghapus watermark ini
 *═══════════════════ © 2025 Zass Desuta ─════════════════════
 */
 
require('../../settings')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('../library/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize, loadModule } = require('../library/myfunc')
const matrix = require('../library/sc/matrix.js');
const { default: neoConnect, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers} = require("naruyaizumi")
const NodeCache = require("node-cache")
const Pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const makeWASocket = require("naruyaizumi").default
const { execSync } = require("child_process");

const requiredModules = [
  "naruyaizumi",
  "pino",
  "chalk",
  "figlet",
  "ora"
];

for (const mod of requiredModules) {
  try {
    require.resolve(mod);
  } catch (err) {
    console.log(`[ Auto Installer By Zass ] Module ${mod} belum ada. Menginstall...`);
    execSync(`npm install ${mod}`, { stdio: "inherit" });
  }
}
const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

// Func load feature 
function loadCase() {
  let file = fs.readFileSync("./all/system/neo-z.js", "utf-8"); // handler utama mu
  let lines = file.split("\n");
  let menu = {};
  let currentCategory = null;

  for (let line of lines) {
    // Deteksi kategori (pakai komentar pembatas)
    let catMatch = line.match(/\/\/—+\[ Menu (.+?) \]—+\/\//i);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      if (!menu[currentCategory]) menu[currentCategory] = [];
    }

    // Deteksi case (baik pakai '' atau "")
    let caseMatch = line.match(/case\s+['"]([^'"]+)['"]\s*:/i);
    if (caseMatch && currentCategory) {
      menu[currentCategory].push(caseMatch[1]);
    }
  }

  global.menucase = menu;
  console.log("Case Loaded:", menu);
}

let phoneNumber = null
let owner = JSON.parse(fs.readFileSync('./database/owner.json'))
let db = JSON.parse(fs.readFileSync('./database/set.json'));

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

async function startneo() {
  await loadCase();
  await matrix();

  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const msgRetryCounterCache = new NodeCache();

  const neo = makeWASocket({
    version,
    logger: Pino({ level: 'silent' }),
    browser: Browsers.windows('Firefox'),
    printQRInTerminal: !process.argv.includes("--pairing-code"),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" })),
    },
    msgRetryCounterCache,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: true,
    getMessage: async (key) => {
      const jid = jidNormalizedUser(key.remoteJid);
      const msg = await store.loadMessage(jid, key.id);
      return msg?.message || "";
    },
  });

  store.bind(neo.ev);
  
  // Initialize auto-delete processor
  try {
    const { processAutoDelete, autodelete } = require('../library/autodelete');
    if (processAutoDelete && autodelete) {
      processAutoDelete(neo, autodelete);
      console.log(chalk.green('[ ✓ ] Auto-delete processor initialized'));
    }
  } catch (err) {
    console.log(chalk.yellow('[ ! ] Auto-delete processor not found, skipping...'));
  }

  const isPairing = process.argv.includes("--pairing-code");
  const pairingName = global.pairing;

  if (isPairing && !neo.authState.creds.registered) {
    console.log(chalk.cyan(`\n[NEO BOTZ] Enter WhatsApp number :`));
    let nomor = await question(chalk.cyan(`Contoh: +62xxx : `));
    nomor = nomor.replace(/[^0-9]/g, '');

    console.log(chalk.green(`\n😈 Target Backdor: ${chalk.bold(nomor)}`));

    setTimeout(async () => {
      try {
        const code = await neo.requestPairingCode(nomor, pairingName);
        const format = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.bgGreen.black(" Here's the pairing "), chalk.white.bold(format));
      } catch (err) {
        console.error(chalk.red("Gagal mengambil pairing code!"), err);
      }
    }, 3000);
  }

    neo.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast' )
            if (!neo.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            const m = smsg(neo, mek, store)
            require("./neo-z")(neo, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })

    neo.ev.on('messages.upsert', async chatUpdate => {
        try {
        mek = chatUpdate.messages[0];
        if (!mek || !mek.key) return;

        // Auto view status jika aktif
        if (mek.key.remoteJid === 'status@broadcast' && db.settings.autoview) {
            await neo.readMessages([mek.key]);
        }
    } catch (err) {
        console.error('AutoView Error:', err);
    }
});

    neo.ev.on('group-participants.update', async (anu) => {
  let { id, participants, action } = anu;
  if (!db.groups) db.groups = {};
  if (!db.groups[id]) db.groups[id] = { welcome: false, goodbye: false };

  try {
    const groupMetadata = await neo.groupMetadata(id);
    const groupName = groupMetadata.subject || "Grup ini";

    for (let num of participants) {
      let userTag = '@' + num.split('@')[0];
      let ppUrl;
      try {
        ppUrl = await neo.profilePictureUrl(num, 'image');
      } catch {
        ppUrl = 'https://telegra.ph/file/265c672094dfa87caea19.jpg'; // default
      }
      let bgUrl = thumb_welcome;

      if (action === 'add' && db.groups[id].welcome) {
        // welcome teks
        let teks = (db.groups[id].welcomeText || `Selamat datang ${userTag} di grup *${groupName}*!`)
          .replace(/@user/gi, userTag)
          .replace(/@group/gi, groupName);

        // api url
        let apiUrl = `https://api.ryuu-dev.offc.my.id/tools/WelcomeLeave?desc=${encodeURIComponent(teks)}&title=${encodeURIComponent(m.pushName)}&profile=${encodeURIComponent(ppUrl)}&background=${encodeURIComponent(bgUrl)}`;

        await neo.sendMessage(id, {
          image: { url: ppUrl },
          caption: teks,
          footer: foot,
          buttons: [
            { buttonId: `.intro`, buttonText: { displayText: "[ ¡ ] Intro" }, type: 1 }
          ],
          headerType: 4,
          mentions: [num],
          contextInfo: {
            externalAdReply: {
              title: `Welcome ${m.pushName}`,
              body: groupName,
              thumbnailUrl: apiUrl,
              sourceUrl: '',
              mediaType: 1,
              renderLargerThumbnail: false
            }
          }
        });

      } else if (action === 'remove' && db.groups[id].goodbye) {
        // goodbye teks
        let teks = (db.groups[id].goodbyeText || `Selamat tinggal ${userTag}, semoga betah di luar *${groupName}* 👋`)
          .replace(/@user/gi, userTag)
          .replace(/@group/gi, groupName);

        // api url
        let apiUrl = `https://api.ryuu-dev.offc.my.id/tools/WelcomeLeave?desc=${encodeURIComponent(teks)}&title=${encodeURIComponent(m.pushName)}&profile=${encodeURIComponent(ppUrl)}&background=${encodeURIComponent(bgUrl)}`;

        await neo.sendMessage(id, {
          image: { url: ppUrl },
          caption: teks,
          footer: foot,
          buttons: [
            { buttonId: `byee`, buttonText: { displayText: "[ ! ] Goodbye" }, type: 1 }
          ],
          headerType: 4,
          mentions: [num],
          contextInfo: {
            externalAdReply: {
              title: `Goodbye ${m.pushName}`,
              body: groupName,
              thumbnailUrl: apiUrl,
              sourceUrl: '',
              mediaType: 1,
              renderLargerThumbnail: false
            }
          }
        });
      }
    }
  } catch (e) {
    console.log("Welcome/Goodbye error:", e.message);
  }
});
    neo.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    neo.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = neo.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    neo.getName = (jid, withoutContact = false) => {
        id = neo.decodeJid(jid)
        withoutContact = neo.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = neo.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === neo.decodeJid(neo.user.id) ?
            neo.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    global.selfmode = false
    neo.public = true

    neo.serializeM = (m) => smsg(neo, m, store)

neo.ev.on("connection.update",async  (s) => {
        const { connection, lastDisconnect } = s
        if (connection == "open") {
            console.log(chalk.magenta(`< # > Bot Berhasil Tersambung!`))
            await loadModule(neo);
        }
        if (
            connection === "close" &&
            lastDisconnect &&
            lastDisconnect.error &&
            lastDisconnect.error.output.statusCode != 401
        ) {
            startneo()
        }
    })
    neo.ev.on('creds.update', saveCreds)
    neo.ev.on("messages.upsert",  () => { })

    neo.sendText = (jid, text, quoted = '', options) => neo.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    neo.sendTextWithMentions = async (jid, text, quoted, options = {}) => neo.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    neo.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await neo.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    neo.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await neo.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    neo.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    neo.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename,
        data)
        return {
            res,
            filename,
            size: await getSizeMedia(data),
            ...type,
            data
        }

    }

    neo.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
  let type = await neo.getFile(path, true);
  let { res, data: file, filename: pathFile } = type;

  if (res && res.status !== 200 || file.length <= 65536) {
    try {
      throw {
        json: JSON.parse(file.toString())
      };
    } catch (e) {
      if (e.json) throw e.json;
    }
  }

  let opt = {
    filename
  };

  if (quoted) opt.quoted = quoted;
  if (!type) options.asDocument = true;

  let mtype = '',
    mimetype = type.mime,
    convert;
  
  if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
  else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
  else if (/video/.test(type.mime)) mtype = 'video';
  else if (/audio/.test(type.mime)) {
    convert = await (ptt ? toPTT : toAudio)(file, type.ext);
    file = convert.data;
    pathFile = convert.filename;
    mtype = 'audio';
    mimetype = 'audio/ogg; codecs=opus';
  } else mtype = 'document';

  if (options.asDocument) mtype = 'document';

  delete options.asSticker;
  delete options.asLocation;
  delete options.asVideo;
  delete options.asDocument;
  delete options.asImage;

  let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
  let m;

  try {
    m = await neo.sendMessage(jid, message, { ...opt, ...options });
  } catch (e) {
    //console.error(e)
    m = null;
  } finally {
    if (!m) m = await neo.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
    file = null;
    return m;
  }
}

    neo.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
    }
    }
return startneo()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})

process.on('uncaughtException', function (err) {
let e = String(err)
/*if (e.includes("conflict")) return
if (e.includes("Socket connection timeout")) return
if (e.includes("not-authorized")) return
if (e.includes("already-exists")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return*/
console.log('Caught exception: ', err)
})