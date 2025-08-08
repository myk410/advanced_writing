"""Main application module for Advanced Writing audio book site.

This module defines the Flask application that serves the single-page
interface for listening to the audio book. It exposes ``app`` for WSGI
servers and the Flask CLI.
"""

from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index() -> str:
    """Render the main page of the audio book site.

    Returns:
        Rendered HTML for the index page.
    """
    book_title = "The Science of Prestige Television"
    return render_template("index.html", book_title=book_title)


if __name__ == "__main__":  # pragma: no cover - convenience for local running
    app.run(debug=True)
