
document.addEventListener("DOMContentLoaded", function () {

  // YIL
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // TELEFON EKRANLARI
  const phones = Array.from(document.querySelectorAll(".phone"));
  const dots = Array.from(document.querySelectorAll(".screen-dot"));
  const screenLabel = document.getElementById("screenLabel");

  const screenNames = {
    tr: ["Anasayfa", "Sesli Oda", "Görüntülü Oda", "Kullanıcı Profili"],
    en: ["Home", "Audio Room", "Video Room", "User Profile"]
  };

  let currentScreen = 0;
  let autoSlide;

  function getLanguage() {
    return document.documentElement.lang === "en" ? "en" : "tr";
  }

  function showScreen(index) {
    if (!phones.length) return;

    currentScreen = (index + phones.length) % phones.length;

    phones.forEach(function (phone, i) {
      phone.classList.toggle("active", i === currentScreen);
      phone.setAttribute(
        "aria-hidden",
        i === currentScreen ? "false" : "true"
      );
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === currentScreen);
      dot.setAttribute(
        "aria-pressed",
        i === currentScreen ? "true" : "false"
      );
    });

    if (screenLabel) {
      screenLabel.textContent =
        screenNames[getLanguage()][currentScreen] || "";
    }
  }

  function startAutoSlide() {
    clearInterval(autoSlide);

    if (phones.length > 1) {
      autoSlide = setInterval(function () {
        showScreen(currentScreen + 1);
      }, 3500);
    }
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      const selected = Number(dot.dataset.screen);

      showScreen(selected);
      startAutoSlide();
    });
  });

  showScreen(0);
  startAutoSlide();

  // DİL DEĞİŞTİRME
  const languageSelect = document.getElementById("languageSelect");

  function changeLanguage(language) {
    const selectedLanguage = language === "en" ? "en" : "tr";

    document.documentElement.lang = selectedLanguage;

    document.querySelectorAll("[data-tr][data-en]").forEach(function (element) {
      const content = element.getAttribute("data-" + selectedLanguage);

      if (content !== null) {
        element.innerHTML = content;
      }
    });

    if (languageSelect) {
      languageSelect.value = selectedLanguage;
    }

    showScreen(currentScreen);
  }

  if (languageSelect) {
    languageSelect.addEventListener("change", function () {
      changeLanguage(languageSelect.value);
    });
  }

  // MOBİL MENÜ
  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", function () {
      navigation.classList.toggle("open");

      const isOpen = navigation.classList.contains("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  // TELEFON EKRANLARINDA DOKUNMATİK GEÇİŞ
  const phoneStage = document.querySelector(".phone-stage");

  if (phoneStage) {
    let touchStartX = 0;
    let touchEndX = 0;

    phoneStage.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    phoneStage.addEventListener("touchend", function (event) {
      touchEndX = event.changedTouches[0].screenX;

      const difference = touchEndX - touchStartX;

      if (Math.abs(difference) > 45) {
        showScreen(
          difference < 0
            ? currentScreen + 1
            : currentScreen - 1
        );

        startAutoSlide();
      }
    }, { passive: true });
  }

});
