(function () {
    const audio = document.getElementById('audioPlayer');
    let currentTrackEl = null;

    function saveProgress() {
        const data = {
            src: audio.getAttribute('data-track') || '',
            time: audio.currentTime || 0
        };
        document.cookie =
            'audiobook=' + encodeURIComponent(JSON.stringify(data)) + ';path=/';
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

    function getTrackEls() {
        return Array.from(document.querySelectorAll('[data-audio]'));
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
            el = getTrackEls().find(
                (t) => t.getAttribute('data-audio') === src
            ) || null;
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
        const els = getTrackEls();
        const idx = els.indexOf(currentTrackEl);
        if (idx >= 0 && idx < els.length - 1) {
            const nextEl = els[idx + 1];
            const parentList = nextEl.closest('.section-list');
            if (parentList) {
                parentList.style.display = 'block';
            }
            setTrack(nextEl.getAttribute('data-audio'), nextEl);
        }
    }

    audio.addEventListener('timeupdate', saveProgress);
    audio.addEventListener('ended', playNext);

    document.addEventListener('click', (evt) => {
        const el = evt.target.closest('[data-audio]');
        if (el) {
            evt.stopPropagation();
            setTrack(el.getAttribute('data-audio'), el);
        }
    });

    document.querySelectorAll('#chapters > li').forEach((chapter) => {
        const sections = chapter.querySelector('.section-list');
        if (sections) {
            chapter.addEventListener('click', () => {
                sections.style.display =
                    sections.style.display === 'none' ? 'block' : 'none';
            });
        }
    });

    document.querySelectorAll('.tab-button').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach((b) => {
                b.classList.remove('active', 'btn-primary');
                b.classList.add('btn-outline-primary');
            });
            btn.classList.add('active', 'btn-primary');
            btn.classList.remove('btn-outline-primary');
            const target = btn.getAttribute('data-target');
            document.querySelectorAll('.tab-content').forEach((c) => {
                c.style.display = c.id === target ? 'block' : 'none';
            });
        });
    });

    function loadPodcasts() {
        fetch(podcastsUrl)
            .then((resp) => (resp.ok ? resp.json() : []))
            .then((items) => {
                const list = document.getElementById('podcastList');
                items.forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = item.title;
                    li.setAttribute('data-audio', item.src);
                    li.classList.add('list-group-item');
                    list.appendChild(li);
                });
            })
            .catch(() => {});
    }

    loadPodcasts();
    loadProgress();
})();
