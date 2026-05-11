# backend/progress_manager.py (concepto)
import asyncio
import uuid
from typing import Dict, Any

class ProgressManager:
    def __init__(self):
        self.queues: Dict[str, asyncio.Queue] = {}
        self.lock = asyncio.Lock()

    async def create(self) -> str:
        async with self.lock:
            install_id = str(uuid.uuid4())
            self.queues[install_id] = asyncio.Queue()
            return install_id

    async def get_queue(self, install_id: str) -> asyncio.Queue | None:
        return self.queues.get(install_id)

    async def push(self, install_id: str, item: Any):
        q = self.queues.get(install_id)
        if q:
            await q.put(item)

    async def finish(self, install_id: str):
        q = self.queues.pop(install_id, None)
        if q:
            # put a final sentinel and let consumers exit
            await q.put({"type": "done"})