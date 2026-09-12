import os
from dotenv import load_dotenv
from supabase import create_client
from sentence_transformers import SentenceTransformer

load_dotenv()

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


def generate_researcher_embeddings():
    print("\nGenerating researcher embeddings...")

    response = (
        supabase
        .table("researchers")
        .select("id, name, position, bio")
        .execute()
    )

    researchers = response.data or []

    print(f"Found {len(researchers)} researchers.")

    for researcher in researchers:
        text = " ".join(
            filter(
                None,
                [
                    researcher.get("name"),
                    researcher.get("position"),
                    researcher.get("bio"),
                ]
            )
        )

        if not text.strip():
            print(f"Skipping researcher {researcher['id']} - no text")
            continue

        embedding = model.encode(text).tolist()

        (
            supabase
            .table("researchers")
            .update({"embedding": embedding})
            .eq("id", researcher["id"])
            .execute()
        )

        print(f"✓ Researcher {researcher['id']}: {researcher.get('name')}")


def generate_project_embeddings():
    print("\nGenerating project embeddings...")

    response = (
        supabase
        .table("projects")
        .select(
            "id, title, description, objectives, outputs_summary, status"
        )
        .execute()
    )

    projects = response.data or []

    print(f"Found {len(projects)} projects.")

    for project in projects:
        text = " ".join(
            filter(
                None,
                [
                    project.get("title"),
                    project.get("description"),
                    project.get("objectives"),
                    project.get("outputs_summary"),
                    project.get("status"),
                ]
            )
        )

        if not text.strip():
            print(f"Skipping project {project['id']} - no text")
            continue

        embedding = model.encode(text).tolist()

        (
            supabase
            .table("projects")
            .update({"embedding": embedding})
            .eq("id", project["id"])
            .execute()
        )

        print(f"✓ Project {project['id']}: {project.get('title')}")


if __name__ == "__main__":
    print("======================================")
    print("R&D DIGITAL HUB EMBEDDING GENERATOR")
    print("======================================")

    generate_researcher_embeddings()
    generate_project_embeddings()

    print("\n======================================")
    print("Embedding generation complete!")
    print("======================================")