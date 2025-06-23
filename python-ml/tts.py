import pyttsx3
from gtts import gTTS
import os
import platform

def speak_pyttsx3(text, voice_gender='male'):
    """
    Uses pyttsx3 to speak the given text.
    Allows selection between male and female voices if available.
    """
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')

    # Attempt to select voice by gender (platform dependent)
    # This is a heuristic and might need adjustment based on specific system's voice properties
    selected_voice = None
    if voice_gender == 'female':
        for voice in voices:
            if voice.gender == 'female' or 'female' in voice.name.lower() or 'zira' in voice.name.lower(): # Zira is a common female voice on Windows
                selected_voice = voice.id
                break
    else: # Default to male or first available voice
         for voice in voices:
            if voice.gender == 'male' or 'male' in voice.name.lower() or 'david' in voice.name.lower(): # David is a common male voice on Windows
                selected_voice = voice.id
                break

    if selected_voice:
        engine.setProperty('voice', selected_voice)
    else:
        print(f"Could not find a specific {voice_gender} voice, using default.")

    engine.say(text)
    print(f"Speaking (pyttsx3): {text}")
    engine.runAndWait()

def speak_gtts(text, lang='en'):
    """
    Uses gTTS to generate an audio file and plays it.
    """
    try:
        tts = gTTS(text=text, lang=lang, slow=False)
        filename = "temp_gtts_audio.mp3"
        tts.save(filename)
        print(f"Speaking (gTTS): {text}")
        if platform.system() == "Windows":
            os.system(f"start {filename}")
        elif platform.system() == "Darwin": # macOS
            os.system(f"afplay {filename}")
        else: # Linux
            os.system(f"mpg321 {filename}") # mpg321 needs to be installed: sudo apt-get install mpg321
        # Ideally, wait for playback to finish before deleting, but os.system is fire-and-forget for players
        # For a robust solution, a more complex audio playing library might be needed.
        # os.remove(filename) # Commented out as player might still be using it.
    except Exception as e:
        print(f"Error using gTTS: {e}")
        print("Falling back to pyttsx3 for speech.")
        speak_pyttsx3(text)


if __name__ == '__main__':
    text_to_say = "Hello, this is Jarvis speaking."

    print("Testing pyttsx3 (default/male voice):")
    speak_pyttsx3(text_to_say)

    print("\nTesting pyttsx3 (female voice if available):")
    speak_pyttsx3(text_to_say, voice_gender='female')

    print("\nTesting gTTS (requires internet and a media player like mpg321 on Linux):")
    # Note: gTTS playback might overlap if not handled carefully.
    # For this test, ensure one finishes before the other if running sequentially without delays.
    speak_gtts("Hello from Google Text-to-Speech.")
    speak_gtts("Hola desde Google Text-to-Speech en Español.", lang='es')

    # Clean up temp file if it exists
    if os.path.exists("temp_gtts_audio.mp3"):
        # A delay might be needed here if the audio player hasn't released the file yet
        # For simplicity in this script, we're not adding a complex wait.
        # In a real app, manage this file lifecycle more carefully.
        # os.remove("temp_gtts_audio.mp3")
        pass
