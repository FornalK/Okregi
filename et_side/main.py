import asyncio
import websockets
import json


async def send_gaze_data():
    uri = "ws://localhost:3000"

    while True:
        try:
            async with websockets.connect(uri) as websocket:
                while True:
                    # Odczytaj dane ze spojrzeń
                    gaze_data = "1920 1080"

                    # Przygotuj dane do wysyłki
                    payload = json.dumps(gaze_data)
                    await websocket.send(payload)

                    # Dodaj opóźnienie, aby unikać przeciążenia
                    await asyncio.sleep(0.2)

        except websockets.exceptions.ConnectionClosedError as e:
            print(f"Połączenie zamknięte: {e}. Próba ponownego połączenia...")
            await asyncio.sleep(2)  # Poczekaj chwilę przed ponownym połączeniem

        except websockets.exceptions.ConnectionClosedOK:
            print("Połączenie zamknięte przez serwer (normalnie). Ponowne łączenie...")
            await asyncio.sleep(2)


# Uruchom funkcję
asyncio.run(send_gaze_data())