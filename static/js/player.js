(function () {
    const audio = document.getElementById('audioPlayer');
    const pdfButton = document.getElementById('pdf-button');

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
                    setTrack(data.src, false);
                    audio.currentTime = data.time || 0;
                }
            } catch (e) {
                // ignore malformed cookie
            }
        }
    }

    function setTrack(src, autoplay = true) {
        audio.pause();
        audio.src = src;
        audio.setAttribute('data-track', src);
        audio.load();
        if (autoplay) {
            audio.play();
        }
        saveProgress();
    }

    audio.addEventListener('timeupdate', saveProgress);

    document.querySelectorAll('[data-audio]').forEach((el) => {
        el.addEventListener('click', (evt) => {
            evt.stopPropagation();
            setTrack(el.getAttribute('data-audio'));
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
