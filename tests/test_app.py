"""Tests for the Advanced Writing Flask application."""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from main import app


def test_index_route() -> None:
    """The index route should return the main page with the book title."""
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    assert b"The Science of Prestige Television" in response.data
