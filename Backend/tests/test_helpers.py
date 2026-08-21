import os
import sys
import types
from types import SimpleNamespace

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)


def setup_fake_langchain_groq():
    fake_module = types.ModuleType('langchain_groq')

    class FakeChatGroq:
        def __init__(self, *args, **kwargs):
            pass

        def invoke(self, prompt):
            if 'Relevance Judge Agent' in prompt:
                return SimpleNamespace(content='Relevance Score: 8\n\nReason:\nThe response is relevant and on point.')
            if 'Accuracy Judge Agent' in prompt:
                return SimpleNamespace(content='Accuracy Score: 8\n\nReason:\nThe response is factually accurate compared to the reference.')
            if 'Hallucination Judge Agent' in prompt:
                return SimpleNamespace(content='Hallucination Score: 2\n\nReason:\nThe response is mostly supported by the reference answer.')
            if 'Completeness Judge Agent' in prompt:
                return SimpleNamespace(content='Completeness Score: 8\n\nReason:\nThe response covers most important points from the reference answer.')
            return SimpleNamespace(content='Relevance Score: 5\n\nReason:\nDefault response.')

    fake_module.ChatGroq = FakeChatGroq
    sys.modules['langchain_groq'] = fake_module


def import_with_fake_langchain(module_name):
    setup_fake_langchain_groq()
    import importlib
    if module_name in sys.modules:
        return importlib.reload(sys.modules[module_name])
    return importlib.import_module(module_name)
