"""Tests for the Advanced Writing Flask application."""
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from main import app
import json
from pathlib import Path


def test_index_route() -> None:
    """The index route should return the main page with the book title."""
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    assert b"The Science of Prestige Television" in response.data


def test_chapter_list_rendered() -> None:
    """Chapter titles from the JSON file should appear in the response."""
    client = app.test_client()
    response = client.get("/")
    json_path = Path(app.static_folder) / "The Science of Prestige Television.json"
    with json_path.open(encoding="utf-8") as handle:
        first_title = json.load(handle)["chapters"][0]["title"]
    assert first_title.encode() in response.data


def test_podcast_route() -> None:
    """The podcast route should return available podcast metadata."""
    client = app.test_client()
    response = client.get("/podcasts")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    ids = [item["id"] for item in data]
    podcast_dir = Path(app.static_folder) / "podcast"
    expected_ids = sorted(
        int(p.stem) for p in podcast_dir.glob("*.mp3") if p.stem.isdigit()
    )
    assert ids == expected_ids
    for item in data:
        assert item["src"] == f"/static/podcast/{item['id']}.mp3"


def test_podcast_titles_subtitles() -> None:
    """Podcast items should include titles and subtitles from the JSON."""
    client = app.test_client()
    response = client.get("/podcasts")
    data = response.get_json()
    json_path = Path(app.static_folder) / "The Science of Prestige Television.json"
    with json_path.open(encoding="utf-8") as handle:
        chapters = {int(c["id"]): c for c in json.load(handle)["chapters"]}
    for item in data:
        chapter = chapters[item["id"]]
        expected_title = chapter.get("podcast_title") or chapter["title"]
        expected_subtitle = chapter.get("podcast_subtitle", "")
        assert item["title"] == expected_title
        assert item["subtitle"] == expected_subtitle


def test_pdf_route() -> None:
    """The PDF route should serve the book PDF file."""
    client = app.test_client()
    response = client.get("/pdf")
    assert response.status_code == 200
    assert response.mimetype == "application/pdf"
