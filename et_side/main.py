import asyncio
import websockets
import json

async def send_gaze_data():
    # Adres serwera WebSocket
    uri = "ws://localhost:3000"

    async with websockets.connect(uri) as websocket:
        while True:
            # Odczytaj dane ze spojrzeń
            gaze_data = "Test"

            # Przygotuj dane do wysyłki
            payload = json.dumps(gaze_data)
            await websocket.send(payload)

            # Dodaj opóźnienie, aby unikać przeciążenia
            await asyncio.sleep(0.05)


# Uruchom funkcję
asyncio.run(send_gaze_data())