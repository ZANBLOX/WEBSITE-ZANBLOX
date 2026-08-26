/* =========================================================
   ZANNBLOX — data & interactions
   =========================================================

   CARA NAMBAH SCRIPT BARU (upload manual lewat kode):
   1. Copy salah satu objek di dalam array SCRIPTS di bawah ini.
   2. Ganti isinya:
      - title      : nama script
      - game       : nama game Roblox-nya
      - desc       : deskripsi singkat 1-2 kalimat
      - executor   : contoh "Any / Delta / Hydrogen"
      - keySystem  : contoh "Tidak ada key" atau "Pakai key (Linkvertise)"
      - time       : kapan di-upload, contoh "5min ago"
      - verified   : true / false (nampilin badge centang biru)
      - color      : "pink" | "blue" | "orange" | "lime"  (dipakai kalau thumbnail kosong)
      - thumbnail  : link foto/gambar script (URL), contoh:
                     "https://i.imgur.com/namafile.png"
                     -> kosongin "" aja kalau belum punya foto, nanti otomatis pakai warna polos
      - loadstring : paste script Roblox asli kamu di sini, contoh:
                     "loadstring(game:HttpGet('https://raw.githubusercontent.com/user/repo/main/script.lua'))()"
   3. Simpan file ini, script baru otomatis muncul di halaman.
   ========================================================= */

const SCRIPTS = [
  {
  title: 'Steal A Egg Speed Hub',
  game: 'Steal A Egg',
  desc: 'Check it yourself/Cek sendiri',
  executor: 'Any (semua bisa)',
  keySystem: 'Key',
  time: 'baru saja',
  verified: true,
  color: 'blue',
  thumbnail: 'https://files.catbox.moe/y4qy67.png',
  loadstring: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/AhmadV99/Speed-Hub-X/main/Speed%20Hub%20X.lua", true))()'
},
  // Sengaja dikosongin — semua script di sini nanti diupload sendiri
  // sama admin lewat tombol "+ Upload Script" di halaman.
  //
  // Cara pakainya: klik "+ Upload Script" → login → isi form → klik
  // "Generate Kode" → copy hasilnya → tempel di sini, di dalam kurung
  // siku [ ] ini, format-nya persis kayak contoh (dikomentari) di bawah:
  //
  // {
  //   title: 'Nama Script',
  //   game: 'Nama Game',
  //   desc: 'Deskripsi singkat.',
  //   executor: 'Any',
  //   keySystem: 'Tidak ada key',
  //   time: 'baru saja',
  //   verified: true,
  //   color: 'pink',
  //   thumbnail: '',
  //   loadstring: 'loadstring(game:HttpGet(\'URL_SCRIPT_KAMU\'))()'
  // },
];

const grid = document.getElementById("scriptGrid");

function renderCard(item, index){
  const hasImage = item.thumbnail && item.thumbnail.trim() !== "";
  const thumbStyle = hasImage
    ? `background-image:url('${item.thumbnail}'); --card-shadow: var(--${item.color})`
    : `--card-shadow: var(--${item.color})`;

  return `
    <article class="script-card" style="--card-shadow: var(--${item.color})" data-title="${item.title.toLowerCase()}" data-game="${item.game.toLowerCase()}">
      <div class="card-thumb ${hasImage ? "" : "no-image"}" style="${thumbStyle}">
        <span class="thumb-time">${item.time}</span>
        <span class="thumb-badge">${item.game}</span>
      </div>
      <div class="card-body">
        <div class="card-title">
          ${item.title}
          ${item.verified ? '<span class="verified" title="Verified">✓</span>' : ''}
        </div>
        <p class="card-desc">${item.desc}</p>
        <div class="card-meta">
          <span>🎮 <strong>${item.executor}</strong></span>
          <span>🔑 <strong>${item.keySystem}</strong></span>
        </div>
        <button class="get-script-btn" data-index="${index}">Get Script</button>
      </div>
    </article>
  `;
}

