// --- Yutuqlar (achievements) ---
function getAchievements() {
  const questions = parseInt(localStorage.getItem('animeai_profile_questions') || '0', 10);
  const animeCounts = JSON.parse(localStorage.getItem('animeai_stats_anime') || '{}');
  const uniqueAnime = Object.keys(animeCounts).length;
  const achievements = [];
  if (questions >= 1) achievements.push('🎉 Birinchi savol!');
  if (questions >= 10) achievements.push('🔟 10 ta savol yubordi');
  if (questions >= 50) achievements.push('🏅 50+ savol yubordi');
  if (uniqueAnime >= 5) achievements.push('🌟 5+ turli anime haqida so‘radi');
  if (uniqueAnime >= 10) achievements.push('🌠 10+ turli anime haqida so‘radi');
  // Yana yutuqlar qo‘shish mumkin
  return achievements;
}

function updateAchievementsUI() {
  const list = document.getElementById('profile-achievements-list');
  if (!list) return;
  const achs = getAchievements();
  list.innerHTML = '';
  if (achs.length === 0) {
    list.innerHTML = '<li>Hali yutuq yo‘q</li>';
  } else {
    achs.forEach(a => {
      const li = document.createElement('li');
      li.textContent = a;
      list.appendChild(li);
    });
  }
}

function updateProfileModalAll() {
  updateProfileModal();
  updateProfileStats && updateProfileStats();
  updateAchievementsUI();
}
// Profilni tozalash yoki qayta tiklash
function resetProfile() {
  localStorage.removeItem('animeai_profile_name');
  localStorage.removeItem('animeai_profile_avatar');
  localStorage.removeItem('animeai_profile_questions');
  localStorage.removeItem('animeai_stats_anime');
  localStorage.removeItem('animeai_stats_genre');
  localStorage.removeItem('animeai_last_active');
  loadProfile();
  updateProfileStats && updateProfileStats();
  updateProfileModal && updateProfileModal();
  updateProfileModalAll && updateProfileModalAll();
}

document.addEventListener('DOMContentLoaded', function() {
  const resetBtn = document.getElementById('profile-reset-btn');
  if (resetBtn) {
    resetBtn.onclick = function() {
      if (confirm('Barcha profil va statistika maʼlumotlari o‘chiriladi. Davom etasizmi?')) {
        resetProfile();
      }
    };
  }
});
// Avatarni o'zgartirish (fayl yoki URL)
function setProfileAvatar(url) {
  localStorage.setItem('animeai_profile_avatar', url);
  // Barcha avatarlarni yangilash
  const avatarEls = [
    document.getElementById('profile-fab-img'),
    document.getElementById('profile-modal-avatar'),
    document.getElementById('profile-avatar-img')
  ];
  avatarEls.forEach(el => { if (el) el.src = url; });
}

document.addEventListener('DOMContentLoaded', function() {
  // Avatarni URL orqali o'zgartirish
  const editAvatarUrlBtn = document.getElementById('edit-avatar-url');
  if (editAvatarUrlBtn) {
    editAvatarUrlBtn.onclick = function() {
      const url = prompt("Avatar uchun rasm URL kiriting:", "");
      if (url && url.startsWith('http')) {
        setProfileAvatar(url);
      }
    };
  }
  // Avatarni fayl orqali o'zgartirish
  const editAvatarFile = document.getElementById('edit-avatar-file');
  if (editAvatarFile) {
    editAvatarFile.onchange = function(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          setProfileAvatar(ev.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  }
});
// Profil floating button va modal logikasi
function updateProfileModal() {
  const name = localStorage.getItem('animeai_profile_name') || 'Foydalanuvchi';
  const avatar = localStorage.getItem('animeai_profile_avatar') || AVATAR_USER;
  const questions = parseInt(localStorage.getItem('animeai_profile_questions') || '0', 10);
  const nameEl = document.getElementById('profile-modal-name');
  const avatarEl = document.getElementById('profile-modal-avatar');
  const questionsEl = document.getElementById('profile-modal-questions');
  if (nameEl) nameEl.textContent = name;
  if (avatarEl) avatarEl.src = avatar;
  if (questionsEl) questionsEl.textContent = questions;
}

document.addEventListener('DOMContentLoaded', function() {
  // Floating button modal ochish
  const fab = document.getElementById('profile-fab');
  const modal = document.getElementById('profile-modal');
  const closeBtn = document.getElementById('profile-modal-close');
  if (fab && modal) {
    fab.onclick = function() {
      updateProfileModal();
      modal.style.display = 'flex';
    };
  }
  if (closeBtn && modal) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  // Modalda ismni o'zgartirish
  const editModalBtn = document.getElementById('edit-profile-modal-name');
  if (editModalBtn) {
    editModalBtn.onclick = function() {
      const nameEl = document.getElementById('profile-modal-name');
      const newName = prompt("Ismingizni kiriting:", nameEl ? nameEl.textContent : '');
      if (newName && newName.trim().length > 0) {
        localStorage.setItem('animeai_profile_name', newName.trim());
        updateProfileModal();
        loadProfile();
      }
    };
  }
  // Modal ochiq paytda tashqariga bosilsa yopiladi
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
  // Profil avatarini ham yangilash (agar kerak bo'lsa)
  const fabImg = document.getElementById('profile-fab-img');
  const avatar = localStorage.getItem('animeai_profile_avatar') || AVATAR_USER;
  if (fabImg) fabImg.src = avatar;
});
// --- Profil va statistika ---
function loadProfile() {
  const name = localStorage.getItem('animeai_profile_name') || 'Foydalanuvchi';
  const avatar = localStorage.getItem('animeai_profile_avatar') || AVATAR_USER;
  const questions = parseInt(localStorage.getItem('animeai_profile_questions') || '0', 10);
  const nameEl = document.getElementById('profile-name');
  const avatarEl = document.getElementById('profile-avatar-img');
  const questionsEl = document.getElementById('profile-questions');
  if (nameEl) nameEl.textContent = name;
  if (avatarEl) avatarEl.src = avatar;
  if (questionsEl) questionsEl.textContent = questions;
}

function saveProfileName(newName) {
  localStorage.setItem('animeai_profile_name', newName);
  loadProfile();
}

function incrementProfileQuestions() {
  let q = parseInt(localStorage.getItem('animeai_profile_questions') || '0', 10);
  q++;
  localStorage.setItem('animeai_profile_questions', q);
  loadProfile();
}

document.addEventListener('DOMContentLoaded', function() {
  loadProfile();
  const editBtn = document.getElementById('edit-profile-name');
  if (editBtn) {
    editBtn.onclick = function() {
      const nameEl = document.getElementById('profile-name');
      const newName = prompt("Ismingizni kiriting:", nameEl ? nameEl.textContent : '');
      if (newName && newName.trim().length > 0) {
        saveProfileName(newName.trim());
      }
    };
  }
});
// Burger menyu va sidebar uchun mobil funksionallik
document.addEventListener('DOMContentLoaded', function () {
  const burger = document.getElementById('burger-menu');
  const sidebar = document.getElementById('sidebar');
  if (burger && sidebar) {
    burger.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      // Burger tugmasini yashirish/ko'rsatish
      if (sidebar.classList.contains('open')) {
        burger.style.opacity = '0';
        burger.style.pointerEvents = 'none';
      } else {
        burger.style.opacity = '1';
        burger.style.pointerEvents = 'auto';
      }
    });
    // Sidebar ochiq bo'lsa, tashqariga bosilganda yopiladi
    document.addEventListener('click', function (e) {
      if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== burger
      ) {
        sidebar.classList.remove('open');
        burger.style.opacity = '1';
        burger.style.pointerEvents = 'auto';
      }
    });
  }
});
/**
 * Anime Recommendation Engine
 * @param {Object[]} animeList - Array of anime objects (from anime-data.json)
 * @param {Object} options
 *   - genre: (string) genre to filter by (optional)
 *   - lastWatched: (string) anime name for similarity (optional)
 *   - exclude: (string[]) anime names to avoid recommending (optional)
 *   - count: (number) number of recommendations (default 5)
 * @returns {Object[]} Array of recommended anime objects
 */
