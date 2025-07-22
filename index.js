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
    ],
    // Contact section
    [
      document.querySelector(".section#contact .section__title.blur-animate"),
      document.querySelector(".section#contact .section__desc.blur-animate"),
      document.querySelector(".contact__container.blur-animate"),
    ],
    // Experience section
    [
      document.querySelector(".section#experience .section__title.blur-animate"),
      document.querySelector(".section#experience .section__desc.blur-animate"),
      ...document.querySelectorAll(".experience__item"),
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
cursor.className = "custom-cursor";
document.body.appendChild(cursor);

window.addEventListener("mousemove", (e) => {
  document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
  document.body.style.setProperty('--mouse-y', `${e.clientY}px`);

  const target = e.target;
  const isClickable = target.tagName === 'A' ||
                      target.tagName === 'BUTTON' ||
                      target.tagName === 'INPUT' ||
                      target.tagName === 'TEXTAREA' ||
                      window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer';

  if (isClickable) {
    cursor.classList.add('cursor-small');
  } else {
    cursor.classList.remove('cursor-small');
  }
});

window.addEventListener('mousedown', () => {
  cursor.classList.add('cursor-clicked');
});

window.addEventListener('mouseup', () => {
  cursor.classList.remove('cursor-clicked');
});

// Project Modal Logic
const modalOverlay = document.getElementById("project-modal-overlay");
const modal = modalOverlay
  ? modalOverlay.querySelector(".project-modal")
  : null;
const modalClose = modalOverlay
  ? modalOverlay.querySelector(".project-modal__close")
  : null;



function fillModal({ image, title, tech, description, features, live, repo }) {
  modal.querySelector(".project-modal__img").src = image;
  modal.querySelector(".project-modal__img").alt = title + " image";
  modal.querySelector(".project-modal__title").textContent = title;
  // Tech tags
  const techWrap = modal.querySelector(".project-modal__tech");
  techWrap.innerHTML = "";
  tech.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "project-modal__tag";
    span.textContent = tag;
    techWrap.appendChild(span);
  });
  modal.querySelector(".project-modal__desc").textContent = description;
  const featuresList = modal.querySelector(".project-modal__features");
  featuresList.innerHTML = "";
  features.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = f;
    featuresList.appendChild(li);
  });
  // Links
  const linksWrap = modal.querySelector(".project-modal__links");
  linksWrap.style.display = live || repo ? "flex" : "none";
  const [liveBtn, repoBtn] = linksWrap.querySelectorAll(".project-modal__btn");
  if (live) {
    liveBtn.style.display = "";
    liveBtn.href = live;
  } else {
    liveBtn.style.display = "none";
  }
  if (repo) {
    repoBtn.style.display = "";
    repoBtn.href = repo;
  } else {
    repoBtn.style.display = "none";
  }
}

// Focus trap for modal
function trapFocus(modalEl) {
  const focusable = modalEl.querySelectorAll(
    'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  modalEl.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
}

function openModal(project) {
  fillModal(project);
  modalOverlay.style.display = "flex";
  setTimeout(() => {
    modalOverlay.classList.add("active");
  }, 10);
  document.body.classList.add("modal-open");
  document.body.style.overflow = "hidden";
  modalOverlay.focus();
  trapFocus(modal);
}

function closeModal() {
  modalOverlay.classList.remove("active");
  setTimeout(() => {
    modalOverlay.style.display = "none";
  }, 400);
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
}

// Open modal on project card click


// Close modal events
if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalOverlay)
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
document.addEventListener("keydown", (e) => {
  if (
    modalOverlay.style.display === "flex" &&
    (e.key === "Escape" || e.key === "Esc")
  )
    closeModal();
});

// Dynamic project loading
async function loadProjects() {
  const projectsContainer = document.getElementById("projects-container");
  if (!projectsContainer) return;

  try {
    const response = await fetch("projects.json");
    const projects = await response.json();

    projects.forEach((project) => {
      const projectCard = document.createElement("a");
      projectCard.href = project.live || project.repo || "#"; // Fallback to # if no links
      projectCard.target = "_blank";
      projectCard.rel = "noopener";
      projectCard.className = "project__container subsection blur-animate";
      projectCard.dataset.staggerIdx = projectsContainer.children.length;
      projectCard.dataset.project = JSON.stringify(project); // Store project data

      projectCard.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="project__img" />
        <h2 class="project__title aqua-text">${project.title}</h2>
        <p class="project__desc">${project.description}</p>
        <div class="project__overlay">
          <div class="project__tech">Tech: ${project.tech.join(", ")}</div>
          <ul class="project__features">
            ${project.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
        </div>
      `;
      projectsContainer.appendChild(projectCard);

      // Add event listener for modal after creation
      projectCard.addEventListener("click", (e) => {
        // Prevent opening link if modal is intended
        if (e.target.tagName === "A" && e.target !== projectCard) return;
        e.preventDefault(); // Prevent default link behavior
        openModal(project);
      });
      projectCard.style.cursor = "pointer";
    });
    animateBlurElements();
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

// Call loadProjects when DOM is ready
document.addEventListener("DOMContentLoaded", loadProjects);
