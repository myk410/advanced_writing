(function () {
    const audio = document.getElementById('audioPlayer');
    const chaptersUl = document.getElementById('chapters');
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

    fetch(jsonPath)
        .then((r) => r.json())
        .then((data) => {
            data.chapters.forEach((chapter) => {
                const li = document.createElement('li');
                li.textContent = chapter.title;
                li.dataset.chapterId = chapter.id;
                chaptersUl.appendChild(li);

                if (chapter.id === 0) {
                    li.addEventListener('click', () => {
                        setTrack('/static/audio/0.mp3');
                    });
                } else {
                    const sections = document.createElement('ul');
                    sections.className = 'section-list';
                    chapter.sections.forEach((section) => {
                        const secLi = document.createElement('li');
                        secLi.textContent = section.title;
                        secLi.addEventListener('click', (evt) => {
                            evt.stopPropagation();
                            setTrack(`/static/audio/${chapter.id}-${section.id}.mp3`);
                        });
                        sections.appendChild(secLi);
                    });
                    li.appendChild(sections);
                    li.addEventListener('click', () => {
                        sections.style.display = sections.style.display === 'none' ? 'block' : 'none';
                    });
                }
            });
            loadProgress();
        });
})();
