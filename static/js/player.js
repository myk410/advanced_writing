(function () {
    const audio = document.getElementById('audioPlayer');
    const pdfButton = document.getElementById('pdf-button');
    const trackEls = Array.from(document.querySelectorAll('[data-audio]'));
    let currentTrackEl = null;

    pdfButton.addEventListener('click', () => {
        window.open(pdfPath, '_blank');
    });

    function saveProgress() {
        const data = {
            src: audio.getAttribute('data-track') || '',
            time: audio.currentTime || 0
        };
        document.cookie = 'audiobook=' + encodeURIComponent(JSON.stringify(data)) + ';path=/';
    }

    function loadProgress() {
        const match = document.cookie.match(/(?:^|; )audiobook=([^;]*)/);
        if (match) {
            try {
                const data = JSON.parse(decodeURIComponent(match[1]));
                if (data.src) {
                    setTrack(data.src, null, false);
                    audio.currentTime = data.time || 0;
                }
            } catch (e) {
                // ignore malformed cookie
            }
        }
    }

    function setTrack(src, el, autoplay = true) {
        audio.pause();
        audio.src = src;
        audio.setAttribute('data-track', src);
        audio.load();
        if (currentTrackEl) {
            currentTrackEl.classList.remove('playing');
        }
        if (!el) {
            el = trackEls.find((t) => t.getAttribute('data-audio') === src) || null;
        }
        if (el) {
            const parentList = el.closest('.section-list');
            if (parentList) {
                parentList.style.display = 'block';
            }
            currentTrackEl = el;
            currentTrackEl.classList.add('playing');
        } else {
            currentTrackEl = null;
        }
        if (autoplay) {
            audio.play();
        }
        saveProgress();
    }

    function playNext() {
        if (!currentTrackEl) {
            return;
        }
        const idx = trackEls.indexOf(currentTrackEl);
        if (idx >= 0 && idx < trackEls.length - 1) {
            const nextEl = trackEls[idx + 1];
            const parentList = nextEl.closest('.section-list');
            if (parentList) {
                parentList.style.display = 'block';
            }
            setTrack(nextEl.getAttribute('data-audio'), nextEl);
        }
    }

    audio.addEventListener('timeupdate', saveProgress);
    audio.addEventListener('ended', playNext);

    document.querySelectorAll('[data-audio]').forEach((el) => {
        el.addEventListener('click', (evt) => {
            evt.stopPropagation();
            setTrack(el.getAttribute('data-audio'), el);
        });
    });

    document.querySelectorAll('#chapters > li').forEach((chapter) => {
        const sections = chapter.querySelector('.section-list');
        if (sections) {
            chapter.addEventListener('click', () => {
                sections.style.display = sections.style.display === 'none' ? 'block' : 'none';
            });
        }
    });

    loadProgress();
})();
