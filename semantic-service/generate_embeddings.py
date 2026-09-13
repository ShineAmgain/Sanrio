import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer

# Resolve the .env path relative to this file instead of hardcoding a
# developer's local machine path, so this works on any checkout/deployment.
ENV_PATH = Path(__file__).resolve().parent.parent / "backend" / ".env"
load_dotenv(ENV_PATH)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
    )

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
)

model = SentenceTransformer("all-MiniLM-L6-v2")


def build_text(*values):
    return " ".join(
        str(value).strip()
        for value in values
        if value is not None and str(value).strip()
    )


def generate_researcher_embeddings():
    print("\n=== Researchers ===")

    response = (
        supabase
        .table("researchers")
        .select("id, name, position, bio, embedding")
        .execute()
    )

    researchers = response.data or []

    print(f"Found {len(researchers)} researchers.")

    for researcher in researchers:

        if researcher.get("embedding") is not None:
            continue

        text = build_text(
            researcher.get("name"),
            researcher.get("position"),
            researcher.get("bio"),
        )

        if not text:
            print(f"⚠ Skipping researcher {researcher['id']} - no text")
            continue

        embedding = model.encode(text).tolist()

        (
            supabase
            .table("researchers")
            .update({"embedding": embedding})
            .eq("id", researcher["id"])
            .execute()
        )

        print(
            f"✓ Researcher {researcher['id']}: "
            f"{researcher.get('name')}"
        )


def generate_project_embeddings():
    print("\n=== Projects ===")

    response = (
        supabase
        .table("projects")
        .select(
            "id, title, description, objectives, "
            "outputs_summary, status, embedding"
        )
        .execute()
    )

    projects = response.data or []

    print(f"Found {len(projects)} projects.")

    for project in projects:

        if project.get("embedding") is not None:
            continue

        text = build_text(
            project.get("title"),
            project.get("description"),
            project.get("objectives"),
            project.get("outputs_summary"),
            project.get("status"),
        )

        if not text:
            print(f"⚠ Skipping project {project['id']} - no text")
            continue

        embedding = model.encode(text).tolist()

        (
            supabase
            .table("projects")
            .update({"embedding": embedding})
            .eq("id", project["id"])
            .execute()
        )

        print(
            f"✓ Project {project['id']}: "
            f"{project.get('title')}"
        )


def generate_publication_embeddings():
    print("\n=== Publications ===")

    response = (
        supabase
        .table("publications")
        .select(
            "id, title, abstract, summary, venue, "
            "publication_type, embedding"
        )
        .execute()
    )

    publications = response.data or []

    print(f"Found {len(publications)} publications.")

    for publication in publications:

        if publication.get("embedding") is not None:
            continue

        text = build_text(
            publication.get("title"),
            publication.get("abstract"),
            publication.get("summary"),
            publication.get("venue"),
            publication.get("publication_type"),
        )

        if not text:
            print(
                f"⚠ Skipping publication "
                f"{publication['id']} - no text"
            )
            continue

        embedding = model.encode(text).tolist()

        (
            supabase
            .table("publications")
            .update({"embedding": embedding})
            .eq("id", publication["id"])
            .execute()
        )

        print(
            f"✓ Publication {publication['id']}: "
            f"{publication.get('title')}"
        )


def generate_event_embeddings():
    print("\n=== Events ===")

    response = (
        supabase
        .table("events")
        .select(
            "id, title, description, event_type, "
            "location, status, embedding"
        )
        .execute()
    )

    events = response.data or []

    print(f"Found {len(events)} events.")

    for event in events:

        if event.get("embedding") is not None:
            continue

        text = build_text(
            event.get("title"),
            event.get("description"),
            event.get("event_type"),
            event.get("location"),
            event.get("status"),
        )

        if not text:
            print(
                f"⚠ Skipping event "
                f"{event['id']} - no text"
            )
            continue

        embedding = model.encode(text).tolist()

        (
            supabase
            .table("events")
            .update({"embedding": embedding})
            .eq("id", event["id"])
            .execute()
        )

        print(
            f"✓ Event {event['id']}: "
            f"{event.get('title')}"
        )


def generate_grant_embeddings():
    print("\n=== Grants ===")

    response = (
        supabase
        .table("grants")
        .select(
            "id, title, description, provider, funding_type, "
            "eligibility, requirements, application_process, "
            "status, embedding"
        )
        .execute()
    )

    grants = response.data or []

    print(f"Found {len(grants)} grants.")

    for grant in grants:

        if grant.get("embedding") is not None:
            continue

        text = build_text(
            grant.get("title"),
            grant.get("description"),
            grant.get("provider"),
            grant.get("funding_type"),
            grant.get("eligibility"),
            grant.get("requirements"),
            grant.get("application_process"),
            grant.get("status"),
        )

        if not text:
            print(
                f"⚠ Skipping grant "
                f"{grant['id']} - no text"
            )
            continue

        embedding = model.encode(text).tolist()

        (
            supabase
            .table("grants")
            .update({"embedding": embedding})
            .eq("id", grant["id"])
            .execute()
        )

        print(
            f"✓ Grant {grant['id']}: "
            f"{grant.get('title')}"
        )


if __name__ == "__main__":
    print("======================================")
    print("R&D DIGITAL HUB EMBEDDING GENERATOR")
    print("======================================")

    generate_researcher_embeddings()
    generate_project_embeddings()
    generate_publication_embeddings()
    generate_event_embeddings()
    generate_grant_embeddings()

    print("\n======================================")
    print("Embedding generation complete!")
    print("======================================")