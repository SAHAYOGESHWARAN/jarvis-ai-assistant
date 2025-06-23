import speech_recognition as sr
from flask import Flask, request, jsonify
import os

# --- Flask App Setup ---
# This part would typically be in a separate file (e.g., app.py or main.py for the ML service)
# but is included here for conceptual demonstration.
# Ensure Flask is in requirements.txt: Flask

app = Flask(__name__)

# --- Core STT Function ---
def recognize_audio_data(audio_data):
    """
    Recognizes speech from audio data.
    audio_data should be an AudioData instance from SpeechRecognition.
    """
    recognizer = sr.Recognizer()
    try:
        print("Recognizing speech from provided audio data...")
        text = recognizer.recognize_google(audio_data)
        print(f"Recognized: {text}")
        return text, None
    except sr.UnknownValueError:
        error_msg = "Google Speech Recognition could not understand audio."
        print(error_msg)
        return None, error_msg
    except sr.RequestError as e:
        error_msg = f"Could not request results from Google Speech Recognition service; {e}"
        print(error_msg)
        return None, error_msg
    except Exception as e:
        error_msg = f"An unexpected error occurred during speech recognition: {e}"
        print(error_msg)
        return None, error_msg

# --- STT from Microphone (Original Functionality) ---
def listen_and_recognize_from_mic():
    """
    Captures audio from the microphone and tries to recognize speech.
    Returns the recognized text or None if an error occurs.
    """
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()

    with microphone as source:
        print("Adjusting for ambient noise... Please wait.")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        print("Listening...")
        try:
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
        except sr.WaitTimeoutError:
            print("No speech detected within the time limit.")
            return None, "No speech detected within the time limit."

    return recognize_audio_data(audio)


# --- Flask API Endpoint for STT ---
@app.route('/ml/stt', methods=['POST'])
def stt_api():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file part"}), 400

    file = request.files['audio']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        try:
            # For SpeechRecognition, we need an AudioFile instance
            # Save the uploaded file temporarily to be read by sr.AudioFile
            temp_filename = "temp_uploaded_audio.wav" # Ensure format is compatible
            file.save(temp_filename)

            recognizer = sr.Recognizer()
            with sr.AudioFile(temp_filename) as source:
                audio_data = recognizer.record(source)  # read the entire audio file

            os.remove(temp_filename) # Clean up temp file

            text, error = recognize_audio_data(audio_data)
            if error:
                return jsonify({"error": error}), 500
            return jsonify({"transcription": text}), 200

        except Exception as e:
            # Clean up temp file in case of error too
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
            return jsonify({"error": f"Processing error: {str(e)}"}), 500

    return jsonify({"error": "File processing failed"}), 500


if __name__ == '__main__':
    # To run the Flask app:
    # 1. Ensure Flask is installed (pip install Flask).
    # 2. Set FLASK_APP=stt.py (or your script name) in your environment.
    # 3. Run 'flask run --port 5002' (or your desired port for the ML service).
    #
    # The code below is for direct microphone testing (original functionality).
    # To test microphone STT: python stt.py mic_test

    import sys
    if len(sys.argv) > 1 and sys.argv[1] == 'mic_test':
        print("Starting speech-to-text test from microphone...")
        recognized_text, error_msg = listen_and_recognize_from_mic()
        if recognized_text:
            print(f"Final recognized text: {recognized_text}")
        else:
            print(f"Error or no text recognized: {error_msg}")
    else:
        print("To test microphone STT, run: python stt.py mic_test")
        print("To run the Flask server for API-based STT, use: flask run --port 5002 (after setting FLASK_APP)")
        # Example: app.run(host='0.0.0.0', port=5002, debug=True)
        # For production, use a proper WSGI server like Gunicorn.
        # This direct app.run is for development/testing only.
        # To avoid running Flask app by default when script is just imported,
        # it's better to guard app.run with a specific condition or use Flask CLI.
        # For this conceptual step, we are not auto-starting the server here.
        pass
