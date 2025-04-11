document.addEventListener("DOMContentLoaded", function () {
    const breadcrumbNav = document.querySelector('nav[aria-label="breadcrumb"]');

    if (!breadcrumbNav) return;

    const breadcrumbList = breadcrumbNav.querySelector(".breadcrumb");

    if (!breadcrumbList) {
        console.error("Breadcrumb list not found");
        return;
    }

    // Ana Sayfa Linki
    const li1 = document.createElement("li");
    li1.className = "breadcrumb-item";
    li1.innerHTML = `<a href="/"><i class="fa fa-home"></i></a>`;
    breadcrumbList.appendChild(li1);

    // Konular Sayfası Linki
    const li2 = document.createElement("li");
    li2.className = "breadcrumb-item";
    li2.innerHTML = `<a href="/konular.html">Konular</a>`;
    breadcrumbList.appendChild(li2);

    // Eğer yol birden fazla öğe içeriyorsa
    const pathArray = window.location.pathname.split("/").filter((item) => item !== "");

    if (pathArray.length > 1) {
        let prevPath = "/konular.html";

        for (let i = 0; i < pathArray.length - 1; i++) {
            const name = pathArray[i].replace(/-/g, " ");
            prevPath += `/${pathArray[i]}`;

            // Sadece .html dosyaları için
            if (!pathArray[i].includes(".html")) continue;

            const liDynamic = document.createElement("li");
            liDynamic.className = "breadcrumb-item";
            liDynamic.innerHTML = `<a href="${prevPath}">${name}</a>`;
            breadcrumbList.appendChild(liDynamic);
        }

        // Mevcut sayfa için son li
        const currentPageName = document.title || pathArray[pathArray.length - 1].replace(".html", "").replace(/-/g, " ");

        const liCurrent = document.createElement("li");
        liCurrent.className = "breadcrumb-item active";
        liCurrent.setAttribute("aria-current", "page");
        liCurrent.textContent = currentPageName;
        breadcrumbList.appendChild(liCurrent);
    }
});

// Scroll button

let button = document.getElementById("scroll-btn");
button.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

window.onscroll = () => {
    if (window.scrollY > 200) {
        button.style.visibility = "visible";
        button.style.opacity = 1;
    } else {
        button.style.visibility = "hidden";
        button.style.opacity = 0;
    }
};

// 🌙 Dark/Light Mode Değişimi
let themeBtn = document.getElementById("theme");
let navbar = document.querySelector(".navbar");
let breadcrumb = document.getElementById("breadcrumb");
let isDark = localStorage.getItem("theme") === "dark";


function updateThemeUI() {
    let isDarkMode = document.body.classList.contains("dark");
    themeBtn.innerHTML = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";

    const prismDarkTheme = document.getElementById('prism-dark');
    const prismLightTheme = document.getElementById('prism-light');

    if (prismDarkTheme && prismLightTheme) {
        prismDarkTheme.disabled = !isDarkMode;
        prismLightTheme.disabled = isDarkMode;
    }

    if (prismDarkTheme) {
        if (isDarkMode) {
            prismDarkTheme.removeAttribute('disabled');
        } else {
            prismDarkTheme.setAttribute('disabled', 'disabled');
        }
    }

    if (window.editor) {
        window.editor.updateOptions({ theme: isDarkMode ? "vs-light" : "vs-dark" });
    }


    document.querySelectorAll(".breadcrumb-item a").forEach((link) => {
        if (isDarkMode) {
            link.classList.add("dark-mode");
        } else {
            link.classList.remove("dark-mode");
        }
    });
}


if (isDark) {
    document.body.classList.add("dark");
    navbar.classList.add("dark-mode");

    const prismDarkTheme = document.getElementById('prism-dark');
    if (prismDarkTheme) {
        prismDarkTheme.removeAttribute('disabled');
    }

    if (breadcrumb) {
        breadcrumb.classList.add("dark-mode");
    }
}
updateThemeUI();

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    navbar.classList.toggle("dark-mode");

    if (breadcrumb) {
        breadcrumb.classList.toggle("dark-mode");
    }

    let isDarkMode = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    updateThemeUI();
});

// İnternet Bağlantı Durumu Kontrolü
let wasOffline = false;

function updateOfflineStatus() {
    const offlineDiv = document.getElementById("offline");
    const onlineNotification = document.getElementById("online-notification");

    if (navigator.onLine) {
        offlineDiv.classList.remove("show");
        offlineDiv.style.zIndex = "-1";

        if (wasOffline) {
            onlineNotification.classList.add("show");
            setTimeout(() => {
                onlineNotification.classList.remove("show");
            }, 3000);
        }

        wasOffline = false;
    } else {
        offlineDiv.classList.add("show");
        offlineDiv.style.zIndex = "9999";
        wasOffline = true;
    }
}

window.addEventListener("online", updateOfflineStatus);
window.addEventListener("offline", updateOfflineStatus);
document.addEventListener("DOMContentLoaded", updateOfflineStatus);


// Service Worker

const CACHE_NAME = 'learnjs-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/run-code.html',
    '/konular.html',
    '/veri-turleri.html',
    '/code-editor.html',
    '/css/style.css',
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});


// document.addEventListener("DOMContentLoaded", function () {
//     const links = document.querySelectorAll('a[href^="#"]'); // Tüm bağlantıları seç

//     links.forEach(link => {
//         link.addEventListener("click", function (e) {
//             e.preventDefault(); // Varsayılan davranışı durdur

//             const targetId = this.getAttribute("href").substring(1);
//             const targetElement = document.getElementById(targetId);

//             if (targetElement) {
//                 const headerOffset = 80; // 80px boşluk bırak
//                 const elementPosition = targetElement.getBoundingClientRect().top;
//                 const offsetPosition = elementPosition + window.scrollY - headerOffset;

//                 window.scrollTo({
//                     top: offsetPosition,
//                     behavior: "smooth" // Yumuşak kaydırma efekti
//                 });
//             }
//         });
//     });
// });



// Aktif menü öğesini belirlemek için kod
document.addEventListener('DOMContentLoaded', function () {
    // Hash değerine göre ilgili menü öğesini bulma
    const activateMenuItem = () => {
        const hash = window.location.hash || '#';

        // Tüm aktif sınıflarını temizle
        document.querySelectorAll('.docs-sidenav .list-group-item').forEach(item => {
            item.classList.remove('active');
        });

        // Hash ile eşleşen öğeyi bul ve aktifleştir
        const activeItem = document.querySelector(`.docs-sidenav .list-group-item[href="${hash}"]`);
        if (activeItem) {
            activeItem.classList.add('active');

            // Üst menüleri aç
            let parent = activeItem.closest('.collapse');
            while (parent) {
                parent.classList.add('show');
                const trigger = document.querySelector(`[data-bs-target="#${parent.id}"]`);
                if (trigger) trigger.setAttribute('aria-expanded', 'true');
                parent = parent.parentElement.closest('.collapse');
            }
        }
    };

    // Sayfa yüklendiğinde aktifleştir
    activateMenuItem();

    // Hash değiştiğinde aktifleştir
    window.addEventListener('hashchange', activateMenuItem);
});

console.log("Hello World")


