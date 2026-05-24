import sys
print("Loading model...")
try:
    from sentence_transformers import CrossEncoder
    model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
    print("Model loaded successfully!")
except Exception as e:
    import traceback
    traceback.print_exc()