function renderGrid(list, isSearching){
  if(!list.length){
    if(!isSearching && SCRIPTS.length === 0){
      grid.innerHTML = `
        <div class="no-results">
          Belum ada script yang diupload.<br>
          Klik <strong>"+ Upload Script"</strong> di atas buat mulai nambahin script kamu sendiri.
        </div>`;
    } else {
      grid.innerHTML = `<div class="no-results">Gak ada script yang cocok. Coba kata kunci lain.</div>`;
    }
    return;
  }
  grid.innerHTML = list.map(renderCard).join("");

  grid.querySelectorAll(".get-script-btn").forEach(btn => {
    btn.addEventListener("click", () => openRedirect(SCRIPTS[btn.dataset.index]));
  });
}

renderGrid(SCRIPTS);

// ---- Search bar ----
document.getElementById("topSearch").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = SCRIPTS.filter(item =>
    item.title.toLowerCase().includes(q) || item.game.toLowerCase().includes(q)
  );
  renderGrid(filtered, q.length > 0);
  if(q) document.getElementById("scripts").scrollIntoView({behavior:"smooth"});
});

/* =========================================================
   UPLOAD SCRIPT — login admin dulu, baru bisa upload
   =========================================================
   CATATAN JUJUR: ini cuma proteksi di sisi tampilan (client-side).
   Username & password ada di file JS ini, jadi kalau ada orang yang
   ngintip source code website, dia bisa lihat kredensialnya juga.
   Ini oke buat nyaring pengunjung biasa, tapi BUKAN keamanan asli.
   Kalau butuh yang beneran aman (nggak bisa dibaca siapa pun selain
   kamu), itu baru butuh backend/login system kayak Supabase Auth. */

const ADMIN_USERNAME = "ADMINZAN";
const ADMIN_PASSWORD = "qgantengg";
const SESSION_KEY = "zannblox_admin_logged_in";

const modalOverlay   = document.getElementById("modalOverlay");
const loginState     = document.getElementById("loginState");
const uploadState    = document.getElementById("uploadState");
const adminUser      = document.getElementById("adminUser");
const adminPass      = document.getElementById("adminPass");
const loginError     = document.getElementById("loginError");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
const logoutBtn      = document.getElementById("logoutBtn");

function isLoggedIn(){ return sessionStorage.getItem(SESSION_KEY) === "true"; }

function showModal(){
  modalOverlay.classList.add("open");
  if(isLoggedIn()){
    loginState.classList.remove("active");
    uploadState.classList.add("active");
  } else {
    uploadState.classList.remove("active");
    loginState.classList.add("active");
  }
}

document.getElementById("addScriptBtn").addEventListener("click", showModal);
document.getElementById("modalClose").addEventListener("click", () => modalOverlay.classList.remove("open"));
modalOverlay.addEventListener("click", (e) => { if(e.target === modalOverlay) modalOverlay.classList.remove("open"); });

function doLogin(){
  const u = adminUser.value.trim();
  const p = adminPass.value;
  if(u === ADMIN_USERNAME && p === ADMIN_PASSWORD){
    sessionStorage.setItem(SESSION_KEY, "true");
    loginError.textContent = "";
    adminUser.value = ""; adminPass.value = "";
    loginState.classList.remove("active");
    uploadState.classList.add("active");
  } else {
    loginError.textContent = "Username atau password salah.";
  }
}
loginSubmitBtn.addEventListener("click", doLogin);
adminPass.addEventListener("keydown", (e) => { if(e.key === "Enter") doLogin(); });

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  uploadState.classList.remove("active");
  loginState.classList.add("active");
});

// ---- Generator kode script (setelah login) ----
const generatedBox      = document.getElementById("generatedBox");
const generatedCode     = document.getElementById("generatedCode");
const copyGeneratedBtn  = document.getElementById("copyGeneratedBtn");

