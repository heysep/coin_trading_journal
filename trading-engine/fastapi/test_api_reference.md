# Legacy API Test Script

The previous `test_api.py` script used the `requests` library and manual prints to verify FastAPI endpoints during development. 
It has been removed in favor of automated tests located in `tests/` which use `pytest` and FastAPI's `TestClient`.

To view the old implementation, check the git history for `test_api.py` prior to its removal.
