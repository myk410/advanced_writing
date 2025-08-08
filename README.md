# Advanced Writing Audio Book

This repository hosts a one-page [Flask](https://flask.palletsprojects.com/) application that serves an audio book from a set of pre-generated audio files.

## Features

* **Single-page audio player** – The site loads once and presents a hierarchical chapter list; selecting a section begins playback without a full page reload.
* **Hierarchical chapter list** – Chapter titles are displayed in a left-aligned list. Selecting a chapter reveals its sections; selecting a section begins playback.
    * Chapter `0` is a special case with only one section; clicking the chapter immediately plays `0.mp3`.
* **Automatic audio switching** – Starting a new track stops the currently playing audio before the next one begins.
* **Progress persistence** – Cookies remember the last track and timestamp so users can continue where they left off after closing or reloading the page.
* **Read-along PDF** – A button at the top opens the book PDF in a new window so the user can read along with the audio.
* **Mobile friendly** – A responsive layout and scalable controls make the site easy to use on phones and tablets.

## Data sources

* `static/` contains the book JSON file and the PDF.
* `static/audio/` holds the audio files. Naming follows the pattern `<chapter>-<section>.mp3` except for chapter `0`, which is stored as `0.mp3`.

The JSON file maps chapter and section IDs to titles. The server reads this file to render the chapter list.

## Running locally

1. **Install dependencies**

   ```bash
   python install.py
   ```

   This installs everything listed in `requirements.txt`.

2. **Start the development server**

   ```bash
   flask --app main.py run
   ```

   The application is exposed as `app` in `main.py` and can also be served via any WSGI server.

3. Visit `http://localhost:5000` in your browser.

## Repository layout

```
static/
├── The Science of Prestige Television.json  # Chapter and section metadata
├── The Science of Prestige Television.pdf   # Book PDF
└── audio/                                   # MP3 files
```

## Contributing

See [AGENTS.md](AGENTS.md) for coding conventions and contribution guidelines.

