// Base URL for the backend API
// In a real app, this would come from an environment variable
const API_BASE_URL = 'http://localhost:5001/api'; // Assuming backend runs on port 5001

/**
 * Sends a message to the chat API.
 * @param message The message string to send.
 * @returns Promise<any> The server's response.
 */
export const sendChatMessage = async (message: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

/**
 * Fetches chat history.
 * @returns Promise<any> The chat history.
 */
export const getChatHistory = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/history`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

/**
 * Sends a system control action to the backend.
 * @param action The action to perform (e.g., 'open_app').
 * @param payload Additional data for the action.
 * @returns Promise<any> The server's response.
 */
export const sendSystemAction = async (action: string, payload?: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/system/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error)
    {
    console.error("Error sending system action:", error);
    throw error;
  }
};

/**
 * Fetches weather information.
 * @param city The city to get weather for.
 * @returns Promise<any> The weather data.
 */
export const getWeather = async (city?: string): Promise<any> => {
  try {
    const query = city ? `?city=${encodeURIComponent(city)}` : '';
    const response = await fetch(`${API_BASE_URL}/productivity/weather${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};

/**
 * Adds a reminder.
 * @param text The reminder text.
 * @param time The reminder time.
 * @returns Promise<any> The created reminder.
 */
export const addReminder = async (text: string, time: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/productivity/reminders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, time }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding reminder:", error);
    throw error;
  }
};

// Example of how a Python ML service might be called (if it runs its own server)
const PYTHON_ML_API_BASE_URL = 'http://localhost:5002/ml'; // Assuming Python ML service runs on port 5002

/**
 * Gets speech-to-text from the Python ML service.
 * This is a conceptual example. The Python service would need to expose an endpoint.
 * For actual STT, browser's Web Speech API is often used directly on the frontend.
 * This could be for more advanced STT or if a specific Python model is required.
 * @param audioBlob The audio data to transcribe.
 * @returns Promise<any> The transcription.
 */
export const getTranscriptionFromPyService = async (audioBlob: Blob): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav'); // Or appropriate format

    const response = await fetch(`${PYTHON_ML_API_BASE_URL}/stt`, {
      method: 'POST',
      body: formData, // Sending as FormData for file upload
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting transcription from Python service:", error);
    throw error;
  }
};

/**
 * Triggers text-to-speech from the Python ML service.
 * This is conceptual. The Python service would need an endpoint.
 * @param text The text to synthesize.
 * @returns Promise<Blob> The audio data as a Blob.
 */
export const getTextToSpeechFromPyService = async (text: string): Promise<Blob> => {
  try {
    const response = await fetch(`${PYTHON_ML_API_BASE_URL}/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.blob(); // Assuming the service returns the audio file directly
  } catch (error) {
    console.error("Error getting TTS from Python service:", error);
    throw error;
  }
};
