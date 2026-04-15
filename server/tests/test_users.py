import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from main import app
from app.database import get_db
from app.models import Base


@pytest.fixture()
def client():
    """Each test gets a fresh in-memory SQLite database."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,  # single shared connection — required for in-memory SQLite
    )
    Base.metadata.create_all(engine)

    def override_get_db():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    engine.dispose()


# ── GET /users/ ─────────────────────────────────────────────────────

def test_get_all_users_empty(client):
    response = client.get("/users/")
    assert response.status_code == 200
    assert response.json() == []


def test_get_all_users_after_create(client):
    client.post("/users/", json={"name": "Alice", "email": "alice@example.com", "password": "pass"})
    client.post("/users/", json={"name": "Bob", "email": "bob@example.com", "password": "pass"})
    response = client.get("/users/")
    assert response.status_code == 200
    assert len(response.json()) == 2


# ── POST /users/ ────────────────────────────────────────────────────

def test_create_user_returns_created_record(client):
    response = client.post(
        "/users/",
        json={"name": "Alice", "email": "alice@example.com", "password": "secret"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Alice"
    assert data["email"] == "alice@example.com"
    assert "id" in data


def test_create_user_assigns_unique_ids(client):
    r1 = client.post("/users/", json={"name": "A", "email": "a@example.com", "password": "p"})
    r2 = client.post("/users/", json={"name": "B", "email": "b@example.com", "password": "p"})
    assert r1.json()["id"] != r2.json()["id"]


# ── GET /users/{id} ─────────────────────────────────────────────────

def test_get_user_by_id(client):
    created = client.post(
        "/users/",
        json={"name": "Bob", "email": "bob@example.com", "password": "pass"},
    )
    user_id = created.json()["id"]
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["email"] == "bob@example.com"


def test_get_user_not_found(client):
    response = client.get("/users/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


# ── PUT /users/{id} ─────────────────────────────────────────────────

def test_update_user(client):
    created = client.post(
        "/users/",
        json={"name": "Old Name", "email": "old@example.com", "password": "pass"},
    )
    user_id = created.json()["id"]

    response = client.put(
        f"/users/{user_id}",
        json={"name": "New Name", "email": "new@example.com"},
    )
    assert response.status_code == 200
    assert response.json()["message"] == "User updated successfully"


def test_update_user_persists_changes(client):
    created = client.post(
        "/users/",
        json={"name": "Original", "email": "orig@example.com", "password": "pass"},
    )
    user_id = created.json()["id"]
    client.put(f"/users/{user_id}", json={"name": "Updated", "email": "updated@example.com"})

    fetched = client.get(f"/users/{user_id}")
    assert fetched.json()["name"] == "Updated"
    assert fetched.json()["email"] == "updated@example.com"


def test_update_user_not_found(client):
    response = client.put(
        "/users/99999",
        json={"name": "Ghost", "email": "ghost@example.com"},
    )
    assert response.status_code == 404


# ── DELETE /users/{id} ──────────────────────────────────────────────

def test_delete_user(client):
    created = client.post(
        "/users/",
        json={"name": "ToDelete", "email": "del@example.com", "password": "pass"},
    )
    user_id = created.json()["id"]

    response = client.delete(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "User deleted successfully"


def test_delete_user_is_no_longer_retrievable(client):
    created = client.post(
        "/users/",
        json={"name": "Gone", "email": "gone@example.com", "password": "pass"},
    )
    user_id = created.json()["id"]
    client.delete(f"/users/{user_id}")

    get_response = client.get(f"/users/{user_id}")
    assert get_response.status_code == 404


def test_delete_user_not_found(client):
    response = client.delete("/users/99999")
    assert response.status_code == 404
