// @ts-nocheck
/* Baris di atas ("@ts-nocheck") itu buat matiin peringatan tipe TypeScript
   yang suka muncul di editor kayak Acode/VSCode pas ngecek file .js biasa.
   Bukan error beneran - situsnya tetap jalan normal tanpa baris ini juga,
   cuma bikin panel "Masalah" di editor kamu jadi bersih dari warning. */

/* =========================================================
   ZANNBLOX - data & interactions
   =========================================================
   CARA NAMBAH SCRIPT BARU:
   Klik "+ Upload Script" di halaman -> login -> isi form ->
   klik "Generate Kode" -> copy hasilnya -> tempel di dalam
   kurung siku [ ] array SCRIPTS di bawah ini -> simpan file
   -> refresh halaman. ========================================================= */

const SCRIPTS = [
  // tempel di sini
   {
  title: 'Script Steal A Egg | Fyy Hub',
  game: 'Steal A Egg',
  desc: 'Vitur banyak cek sendiri',
  executor: 'Any ( semua bisa)',
  keySystem: 'No',
  time: 'baru saja',
  uploadedAt: 1788359487617,
  verified: true,
  color: 'orange',
  thumbnail: 'https://files.catbox.moe/hyrvpl.png',
  loadstring: 'loadstring(game:HttpGet("https://FyyCommunity.my.id"))()'
},
  {
  title: 'Script Steal A Egg | Nasi rendang hub',
  game: 'Steal A Egg',
  desc: 'Auto steal egg dll',
  executor: 'Any ( semua bisa)',
  keySystem: 'Key',
  time: 'baru saja',
  uploadedAt: 1788172174310,
  verified: true,
  color: 'orange',
  thumbnail: 'https://files.catbox.moe/86dnot.png',
  loadstring: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/JualNasiRendang/loader/refs/heads/main/main.lua"))()'
},
   {
  title: 'Script Steal A Egg | Night hub',
  game: 'Steal A Egg',
  desc: 'remove',
  executor: 'Any ( semua bisa)',
  keySystem: 'Key',
  time: 'baru saja',
  uploadedAt: 1788172174310,
  verified: true,
  color: 'blue',
  thumbnail: 'https://files.catbox.moe/uwre00.png',
  loadstring: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/WhiteX1208/Scripts/refs/heads/main/StealAnEggs.luau"))()'
},
   {
  title: 'Script Steal A Egg Speed Hub',
  game: 'Steal A Egg',
  desc: 'vitur vitur bagus cek sendiri',
  executor: 'Any (semua bisa)',
  keySystem: 'Key',
  time: 'baru saja',
  uploadedAt: 1788172174310,
  verified: true,
  color: 'pink',
  thumbnail: 'https://files.catbox.moe/y4qy67.png',
  loadstring: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/AhmadV99/Speed-Hub-X/main/Speed%20Hub%20X.lua", true))()'
},
];

const grid = document.getElementById("scriptGrid");

/* Ubah timestamp upload jadi teks waktu berjalan: detik -> menit -> jam
   -> hari -> bulan -> tahun, update sendiri tiap detik tanpa refresh. */
function formatRelativeTime(timestamp){
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if(seconds < 5) return "baru saja";
  if(seconds < 60) return `${seconds} detik lalu`;
  const minutes = Math.floor(seconds / 60);
  if(minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if(hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if(days < 30) return `${days} hari lalu`;
  const months = Math.floor(days / 30);
  if(months < 12) return `${months} bulan lalu`;
  const years = Math.floor(months / 12);
  return `${years} tahun lalu`;
}

setInterval(() => {
  document.querySelectorAll("[data-uploaded-at]").forEach(el => {
    el.textContent = formatRelativeTime(Number(el.dataset.uploadedAt));
  });
}, 1000);

function renderCard(item){
  const hasImage = item.thumbnail && item.thumbnail.trim() !== "";

  return `
    <article class="script-card" style="--card-shadow: var(--${item.color})" data-title="${item.title.toLowerCase()}" data-game="${item.game.toLowerCase()}">
      <div class="card-thumb ${hasImage ? "" : "no-image"}" style="--card-shadow: var(--${item.color})">
        ${hasImage ? `<img class="thumb-img" src="${item.thumbnail}" alt="${item.title}" loading="lazy" decoding="async">` : ""}
        <span class="thumb-time" ${item.uploadedAt ? `data-uploaded-at="${item.uploadedAt}"` : ""}>${item.uploadedAt ? formatRelativeTime(item.uploadedAt) : item.time}</span>
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
        <button class="get-script-btn">Get Script</button>
      </div>
    </article>
  `;
}

/* ---- Pagination: 10 script per halaman + tombol "Load More" ---- */
const PAGE_SIZE = 10;
const loadMoreWrap = document.getElementById("loadMoreWrap");
const loadMoreBtn  = document.getElementById("loadMoreBtn");

let currentList  = SCRIPTS;
let visibleCount = PAGE_SIZE;

function renderGrid(list, isSearching){
  currentList  = list;
  visibleCount = PAGE_SIZE; // list baru (hasil search/awal) -> mulai dari halaman 1 lagi
  renderVisiblePage(isSearching);
}

function renderVisiblePage(isSearching){
  const list = currentList;

  if(!list.length){
    loadMoreWrap.style.display = "none";
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

  const slice = list.slice(0, visibleCount);
  grid.innerHTML = slice.map(renderCard).join("");

  // Klik "Get Script" langsung dihubungin ke objek aslinya (bukan lewat index),
  // biar nggak salah buka script gara-gara urutan berubah pas search/pagination.
  const buttons = grid.querySelectorAll(".get-script-btn");
  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => openRedirect(slice[i]));
  });

  loadMoreWrap.style.display = visibleCount < list.length ? "flex" : "none";
}

