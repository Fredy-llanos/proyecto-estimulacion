/**
 * ==========================================================================
 * GUÍAS DE ESTIMULACIÓN TEMPRANA - BEBÉS BRILLANTES
 * Script de interactividad, conversión y accesibilidad
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initAgeExplorer();
    initFaqAccordion();
    initCountdownTimer();
    initSmartStickyBar();
    initSocialProofToasts();
});

/**
 * 1. EXPLORADOR INTERACTIVO POR EDADES
 * Permite a los padres ver qué tipo de actividades e hitos desarrollarán
 */
function initAgeExplorer() {
    const tabButtons = document.querySelectorAll('.age-tab-btn');
    const panels = document.querySelectorAll('.age-content-panel');

    if (!tabButtons.length || !panels.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetAge = button.getAttribute('data-age');

            // Quitar clase activa de todos los botones y paneles
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            panels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Activar el seleccionado
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const targetPanel = document.getElementById(`panel-${targetAge}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/**
 * 2. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
 * Animación fluida con accesibilidad WAI-ARIA
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Opcional: cerrar los demás para mantener la página compacta
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Conmutar el seleccionado
            if (isActive) {
                item.classList.remove('active');
                questionBtn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/**
 * 3. TEMPORIZADOR DE OFERTA LIMITADA
 * Cuenta regresiva dinámica para incrementar la conversión
 */
function initCountdownTimer() {
    const timerElement = document.getElementById('offer-countdown');
    if (!timerElement) return;

    const STORAGE_KEY = 'bebes_brillantes_timer_deadline';
    let deadline = localStorage.getItem(STORAGE_KEY);

    // Si no existe o ya expiró, programar a 15 minutos en el futuro
    const now = Date.now();
    if (!deadline || parseInt(deadline, 10) <= now) {
        deadline = now + 15 * 60 * 1000; // 15 minutos
        localStorage.setItem(STORAGE_KEY, deadline);
    } else {
        deadline = parseInt(deadline, 10);
    }

    function updateTimer() {
        const current = Date.now();
        const remaining = Math.max(0, deadline - current);

        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        const formattedMin = String(minutes).padStart(2, '0');
        const formattedSec = String(seconds).padStart(2, '0');

        timerElement.textContent = `${formattedMin}:${formattedSec}`;

        if (remaining <= 0) {
            // Reiniciar con una pequeña prórroga sutil
            deadline = Date.now() + 12 * 60 * 1000;
            localStorage.setItem(STORAGE_KEY, deadline);
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/**
 * 4. BARRA DE COMPRA MÓVIL INTELIGENTE
 * Aparece suavemente solo cuando el usuario pasa el botón principal del Hero
 */
function initSmartStickyBar() {
    const stickyBar = document.getElementById('mobile-sticky-bar');
    const heroCta = document.getElementById('hero-cta-btn');

    if (!stickyBar || !heroCta) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si el botón principal sale de vista hacia arriba, mostramos la barra móvil
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    stickyBar.classList.add('visible');
                } else {
                    stickyBar.classList.remove('visible');
                }
            });
        }, {
            threshold: 0
        });

        observer.observe(heroCta);
    } else {
        // Fallback por scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 450) {
                stickyBar.classList.add('visible');
            } else {
                stickyBar.classList.remove('visible');
            }
        }, { passive: true });
    }
}

/**
 * 5. NOTIFICACIONES SOCIALES EN VIVO (SOCIAL PROOF TOASTS)
 * Muestra discretamente compras recientes para generar confianza
 */
function initSocialProofToasts() {
    const toast = document.getElementById('social-toast');
    if (!toast) return;

    const buyers = [
        { name: 'Valentina M.', city: 'Bogotá, Colombia', text: 'Adquirió las guías hace 4 min', icon: '👶' },
        { name: 'Sofía L.', city: 'Ciudad de México', text: 'Comenzó las actividades hoy', icon: '💖' },
        { name: 'Camila P.', city: 'Lima, Perú', text: 'Descargó el kit completo 0 a 5 años', icon: '🌟' },
        { name: 'Andrea G.', city: 'Santiago, Chile', text: 'Adquirió las guías hace 11 min', icon: '🧩' },
        { name: 'Mariana R.', city: 'Buenos Aires, Argentina', text: 'Descargó el material digital', icon: '📔' },
        { name: 'Lucía F.', city: 'Quito, Ecuador', text: 'Adquirió las guías con bonos gratis', icon: '🎁' }
    ];

    let currentIndex = 0;

    function showToast() {
        if (window.innerWidth < 680) return; // No saturar pantallas móviles pequeñas

        const buyer = buyers[currentIndex];
        const avatarEl = toast.querySelector('.social-toast-avatar');
        const titleEl = toast.querySelector('.social-toast-content h6');
        const descEl = toast.querySelector('.social-toast-content p');

        if (avatarEl && titleEl && descEl) {
            avatarEl.textContent = buyer.icon;
            titleEl.textContent = `${buyer.name} (${buyer.city})`;
            descEl.textContent = buyer.text;

            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 5000); // Se oculta tras 5 segundos
        }

        currentIndex = (currentIndex + 1) % buyers.length;
    }

    // Primera aparición tras 8 segundos, luego cada 26 segundos
    setTimeout(() => {
        showToast();
        setInterval(showToast, 26000);
    }, 8000);
}
