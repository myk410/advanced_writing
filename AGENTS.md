# AGENTS

These guidelines apply to the entire repository.

## Code style

- Use 4 spaces for indentation in all source files.
- Follow [PEP 8](https://peps.python.org/pep-0008/) conventions.
- Keep lines under 100 characters.
- Include docstrings for all public modules, classes and functions.

## Testing

- Before committing, run `pytest` and ensure it finishes without errors.
- Add new tests when adding new features or fixing bugs.

## Other notes

- Static assets live in `static/`; keep the audio naming scheme `<chapter>-<section>.mp3` (except `0.mp3`).
- Keep `README.md` up to date when project layout or usage changes.
- Never rename podcast MP3 files. Filenames `1.mp3` through `7.mp3` match chapter IDs and must stay fixed.

