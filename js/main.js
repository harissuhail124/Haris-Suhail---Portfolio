/**
 * Haris Suhail - Personal Portfolio
 * Interactive Features, Ambient Canvas, Filter Systems, Modals & Drawer Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initAmbientCanvas();
  initTypewriter();
  initNavigation();
  initScrollEffects();
  initSkillsFilter();
  initProjectsFilter();
  initProjectModals();
  initCopyEmail();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. AMBIENT INTERACTIVE CANVAS PARTICLES
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(139, 92, 246, ';
      this.opacity = Math.random() * 0.4 + 0.15;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse gentle repel
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          this.x -= directionX * force * 1.5;
          this.y -= directionY * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between nearby particles
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.12;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
      particles[a].update();
      particles[a].draw();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. TYPEWRITER / ROLE ROTATOR
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    'BS Computer Science Student',
    'Front-End Web Developer',
    'C / C++ Problem Solver',
    'Operations & Sales Lead',
    'Design Thinking Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      el.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200; // Pause at complete word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER & ACCESSIBILITY
   ========================================================================== */
function initNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeDrawer() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  // Close drawer on link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   4. SCROLL EFFECTS & ACTIVE LINK SPY
   ========================================================================== */
function initScrollEffects() {
  const navbar = document.querySelector('.navbar-wrapper');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  window.addEventListener('scroll', () => {
    // Sticky navbar glass style
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll Spy for active nav item
    let currentSection = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. SKILLS FILTER SYSTEM
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active button style
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECTS FILTER SYSTEM
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.projects-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-project-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECT DETAILS MODAL
   ========================================================================== */
const projectData = {
  nexus: {
    title: "Nexus Retail & Inventory Tracking System",
    category: "C++ / Systems & Data Management",
    image: "assets/project-inventory.jpg",
    description: "A robust console and file-driven inventory and point-of-sale management system built in C++. Inspired by Haris's day-to-day management at Bags'n'Bags, this project bridges practical retail challenges with object-oriented software engineering.",
    features: [
      "Custom C++ classes for Product, InventoryLedger, and SalesTransaction with strict encapsulation",
      "Persistent file stream storage (CSV / Binary) to track SKU stock counts, unit costs, and reorder levels",
      "Automated low-stock threshold alerting and end-of-day sales revenue calculation",
      "Receipt generation formatted for standard retail printers with itemized tax and invoice timestamps"
    ],
    courseworkConnection: "Developed as part of Object-Oriented Programming (OOP) and Programming Fundamentals coursework at GU Tech.",
    techStack: ["C++", "OOP Architecture", "File Streams (fstream)", "Dynamic Memory Management", "Data Structures"],
    githubUrl: "https://github.com/harissuhail124"
  },
  algovis: {
    title: "AlgoVisualizer v2.0 - Interactive CS Suite",
    category: "Web Engineering & Algorithms",
    image: "assets/project-algo.jpg",
    description: "An educational visualizer designed to assist Computer Science peers in comprehending core algorithms and data structure operations in real time.",
    features: [
      "Dynamic step-by-step sorting visualizer for Bubble Sort, QuickSort, Merge Sort, and Insertion Sort",
      "Interactive Binary Search Tree (BST) canvas node insertion, traversal, and balance checking",
      "Real-time visual complexity graphs plotting O(n log n) vs O(n²) operations",
      "Adjustable execution speed controls, step-forward / step-back debugging slider"
    ],
    courseworkConnection: "Designed to reinforce concepts from GU Tech Data Structures, Algorithms, and Web Development tracks.",
    techStack: ["JavaScript ES6+", "HTML5 Canvas", "CSS3 Transitions", "Algorithmic Analysis"],
    githubUrl: "https://github.com/harissuhail124"
  },
  luxenoir: {
    title: "Luxe Noir - Bags'n'Bags Digital Storefront",
    category: "Front-End & UI/UX Design",
    image: "assets/project-ecommerce.jpg",
    description: "A luxury glassmorphism e-commerce prototype designed to expand physical market retail operations into the digital realm, tailored for Bags'n'Bags.",
    features: [
      "Dark glassmorphism user interface with frosted glass cards and high-contrast color scheme",
      "Dynamic product filtering by bag type, material, color, and price range with instant DOM updates",
      "Interactive slide-out shopping cart drawer with live subtotal calculation and local storage persistence",
      "Mobile-first responsive layout tested across mobile viewports and desktop displays"
    ],
    courseworkConnection: "Applied principles of Design Thinking and Modern Front-End Web Engineering.",
    techStack: ["HTML5 Semantic", "Vanilla CSS3", "JavaScript ES6+", "LocalStorage API", "Glassmorphism UI"],
    githubUrl: "https://github.com/harissuhail124"
  },
  portfolio: {
    title: "Haris Suhail - Personal Portfolio Website",
    category: "Full Frontend Architecture",
    image: "assets/avatar.jpg",
    description: "The current portfolio website you are viewing! Engineered completely with semantic HTML5, Vanilla CSS3 tokens, and JavaScript without bloated frameworks.",
    features: [
      "Custom dark glassmorphic design system using CSS variables, backdrop blurs, and neon accents",
      "Interactive timeline showcasing GU Tech BS CS and Aisha Bawany Pre-Engineering coursework",
      "Interactive ambient particle canvas with mouse-distance connection physics",
      "WCAG AA contrast compliant colors, semantic headings, and keyboard navigation support"
    ],
    courseworkConnection: "Synthesis of Computer Science web technologies and Design Thinking user experience principles.",
    techStack: ["HTML5", "CSS3 Custom Properties", "JavaScript ES6", "WCAG AA Guidelines"],
    githubUrl: "https://github.com/harissuhail124"
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-content');
  const openButtons = document.querySelectorAll('.open-modal-btn');

  if (!modalOverlay || !modalBody) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div style="position: relative; width: 100%; aspect-ratio: 16/9; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 20px; background: #0c1220;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
        <span style="position: absolute; top: 12px; left: 12px; background: rgba(9, 13, 24, 0.85); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.12); color: var(--accent-sky); font-family: var(--font-mono); font-size: 0.75rem; padding: 4px 12px; border-radius: var(--radius-full);">
          ${data.category}
        </span>
      </div>
      <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 700; color: #fff; margin-bottom: 12px;">${data.title}</h3>
      <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.7; margin-bottom: 20px;">${data.description}</p>
      
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
        <h4 style="font-family: var(--font-heading); font-size: 1rem; color: var(--accent-cyan); margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Key Architecture & Engineering Features
        </h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; padding: 0;">
          ${data.features.map(f => `
            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.92rem; color: var(--text-secondary);">
              <span style="color: var(--accent-emerald); font-weight: bold;">✓</span>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 20px; font-size: 0.9rem; color: var(--text-muted); font-style: italic; background: rgba(6, 182, 212, 0.05); padding: 10px 14px; border-left: 3px solid var(--accent-cyan); border-radius: 4px;">
        <strong>Academic Context:</strong> ${data.courseworkConnection}
      </div>

      <div style="margin-bottom: 24px;">
        <h5 style="font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;">Tech Stack & Tools</h5>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${data.techStack.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 14px; flex-wrap: wrap;">
        <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          View on GitHub Profile
        </a>
      </div>
    `;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project-id');
      openModal(projId);
    });
  });

  modalClose?.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. COPY EMAIL TO CLIPBOARD WITH TOAST FEEDBACK
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = 'haris124suhail@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText).then(
      () => {
        showToast('Email address copied to clipboard!');
        copyBtn.innerHTML = `
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Copied!
        `;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy Email
          `;
        }, 2200);
      },
      () => {
        showToast('Failed to copy. Email: haris124suhail@gmail.com');
      }
    );
  });
}

/* Toast message utility */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" fill="none" stroke="#06b6d4" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

/* ==========================================================================
   9. INTERACTIVE CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim() || 'Portfolio Contact Inquiry';
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please fill out all required fields (Name, Email, Message).';
      }
      return;
    }

    // Prepare mailto link with encoded parameters
    const bodyContent = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:haris124suhail@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyContent)}`;

    if (feedback) {
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `Thank you, <strong>${name}</strong>! Opening your email client to send your message...`;
    }

    showToast('Launching email client...');
    window.location.href = mailtoUrl;

    setTimeout(() => {
      form.reset();
    }, 1500);
  });
}

/* ==========================================================================
   10. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
