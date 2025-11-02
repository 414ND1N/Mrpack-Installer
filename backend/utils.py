import os

async def PathJoin(*paths: str) -> str:
    return os.path.normpath(os.path.join(*paths))