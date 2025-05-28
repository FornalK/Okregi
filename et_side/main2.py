import tobii_research as tr
import time

global_gaze_data = None

def gaze_data_callback(gaze_data):
    global global_gaze_data
    global_gaze_data = gaze_data

def send_gaze_data():
    while True:
        # Odczytaj dane ze spojrzeń
        if global_gaze_data == None:
            gaze_data = "nan,nan,nan,nan"
        else:
            leX, leY = global_gaze_data['left_gaze_point_on_display_area']
            reX, reY = global_gaze_data['right_gaze_point_on_display_area']
            gaze_data = str(leX) + "," + str(leY) + "," + str(reX) + "," + str(reY)

        # Przygotuj dane do wysyłki
        print(gaze_data, flush=True)

        # Dodaje opóźnienie
        time.sleep(0.2)

# Znajdz eyetracker
eyetracker = tr.find_all_eyetrackers()[0]

# Rozpocznij zbierane danych z eyetrackera
eyetracker.subscribe_to(tr.EYETRACKER_GAZE_DATA, gaze_data_callback, as_dictionary=True)

# Uruchom funkcję
send_gaze_data()

# Zakończ zbieranie informacji z eyetrackera
eyetracker.unsubscribe_from(tr.EYETRACKER_GAZE_DATA, gaze_data_callback)