"""Main application module for Advanced Writing audio book site.

This module defines the Flask application that serves the single-page
interface for listening to the audio book. It exposes ``app`` for WSGI
servers and the Flask CLI.
"""

from pathlib import Path
import json

from flask import Flask, Response, jsonify, render_template, url_for, send_from_directory

app = Flask(__name__)


@app.route("/")
def index() -> str:
    """Render the main page of the audio book site.

    Returns:
        Rendered HTML for the index page.
    """
    book_title = "The Science of Prestige Television"
    json_path = Path(app.static_folder) / "The Science of Prestige Television.json"
    with json_path.open(encoding="utf-8") as handle:
        chapters = json.load(handle).get("chapters", [])
    return render_template("index.html", book_title=book_title, chapters=chapters)


@app.route("/pdf")
def pdf() -> Response:
    """Serve the full book PDF file."""
    return send_from_directory(
        app.static_folder, "The Science of Prestige Television.pdf"
    )


@app.route("/podcasts")
def podcasts() -> Response:
    """Return metadata for podcast episodes.

    MP3 files are named using the chapter ID (e.g. ``1.mp3``). The response
    is a JSON array with objects containing ``id`` (chapter number),
    ``title``, ``subtitle`` and ``src`` URL for each podcast file. Chapter
    ``0`` is excluded.

    Returns:
        JSON list describing available podcast audio files.
    """
    json_path = Path(app.static_folder) / "The Science of Prestige Television.json"
    with json_path.open(encoding="utf-8") as handle:
        chapters = {
            int(c["id"]): (
                c.get("podcast_title") or c["title"],
                c.get("podcast_subtitle", ""),
            )
            for c in json.load(handle)["chapters"]
        }
    podcast_dir = Path(app.static_folder) / "podcast"
    files = []
    for path in sorted(podcast_dir.glob("*.mp3")):
        try:
            chap_id = int(path.stem)
        except ValueError:  # skip unexpected files
            continue
        if chap_id == 0:
            continue
        title, subtitle = chapters.get(chap_id, (f"Chapter {chap_id}", ""))
        files.append(
            {
                "id": chap_id,
                "title": title,
                "subtitle": subtitle,
                "src": url_for("static", filename=f"podcast/{path.name}"),
            }
        )
    files.sort(key=lambda item: item["id"])
    return jsonify(files)


if __name__ == "__main__":  # pragma: no cover - convenience for local running
    app.run(debug=True)