loadMoreBtn.addEventListener("click", () => {
  visibleCount += PAGE_SIZE;
  renderVisiblePage();
});

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
   UPLOAD SCRIPT - login admin dulu, baru bisa upload
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
  uploadedAt: ${Date.now()},
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
   "GET SCRIPT" - animasi loading lalu "pindah" ke halaman
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

/* =========================================================
   VISIT COUNTER - hitung pengunjung UNIK (per perangkat/HP),
   nambah global buat semua orang, bukan cuma di HP kamu.
   =========================================================
   Sebelumnya pakai CountAPI.xyz tapi servicenya sering nggak
   bisa diandalkan/sering down, makanya diganti ke Abacus
   (abacus.jasoncameron.dev) - sama-sama gratis & tanpa daftar,
   tapi lebih stabil. Ganti VISIT_NAMESPACE di bawah jadi sesuatu
   yang unik (misal gabungan nama+tanggal) biar nggak kesenggol
   sama pengguna lain yang kebetulan pakai nama namespace sama.

   Cara kerjanya:
   - HP/device yang BELUM PERNAH buka situs ini -> hit endpoint,
     angkanya nambah 1, lalu device ditandai "udah pernah" di localStorage.
   - HP/device yang UDAH PERNAH buka -> cuma ambil angka saat ini,
     nggak nambah lagi (biar nggak numpuk gara-gara refresh/buka lagi).

   CATATAN JUJUR: ini tetap layanan pihak ketiga gratisan, jadi
   kalau servernya lagi down, badge-nya nampilin "belum sinkron"
   ketimbang angka aneh. Kalau nanti udah pindah ke Supabase, ini
   bisa diganti hitung dari database sendiri biar lebih akurat. */

const VISIT_NAMESPACE = "zannblox-hub-ganti-ini";
const VISIT_KEY = "total-visits";
const VISITED_FLAG = "zannblox_visited_device";
const visitCountNum = document.getElementById("visitCountNum");
const visitCounterEl = document.querySelector(".visit-counter");

function animateCount(el, target){
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    current += step;
    if(current >= target){ current = target; clearInterval(timer); }
    el.textContent = current.toLocaleString("id-ID");
  }, 22);
}

async function fetchVisitValue(alreadyVisited){
  const action = alreadyVisited ? "get" : "hit";
  // Coba Abacus dulu (lebih stabil)...
  try{
    const res = await fetch(`https://abacus.jasoncameron.dev/${action}/${VISIT_NAMESPACE}/${VISIT_KEY}`);
    const data = await res.json();
    if(typeof data.value === "number") return data.value;
  } catch(e){ /* lanjut ke fallback */ }

  // ...kalau Abacus gagal, coba CountAPI sebagai cadangan.
  try{
    const res = await fetch(`https://api.countapi.xyz/${action}/${VISIT_NAMESPACE}/${VISIT_KEY}`);
    const data = await res.json();
    if(typeof data.value === "number") return data.value;
  } catch(e){ /* kedua-duanya gagal */ }

  return null;
}

async function initVisitCounter(){
  if(!visitCountNum) return;
  const alreadyVisited = localStorage.getItem(VISITED_FLAG);
  const value = await fetchVisitValue(alreadyVisited);

  if(value === null){
    visitCounterEl.classList.add("vc-offline");
    visitCountNum.textContent = "";
    document.querySelector(".vc-label").textContent = "Belum sinkron, muat ulang halaman ya";
    return;
  }

  if(!alreadyVisited) localStorage.setItem(VISITED_FLAG, "true");
  animateCount(visitCountNum, value);
}

initVisitCounter();
    
