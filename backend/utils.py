import os

async def PathJoin(*paths: str) -> str:
    return os.path.join(*paths)