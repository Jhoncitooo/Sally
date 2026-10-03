/* ==========================================================================
   CARS MOVIE INVITATION - INTERACTIVE SCRIPT (08 DE OCTUBRE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. WEB AUDIO API SYNTHESIZER FOR SOUND SFX ---
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playEngineRev() {
    if (!soundEnabled) return;
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  function playStampSFX() {
    if (!soundEnabled) return;
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  }

  // Sound Toggle Button
  const soundBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    soundBtn.style.opacity = soundEnabled ? '1' : '0.6';
    if (soundEnabled) playStampSFX();
  });


  // --- 2. THEME SWITCH (DESERT DAY / NEON NIGHT) ---
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'neon' ? 'desert' : 'neon';
    document.documentElement.setAttribute('data-theme', newTheme);
    
    themeBtn.querySelector('.theme-icon').textContent = newTheme === 'neon' ? '☀️' : '💡';
    themeBtn.setAttribute('title', newTheme === 'neon' ? 'Cambiar a Modo Día' : 'Cambiar a Modo Neón');
    playEngineRev();
  });


  // --- 3. SPEEDOMETER COUNTDOWN TIMER (TARGET: OCT 8) ---
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // Set target date for October 8th of current or next target year (2026-10-08 19:00:00)
  const now = new Date();
  let targetYear = now.getFullYear();
  let targetDate = new Date(targetYear, 9, 8, 19, 0, 0); // Month is 0-indexed (9 = Oct)

  if (now > targetDate) {
    targetDate = new Date(targetYear + 1, 9, 8, 19, 0, 0);
  }

  function updateCountdown() {
    const currentTime = new Date();
    const diff = targetDate - currentTime;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();


  // --- 4. VIP TICKET GENERATOR & STAMPER ---
  const guestInput = document.getElementById('guest-name-input');
  const ticketNameDisplay = document.getElementById('ticket-name-display');
  const stampBtn = document.getElementById('stamp-btn');
  const ticketCard = document.getElementById('ticket-card');

  guestInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    ticketNameDisplay.textContent = val ? val.toUpperCase() : 'TU NOMBRE AQUÍ';
  });

  stampBtn.addEventListener('click', () => {
    const guestName = guestInput.value.trim() || 'INVITADO ESPECIAL';
    ticketNameDisplay.textContent = guestName.toUpperCase();

    ticketCard.classList.remove('ticket-stamped');
    void ticketCard.offsetWidth; // Trigger reflow
    ticketCard.classList.add('ticket-stamped');

    playStampSFX();
  });


  // --- 5. MENÚ DE PITS & SNACK SELECTOR ---
  const snackCounts = {
    popcorn: 0,
    soda: 0,
    pizza: 0,
    candy: 0
  };

  const snackNames = {
    popcorn: '🍿 Palomitas',
    soda: '🥤 Refrescos',
    pizza: '🍕 Pizza',
    candy: '🍬 Dulces'
  };

  const snackSummaryText = document.getElementById('snack-list-text');

  document.querySelectorAll('.snack-card').forEach(card => {
    const id = card.getAttribute('data-id');
    const decreaseBtn = card.querySelector('.decrease');
    const increaseBtn = card.querySelector('.increase');
    const qtySpan = card.querySelector('.snack-qty');

    increaseBtn.addEventListener('click', () => {
      snackCounts[id]++;
      qtySpan.textContent = snackCounts[id];
      updateSnackSummary();
      playStampSFX();
    });

    decreaseBtn.addEventListener('click', () => {
      if (snackCounts[id] > 0) {
        snackCounts[id]--;
        qtySpan.textContent = snackCounts[id];
        updateSnackSummary();
        playStampSFX();
      }
    });
  });

  function updateSnackSummary() {
    const selected = [];
    for (const [key, count] of Object.entries(snackCounts)) {
      if (count > 0) {
        selected.push(`${snackNames[key]} x${count}`);
      }
    }

    if (selected.length === 0) {
      snackSummaryText.textContent = 'Aún no has seleccionado snacks (se valen todos 😉).';
    } else {
      snackSummaryText.innerHTML = `<strong>${selected.join(' • ')}</strong>`;
    }
  }


  // --- 6. INTERACTIVE TRIVIA QUIZ ---
  const triviaQuestions = [
    {
      question: "¿Cuál es el lema icónico de velocidad de Rayo McQueen?",
      options: [
        "\"Más veloz que la luz, más rápido que el viento... ¡Cuchao!\"",
        "\"Hasta el infinito y más allá\"",
        "\"¡Yo soy tu amigo fiel!\"",
        "\"Correr es ganar sin mirar atrás\""
      ],
      correct: 0
    },
    {
      question: "¿En qué histórico pueblo de la Ruta 66 se pierde Rayo McQueen?",
      options: [
        "Carburetor City",
        "Radiator Springs",
        "Ornament Valley",
        "Los Ángeles"
      ],
      correct: 1
    },
    {
      question: "¿Quién es el legendario mentor de Rayo McQueen y 3 veces campeón de la Piston Cup?",
      options: [
        "Mate la Grúa",
        "Chick Hicks",
        "Doc Hudson (El Fabuloso Hudson Hornet)",
        "Ramone"
      ],
      correct: 2
    }
  ];

  let currentTriviaIndex = 0;
  let triviaScore = 0;
  const triviaQuizBody = document.getElementById('trivia-quiz-body');
  const triviaProgressBar = document.getElementById('trivia-progress-bar');

  function renderTriviaQuestion() {
    if (currentTriviaIndex >= triviaQuestions.length) {
      // Quiz Complete
      triviaProgressBar.style.width = '100%';
      triviaQuizBody.innerHTML = `
        <div class="trivia-results">
          <h3>🏆 ¡FELICIDADES PILOTO!</h3>
          <p>Obtuviste <strong>${triviaScore} de ${triviaQuestions.length}</strong> respuestas correctas.</p>
          <p style="margin-top: 10px; color: var(--text-muted);">¡Estás listo para el gran día de cine el 08 de Octubre! 🏁⚡</p>
          <button class="trivia-restart-btn" id="trivia-restart">Reintentar Trivia 🏎️</button>
        </div>
      `;

      document.getElementById('trivia-restart').addEventListener('click', () => {
        currentTriviaIndex = 0;
        triviaScore = 0;
        renderTriviaQuestion();
      });

      triggerConfetti();
      playEngineRev();
      return;
    }

    const q = triviaQuestions[currentTriviaIndex];
    triviaProgressBar.style.width = `${((currentTriviaIndex + 1) / triviaQuestions.length) * 100}%`;

    let optionsHTML = q.options.map((opt, idx) => `
      <button class="option-btn" data-index="${idx}">${opt}</button>
    `).join('');

    triviaQuizBody.innerHTML = `
      <div class="question-title">Pregunta ${currentTriviaIndex + 1} de ${triviaQuestions.length}: ${q.question}</div>
      <div class="options-grid">${optionsHTML}</div>
    `;

    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedIdx = parseInt(e.target.getAttribute('data-index'));
        const allBtns = document.querySelectorAll('.option-btn');

        allBtns.forEach(b => b.disabled = true);

        if (selectedIdx === q.correct) {
          e.target.classList.add('correct');
          triviaScore++;
          playStampSFX();
        } else {
          e.target.classList.add('wrong');
          allBtns[q.correct].classList.add('correct');
        }

        setTimeout(() => {
          currentTriviaIndex++;
          renderTriviaQuestion();
        }, 1200);
      });
    });
  }

  renderTriviaQuestion();


  // --- 7. RSVP ACTION HANDLERS & CONFETTI ENGINE ---
  const btnAccept = document.getElementById('btn-accept');
  const btnMaybe = document.getElementById('btn-maybe');
  const btnDecline = document.getElementById('btn-decline');
  const rsvpStatus = document.getElementById('rsvp-status-message');

  btnAccept.addEventListener('click', () => {
    const guestName = guestInput.value.trim() || 'Piloto VIP';
    playEngineRev();
    triggerConfetti();

    rsvpStatus.className = 'rsvp-status accepted';
    rsvpStatus.innerHTML = `
      🏁 <strong>¡CUCHAO! ASISTENCIA CONFIRMADA</strong><br>
      ¡Genial, <strong>${guestName}</strong>! Nos vemos el 08 de Octubre a las 07:00 PM.
    `;
    rsvpStatus.classList.remove('hidden');
  });

  btnMaybe.addEventListener('click', () => {
    playStampSFX();
    rsvpStatus.className = 'rsvp-status question';
    rsvpStatus.innerHTML = `
      🛠️ <strong>MENSAJE EN PITS</strong><br>
      Entendido. Si tienes alguna duda o deseas ajustar el horario para el 08 de octubre, ¡avísame para coordinar todo a la perfección!
    `;
    rsvpStatus.classList.remove('hidden');
  });

  btnDecline.addEventListener('click', () => {
    playStampSFX();
    rsvpStatus.className = 'rsvp-status declined';
    rsvpStatus.innerHTML = `
      💔 <strong>ENTENDIDO</strong><br>
      Te extrañaremos en la pista este 08 de octubre. ¡La próxima carrerita será la buena! 🏁
    `;
    rsvpStatus.classList.remove('hidden');
  });


  // --- 8. CANVAS CONFETTI ENGINE ---
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function triggerConfetti() {
    particles = [];
    const colors = ['#E60012', '#FFCC00', '#FF5722', '#FFFFFF', '#00F0FF'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }
    requestAnimationFrame(updateConfetti);
  }

  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let active = false;
    particles.forEach(p => {
      if (p.opacity > 0) {
        active = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Gravity
        p.rotation += p.rSpeed;
        p.opacity -= 0.012;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (active) {
      requestAnimationFrame(updateConfetti);
    }
  }

});
