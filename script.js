// === UTIL: move #skills directly under #about (keeps all photos/content) ===
function moveSkillsUnderAbout() {
  const aboutSection  = document.getElementById('about');   // <section id="about">
  const skillsSection = document.getElementById('skills');  // <section id="skills">
  if (!aboutSection || !skillsSection) return;

  // Only move if it's not already immediately after About
  if (aboutSection.nextElementSibling !== skillsSection) {
    aboutSection.insertAdjacentElement('afterend', skillsSection);
  }
}

// Run once DOM is ready (works even if JSON hasn’t loaded yet)
document.addEventListener('DOMContentLoaded', moveSkillsUnderAbout);

// === Year stamp ===
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});

// === Load data/profile.json if present and render all sections ===
fetch('data/profile.json')
  .then(r => (r.ok ? r.json() : null))
  .then(data => {
    if (!data) {
      // Still ensure Skills sits under About even without data
      moveSkillsUnderAbout();
      return;
    }

    // About
    if (data.about) {
      const about = document.getElementById('aboutText');
      if (about) about.textContent = data.about;
    }

    // Email + links
    if (data.email) {
      const el = document.getElementById('emailLink');
      if (el) { el.textContent = data.email; el.href = 'mailto:' + data.email; }
    }
    if (data.links) {
      if (data.links.github) {
        const g = document.getElementById('githubLink');
        if (g) g.href = data.links.github;
      }
      if (data.links.linkedin) {
        const l = document.getElementById('linkedinLink');
        if (l) l.href = data.links.linkedin;
      }
    }

    // Projects
    if (Array.isArray(data.projects)) {
      const grid = document.getElementById('projectsGrid');
      if (grid) {
        grid.innerHTML = '';
        data.projects.forEach(p => {
          const el = document.createElement('article');
          el.className = 'row';
          el.innerHTML = `
            <div class="rule"></div>
            <div class="row-body">
              <h3>${p.title || ''}</h3>
              <p>${p.description || ''}</p>
              ${p.tags ? `<div class="tags">${p.tags.join(' · ')}</div>` : ''}
              ${p.link ? `<p style="margin-top:8px"><a class="btn" href="${p.link}" target="_blank" rel="noopener">view</a></p>` : '' }
            </div>`;
          grid.appendChild(el);
        });
      }
    }

    // Research
    if (Array.isArray(data.research)) {
      const researchList = document.getElementById('researchList');
      if (researchList) {
        researchList.innerHTML = '';
        data.research.forEach(r => {
          const el = document.createElement('article');
          el.className = 'row';
          el.innerHTML = `
            <div class="rule"></div>
            <div class="row-body">
              <h3>${r.title || ''}</h3>
              <p>${r.description || ''}</p>
              ${r.progress ? `<p class="progress">Progress: ${r.progress}</p>` : ''}
            </div>`;
          researchList.appendChild(el);
        });
      }
    }

    // Experience
    if (Array.isArray(data.experience)) {
      const list = document.getElementById('expList');
      if (list) {
        list.innerHTML = '';
        data.experience.forEach(e => {
          const li = document.createElement('li');
          li.textContent = `${e.org} — ${e.role} (${e.when})${e.summary ? ': ' + e.summary : ''}`;
          list.appendChild(li);
        });
      }
    }

    // Education
    if (Array.isArray(data.education)) {
      const list = document.getElementById('eduList');
      if (list) {
        list.innerHTML = '';
        data.education.forEach(ed => {
          const li = document.createElement('li');
          li.textContent = `${ed.school} — ${ed.degree}${ed.when ? ' (' + ed.when + ')' : ''}`;
          list.appendChild(li);
        });
      }
    }

    // Skills (text line — photos remain as-is inside #skills)
    if (Array.isArray(data.skills)) {
      const line = document.getElementById('skillsLine');
      if (line) line.textContent = data.skills.join(' · ');
    }
    // Skill photos gallery
if (Array.isArray(data.skills_photos)) {
  const gallery = document.getElementById('skillsPhotos');
  if (gallery) {
    gallery.innerHTML = '';
    data.skills_photos.forEach(photo => {
      const fig = document.createElement('figure');
      fig.className = 'skill-photo';
      fig.innerHTML = `
        <img src="${photo.src}" alt="${photo.alt || 'Skill'}">
        ${photo.title ? `<figcaption>${photo.title}</figcaption>` : ''}
      `;
      gallery.appendChild(fig);
    });
  }
}

    // After JSON-driven renders, ensure #skills sits under #about
    moveSkillsUnderAbout();
  })
  .catch(() => {
    // If JSON fails, still try to put Skills under About
    moveSkillsUnderAbout();
  });
  
// --- Optional nicety: smooth scroll + target offset for sticky headers ---
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.scrollBehavior = 'smooth';
  // Add this rule in your CSS once:
  // :target { scroll-margin-top: 80px; }  /* adjust 80px to your header height */
});

// --- Fireflies spawner (unchanged) ---
(function makeFireflies() {
  const container = document.getElementById('fireflies');
  if (!container) return;

  // Tweak density for desktop vs mobile
  const isMobile = matchMedia('(max-width: 960px)').matches;
  const COUNT = isMobile ? 18 : 36;

  for (let i = 0; i < COUNT; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';

    // randomize start position: anywhere across width, near lower 70% height
    const startX = Math.random() * 100;            // vw
    const startY = 40 + Math.random() * 60;        // vh (40–100)
    const curveX = (Math.random() * 20 - 10) + 'vw'; // -10vw..10vw
    const duration = (10 + Math.random() * 10).toFixed(1) + 's'; // 10–20s
    const flicker  = (2.2 + Math.random() * 1.8).toFixed(1) + 's'; // 2.2–4.0s
    const delay    = (-Math.random() * 10).toFixed(1) + 's'; // negative = stagger immediately
    const scale    = (0.7 + Math.random() * 0.8).toFixed(2); // 0.7–1.5

    f.style.setProperty('--start-x', startX + 'vw');
    f.style.setProperty('--start-y', startY + 'vh');
    f.style.setProperty('--curve-x', curveX);
    f.style.setProperty('--ff-duration', duration);
    f.style.setProperty('--ff-flicker', flicker);
    f.style.setProperty('--ff-delay', delay);
    f.style.setProperty('--ff-scale', scale);

    container.appendChild(f);
  }
})();
