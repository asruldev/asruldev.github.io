// Script opsional untuk interaktivitas tambahan

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(mode) {
  if (mode === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }
}

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // Default: follow system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }
}

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// --- Ubuntu browser window controls ---
const browserWindow = document.getElementById('browserWindow');
const btnMin = document.getElementById('btnMin');
const btnMax = document.getElementById('btnMax');
const btnClose = document.getElementById('btnClose');

let isMaximized = false;

btnMin.addEventListener('click', () => {
  browserWindow.classList.add('minimized');
  setTimeout(() => {
    browserWindow.style.display = 'none';
    setTimeout(() => {
      browserWindow.style.display = '';
      browserWindow.classList.remove('minimized');
    }, 800);
  }, 300);
});

btnMax.addEventListener('click', () => {
  isMaximized = !isMaximized;
  if (isMaximized) {
    browserWindow.classList.add('maximized');
    browserWindow.classList.remove('restored');
  } else {
    browserWindow.classList.remove('maximized');
    browserWindow.classList.add('restored');
    setTimeout(() => browserWindow.classList.remove('restored'), 350);
  }
});

btnClose.addEventListener('click', () => {
  browserWindow.style.opacity = 0;
  setTimeout(() => {
    browserWindow.style.display = 'none';
  }, 400);
});

// --- Custom wallpaper support ---
function checkWallpaper() {
  const img = new Image();
  img.src = 'assets/wallpaper.jpg';
  img.onload = function() {
    body.classList.add('has-wallpaper');
  };
}
checkWallpaper();

const dockBrowser = document.getElementById('dockBrowser');

const dockIcons = Array.from(document.querySelectorAll('.ubuntu-dock .dock-icon'));
const sectionIds = ['about', 'experience', 'portfolio', 'contact'];
const dockSectionMap = {
  about: dockIcons[1],
  experience: dockIcons[2],
  portfolio: dockIcons[3],
  contact: dockIcons[4],
};

function setActiveDock(section) {
  dockIcons.forEach(icon => icon.classList.remove('active'));
  if (browserWindow.style.display === 'none' || browserWindow.classList.contains('minimized')) {
    // Semua non-aktif jika window tertutup
    return;
  }
  // Jika ada section aktif, hanya icon section yang aktif
  if (section && dockSectionMap[section]) {
    dockSectionMap[section].classList.add('active');
  } else {
    // Jika tidak ada section aktif, icon browser aktif
    dockBrowser.classList.add('active');
  }
}

// Update active dock on scroll
window.addEventListener('scroll', () => {
  if (browserWindow.style.display === 'none' || browserWindow.classList.contains('minimized')) return;
  let current = '';
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < 120) {
      current = id;
    }
  }
  setActiveDock(current);
});

// Update on restore from dock
function showBrowserWindowBounce() {
  browserWindow.style.display = '';
  browserWindow.classList.remove('minimized');
  browserWindow.classList.remove('maximized');
  browserWindow.classList.remove('restored');
  if (isMobile()) {
    browserWindow.classList.remove('bounce');
    browserWindow.classList.remove('windowMobileSlideUp');
    void browserWindow.offsetWidth; // force reflow
    browserWindow.classList.add('windowMobileSlideUp');
  } else {
    browserWindow.classList.add('bounce');
    setTimeout(() => browserWindow.classList.remove('bounce'), 600);
  }
  browserWindow.style.opacity = 1;
  dockBrowser.classList.add('active');
  dockBrowser.classList.add('restore-anim');
  setTimeout(() => dockBrowser.classList.remove('restore-anim'), 400);
  setTimeout(() => setActiveDock('about'), 400); // default to about
}

dockBrowser.addEventListener('click', () => {
  if (browserWindow.style.display === 'none' || browserWindow.classList.contains('minimized')) {
    showBrowserWindowBounce();
  } else {
    browserWindow.classList.add('bounce');
    setTimeout(() => browserWindow.classList.remove('bounce'), 600);
    browserWindow.scrollIntoView({behavior:'smooth'});
  }
});

function updateDockActive() {
  if (browserWindow.style.display === 'none' || browserWindow.classList.contains('minimized')) {
    dockBrowser.classList.remove('active');
  } else {
    dockBrowser.classList.add('active');
  }
}

// Update dock active state on window actions
btnMin.addEventListener('click', () => {
  setTimeout(() => setActiveDock(), 350);
});
btnMax.addEventListener('click', () => {
  setTimeout(() => setActiveDock(), 350);
});
btnClose.addEventListener('click', () => {
  setTimeout(() => setActiveDock(), 450);
});

// Initial state
setActiveDock('about');

const dragBtn = document.getElementById('dragBtn');
let isDragging = false;
let dragStartX = 0;
let windowStartLeft = 0;

