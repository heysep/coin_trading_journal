import sys
from pathlib import Path
from datetime import datetime, timedelta
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

# ensure main module import
ROOT = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT))
import main  # noqa: E402


@pytest.fixture()
def client():
    """Create TestClient with Kafka mocks."""
    with patch.object(main, "AIOKafkaProducer") as mock_prod, \
         patch.object(main, "AIOKafkaConsumer") as mock_cons:
        mock_prod.return_value = AsyncMock(start=AsyncMock(), stop=AsyncMock())
        mock_cons.return_value = AsyncMock(start=AsyncMock(), stop=AsyncMock())
        with TestClient(main.app) as client:
            yield client


@pytest.mark.parametrize(
    "endpoint,expected_key,expected_value",
    [
        ("/", "status", "running"),
        ("/health", "status", "healthy"),
        ("/api/v1/status", "status", "success"),
    ],
)
def test_get_endpoints_success(client, endpoint, expected_key, expected_value):
    response = client.get(endpoint)
    assert response.status_code == 200
    assert response.json()[expected_key] == expected_value


@pytest.mark.parametrize("endpoint", ["/", "/health", "/api/v1/status"])
def test_get_endpoints_method_not_allowed(client, endpoint):
    response = client.post(endpoint)
    assert response.status_code == 405


def _generate_candles(count: int):
    base_ts = int(datetime.now().timestamp() * 1000)
    candles = []
    for i in range(count):
        ts = base_ts - (count - i) * 300000  # 5 minutes in ms
        price = 100 + i
        candles.append(
            {
                "timestamp": ts,
                "open": price,
                "high": price + 1,
                "low": price - 1,
                "close": price,
                "volume": 1000 + i,
                "symbol": "BTC/USDT",
                "timeframe": "5m",
            }
        )
    return candles


def _score_payload(candle_count):
    return {
        "symbol": "BTC/USDT",
        "timeframe": "5m",
        "candles": _generate_candles(candle_count),
        "strategy_name": "BreakoutStrategy",
        "parameters": {"lookback_period": 20},
        "include_indicators": True,
        "include_signals": True,
    }


def _trade_payload():
    return {
        "pair": "BTC/USDT",
        "side": "buy",
        "amount": 0.001,
        "price": 50000.0,
        "timestamp": datetime.now().isoformat(),
        "strategy": "BreakoutStrategy",
        "confidence": 0.8,
        "stop_loss": 49000.0,
        "take_profit": 51000.0,
        "metadata": {"rsi": 60},
    }


def test_score_success(client):
    response = client.post("/score", json=_score_payload(20))
    assert response.status_code == 200
    body = response.json()
    assert body["symbol"] == "BTC/USDT"
    assert "score" in body


def test_score_not_enough_candles(client):
    response = client.post("/score", json=_score_payload(10))
    assert response.status_code == 400


@pytest.mark.parametrize(
    "endpoint",
    [
        "/api/v1/trade/score",
        "/api/v1/trade/breakout",
        "/api/v1/trade/mean_reversion",
    ],
)
def test_trade_endpoints_success(client, endpoint):
    response = client.post(endpoint, json=_trade_payload())
    assert response.status_code == 200
    assert response.json()["status"] == "success"


@pytest.mark.parametrize(
    "endpoint",
    [
        "/api/v1/trade/score",
        "/api/v1/trade/breakout",
        "/api/v1/trade/mean_reversion",
    ],
)
def test_trade_endpoints_validation_error(client, endpoint):
    response = client.post(endpoint, json={})
    assert response.status_code == 422
