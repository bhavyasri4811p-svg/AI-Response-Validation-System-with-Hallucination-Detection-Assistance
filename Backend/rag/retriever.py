from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

CHROMA_DB = "chromadb"

# Load the same embedding model used during indexing
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load ChromaDB
db = Chroma(
    persist_directory=CHROMA_DB,
    embedding_function=embeddings
)

def retrieve_context(query, k=3):
    """
    Retrieve top-k relevant chunks from ChromaDB.
    """

    docs = db.similarity_search(query, k=k)

    return docs


if __name__ == "__main__":

    question = input("Enter your question: ")

    results = retrieve_context(question)

    print("\nRetrieved Chunks:\n")

    for i, doc in enumerate(results, 1):

        print("=" * 80)
        print(f"Chunk {i}")
        print("=" * 80)
        print(doc.page_content)
        print()