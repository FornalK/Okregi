import asyncio
import websockets
import json
import tobii_research as tr

global_gaze_data = None

def gaze_data_callback(gaze_data):
    global global_gaze_data
    global_gaze_data = gaze_data

async def send_gaze_data():
    uri = "ws://localhost:3000"

    while True:
        try:
            async with websockets.connect(uri) as websocket:
                while True:
                    # Odczytaj dane ze spojrzeń
                    if global_gaze_data == None:
                        gaze_data = "nan,nan,nan,nan"
                    else:
                        leX, leY = global_gaze_data['left_gaze_point_on_display_area']
                        reX, reY = global_gaze_data['right_gaze_point_on_display_area']
                        gaze_data = str(leX) + "," + str(leY) + "," + str(reX) + "," + str(reY)

                    # Przygotuj dane do wysyłki
                    payload = json.dumps(gaze_data)
                    await websocket.send(payload)

                    # Dodaj opóźnienie, aby unikać przeciążenia
                    await asyncio.sleep(0.2)

        except websockets.exceptions.ConnectionClosedError as e:
            print(f"Połączenie zamknięte: {e}. Próba ponownego połączenia...")
            await asyncio.sleep(1)  # Poczekaj chwilę przed ponownym połączeniem

        except websockets.exceptions.ConnectionClosedOK:
            print("Połączenie zamknięte przez serwer (normalnie). Ponowne łączenie...")
            await asyncio.sleep(1)

# Znajdz eyetracker
eyetracker = tr.find_all_eyetrackers()[0]

# Rozpocznij zbierane danych z eyetrackera
eyetracker.subscribe_to(tr.EYETRACKER_GAZE_DATA, gaze_data_callback, as_dictionary=True)

# Uruchom funkcję
asyncio.run(send_gaze_data())

# Zakończ zbieranie informacji z eyetrackera
eyetracker.unsubscribe_from(tr.EYETRACKER_GAZE_DATA, gaze_data_callback)