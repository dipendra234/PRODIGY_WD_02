
  (
    function() {
    const timeDisplay = document.getElementById('time');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const lapBtn = document.getElementById('lapBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapList = document.getElementById('lapList');
    const noLapsDiv = document.getElementById('no-laps');

    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    let isRunning = false;
    let laps = [];

    function formatTime(time) {
      const milliseconds = time % 1000;
      const totalSeconds = Math.floor(time / 1000);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);

      const pad = (num, size=2) => num.toString().padStart(size, '0');
      const padMs = ms => ms.toString().padStart(3, '0');

      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${padMs(milliseconds)}`;
    }

    function updateTime() {
      elapsedTime = performance.now() - startTime + elapsedTimeBase;
      timeDisplay.textContent = formatTime(elapsedTime);
    }

    // We keep elapsedTimeBase to preserve elapsedTime when paused
    let elapsedTimeBase = 0;

    function startTimer() {
      startTime = performance.now();
      timerInterval = requestAnimationFrame(tick);
      isRunning = true;
      startPauseBtn.textContent = 'Pause';
      startPauseBtn.setAttribute('aria-pressed', 'true');
      lapBtn.disabled = false;
      resetBtn.disabled = false;
      noLapsDiv.style.display = laps.length ? 'none' : 'block';
    }

    function pauseTimer() {
      cancelAnimationFrame(timerInterval);
      timerInterval = null;
      elapsedTimeBase = elapsedTime;
      isRunning = false;
      startPauseBtn.textContent = 'Start';
      startPauseBtn.setAttribute('aria-pressed', 'false');
    }

    function resetTimer() {
      cancelAnimationFrame(timerInterval);
      timerInterval = null;
      startTime = 0;
      elapsedTime = 0;
      elapsedTimeBase = 0;
      isRunning = false;
      laps = [];
      updateTime();
      lapList.innerHTML = '';
      noLapsDiv.style.display = 'block';
      startPauseBtn.textContent = 'Start';
      startPauseBtn.setAttribute('aria-pressed', 'false');
      lapBtn.disabled = true;
      resetBtn.disabled = true;
    }

    function tick() {
      updateTime();
      timerInterval = requestAnimationFrame(tick);
    }

    function addLap() {
      if (!isRunning) return;
      laps.push(elapsedTime);
      renderLaps();
      noLapsDiv.style.display = 'none';
    }

    function renderLaps() {
      lapList.innerHTML = '';
      // Display laps with lap number and time
      for (let i = laps.length - 1; i >= 0; i--) {
        const lapTime = laps[i];
        const li = document.createElement('li');
        li.textContent = `Lap ${i + 1}`;
        const span = document.createElement('span');
        span.textContent = formatTime(lapTime);
        li.appendChild(span);
        lapList.appendChild(li);
      }
      noLapsDiv.style.display = laps.length ? 'none' : 'block';
    }

    startPauseBtn.addEventListener('click', () => {
      if (isRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    });

    lapBtn.addEventListener('click', () => {
      if (isRunning) {
        addLap();
      }
    });

    resetBtn.addEventListener('click', () => {
      resetTimer();
    });

    // Initialize display
    resetTimer();

  })();