function getRecommendations(animeList, options = {}) {
  const {
    genre = null,
    lastWatched = null,
    exclude = [],
    count = 5
  } = options;

  // Helper: get genres for a given anime name
  function getGenresByName(name) {
    const found = animeList.find(a => a.name.toLowerCase() === name.toLowerCase());
    return found ? found.genres || found.genre || [] : [];
  }

  // Helper: scoring function
  function score(anime) {
    let s = 0;
    // Genre match
    if (genre && anime.genres.map(g => g.toLowerCase()).includes(genre.toLowerCase())) s += 5;
    // Similarity to last watched
    if (lastWatched) {
      const lastGenres = getGenresByName(lastWatched);
      const common = anime.genres.filter(g => lastGenres.includes(g));
      s += common.length * 2;
    }
    // Popularity (normalized)
    s += (anime.popularity || 0);
    // Rating (normalized, assume 0-10)
    s += (anime.rating || 0) * 2;
    return s;
  }

  // Exclude already recommended or watched anime
  const excludeSet = new Set((exclude || []).map(n => n.toLowerCase()));
  if (lastWatched) excludeSet.add(lastWatched.toLowerCase());

  // Filter and score
  let candidates = animeList.filter(a => !excludeSet.has(a.name.toLowerCase()));
  if (genre) {
    candidates = candidates.filter(a => a.genres.map(g => g.toLowerCase()).includes(genre.toLowerCase()));
    if (candidates.length === 0) candidates = animeList.filter(a => !excludeSet.has(a.name.toLowerCase()));
  }

  // Score and sort
  candidates = candidates
    .map(a => ({ anime: a, score: score(a) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(obj => obj.anime);

  return candidates;
}
// --- Anime AI Chatbot Frontend Only ---
// Author: KIwei AI
// Description: Anime expert AI chatbot (Uzbek) with localStorage memory
// Helper: get most frequent item from array
function getMostFrequent(arr) {
  if (!arr.length) return '-';
  const freq = {};
  let max = 0, result = '-';
  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
    if (freq[item] > max) {
      max = freq[item];
      result = item;
    }
  }
  return result;
}

// Update profile stats UI (including most asked anime/genre, last active)
function updateProfileStats() {
  const stats = JSON.parse(localStorage.getItem('profileStats') || '{}');
  // Umumiy savollar
  document.getElementById('profile-modal-total-questions').textContent = stats.totalQuestions || 0;
  // Eng ko'p so'ralgan anime
  document.getElementById('profile-modal-most-anime').textContent = getMostFrequent(stats.animeAsked || []);
  // Eng ko'p so'ralgan janr
  document.getElementById('profile-modal-most-genre').textContent = getMostFrequent(stats.genreAsked || []);
  // Oxirgi faol vaqt
  document.getElementById('profile-modal-last-active').textContent = stats.lastActive ? new Date(stats.lastActive).toLocaleString() : '-';
}

// Call this after every user message
function updateStatsOnUserMessage(message) {
  let stats = JSON.parse(localStorage.getItem('profileStats') || '{}');
  stats.totalQuestions = (stats.totalQuestions || 0) + 1;
  // Simple anime/janr extraction (customize as needed)
  const animeList = (window.animeData || []).map(a => (a.name || '').toLowerCase());
  // Support both 'genre' and 'genres' fields
  const genreList = (window.animeData || []).flatMap(a => (a.genre || a.genres || []).map(g => g.toLowerCase()));
  const msg = message.toLowerCase();
  if (!stats.animeAsked) stats.animeAsked = [];
  if (!stats.genreAsked) stats.genreAsked = [];
  for (const anime of animeList) {
    if (anime && msg.includes(anime)) stats.animeAsked.push(anime);
  }
  for (const genre of genreList) {
    if (genre && msg.includes(genre)) stats.genreAsked.push(genre);
  }
  stats.lastActive = Date.now();
  localStorage.setItem('profileStats', JSON.stringify(stats));
  updateProfileStats();
}

// --- Add message to chat ---
function addMessage(sender, text, save = true) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ' + sender;
  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  if (sender === 'ai') {
    avatar.src = AVATAR_AI;
  } else {
    avatar.src = localStorage.getItem('animeai_profile_avatar') || AVATAR_USER;
  }
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + sender;
  // Link, image, video aniqlash va chiqarish
  const urlRegex = /(https?:\/\/[\w\-\.\/\?#=&%]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov|avi|mkv|svg|bmp|gif|pdf|html|htm)|https?:\/\/[\w\-\.\/\?#=&%]+)/gi;
  let parts = text.split(urlRegex);
  parts = parts.map(part => {
    if (!part) return '';
    if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(part)) {
      return `<img src="${part}" alt="rasm" style="max-width:220px;max-height:160px;display:block;margin:6px 0;">`;
    } else if (/^https?:\/\/.+\.(mp4|webm|mov|avi|mkv)$/i.test(part)) {
      return `<video src="${part}" controls style="max-width:220px;max-height:160px;display:block;margin:6px 0;"></video>`;
    } else if (/^https?:\/\//i.test(part)) {
      return `<a href="${part}" target="_blank" rel="noopener">${part}</a>`;
    } else {
      // Faqat user uchun escape
      if (sender === 'ai') return part;
      return part.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  });
  bubble.innerHTML = parts.join('');
  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatArea.appendChild(msgDiv);
  if (save) {
    const history = getCurrentHistory();
    history.push({ sender, text });
    saveCurrentHistory(history);
    renderSidebarHistories();
    // Foydalanuvchi savollar sonini oshirish
    if (sender === 'user') incrementProfileQuestions();
    // Statistikani yangilash (profil statistikasi uchun)
    if (sender === 'user') updateStatsOnUserMessage(text);
  }
  scrollToBottom();
}


const chatArea = document.getElementById('chat-area');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
// Sidebar elements
const sidebar = document.getElementById('sidebar');
const historyList = document.getElementById('history-list');
const newChatBtn = document.getElementById('new-chat');
const sidebarExportBtn = document.getElementById('sidebar-export');
const sidebarImportBtn = document.getElementById('sidebar-import');
const sidebarImportFile = document.getElementById('sidebar-import-file');
const sidebarUsernameInput = document.getElementById('sidebar-username');
const sidebarSaveUsernameBtn = document.getElementById('sidebar-save-username');
// Old header elements (for backward compatibility)
const usernameInput = document.getElementById('username-input');
const saveUsernameBtn = document.getElementById('save-username');
const exportBtn = document.getElementById('export-history');
const importBtn = document.getElementById('import-history');
const importFile = document.getElementById('import-file');
const AVATAR_AI = 'https://upload.wikimedia.org/wikipedia/commons/b/b9/AI_logo_by_United_Blasters.png';
const AVATAR_USER = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Font_Awesome_5_solid_user-circle.svg/1982px-Font_Awesome_5_solid_user-circle.svg.png';
let animeData = [];

// --- Load anime data ---
fetch('anime-data.json')
  .then(res => res.json())
  .then(data => { animeData = data.anime; })
  .catch(() => { animeData = []; });


// --- Chat memory (multi-history) ---
function getAllHistories() {
  return JSON.parse(localStorage.getItem('animeai_histories') || '[]');
}
function saveAllHistories(histories) {
  localStorage.setItem('animeai_histories', JSON.stringify(histories));
}
function getCurrentHistoryIndex() {
  return parseInt(localStorage.getItem('animeai_current_history') || '0', 10);
}
function setCurrentHistoryIndex(idx) {
  localStorage.setItem('animeai_current_history', idx);
}
function getCurrentHistory() {
  const histories = getAllHistories();
  const idx = getCurrentHistoryIndex();
  return histories[idx] || [];
}
function saveCurrentHistory(history) {
  const histories = getAllHistories();
  const idx = getCurrentHistoryIndex();
  histories[idx] = history;
  saveAllHistories(histories);
}
function addNewHistory() {
  const histories = getAllHistories();
  histories.push([]);
  saveAllHistories(histories);
  setCurrentHistoryIndex(histories.length - 1);
}
function deleteHistory(idx) {
  let histories = getAllHistories();
  histories.splice(idx, 1);
  if (histories.length === 0) histories = [[]];
  saveAllHistories(histories);
  setCurrentHistoryIndex(0);
}
function saveUsername(name) {
  localStorage.setItem('animeai_username', name);
}
function loadUsername() {
  return localStorage.getItem('animeai_username') || '';
}


// --- Render chat ---
function renderChat(history) {
  chatArea.innerHTML = '';
  history.forEach(msg => addMessage(msg.sender, msg.text, false));
  scrollToBottom();
}

// --- Render sidebar histories ---
function renderSidebarHistories() {
  const histories = getAllHistories();
  const idx = getCurrentHistoryIndex();
  historyList.innerHTML = '';
  histories.forEach((h, i) => {
    const li = document.createElement('li');
    li.textContent = h.length && h[0] ? (h[0].text.slice(0, 18) + (h[0].text.length > 18 ? '...' : '')) : 'Yangi chat';
    if (i === idx) li.classList.add('active');
    li.onclick = () => {
      setCurrentHistoryIndex(i);
      renderChat(getCurrentHistory());
      renderSidebarHistories();
    };
    // Right-click to delete
    li.oncontextmenu = (e) => {
      e.preventDefault();
      if (confirm('Ushbu chat tarixini o‘chirasizmi?')) {
        deleteHistory(i);
        renderChat(getCurrentHistory());
        renderSidebarHistories();
      }
    };
    historyList.appendChild(li);
  });
}


// --- Add message to chat ---
function addMessage(sender, text, save = true) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ' + sender;
  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  if (sender === 'ai') {
    avatar.src = AVATAR_AI;
  } else {
    avatar.src = localStorage.getItem('animeai_profile_avatar') || AVATAR_USER;
  }
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + sender;
  // Link, image, video aniqlash va chiqarish
  const urlRegex = /(https?:\/\/[\w\-\.\/?#=&%]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov|avi|mkv|svg|bmp|gif|pdf|html|htm)|https?:\/\/[\w\-\.\/?#=&%]+)/gi;
  let parts = text.split(urlRegex);
  parts = parts.map(part => {
    if (!part) return '';
    if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(part)) {
      return `<img src="${part}" alt="rasm" style="max-width:220px;max-height:160px;display:block;margin:6px 0;">`;
    } else if (/^https?:\/\/.+\.(mp4|webm|mov|avi|mkv)$/i.test(part)) {
      return `<video src="${part}" controls style="max-width:220px;max-height:160px;display:block;margin:6px 0;"></video>`;
    } else if (/^https?:\/\//i.test(part)) {
      return `<a href="${part}" target="_blank" rel="noopener">${part}</a>`;
    } else {
      // Faqat user uchun escape
      if (sender === 'ai') return part;
      return part.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  });
  bubble.innerHTML = parts.join('');
  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatArea.appendChild(msgDiv);
  if (save) {
    const history = getCurrentHistory();
    history.push({ sender, text });
    saveCurrentHistory(history);
    renderSidebarHistories();
    // Foydalanuvchi savollar sonini oshirish
    if (sender === 'user') incrementProfileQuestions();
  }
  scrollToBottom();
}

function scrollToBottom() {
  setTimeout(() => {
    chatArea.scrollTop = chatArea.scrollHeight;
  }, 80);
}


// --- AI Logic ---
function aiReply(userMsg, history) {
  const msg = userMsg.trim().toLowerCase();
  const username = loadUsername();
  // So'z-javoblar bazasi
  const customAnswers = {
    "otaku": "Otaku — anime va manga ishqibozi uchun ishlatiladigan soʻz!",
    "manga nima": "Manga — Yaponiyada yaratilgan komiks va grafik romanlar. Ko‘plab animelar manga asosida yaratiladi.",
    "anime nima": "Anime — Yaponiyada yaratilgan animatsion filmlar va seriallar. Ular o‘ziga xos uslub va syujetlarga ega.",
    "seiyuu": "Seiyuu — yapon tilida ovoz aktyori, ya'ni anime va boshqa animatsion asarlarda qahramonlarga ovoz beruvchi aktyor yoki aktrisa.",
    "ova": "OVA (Original Video Animation) — to‘g‘ridan-to‘g‘ri video uchun chiqarilgan maxsus anime epizodlari yoki qisqa filmlar.",
    "shounen": "Shounen — yosh o‘g‘il bolalar uchun mo‘ljallangan anime va manga janri. Ko‘pincha sarguzasht va do‘stlik mavzulari bo‘ladi.",
    "shojo": "Shojo — yosh qizlar uchun mo‘ljallangan anime va manga janri. Ko‘proq romantika va his-tuyg‘ular aks etadi.",
    "isekai": "Isekai — boshqacha dunyoga tushib qolish haqidagi anime va manga janri. Qahramonlar real dunyodan fantastik dunyoga o‘tadi.",
   "kaklik": "Kaklik — bu anime va manga olamida ko‘pincha qo‘llaniladigan hazil yoki kulgili vaziyatlarni ifodalash uchun ishlatiladigan so‘z.",
   "sundare": "Sundare — bu anime va manga qahramonlarining bir-biriga nisbatan sovuq yoki befarq munosabatlarini ifodalash uchun ishlatiladigan atama.",
 "kaklik": "Kaklik — bu anime va manga olamida ko‘pincha qo‘llaniladigan hazil yoki kulgili vaziyatlarni ifodalash uchun ishlatiladigan so‘z.",
"tsundere": "Tsundere — bu anime qahramonlarida uchraydigan xarakter turidir. Ular dastlab sovuq yoki g‘azabli bo‘lib ko‘rinadi, lekin asta-sekin iliqlik va mehr ko‘rsatadi.",
"yandere": "Yandere — bu xarakter turi, boshqalar oldida mehribon va muloyim, lekin sevgisi yoki g‘azabi bilan keskin va xavfli bo‘lib qoladigan shaxsni ifodalaydi.",
"kuudere": "Kuudere — bu xarakterlar odatda sovuq va jim turadi, lekin yaqin odamlar bilan muloyim va sadoqatli bo‘ladi.",
"dere": "Dere — bu so‘z qahramonlarning mehribon yoki sevgiga to‘la tomonlarini ifodalaydi.",
"isekai": "Isekai — bu janrda bosh qahramon boshqa olamga yoki paralel dunyoga tushadi va u yerda sarguzashtlar boshlanadi.",
"shounen": "Shounen — bu asosan yosh o‘g‘il bolalar uchun mo‘ljallangan anime yoki manga janri, unda ko‘pincha sarguzasht, do‘stlik va kuch mavzulari mavjud.",
"shoujo": "Shoujo — bu asosan yosh qizlar uchun mo‘ljallangan anime yoki manga janri, unda muhabbat va hissiyotlar markazda bo‘ladi.",
"seinen": "Seinen — kattaroq yoshdagi erkaklar uchun mo‘ljallangan janr, unda murakkab syujet va qattiq mavzular mavjud.",
"josei": "Josei — kattaroq yoshdagi ayollar uchun mo‘ljallangan anime yoki manga janri, unda realistik sevgi va hayotiy mavzular ko‘riladi.",
"mecha": "Mecha — bu janrda robotlar va texnologik qurilmalar asosiy rol o‘ynaydi, ko‘pincha janglar va texnologik sarguzashtlar markazida bo‘ladi.",
"chibi": "Chibi — bu anime va manga obrazlarini kichik va juda yumshoq, kulgili ko‘rinishda chizish usuli.",
"fanservice": "Fanservice — bu anime va manga ichida tomoshabinni xursand qilish uchun qo‘llaniladigan vizual yoki hikoya elementlari.",
"opening": "OP (Opening) — anime boshlanishidagi qo‘shiq yoki intro sahnasi.",
"ending": "ED (Ending) — anime oxiridagi qo‘shiq yoki outro sahnasi.",
"ova": "OVA (Original Video Animation) — televideniye yoki kino uchun emas, balki to‘g‘ridan-to‘g‘ri video sifatida chiqarilgan anime qismlari.",
"manga": "Manga — Yaponiyada chop etilgan komik kitob yoki serial hikoya shakli.",

"seiyuu": "Seiyuu — anime qahramonlariga ovoz beruvchi aktyor yoki aktrisa.",
"otaku": "Otaku — anime, manga va video o‘yinlarga juda qiziqqan insonni ifodalaydi.",
"kawaii": "Kawaii — yoqimli, chiroyli yoki kulgili narsalarni ifodalovchi so‘z.",
"baka": "Baka — anime qahramonlari orasida ko‘pincha hazil yoki mayda janjallar uchun ishlatiladigan 'ahmoq' so‘zi.",
"senpai": "Senpai — kimdirga hurmat bilan murojaat qiluvchi, tajribali yoki kattaroq insonni ifodalash uchun ishlatiladi.",
"kouhai": "Kouhai — senpai ga nisbatan kichik yoki yangi bo‘lgan shaxsni ifodalaydi.",
"tsukkomi": "Tsukkomi — komediya kontekstida bosh qahramonning kulgili yoki g‘alati narsalarga reaksiyasi.",
"boke": "Boke — kulgili vaziyatlarda bosh qahramonning g‘alati yoki ahmoqona harakatlari.",
"harem": "Harem — bosh qahramon atrofida bir nechta sevgi qizi qahramonlari bo‘lgan janr.",
"reverse harem": "Reverse harem — bosh qahramon ayol, atrofida bir nechta erkak qahramonlar bo‘lgan janr.",
"slice of life": "Slice of life — kundalik hayot va oddiy voqealarni tasvirlaydigan janr.",
"magical girl": "Magical girl — odatiy qizlar super qudratga ega bo‘lib, yomonlikka qarshi kurashadi.",
"shoujo-ai": "Shoujo-ai — qizlar o‘rtasidagi romantik munosabatlarni tasvirlaydigan janr.",
"shounen-ai": "Shounen-ai — o‘g‘il bolalar o‘rtasidagi romantik munosabatlarni tasvirlaydigan janr.",
"yaoi": "Yaoi — erkaklar o‘rtasidagi romantik va ba'zan jinsiy munosabatlarni ko‘rsatadigan janr.",
"yuri": "Yuri — qizlar o‘rtasidagi romantik va ba'zan jinsiy munosabatlarni ko‘rsatadigan janr.",
"ecchi": "Ecchi — biroz jinsiy, lekin haddan tashqari ko‘rsatilmagan hazil yoki sahnalar bilan boyitilgan janr.",
"hentai": "Hentai — ochiq jinsiy kontentni o‘z ichiga olgan anime yoki manga.",
"moe": "Moe — tomoshabinni himoya qilish va mehr ko‘rsatishga majbur qiladigan xarakter sifati.",
"waifu": "Waifu — tomoshabinning anime qahramoniga bo‘lgan hissiy yoki romantik sevgisi.",
"husbando": "Husbando — erkak anime qahramoniga bo‘lgan hissiy yoki romantik sevgi.",
"trap": "Trap — bosh qahramon ko‘rinishi bilan boshqa jinsga o‘xshash bo‘lib chiqadigan xarakter.",
"power-up": "Power-up — qahramonning kuchini vaqtincha yoki doimiy oshirish jarayoni.",
"battle shounen": "Battle shounen — janglar, sarguzashtlar va do‘stlikka asoslangan shounen janri.",
"villain": "Villain — hikoyadagi yomon qahramon yoki antagonist.",
"opm": "OPM (One Punch Man) kabi mashhur qisqartmalar, ko‘pincha anime nomlarini tezroq aytish uchun ishlatiladi.",
"isekai trap": "Isekai trap — bosh qahramon jinsini o‘zgartirib yoki noto‘g‘ri ko‘rinishda yangi olamga tushadigan hikoya.",
"tsundora": "Tsundora — tsundere va yandere elementlarini aralashtirgan xarakter.",
"bishoujo": "Bishoujo — chiroyli qizlarni ifodalovchi so‘z.",
"bishounen": "Bishounen — chiroyli, nozik va jozibali o‘g‘il qahramonlarni ifodalovchi so‘z.",
"kemonomimi": "Kemonomimi — inson-qo‘shmacha hayvon xususiyatlariga ega qahramonlar.",
"otome game": "Otome game — ayol bosh qahramon atrofida sevgi variantlari bo‘lgan o‘yinlar yoki hikoyalar.",
"visual novel": "Visual novel — hikoya asosidagi interaktiv o‘yinlar, ko‘pincha anime uslubida chizilgan.",
"school life": "School life — maktab va talabalar hayotini tasvirlaydigan janr.",
"supernatural": "Supernatural — ruhiy, sehrli yoki tabiiy bo‘lmagan hodisalar markazida bo‘lgan janr.",
"dark fantasy": "Dark fantasy — qorong‘u, qiyin hayotiy yoki g‘oyat xavfli fantastik dunyo janri.",
"light novel": "Light novel — oson o‘qiladigan, ko‘pincha manga va anime asosida yozilgan kitoblar.",
"opm parody": "OPM parody — mashhur anime yoki qahramonlarni kulgili tarzda parodiya qilish.",
"isekai comedy": "Isekai comedy — boshqa olamga tushgan qahramonlar bilan bog‘liq kulgili voqealar.",
"mecha pilot": "Mecha pilot — robot yoki texnologik mashinalarni boshqaruvchi qahramon.",
"shinigami": "Shinigami — anime va manga olamida o‘lim xudosi yoki ruhlarni boshqaruvchi mavjudot.",
"vampire": "Vampire — anime va manga olamida qonxo‘r mavjudotlar.",
"monster girl": "Monster girl — yarmi inson, yarmi boshqa mavjudot bo‘lgan qiz xarakterlari.",
"doujinshi": "Doujinshi — muxlislar tomonidan yaratilgan manga yoki hikoyalar.",
"isekai romance": "Isekai romance — boshqa olamga tushgan qahramonlar orasidagi romantik voqealar.",
"battle royale": "Battle royale — qahramonlar bir-biri bilan kurashadigan va yagona g‘olib qoladigan janr.",
"adventure": "Adventure — sarguzashtlar va sayohatlar asosidagi janr.",
"isekai action": "Isekai action — boshqa olamga tushgan qahramonlarning jang va harakatlari markazida.",
"fantasy": "Fantasy — sehrli va fantastik olamlar asosidagi hikoyalar.",
"isekai drama": "Isekai drama — boshqa olamga tushgan qahramonlar hayoti va hissiyotlariga asoslangan hikoya.",
"romcom": "Romcom — romantik komediya janri.",
"isekai magic": "Isekai magic — boshqa olamda sehr va qudrat ishlatiladigan hikoyalar.",
"isekai school": "Isekai school — boshqa olamda maktab yoki ta'lim muhitida hikoya.",
"isekai adventure": "Isekai adventure — boshqa olamda sarguzashtlar va sayohatlar asosida hikoya.",
"isekai battle": "Isekai battle — boshqa olamda qahramonlar orasidagi janglar.",
"isekai fantasy": "Isekai fantasy — boshqa olamda fantastik va sehrli elementlar.",
"isekai comedy drama": "Isekai comedy drama — kulgili va hissiyotli boshqa olam hikoyalari.",
"isekai harem": "Isekai harem — boshqa olamda bosh qahramon atrofida bir nechta sevgi qizi bo‘lgan hikoya.",
"isekai reverse harem": "Isekai reverse harem — boshqa olamda bosh qahramon ayol, atrofida bir nechta erkak qahramonlar.",
"isekai romantic comedy": "Isekai romantic comedy — boshqa olamda romantik va kulgili voqealar.",
"isekai drama romance": "Isekai drama romance — boshqa olamda hissiyot va romantika asosida hikoya.",
"isekai supernatural": "Isekai supernatural — boshqa olamda ruhiy yoki sehrli hodisalar.",
"isekai action adventure": "Isekai action adventure — boshqa olamda harakat va sarguzasht asosidagi hikoya.",
"isekai magical girl": "Isekai magical girl — boshqa olamda sehrli qizlar bilan bog‘liq hikoya.",
"isekai monster": "Isekai monster — boshqa olamda mavjudotlar va yovuzlikka qarshi kurash.",
"isekai fantasy action": "Isekai fantasy action — boshqa olamda sehr va jang asosidagi hikoya.",
"isekai school romance": "Isekai school romance — boshqa olamda maktab va romantika markazida hikoya.",
"isekai supernatural adventure": "Isekai supernatural adventure — boshqa olamda ruhiy va sarguzasht asosida hikoya.",
"isekai villain": "Isekai villain — boshqa olamda yomon qahramon yoki antagonist bilan bog‘liq hikoya.",
"isekai hero": "Isekai hero — boshqa olamda bosh qahramon jasorat va qudrat bilan ishlaydi.",
"isekai rival": "Isekai rival — boshqa olamda bosh qahramon bilan raqobat qiluvchi qahramon.",
"isekai companion": "Isekai companion — boshqa olamda bosh qahramonga yordam beruvchi do‘st yoki sherik.",
"isekai mentor": "Isekai mentor — boshqa olamda bosh qahramonni o‘rgatuvchi tajribali shaxs.",
"isekai guild": "Isekai guild — boshqa olamda qahramonlar birlashgan guruh yoki tashkilot.",
"isekai quest": "Isekai quest — boshqa olamda maqsad yoki vazifa asosida sarguzasht.",
"isekai dungeon": "Isekai dungeon — boshqa olamda xavfli joy yoki labirintdagi sarguzasht.",
"isekai treasure": "Isekai treasure — boshqa olamda qimmatbaho narsalar yoki mukofotlarni izlash.",
"qudrat oshirish": "Qahramonning kuchini vaqtincha yoki doimiy oshirish jarayoni.",
"sehrli qiz": "Odatda qizlar bo‘lib, sehrli qudratga ega va yomonlikka qarshi kurashadi.",
"qahramon": "Hikoyaning asosiy bosh qahramoni, jasorat va sadoqat bilan ajralib turadi.",
"yovuz qahramon": "Hikoyadagi antagonist yoki yomon niyatli shaxs.",
"do‘stlik": "Anime va manga olamida qahramonlar orasidagi sadoqat va yaqinlikni ifodalaydi.",
"sarguzasht": "Qahramonlar duch keladigan hayajonli voqealar va harakatlar.",
"sehrli olam": "Fantastik va sehrli hodisalar markazidagi hikoya.",
"maktab hayoti": "Maktab va talaba hayotini tasvirlaydigan janr.",
"sevgi": "Anime va manga qahramonlari orasidagi romantik munosabatlar.",
"kulgi": "Hazil, qiziqarli yoki kulgili vaziyatlar.",
"qahramon sherigi": "Bosh qahramonga yordam beruvchi do‘st yoki sherik.",
"yovuz mavjudot": "Qahramonlar duch keladigan dushman yoki yovuz mavjudot.",
"sehrli qudrat": "Qahramon yoki qahramonlar tomonidan ishlatiladigan sehrli kuch.",
"muxlis hikoyasi": "Fanlar tomonidan yaratilgan hikoya yoki manga.",
"interaktiv hikoya": "Tomoshabin yoki o‘quvchi qarorlari hikoyaga ta’sir qiladigan janr.",
"parodiya": "Mashhur anime yoki qahramonlarni kulgili tarzda ko‘rsatish.",
"komediya": "Hazil va kulgili voqealar bilan boyitilgan janr.",
"romantik komediya": "Romantika va hazil birlashtirilgan hikoya.",
"fantastik sarguzasht": "Sehrli va sarguzashtlar asosidagi hikoya.",
"ruhiy mavjudot": "Anime olamida ruhlar yoki o‘lim xudosi kabi mavjudotlar.",
"yovuzlikka qarshi kurash": "Qahramonlarning yovuz kuchlarga qarshi kurashi.",
"mukofot izlash": "Qahramonlar maqsad yoki xazina izlab sarguzasht qilishi.",
"guruh": "Qahramonlar birlashgan jamoa yoki tashkilot.",
"raqobatchi": "Bosh qahramon bilan raqobat qiluvchi shaxs.",
"murabbiy": "Bosh qahramonni o‘rgatuvchi tajribali shaxs.",
"labirint": "Xavfli joy yoki sirli labirintdagi sarguzasht.",
"sehrli sehrgar": "Sehr va qudrat bilan ishlovchi qahramon.",
"qahramon sarguzashti": "Bosh qahramonning hayajonli va xavfli voqealaridagi faoliyati.",
"sevgi qizi": "Bosh qahramon atrofidagi sevgi qizi qahramonlari.",
"sevgi qahramoni": "Bosh qahramon sevadigan yoki unga mehr qo‘yadigan shaxs.",
"yovuz qudrat": "Qahramonlarga qarshi ishlatiladigan kuchli yovuz qudrat.",
"sehrli maktab": "Sehrli qudratga ega maktab va talabalari hikoyasi.",
"fantastik jang": "Sehrli yoki kuchli mavjudotlar bilan jang qilish voqeasi.",
"qahramon jasorati": "Bosh qahramonning jasorat va sadoqat bilan qilgan ishlari.",
"hayajonli voqealar": "Tomoshabinni qiziqtiradigan va hayajon uyg‘otadigan voqealar.",
"muxlis yaratilishi": "Fanlar tomonidan yaratilib, hikoyaga qo‘shilgan elementlar.",
"fantastik dunyo": "Sehrli va o‘ziga xos olamdagi hikoya.",
"tahdid": "Qahramonlar duch keladigan xavfli vaziyat yoki dushman.",
"yaxshi niyat": "Qahramonlarning mehr va yaxshilik bilan qilgan harakatlari.",
"yovuz niyat": "Dushman yoki antagonistning zararli maqsadlari.",
"sehrli qurol": "Sehr va qudrat bilan ishlatiladigan maxsus qurol yoki asbob.",
"qahramon qobiliyati": "Bosh qahramonning o‘ziga xos kuchi yoki qobiliyati.",
"qiziqarli voqealar": "Tomoshabinni jalb qiladigan va qiziqtiradigan vaziyatlar.",
"fantastik mavjudotlar": "Sehrli va noodatiy mavjudotlar hikoyada markaziy rol o‘ynaydi.",
"shounen": "Shounen janridagi anime va manga odatda yosh o‘g‘il qahramonlar atrofida sodir bo‘ladigan sarguzashtlar, janglar va o‘sish hikoyalarini o‘z ichiga oladi. Bu janrda qahramonlar do‘stlik, jasorat va maqsad sari intilish orqali rivojlanadi.",
"shoujo": "Shoujo janri odatda yosh qizlar atrofidagi romantik voqealar va hissiyotlarni tasvirlaydi. Hikoyalar do‘stlik, sevgi, o‘sish va hissiy o‘zgarishlarni markazga oladi.",
"boshqa olam": "Isekai janridagi anime olamida bosh qahramon boshqa olamga yoki parallel dunyoga tushadi. Bu janrda sarguzashtlar, yangi kuchlar, do‘stlar va dushmanlar bilan to‘qnashuvlar mavjud.",
"ninja texnikalari": "Naruto kabi anime olamida ninja texnikalari, jutsu va maxfiy ko‘nikmalar muhim element bo‘lib, janglarda strategik afzallik beradi.",
"pirat sarguzashti": "One Piece kabi anime olamida qahramonlar dengizda xazina izlab sarguzasht qiladi, boshqa piratlar bilan raqobatlashadi va do‘stlikni mustahkamlaydi.",
"yovuz demonlar": "Demon Slayer olamida insoniyatga tahdid soluvchi yovuz mavjudotlar bo‘lib, qahramonlar maxsus qurollar va texnikalar yordamida ularni yo‘q qiladi.",
"super qudrat": "My Hero Academia olamida har bir qahramonning o‘ziga xos super qudrati (quirk) mavjud bo‘lib, ular janglarda va strategik vaziyatlarda qahramonlarga ustunlik beradi.",
"alkimiya transmutatsiyasi": "Fullmetal Alchemist olamida alkimya orqali moddalarni o‘zgartirish, yangi narsalar yaratish yoki janglarda strategik afzallik olish mumkin.",
"devlar": "Attack on Titan olamida gigant inson shaklidagi mavjudotlar bo‘lib, ular devorlar ortidagi insoniyatga tahdid soladi va janglar markazida turadi.",
"laqillangan buyumlar": "Jujutsu Kaisen olamida yovuz ruhlar bilan bog‘langan buyumlar bo‘lib, qahramonlar ularni yo‘q qilish yoki boshqarish vazifasini bajaradi.",
"yo‘q qilish hujumi": "Anime olamida ba’zi qahramonlar maxsus hujumlar yoki energiya bilan ob’ekt yoki dushmanlarni yo‘q qilish imkoniga ega, masalan Dragon Ball Z da.",
"mexanik robotlar": "Yapon anime olamida gigant robotlar yoki mexanik kostyumlar bilan jang qiluvchi qahramonlar. Gundam, Evangelion kabi seriyalar bunga misol.",
"ruh chaqirish": "Bleach va boshqa anime olamlarida ruhlar yoki maxsus mavjudotlarni chaqirish texnikasi, qahramonga janglarda yordam beradi.",
"sehrli qilich": "Demon Slayer va boshqa fantastik anime olamlarida sehrli qurollar, ko‘pincha qahramonlarni dushmandan himoya qiladi va janglarda ustunlik beradi.",
"jang maydoni": "Qahramonlar yoki jamoalar o‘rtasida rasmiy yoki maxsus jang maydoni, shounen va shoujo anime olamida tez-tez uchraydi.",
"maktab klubi": "Maktab hayoti janridagi qahramonlar uchun klub yoki guruhlar bo‘lib, ular o‘quvchilar orasida do‘stlik va qiziqarli voqealarni rivojlantiradi.",
"manga moslamasi": "Anime olamida mashhur manga asari asosida yaratilgan animatsion versiya, asosan hikoya va qahramonlarni saqlaydi.",
"birlashtirish voqeasi": "Bir nechta anime yoki manga olamidagi qahramonlar va hikoyalarni birlashtiruvchi voqea yoki maxsus film.",
"murabbiy shaxs": "Bosh qahramonni o‘rgatuvchi va yo‘l-yo‘riq ko‘rsatadigan tajribali shaxs, shounen va fantasy anime olamida keng tarqalgan.",
"dushman": "Bosh qahramonga raqobatchi yoki kuchli dushman bo‘lib, hikoyani qiziqarli va dramatik qiladi.",
"guild": "Bosh qahramon boshqa olamda a’zo bo‘lgan guruh yoki tashkilot, ularni sarguzasht va janglarda qo‘llab-quvvatlaydi.",
"fantastik xazina": "Sehrli va qimmatbaho buyum, ko‘pincha qahramonning motivatsiyasi va maqsadi sifatida xizmat qiladi.",
"harem": "Bosh qahramon atrofida bir nechta sevgi qizi bo‘lgan hikoya janri, romantik va kulgili elementlarni birlashtiradi.",
"teskari harem": "Bosh qahramon ayol bo‘lib, atrofida bir nechta erkak qahramonlar mavjud bo‘ladi, romantik hikoyani rivojlantiradi.",
"kuch oshishi sahnasi": "Qahramon kuchini oshiradigan sahna yoki texnika, janglar va dramatik vaziyatlarda ko‘p uchraydi.",
"g‘ayritabiiy hodisalar": "Sehrli va tabiiy bo‘lmagan hodisalar, ruhlar, sehrli mavjudotlar yoki kuchlar anime olamida tez-tez uchraydi.",
"dramatic sahna": "Hissiyotli, qahramon ichki kurashini ko‘rsatadigan sahnalar, hikoyani chuqurlashtiradi va tomoshabinni jalb qiladi.",
"romantik sahna": "Qahramonlar orasidagi sevgi va hissiyotlarni ko‘rsatadigan sahnalar, shoujo va romantik anime olamida keng tarqalgan.",
"kulgi sahnasi": "Hazil, qiziqarli yoki kulgili vaziyatlarni aks ettiruvchi sahnalar, komediya anime janrining asosiy elementi.",
"muxlis xizmati": "Muxlislar uchun qo‘shimcha vizual yoki hikoya elementi, ba’zan romantik yoki kulgili sahnalarda ishlatiladi.",
"yovuz mavjudot bilan jang": "Qahramonlar va yovuz mavjudotlar yoki hayvonlar o‘rtasidagi jang sahnalari, shounen va fantasy anime olamida keng tarqalgan.",
"sehrli maktab": "Sehrli qudratga ega maktab va talabalari hikoyasi, qahramonlar o‘z qobiliyatlarini rivojlantiradi.",
"bosh qahramon missiyasi": "Bosh qahramon boshqa olamda bajarishi kerak bo‘lgan vazifa yoki missiya, sarguzasht va dramani rivojlantiradi.",
"lanatlangan texnika": "Jujutsu Kaisen kabi anime olamida maxsus yovuz kuch yoki texnika, qahramonlar uni o‘rganib dushmanlarga qarshi kurashadi.",
"bankai": "Bleach olamida Shinigami qahramonlarining qurol va ruhiy kuchlarini maksimal darajada oshirish texnikasi. Har bir Bankai o‘ziga xos ko‘rinishga ega va qahramonning shaxsiy qudrati bilan bog‘liq. Bankai faqat yuqori darajadagi Shinigami tomonidan ishlatiladi va janglarda strategik ustunlik beradi. Ushbu texnika egasining ruhiy kuchi va tajribasiga bog‘liq bo‘lib, har bir Bankai o‘ziga xos maxsus hujum va himoya xususiyatlariga ega.",
"sharingan": "Naruto olamida Uchiha klanining ko‘z qobiliyati bo‘lib, raqibni tahlil qilish, ko‘chirish va maxsus jutsu ishlatishga imkon beradi. Sharingan foydalanuvchisi dushman harakatlarini oldindan ko‘rishi va ularni tahlil qilishi mumkin. Mangekyou Sharingan shakli yanada kuchli va maxsus texnikalarni ochadi, masalan Susanoo yoki Amaterasu. Bu ko‘z qobiliyati foydalanuvchining strategik ustunlikka erishishini ta’minlaydi.",
"kamehameha": "Dragon Ball olamida Son Goku va boshqa qahramonlar tomonidan ishlatiladigan kuchli energiya hujumi. Kamehameha foydalanuvchining ichki energiyasini to‘plab, konsentratsiyalangan lazer shaklida chiqaradi. Ushbu texnika janglarda hal qiluvchi zarba sifatida ishlatiladi va ko‘plab qahramonlar uni o‘rganishga intiladi. Turli versiyalari ham mavjud: Super Kamehameha, Big Bang Kamehameha va boshqalar.",
"rasengan": "Naruto olamida Naruto Uzumaki tomonidan yaratilgan aylanadigan chakra hujumi. Rasengan qo‘lda hosil qilinadi va zarbani maksimal kuch bilan raqibga yetkazadi. Bu texnika tezlik va aniqlikni talab qiladi, shuningdek, unga turli elementlar qo‘shilishi mumkin, masalan Wind Release: Rasengan. Rasengan bir nechta rivojlangan shakllarga ega, jumladan Giant Rasengan va Rasenshuriken.",
"chidori": "Naruto olamida Sasuke Uchiha tomonidan ishlatiladigan tez va kuchli elektr energiyasi bilan hujum texnikasi. Chidori raqibni tezda yo‘q qilishi mumkin, lekin ishlatish paytida foydalanuvchiga katta xavf tug‘diradi. Shuningdek, bu texnika foydalanuvchining tezkor harakat va aniqlik ko‘nikmalarini talab qiladi. Chidori rivojlangan shakllari ham mavjud, masalan: Chidori Nagashi va Chidori Senbon.",
"zanpakuto": "Bleach olamida Shinigami qahramonlarining ruhiy qurollari bo‘lib, har biri o‘ziga xos kuch va texnikaga ega. Zanpakuto egasi bilan ruhiy bog‘lanishga ega va qurolning haqiqiy kuchini faqat egasi ochishi mumkin. Har bir Zanpakuto ikki shaklga ega: Shikai va Bankai, har biri janglarda strategik ustunlik beradi. Shuningdek, Zanpakuto foydalanuvchining ruhiy xususiyatlarini aks ettiradi.",
"susanoo": "Naruto olamida Mangekyou Sharingan egasi tomonidan chaqiriladigan gigant ruhiy jang quroli. Susanoo foydalanuvchining himoya va hujum qudratini maksimal darajada oshiradi. Har bir Susanoo o‘ziga xos ko‘rinishga ega va faqat Mangekyou Sharingan foydalanuvchilari chaqira oladi. U janglarda himoya va taktik imkoniyatlarni oshirishda muhim ahamiyatga ega.",
"One For All": "My Hero Academia olamida All Mightdan izlangan va bir qahramondan boshqasiga uzatiladigan kuch. One For All foydalanuvchining kuchini sezilarli darajada oshiradi va janglarda hal qiluvchi rol o‘ynaydi. Ushbu qudratni egallash katta masʼuliyat va tayyorgarlikni talab qiladi. One For All nafaqat kuch, balki tezlik va chidamlilikni ham oshiradi.",
"quirk": "My Hero Academia olamida har bir qahramonga berilgan shaxsiy super qudrat. Quirklar turli shakllarda bo‘lib, jang, strategiya yoki kundalik hayotda qo‘llanilishi mumkin. Qahramonlar o‘z quirklarini rivojlantirish va nazorat qilish orqali kuchayadi. Quirklar baʼzan avloddan-avlodga uzatilishi mumkin yoki genetik xususiyatga bog‘liq bo‘ladi.",
"henshin": "Anime va tokusatsu olamida qahramonning o‘zini maxsus shaklga yoki qudratga o‘zgartirish texnikasi. Henshin orqali qahramonlar janglarda kuchayadi va yangi qobiliyatlarni ishga soladi. Ushbu texnika tomoshabinlar orasida eng mashhur vizual effektlardan biri hisoblanadi. Henshin turli shakllarda: suzuvchi kostyum, robot yoki sehrli qurol bilan birlashgan bo‘lishi mumkin.",
"tsundere": "Anime olamida qahramon dastlab sovuq yoki keskin xarakterga ega bo‘lib, keyinchalik iliq va mehribon tomonlarini ko‘rsatadi. Tsundere qahramonlar ko‘pincha romantik sahnalarda o‘zgarish ko‘rsatadi. Ushbu xarakter turi ko‘plab anime janrlarida uchraydi va tomoshabinlar orasida juda mashhur.",
"yandere": "Dastlab mehribon yoki muloyim ko‘rinadigan, ammo sevgisi zo‘ravonlikka aylanadigan qahramon tipi. Yandere qahramonlar odatda obsesif va himoyachi bo‘ladi. Ular sevgi uchun barcha cheklovlarni buzishga tayyor bo‘ladi, bu esa drama va triller elementlarini yaratadi.",
"kuudere": "Emotsiyalarini ochiq ko‘rsatmaydigan, sokin va sovuqqon xarakterga ega qahramon tipi. Kuudere qahramonlar odatda mantiqiy va strategik qarorlar qabul qiladi. Ular ko‘pincha sovuq ko‘rinadi, lekin ichida mehr va hissiyotlar yashirin bo‘ladi.",
"harem": "Asosan bir qahramon atrofida bir nechta sevgi qizi qahramonlar bo‘lgan anime janri. Harem hikoyalari romantik va kulgili sahnalarni o‘z ichiga oladi. Bosh qahramon ko‘pincha bunday vaziyatlarni boshqarishga harakat qiladi. Reverse Harem esa ayol qahramon atrofida bir nechta erkak qahramonlar bilan bo‘ladi.",
"Fan Service": "Tomoshabinlarni xursand qilish uchun qo‘shimcha vizual yoki hikoya elementlari. Fan Service sahnalari romantik, kulgili yoki baʼzan erotik bo‘lishi mumkin. Bu elementlar ko‘pincha anime muvaffaqiyatiga taʼsir qiladi.",
"opening": "Opening – anime boshlanishidagi qo‘shiq va intro sahna. OP serialning kayfiyati va mavzusini belgilaydi. Ko‘pincha OP sahnalari hikoyaning muhim voqealarini oldindan ko‘rsatadi va tomoshabin eʼtiborini jalb qiladi.",
"ending": "Ending – anime tugashidagi qo‘shiq va outro sahna. ED odatda epizod yakunini yoritadi va voqealarni xulosa qiladi. Baʼzi ED sahnalari qo‘shimcha hikoya elementlarini yoki personajlar orasidagi munosabatlarni ko‘rsatadi.",
"ova": "Original Video Animation – televideniye orqali emas, balki video formatida chiqarilgan epizod. OVA odatda asosiy hikoyadan tashqarida qo‘shimcha voqealarni ko‘rsatadi. Ular original hikoya yoki maxsus sahnalarni o‘z ichiga oladi.",
"ona": "Original Net Animation – internet orqali eʼlon qilingan anime. ONA tez-tez qisqa epizodlarda chiqariladi va turli platformalarda tomosha qilinadi. Ular televideniye cheklovlaridan mustaqil ishlaydi.",
"seiyuu": "Anime qahramonlariga ovoz beruvchi yapon aktyor yoki aktrisa. Seiyuular o‘z rollarini ovoz, hissiyot va ifoda orqali jonlantiradi. Mashhur Seiyuular muxlislar orasida katta obro‘ga ega va ko‘plab anime loyihalarida qatnashadi.",
"canon": "Asl hikoyaga tegishli voqealar yoki elementlar. Canon rasmiy syujetni belgilaydi va manga, light novel yoki original anime bilan mos keladi. Filler epizodlar esa canon bo‘lmagan voqealarni o‘z ichiga oladi.",
"filler": "Asl manbadan tashqarida anime jamoatchiligini to‘ldirish uchun kiritilgan epizod yoki sahna. Filler syujetni rivojlantirmaydi, ammo baʼzan qahramonlar xarakterini kengaytiradi yoki kulgili sahnalarni qo‘shadi.",
"glomp": "Anime va manga muxlislar orasida tez-tez uchraydigan juda ishtiyoq bilan beriladigan quchoqlash turi. Glomp sahnasi ko‘pincha kulgili yoki romantik kontekstda ishlatiladi. Bu atama fanlar orasida juda mashhur.",
"waifu": "Anime qahramoniga romantik yoki hissiy bog‘lanilgan muxlis atamasi. Waifu tushunchasi shaxsiy tanlov va mehrni ifodalaydi. Ko‘plab muxlislar o‘z waifularini himoya qilish va ularga sodiq qolishadi.",
"husbando": "Erkak anime qahramoniga nisbatan muxlisning romantik hissiy bog‘lanishi. Husbando tushunchasi shaxsiy did va afzallikni ifodalaydi. Ko‘pincha fanlar forumlarida va merchandizingda uchraydi.",
"ecchi": "Yumshoq erotik kontentni o‘z ichiga olgan anime janri. Ecchi sahnalari pornografik emas, balki hazil va romantik kontekstda ishlatiladi. Ushbu janr ko‘pincha komediya bilan birlashadi.",
"hentai": "Juda ochiq jinsiy kontentli anime va manga janri. Hentai kattalar auditoriyasi uchun mo‘ljallangan. U ko‘pincha ekstremal sahnalarni va erotik hikoyalarni o‘z ichiga oladi.",
"kawaii": "Yoqlik, chiroyli yoki kulgili narsalarni ifodalovchi yaponcha so‘z. Kawaii tushunchasi anime va manga olamida ko‘plab vizual va xarakter elementlarida uchraydi. U tomoshabinlarni jalb qilish va qahramonlarni sevimli qilish uchun ishlatiladi.",
"baka": "Hazil yoki norasmiy kontekstda ‘ahmoq’ maʼnosini beruvchi ibora. Baka so‘zi anime dialoglarida ko‘pincha hazil, keskinlik yoki dramatik effekt yaratish uchun ishlatiladi.",
"rahmat": "Hechqisi yo‘q! Har doim yordamga tayyorman 😄",
"rahmat katta!": "Doimo xursandman yordam berishga! 😎",
"iltimos": "Ha, albatta! 😊",
"uzr": "Hechqisi yo‘q! Bunday narsalar bo‘lib turadi 😅",
"anime kerak": "Albatta! Siz qaysi janrni yoqtirasiz? harakat, fantastika, romantika, komediya, horor, sirli, dramma, shoujo, shounen, meha, isekai, sport, shoujo-ai, shounen-ai, seinen, josei, slice of life, harem, reverse harem, ecchi, cyberpunk yoki Sarguzasht?",
"ekshen": "Zo‘r! Sizga 'Titanlarga Qarshi', 'Naruto', 'Bir Bo‘lak', 'Mening Qahramon Akademiyam', 'Bir Zarba Qahramon', 'Dragon Ball', 'Bleach' tavsiya qilaman 💥",
"fantastika": "Ajoyib! Sizga 'Re:Zero', 'Qilich San’ati Onlayn', 'Fate/Stay Night', 'Chuqur Ichki Dunyo', 'Made in Abyss', 'No Game No Life', 'Overlord' tavsiya qilaman ✨",
"romantika": "Yaxshi tanlov! Sizga 'Toradora!', 'Sizning Aprelingizdagi Yolg‘on', 'Clannad', 'Mevalar Savati', 'Kimi ni Todoke', 'Lovely Complex', 'Nisekoi' tavsiya qilaman ❤️",
"komediya": "Zo‘r! Sizga 'Gintama', 'Konosuba', 'Bir Zarba Qahramon', 'Saiki Kusuo no Psi-nan', 'Daily Lives of High School Boys', 'Nichijou', 'Azumanga Daioh' tavsiya qilaman 😆",
"horor": "Ajoyib! Sizga 'Tokio Ghul', 'Boshqa', 'Parazit', 'Higurashi', 'Elfen Lied', 'Another', 'Shingeki no Kyojin: Qo‘rqinchli Hikoyalar' tavsiya qilaman 😱",
"sirli": "Zo‘r tanlov! Sizga 'Steins;Gate', 'Erased', 'The Future Diary', 'Paranoia Agent', 'Ghost Hunt', 'Psycho-Pass', 'Death Note' tavsiya qilaman 🕵️‍♂️",
"dramma": "Ajoyib! Sizga 'Clannad: Yakuniy Hikoya', 'Anohana', 'Your Lie in April', 'Orange', 'Vivy: Fluorite Eye’s Song', 'Plastic Memories', 'March Comes in Like a Lion' tavsiya qilaman 😢",
"shoujo": "Zo‘r! Sizga 'Fruits Basket', 'Kimi ni Todoke', 'Lovely★Complex', 'Ao Haru Ride', 'Ouran High School Host Club', 'My Little Monster', 'Blue Spring Ride' tavsiya qilaman 🌸",
"shounen": "Ajoyib! Sizga 'Naruto', 'One Piece', 'Dragon Ball', 'Bleach', 'My Hero Academia', 'Hunter x Hunter', 'Black Clover' tavsiya qilaman 🔥",
"meha": "Zo‘r! Sizga 'Gundam', 'Evangelion', 'Code Geass', 'Darling in the FranXX', 'Tengen Toppa Gurren Lagann', 'Aldnoah.Zero', 'Vivy: Fluorite Eye’s Song' tavsiya qilaman 🤖",
"isekai": "Zo‘r tanlov! Sizga 'Re:Zero', 'Qilich San’ati Onlayn', 'No Game No Life', 'Konosuba', 'Overlord', 'That Time I Got Reincarnated as a Slime', 'Sword Art Online' tavsiya qilaman 🌍",
"sport": "Ajoyib! Sizga 'Haikyuu!!', 'Kuroko no Basket', 'Yuri on Ice', 'Free!', 'Prince of Tennis', 'Diamond no Ace', 'Hajime no Ippo' tavsiya qilaman 🏐",
"shoujo-ai": "Zo‘r! Sizga 'Citrus', 'Bloom Into You', 'Yagate Kimi ni Naru', 'Strawberry Panic!', 'Aoi Hana', 'Sasameki Koto' tavsiya qilaman 💙",
"shounen-ai": "Ajoyib! Sizga 'Given', 'Junjou Romantica', 'Sekaiichi Hatsukoi', 'Doukyuusei', 'Love Stage!!', 'Super Lovers' tavsiya qilaman 💚",
"seinen": "Zo‘r! Sizga 'Tokyo Ghoul', 'Psycho-Pass', 'Monster', 'Berserk', 'Black Lagoon', 'Paranoia Agent', 'Erased' tavsiya qilaman 🖤",
"josei": "Ajoyib! Sizga 'Nodame Cantabile', 'Paradise Kiss', 'Honey and Clover', 'Chihayafuru', 'Kuragehime', 'Sakamichi no Apollon' tavsiya qilaman 🌹",
"slice of life": "Zo‘r tanlov! Sizga 'Barakamon', 'Clannad', 'March Comes in Like a Lion', 'Usagi Drop', 'Toradora!', 'Nichijou', 'Honey and Clover' tavsiya qilaman 🏡",
"harem": "Ajoyib! Sizga 'High School DxD', 'Nisekoi', 'Rosario + Vampire', 'Date A Live', 'Saenai Heroine no Sodatekata', 'The World God Only Knows' tavsiya qilaman 💘",
"reverse harem": "Zo‘r! Sizga 'Ouran High School Host Club', 'Fushigi Yuugi', 'La Corda d’Oro', 'Hakuouki', 'Brothers Conflict', 'Yumeiro Patissiere' tavsiya qilaman 💖",
"ecchi": "Ajoyib! Sizga 'High School DxD', 'To Love-Ru', 'Prison School', 'Sekirei', 'Rosario + Vampire', 'Shinmai Maou no Testament' tavsiya qilaman 😏",
"cyberpunk": "Zo‘r tanlov! Sizga 'Akira', 'Ghost in the Shell', 'Psycho-Pass', 'Ergo Proxy', 'Texhnolyze', 'Blame!' tavsiya qilaman 🕹️",
"sarguzasht": "Ajoyib! Sizga 'One Piece', 'Made in Abyss', 'Hunter x Hunter', 'Magi', 'Fairy Tail', 'Dragon Quest: Dai no Daibouken', 'Nanatsu no Taizai' tavsiya qilaman 🗺️",


   // Yangi so'z va javoblarni shu yerga qo'shishingiz mumkin
  };
  // Custom javoblar tekshiruvi
  for (const key in customAnswers) {
    if (msg.includes(key)) {
      return customAnswers[key];
    }
  }
  // Greetings
  if (/^(salom|assalomu|hello|hi|yo|konichiwa)/i.test(msg)) {
    return random([
      `Salom${username ? ', ' + username : ''}!Men sizning Kiwei AI do‘stingizman. Bu yerda anime faqat ko‘rilmaydi — bu yerda u his qilinadi. Qaysi anime hozir kayfiyatingizga mos keladi? Nomini yozing, birga ko‘rib chiqamiz 😉?`,
      `Assalomu alaykum${username ? ', ' + username : ''}! 🔥 Yo, siz ham anime olamiga oshiqsizmi? Demak to‘g‘ri joydasiz. Men Kiwei AI’man — qahramonlar, syujetlar, studiyalar va faktlar bilan yashayman. Hozir qaysi anime xayolingizda? Yoki tavsiya kerakmi??`,
      `Hi${username ? ', ' + username : ''}! Kiwei AI tizimi faol. Men sizga anime tanlashda, tushunishda va yangi kashfiyotlarda yordam beraman. Xohlasangiz aniq anime nomini yozing, yoki “tavsiya ber” deb yozing — suhbatni boshlaymiz.?`
    ]);
  }
  // Popular anime
  if (/eng mashhur|top|populyar|mashxur/.test(msg)) {
    const tops = animeData.slice().sort((a,b)=>b.popularity-a.popularity).slice(0,5);
    return 'Eng mashhur animelar:\n' + tops.map(a=>`• ${a.name}`).join('\n');
  }
  // Anime search by name (with images)
  const nameMatch = msg.match(/([a-zA-Z0-9' ]+) haqida( ayt| so'zlab ber|)/);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    const found = animeData.find(a => a.name.toLowerCase() === name.toLowerCase());
    const formatAnimeInfo = (anime) => {
      let info = `<b>${anime.name}</b><br>`;
      info += `<i>${anime.desc}</i><br>`;
      if (anime.genre) info += `<b>Janr:</b> ${anime.genre.join(', ')}<br>`;
      if (anime.popularity) info += `<b>Mashhurlik:</b> ${anime.popularity}/10<br>`;
      if (anime.year) info += `<b>Ishlab chiqarilgan yil:</b> ${anime.year}<br>`;
      if (anime.facts && Array.isArray(anime.facts) && anime.facts.length) {
        info += `<b>Faktlar:</b> ${anime.facts.join(' | ')}<br>`;
      }
      if (anime.images && Array.isArray(anime.images) && anime.images.length) {
        info += anime.images.slice(0,3).map(url => `<img src="${url}" alt="${anime.name}" style="max-width:120px;max-height:90px;margin:4px;border-radius:6px;">`).join('');
      }
      return info;
    };
    if (found) {
      return formatAnimeInfo(found);
    }
    // Fuzzy search
    const fuzzy = animeData.find(a => a.name.toLowerCase().includes(name.toLowerCase()));
    if (fuzzy) {
      return formatAnimeInfo(fuzzy);
    }
    return 'Kechirasiz, bu anime haqida maʼlumot topilmadi.';
  }
  // Genre recommendation
  const genreMatch = msg.match(/([a-zA-Z]+) anime tavsiya qil/);
  if (genreMatch) {
    const genre = genreMatch[1].toLowerCase();
    const found = animeData.filter(a => a.genre.some(g => g.toLowerCase().includes(genre)));
    if (found.length)
      return `${capitalize(genre)} janridagi tavsiya: \n` + found.slice(0,3).map(a=>`• ${a.name}`).join('\n');
    return 'Kechirasiz, bu janrda anime topilmadi.';
  }
  // Anime search (short)
  if (/anime (qidir|izla|top)/.test(msg)) {
    const q = msg.replace(/.*anime (qidir|izla|top)/,'').trim();
    if (!q) return 'Qaysi anime qidiryapsiz?';
    const found = animeData.filter(a => a.name.toLowerCase().includes(q));
    if (found.length)
      return 'Natijalar:\n' + found.map(a=>`• ${a.name}`).join('\n');
    return 'Hech narsa topilmadi.';
  }
  // Recommendation
  if (/anime tavsiya|rekomendatsiya|recommend/.test(msg)) {
    const recs = animeData.slice().sort(()=>0.5-Math.random()).slice(0,3);
    return 'Sizga quyidagi animelar yoqishi mumkin:\n' + recs.map(a=>`• ${a.name}`).join('\n');
  }
  // Contextual fallback (use last user message)
  if (history && history.length > 1) {
    const prev = history.filter(m=>m.sender==='user').slice(-2,-1)[0];
    if (prev) {
      if (/anime/.test(prev.text.toLowerCase()))
        return 'Anime haqida yana savolingiz bormi?';
    }
  }
  // Fallback
  return random([
    `Kechirasiz${username ? ', ' + username : ''}, bu savolga javob bera olmadim. Yana soʻrashingiz mumkin.`,
    `Aniq javob topa olmadim${username ? ', ' + username : ''}. Boshqa savol bormi?`,
    `Qiziqarli savol! Biroq, aniq javob bera olmayman${username ? ', ' + username : ''}.`
  ]);
}

function random(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// --- Handle form submit ---

function handleChatFormSubmit(e) {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  addMessage('user', text);
  userInput.value = '';
  userInput.focus();
  setTimeout(() => {
    const history = getCurrentHistory();
    const aiText = aiReply(text, history);
    addMessage('ai', aiText);
  }, 500 + Math.random()*400);
}

let chatFormSubmitAttached = false;
function attachChatFormSubmit() {
  if (!chatFormSubmitAttached) {
    chatForm.addEventListener('submit', handleChatFormSubmit);
    chatFormSubmitAttached = true;
  }
}
window.addEventListener('animeDataLoaded', function() {
  attachChatFormSubmit();
});
// Fallback: agar 2 sekundda animeData yuklanmasa ham chat ishlasin
setTimeout(() => {
  attachChatFormSubmit();
}, 2000);

// --- Username logic (header and sidebar) ---
function setUsernameInputFields(name) {
  if (usernameInput) usernameInput.value = name;
  if (sidebarUsernameInput) sidebarUsernameInput.value = name;
}
function handleUsernameSave(name) {
  saveUsername(name);
  setUsernameInputFields(name);
  addMessage('ai', name ? `Ismingiz saqlandi: ${name}` : 'Ismingiz o‘chirildi.');
}
if (saveUsernameBtn && usernameInput) {
  saveUsernameBtn.addEventListener('click', function() {
    handleUsernameSave(usernameInput.value.trim());
  });
  usernameInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') saveUsernameBtn.click();
  });
}
if (sidebarSaveUsernameBtn && sidebarUsernameInput) {
  sidebarSaveUsernameBtn.addEventListener('click', function() {
    handleUsernameSave(sidebarUsernameInput.value.trim());
  });
  sidebarUsernameInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') sidebarSaveUsernameBtn.click();
  });
}

// --- Export chat history (header and sidebar) ---
function exportCurrentHistory() {
  const history = getCurrentHistory();
  const blob = new Blob([JSON.stringify(history, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'animeai_chat_history.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
if (exportBtn) exportBtn.addEventListener('click', exportCurrentHistory);
if (sidebarExportBtn) sidebarExportBtn.addEventListener('click', exportCurrentHistory);

// --- Import chat history (header and sidebar) ---
function importHistoryFromFile(fileInput) {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      if (Array.isArray(data)) {
        saveCurrentHistory(data);
        renderChat(data);
        renderSidebarHistories();
        addMessage('ai', 'Tarix muvaffaqiyatli yuklandi!');
      } else {
        addMessage('ai', 'Fayl formati noto‘g‘ri.');
      }
    } catch {
      addMessage('ai', 'Faylni o‘qishda xatolik.');
    }
  };
  reader.readAsText(file);
  fileInput.value = '';
}
if (importBtn && importFile) {
  importBtn.addEventListener('click', function() { importFile.click(); });
  importFile.addEventListener('change', function() { importHistoryFromFile(importFile); });
}
if (sidebarImportBtn && sidebarImportFile) {
  sidebarImportBtn.addEventListener('click', function() { sidebarImportFile.click(); });
  sidebarImportFile.addEventListener('change', function() { importHistoryFromFile(sidebarImportFile); });
}

// --- New chat ---
if (newChatBtn) {
  newChatBtn.addEventListener('click', function() {
    addNewHistory();
    renderChat([]);
    renderSidebarHistories();
    setTimeout(() => {
      const username = loadUsername();
      addMessage('ai', `Salom${username ? ', ' + username : ''}! Yangi chat boshlandi. Anime haqida savol bering yoki tavsiya soʻrang!`);
    }, 400);
  });
}

// --- On load: restore chat, histories, and username ---
window.addEventListener('DOMContentLoaded', () => {
  // Migrate old single history if exists
  if (!localStorage.getItem('animeai_histories')) {
    const old = localStorage.getItem('animeai_history');
    if (old) {
      saveAllHistories([JSON.parse(old)]);
      setCurrentHistoryIndex(0);
      localStorage.removeItem('animeai_history');
    } else {
      saveAllHistories([[]]);
      setCurrentHistoryIndex(0);
    }
  }
  const username = loadUsername();
  setUsernameInputFields(username);
  renderSidebarHistories();
  const history = getCurrentHistory();
  if (history.length) {
    renderChat(history);
  } else {
    setTimeout(() => {
      addMessage('ai', `Salom${username ? ', ' + username : ''}! Men Anime AI yordamchingizman. Anime haqida savol bering yoki tavsiya soʻrang!`);
    }, 400);
  }
});
