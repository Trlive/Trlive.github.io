
(() => {
  "use strict";

  // MOBİL MENÜ
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  // TÜRKÇE / İNGİLİZCE DİL DEĞİŞTİRME
  const langButton = document.querySelector(".lang-toggle");
  let language = "tr";

  if (langButton) {
    langButton.addEventListener("click", () => {
      language = language === "tr" ? "en" : "tr";
      document.documentElement.lang = language;

      document.querySelectorAll("[data-tr][data-en]").forEach(element => {
        element.innerHTML = element.dataset[language];
      });

      langButton.textContent = language === "tr" ? "EN" : "TR";
    });
  }

  // TELEFON EKRANLARI
  const slides = [
    {
      name: "Anasayfa",
      kicker: "DISCOVER",
      title: "Find your<br>live community",
      card: "Popular rooms",
      small: "Join the conversation",
      kind: "home"
    },
    {
      name: "Sesli oda",
      kicker: "VOICE ROOM",
      title: "Voices bring<br>us together",
      card: "Live voice room",
      small: "Join and share your voice",
      kind: "voice"
    },
    {
      name: "Görüntülü oda",
      kicker: "VIDEO ROOM",
      title: "Meet face<br>to face",
      card: "Video live room",
      small: "Connect in real time",
      kind: "video"
    },
    {
      name: "Kullanıcı profili",
      kicker: "YOUR PROFILE",
      title: "Your space.<br>Your identity.",
      card: "Personal profile",
      small: "Make it yours",
      kind: "profile"
    }
  ];

  let current = 0;
  const screenContent = document.getElementById("screenContent");
  const slideName = document.getElementById("slideName");
  const dots = Array.from(document.querySelectorAll(".dot"));

  function renderSlide() {
    if (!screenContent) return;

    const slide = slides[current];

    screenContent.style.opacity = "0";

    window.setTimeout(() => {
      screenContent.innerHTML = `
        <div class="screen-brand">TR <b>LIVE</b></div>
        <p class="screen-kicker">${slide.kicker}</p>
        <h3>${slide.title}</h3>
        <div class="screen-card ${slide.kind}">
          <div class="screen-people">
            <i></i><i></i><i></i>
          </div>
          <b>${slide.card}</b>
          <small>${slide.small}</small>
        </div>
        <div class="screen-lines">
          <i></i><i></i><i></i>
        </div>
      `;

      screenContent.style.opacity = "1";
    }, 150);

    if (slideName) {
      slideName.textContent = slide.name;
    }

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === current);
    });
  }

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    renderSlide();
  }

  // SAĞ VE SOL OKLAR
  document.querySelector(".slide-arrow.prev")
    ?.addEventListener("click", () => goToSlide(current - 1));

  document.querySelector(".slide-arrow.next")
    ?.addEventListener("click", () => goToSlide(current + 1));

  // NOKTALARA DOKUNARAK GEÇİŞ
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  // TELEFONDA PARMAKLA SAĞA / SOLA KAYDIRMA
  const deviceScreen = document.querySelector(".device-screen");
  let touchStartX = null;

  if (deviceScreen) {
    deviceScreen.addEventListener("touchstart", event => {
      touchStartX = event.touches[0].clientX;
    }, { passive: true });

    deviceScreen.addEventListener("touchend", event => {
      if (touchStartX === null) return;

      const difference = event.changedTouches[0].clientX - touchStartX;

      if (Math.abs(difference) > 35) {
        goToSlide(current + (difference < 0 ? 1 : -1));
      }

      touchStartX = null;
    }, { passive: true });
  }

  // OTOMATİK GEÇİŞ: 5 SANİYEDE BİR
  if (screenContent) {
    renderSlide();
    window.setInterval(() => {
      goToSlide(current + 1);
    }, 5000);
  }
})();
