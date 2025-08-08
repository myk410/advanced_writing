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
