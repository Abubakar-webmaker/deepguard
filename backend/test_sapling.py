import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            'https://api.sapling.ai/api/v1/aidetect',
            json={
                'key': 'D1RWNS4B0E26URMTYMP63KTGCPKK2VLR',
                'text': 'Artificial intelligence is transforming the way we live and work. Machine learning algorithms are becoming increasingly sophisticated.'
            },
            timeout=10
        )
        print(resp.status_code)
        print(resp.json())

asyncio.run(test())