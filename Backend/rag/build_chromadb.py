from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

PDF_FOLDER = "documents"
CHROMA_DB = "chromadb"

print("📄 Loading PDF files...")

loader = PyPDFDirectoryLoader(PDF_FOLDER)
documents = loader.load()

print(f"✅ Loaded {len(documents)} pages")

print("✂ Splitting documents into chunks...")

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

chunks = splitter.split_documents(documents)

print(f"✅ Created {len(chunks)} chunks")

print("🧠 Creating HuggingFace Embeddings...")

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

print("💾 Saving to ChromaDB...")

db = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory=CHROMA_DB
)

print("🎉 ChromaDB created successfully!")