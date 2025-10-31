from pathlib import Path

async def PathJoin(*paths: str) -> str:
    return str(Path().joinpath(*paths))