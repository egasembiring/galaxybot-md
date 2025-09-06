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

const fs = require('fs')
const chalk = require('chalk')

//——————————[ Set Owner ]——————————//
global.ytname = "https://www.youtube.com/@zassci_desu"
global.location = "Abydos High School"
global.ownername = "manusia tertamvan"
global.ownernumber = '6283845376470' 
global.email = "tahusemesta@gmail.com" // gmail.com

//——————————[ Set Bot ]——————————//
global.botname = '𝙽𝚎𝚘 𝙵𝚕𝚊𝚛𝚎 あ⁩'
global.versi = '4.0'
global.foot = '© ᴍᴀᴅᴇ ʙʏ ᴢᴀss ᴅᴇsᴜᴛᴀ'
global.idSaluran = "120363421570647022@newsletter"
global.namach = "𝙽𝚎𝚘'𝚂 𝙻𝚊𝚋𝚜 𝙲𝚑."
global.aiUsageCount = global.aiUsageCount || {};
global.hias = "➤"
global.pairing = "neoflare"

//——————————[ Set Sticker ]——————————//
global.packname = ':: 𝙽𝚎𝚘 𝙵𝚕𝚊𝚛𝚎 ::'
global.author = `\nWaBot By NeoShiroko Labs`
global.themeemoji = '🪀'
global.wm = "⫹⫺ 𝚈𝚃 𝙽𝚎𝚘𝚂𝚑𝚒𝚛𝚘𝚔𝚘 𝙻𝚊𝚋𝚜"

//——————————[ Set Link ]——————————//
global.link = "https://whatsapp.com/channel/0029Vb6w7eO9sBIEUYRgeC30"
global.namagc = "Marketplace¹ || Zass Official"
global.linkgc = "https://chat.whatsapp.com/Bvdic3yrpFh5kTkk5oc5G0"
global.web = "https://www.epictopup.tech"
global.prefa = ['!','.','#','💐']

//——————————[ Set Payment ]——————————//
global.dana = "083195893959" // Isi no dana mu
global.gopay = "083195893959" // Isi no gopay mu
global.ovo = "tidak tersedia" // Isi no ovo mu
global.qris = "https://link_qr_mu.desu" // pakai fitur .tourl untuk ubah foto ke link
global.an = {
  dana: "hanya manusia biasa",
  gopay: "hanya manusia biasa",
  ovo: "Nama Ovo"
}
/* ------ let kotak amal = {
Dana : 085298027445, An: Irfan,
Gopay : 085298027445, An: ARDY SHOP
}

#Ahh ini payment gw gpp di hapus cuma naro buat orang yg mau sedekah 😙
Btw di bawah free github and vercel token dilarang keras menyebarkan nya apalagi ke github repo(fronted) atau token nya akan di blokir!!!
— Zass Desuta
*/

//——————————[ Set Payment ]——————————//
global.delayjpm = 1000
global.delaypushkontak = 6000

//——————————[ Manage Vercell ]——————————//
global.vercelToken = "2A5CIYutvRA2c8lUurA9iwkK" //Your Vercel Token

//——————————[ Manage GitHub ]——————————//
global.githubToken = "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" //Your GitHub Token
global.githubUsername = "NeoS-Labs" //Your GitHub Username

//——————————[ Media Url ]——————————//
global.gif = "https://files.catbox.moe/22w9jb.mp4" // gif menu all
global.imgthumb = "https://files.catbox.moe/z57jzn.jpeg" //thumb menu
global.imgmenu = "https://files.catbox.moe/0i1pef.jpeg" //thumb menu2
global.imgdoc = "https://files.catbox.moe/lmbhlo.jpeg" // ukuran 1280 × 450
global.logo = "https://files.catbox.moe/0i1pef.jpeg" //logo toko
global.vn = "https://files.catbox.moe/trprm3.mp3" //music menu
global.thumb_welcome = "https://files.catbox.moe/05ot73.jpeg" // welcome/leave thumb

//——————————[ Api Panel V1 ]——————————//
global.egg = "15" // Isi id egg
global.nestid = "5" // Isi id nest
global.loc = "1" // Isi id location
global.domain = "https://domainmu.com"
global.apikey = "" // Isi api ptla
global.capikey = "" // Isi api ptlc

//——————————[ Api Panel V2 ]——————————//
global.egg2 = "15" // Isi id egg
global.nestid2 = "5" // Isi id nest
global.loc2 = "1" // Isi id location
global.domain2 = "https://domainmu2.com"
global.apikey2 = "-" // Isi api ptla
global.capikey2 = "-" // Isi api ptlc

//——————————[ Api Panel PV ]——————————//
global.egg3 = "15" // Isi id egg
global.nestid3 = "5" // Isi id nest
global.loc3 = "1" // Isi id location
global.domain3 = "https://domainmu-privatepanel.vip"
global.apikey3 = "-" // Isi api ptla
global.capikey3 = "-" // Isi api ptlc

//——————————[ Set Massage ]——————————//
global.loadreact = "🧿"
global.mesg = {
  slr: "Fitur ini khusus reseller! Silahkan hubungi owner untuk membeli akses",
  pv: "*[ Warm System ]* Fitur ini khusus di private chat",
  gc: "*[ Warm System ]* Fitur ini khusus grup om—____—",
  own: "*[ Warm System ]* Sok asikk fitur ini khusus manusia tertamvan",
  adm: "*[ Warm System ]* Fitur ini khusus ateminnn",
  botadm: "Jadiin admin dulu",
  load: "bentar....",
  err: "Terjadi kesalahan, coba lagi suatu saat nanti..."
}
  

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update'${__filename}'`))
    delete require.cache[file]
    require(file)
})