document.getElementById("generateBtn").addEventListener("click", () => {
  const title      = document.getElementById("fTitle").value.trim() || "Judul Script";
  const game       = document.getElementById("fGame").value.trim() || "Nama Game";
  const desc       = document.getElementById("fDesc").value.trim() || "Deskripsi singkat.";
  const executor   = document.getElementById("fExecutor").value.trim() || "Any";
  const keySystem  = document.getElementById("fKey").value.trim() || "Tidak ada key";
  const thumbnail  = document.getElementById("fThumb").value.trim();
  const loadstring = document.getElementById("fLoadstring").value.trim() || "loadstring(game:HttpGet('URL_SCRIPT_KAMU'))()";
  const colors = ["pink", "blue", "orange", "lime"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const esc = (s) => s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

  const snippet =
`{
  title: '${esc(title)}',
  game: '${esc(game)}',
  desc: '${esc(desc)}',
  executor: '${esc(executor)}',
  keySystem: '${esc(keySystem)}',
  time: 'baru saja',
  verified: true,
  color: '${color}',
  thumbnail: '${esc(thumbnail)}',
  loadstring: '${esc(loadstring)}'
},`;

  generatedCode.textContent = snippet;
  generatedBox.style.display = "block";
  copyGeneratedBtn.style.display = "block";
});

copyGeneratedBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(generatedCode.textContent).then(() => {
    copyGeneratedBtn.textContent = "✅ Tersalin!";
    setTimeout(() => { copyGeneratedBtn.textContent = "📋 Copy Kode"; }, 1600);
  });
});

/* =========================================================
   "GET SCRIPT" — animasi loading lalu "pindah" ke halaman
   yang nampilin script siap copy (semua tetap di 1 halaman,
   cuma disimulasikan biar berasa kayak redirect beneran).
   ========================================================= */
const redirectOverlay  = document.getElementById("redirectOverlay");
const loadingState     = document.getElementById("redirectLoading");
const resultState      = document.getElementById("redirectResult");
const redirectStatus   = document.getElementById("redirectStatus");
const redirectBarFill  = document.getElementById("redirectBarFill");
const redirectPercent  = document.getElementById("redirectPercent");
const redirectCancel   = document.getElementById("redirectCancel");
const fakeUrl          = document.getElementById("fakeUrl");
const resultTitle      = document.getElementById("resultTitle");
const resultInfo       = document.getElementById("resultInfo");
const scriptCodeText   = document.getElementById("scriptCodeText");
const copyCodeBtn      = document.getElementById("copyCodeBtn");
const redirectCloseBtn = document.getElementById("redirectCloseBtn");

const STATUS_STEPS = [
  { at: 0,   text: "Menyiapkan link aman..." },
  { at: 30,  text: "Memverifikasi script..." },
  { at: 65,  text: "Menghubungkan ke server..." },
  { at: 90,  text: "Hampir selesai..." },
  { at: 100, text: "Selesai, mengalihkan..." }
];

let redirectTimer = null;

function slugify(text){
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function openRedirect(item){
  clearInterval(redirectTimer);

  // reset ke state loading
  loadingState.classList.add("active");
  resultState.classList.remove("active");
  redirectBarFill.style.width = "0%";
  redirectPercent.textContent = "0%";
  redirectStatus.textContent = STATUS_STEPS[0].text;
  redirectOverlay.classList.add("open");

  let progress = 0;
  redirectTimer = setInterval(() => {
    progress += Math.floor(Math.random() * 9) + 4;
    if(progress >= 100){
      progress = 100;
      clearInterval(redirectTimer);
      setTimeout(() => showResult(item), 400);
    }
    redirectBarFill.style.width = progress + "%";
    redirectPercent.textContent = progress + "%";
    const step = [...STATUS_STEPS].reverse().find(s => progress >= s.at);
    if(step) redirectStatus.textContent = step.text;
  }, 260);
}

function showResult(item){
  fakeUrl.textContent = `zannblox.net/get/${slugify(item.title)}`;
  resultTitle.textContent = item.title;
  resultInfo.textContent = `${item.game} • ${item.executor} • ${item.keySystem}`;
  scriptCodeText.textContent = item.loadstring;

  loadingState.classList.remove("active");
  resultState.classList.add("active");
}

function closeRedirect(){
  clearInterval(redirectTimer);
  redirectOverlay.classList.remove("open");
}

redirectCancel.addEventListener("click", closeRedirect);
redirectCloseBtn.addEventListener("click", closeRedirect);
redirectOverlay.addEventListener("click", (e) => { if(e.target === redirectOverlay) closeRedirect(); });

copyCodeBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(scriptCodeText.textContent).then(() => {
    copyCodeBtn.textContent = "✅ Tersalin!";
    setTimeout(() => { copyCodeBtn.textContent = "📋 Copy Script"; }, 1600);
  }).catch(() => {
    copyCodeBtn.textContent = "Gagal, salin manual";
    setTimeout(() => { copyCodeBtn.textContent = "📋 Copy Script"; }, 1600);
  });
});
  