function isMobile() {
  return window.innerWidth <= 900;
}

dragBtn.addEventListener('mousedown', function(e) {
  if (isMobile()) return;
  isDragging = true;
  browserWindow.style.transition = 'none';
  dragStartX = e.clientX;
  windowStartLeft = browserWindow.offsetLeft;
  document.body.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  let newLeft = windowStartLeft + dx;
  // Batas kiri-kanan
  newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - browserWindow.offsetWidth));
  browserWindow.style.left = newLeft + 'px';
  browserWindow.style.right = 'auto';
  browserWindow.style.position = 'absolute';
});

document.addEventListener('mouseup', function() {
  if (isDragging) {
    isDragging = false;
    browserWindow.style.transition = '';
    document.body.style.cursor = '';
  }
});

// Reset posisi window ke tengah saat maximize/restore
btnMax.addEventListener('click', () => {
  if (!isMobile()) {
    browserWindow.style.left = '';
    browserWindow.style.right = '';
    browserWindow.style.position = '';
  }
});
dockBrowser.addEventListener('click', () => {
  if (!isMobile()) {
    browserWindow.style.left = '';
    browserWindow.style.right = '';
    browserWindow.style.position = '';
  }
});

// Efek tap pada dock icon
Array.from(document.querySelectorAll('.ubuntu-dock .dock-icon')).forEach(icon => {
  icon.addEventListener('touchstart', () => icon.classList.add('tapped'));
  icon.addEventListener('touchend', () => setTimeout(() => icon.classList.remove('tapped'), 180));
  if (icon !== dockBrowser) {
    icon.addEventListener('click', () => {
      if (browserWindow.style.display === 'none' || browserWindow.classList.contains('minimized')) {
        showBrowserWindowBounce();
      }
    });
  }
});

// --- Swipe down to minimize (mobile only) ---
let touchStartY = 0;
let touchMoveY = 0;
let isSwiping = false;
const browserBar = document.querySelector('.browser-bar');

browserBar.addEventListener('touchstart', function(e) {
  if (!isMobile()) return;
  isSwiping = true;
  touchStartY = e.touches[0].clientY;
  browserWindow.style.transition = 'none';
});

browserBar.addEventListener('touchmove', function(e) {
  if (!isMobile() || !isSwiping) return;
  touchMoveY = e.touches[0].clientY;
  const dy = touchMoveY - touchStartY;
  if (dy > 0) {
    browserWindow.style.transform = `translateY(${dy}px)`;
    browserWindow.style.opacity = Math.max(0.3, 1 - dy / 300);
  }
});

browserBar.addEventListener('touchend', function(e) {
  if (!isMobile() || !isSwiping) return;
  isSwiping = false;
  const dy = touchMoveY - touchStartY;
  browserWindow.style.transition = '';
  if (dy > 60) {
    // Minimize
    browserWindow.classList.add('minimized');
    browserWindow.style.transform = '';
    browserWindow.style.opacity = '';
    setTimeout(() => {
      browserWindow.style.display = 'none';
      browserWindow.classList.remove('minimized');
    }, 800);
    updateDockActive();
  } else {
    // Restore
    browserWindow.style.transform = '';
    browserWindow.style.opacity = '';
  }
});

dockIcons.forEach((icon, idx) => {
  icon.addEventListener('click', () => {
    dockIcons.forEach(i => i.classList.remove('active'));
    icon.classList.add('active');
  });
});

// Nonaktifkan auto-active pada scroll dan restore
window.removeEventListener('scroll', () => {});

// --- Custom context menu on wallpaper ---
const contextMenu = document.getElementById('contextMenu');
const menuRefresh = document.getElementById('menuRefresh');
const menuTheme = document.getElementById('menuTheme');

function showContextMenu(x, y) {
  contextMenu.style.left = x + 'px';
  contextMenu.style.top = y + 'px';
  contextMenu.classList.add('active');
}
function hideContextMenu() {
  contextMenu.classList.remove('active');
}

function isWallpaperArea(target) {
  return (
    target === document.body ||
    target === document.documentElement ||
    (target.tagName === 'MAIN' && !browserWindow.contains(target))
  );
}

document.addEventListener('contextmenu', function(e) {
  // Hanya di wallpaper (body, html, main), bukan di window atau dock
  if (isWallpaperArea(e.target)) {
    e.preventDefault();
    showContextMenu(e.clientX, e.clientY);
  } else {
    hideContextMenu();
  }
});

document.addEventListener('click', function(e) {
  if (!contextMenu.contains(e.target)) hideContextMenu();
});

menuRefresh.addEventListener('click', () => {
  location.reload();
});
menuTheme.addEventListener('click', () => {
  const isDark = body.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  hideContextMenu();
}); 