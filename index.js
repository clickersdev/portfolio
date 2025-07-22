let myNav = document.getElementById("nav");
console.log(myNav);
document.addEventListener("scroll", (event) => {
  if (window.scrollY > 15) {
    myNav.classList.add("scroll");
  } else {
    myNav.classList.remove("scroll");
  }
});

// Blur-up animation for project cards and all .blur-animate elements on scroll
function animateBlurElements() {
  const blurGroups = [
    // Hero section
    Array.from(document.querySelectorAll(".hero__text-group .blur-animate")),
    // Projects section
    [
      document.querySelector(".section#projects .section__title.blur-animate"),
      document.querySelector(".section#projects .section__desc.blur-animate"),
      ...document.querySelectorAll(".projects__flex--row .project__container"),
    ],
    // Contact section
    [
      document.querySelector(".section#contact .section__title.blur-animate"),
      document.querySelector(".section#contact .section__desc.blur-animate"),
      document.querySelector(".contact__container.blur-animate"),
    ],
  ];

  blurGroups.forEach((group) => {
    if (!group) return;
    group.forEach((el, idx) => {
      if (!el) return;
      el.classList.add("blur-animate");
      el.dataset.staggerIdx = idx;
    });
  });

  // All blur-animate elements
  const allBlur = document.querySelectorAll(".blur-animate");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.staggerIdx || "0", 10);
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, idx * 120);
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  allBlur.forEach((el) => observer.observe(el));
}

// Remove AOS logic if present
if (window.AOS) delete window.AOS;

// Run after DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", animateBlurElements);
} else {
  animateBlurElements();
}

// Custom smooth cursor
const cursor = document.createElement("div");
cursor.style.position = "fixed";
cursor.style.top = "0";
cursor.style.left = "0";
cursor.style.width = "28px";
cursor.style.height = "28px";
cursor.style.borderRadius = "50%";
cursor.style.background = "rgba(0,200,150,0.18)";
cursor.style.border = "2px solid var(--clr-accent)";
cursor.style.pointerEvents = "none";
cursor.style.zIndex = "9999";
cursor.style.transition = "background 0.2s, border 0.2s;";
cursor.style.mixBlendMode = "exclusion";
document.body.appendChild(cursor);

let mouseX = 0,
  mouseY = 0,
  cursorX = 0,
  cursorY = 0;
const speed = 0.18;

function animateCursor() {
  cursorX += (mouseX - cursorX) * speed;
  cursorY += (mouseY - cursorY) * speed;
  cursor.style.transform = `translate3d(${cursorX - 14}px, ${
    cursorY - 14
  }px, 0)`;
  requestAnimationFrame(animateCursor);
}

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

animateCursor();
