document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Envelope & Music Logic ---
    const envelope = document.querySelector('.envelope');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = false;

    if (envelope) {
        envelope.addEventListener('click', () => {
            // Открываем конверт
            envelope.classList.add('open');
            
            // Запускаем музыку
            bgMusic.volume = 0.5;
            bgMusic.play().then(() => {
                isPlaying = true;
                musicToggle.classList.add('playing');
            }).catch(e => console.log("Автозапуск аудио заблокирован браузером"));

            // Через 1.5 секунды скрываем экран загрузки и показываем сайт
            setTimeout(() => {
                envelopeWrapper.style.opacity = '0';
                setTimeout(() => {
                    envelopeWrapper.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    document.body.style.overflowY = 'auto'; // Разрешаем скролл
                    triggerFadeIns(); // Запуск анимаций появления
                }, 1000);
            }, 1500);
        });
    }

    // Music Toggle Button
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
        } else {
            bgMusic.play();
        }
        isPlaying = !isPlaying;
        musicToggle.classList.toggle('playing');
    });

    // --- 2. Countdown Timer ---
    // Устанавливаем дату свадьбы: 27 апреля 2026, 17:00
    const weddingDate = new Date("April 27, 2026 17:00:00").getTime();
    
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(timerInterval);
            document.getElementById("countdown").innerHTML = "<p>Этот день настал!</p>";
            return;
        }

        document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }, 1000);

    // --- 3. Scroll Animations (Fade-in) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    function triggerFadeIns() {
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }

    // --- 4. AJAX Form Submissions ---
    function handleFormSubmit(formId, msgId) {
        const form = document.getElementById(formId);
        const msgBox = document.getElementById(msgId);
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const btn = this.querySelector('button');
                btn.disabled = true;
                btn.innerText = 'Отправка...';

                fetch(window.location.href, {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                })
                .then(response => response.json())
                .then(data => {
                    msgBox.innerText = data.message;
                    if (data.success) {
                        form.reset();
                        // Если это форма пожеланий, перезагружаем страницу или добавляем в DOM (для простоты перезагрузим через 2 сек)
                        if (formId === 'wishForm') {
                            setTimeout(() => location.reload(), 1500);
                        }
                    }
                })
                .catch(error => {
                    msgBox.innerText = 'Произошла ошибка. Попробуйте позже.';
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.innerText = formId === 'rsvpForm' ? 'Отправить ответ' : 'Оставить пожелание';
                });
            });
        }
    }
    handleFormSubmit('rsvpForm', 'rsvp-msg');
    handleFormSubmit('wishForm', 'wish-msg');

    // --- 5. Admin Panel Search ---
    const searchInput = document.getElementById('guestSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            let filter = this.value.toLowerCase();
            let rows = document.querySelectorAll('.guest-row');
            
            rows.forEach(row => {
                let text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    }
});