import cv2
import numpy as np
import time
import os
from datetime import datetime

# --- Configuration ---
ENABLE_FACE_DETECTION = True
ENABLE_MOTION_DETECTION = True
MIN_MOTION_AREA = 500  # Minimum area to consider as motion
LOG_DIR = "security_logs"
RECORD_VIDEO_ON_DETECTION = False # Set to True to record video clips
VIDEO_RECORD_DURATION = 10 # seconds

# Ensure log directory exists
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)
if RECORD_VIDEO_ON_DETECTION and not os.path.exists(os.path.join(LOG_DIR, "videos")):
    os.makedirs(os.path.join(LOG_DIR, "videos"))

# --- Face Detection Setup ---
if ENABLE_FACE_DETECTION:
    try:
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        if face_cascade.empty():
            print("Error loading face cascade classifier. Face detection will be disabled.")
            ENABLE_FACE_DETECTION = False
    except Exception as e:
        print(f"Exception loading face cascade: {e}. Face detection will be disabled.")
        ENABLE_FACE_DETECTION = False

# --- Video Recording Setup ---
video_writer = None
recording_start_time = 0

def log_event(event_type, details=""):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_message = f"[{timestamp}] {event_type}: {details}"
    print(log_message)
    with open(os.path.join(LOG_DIR, "security_log.txt"), "a") as f:
        f.write(log_message + "\n")

def start_recording(frame_width, frame_height, fps=20):
    global video_writer, recording_start_time
    if RECORD_VIDEO_ON_DETECTION and video_writer is None:
        filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".avi"
        filepath = os.path.join(LOG_DIR, "videos", filename)
        fourcc = cv2.VideoWriter_fourcc(*'XVID') # or 'MJPG'
        video_writer = cv2.VideoWriter(filepath, fourcc, fps, (frame_width, frame_height))
        recording_start_time = time.time()
        log_event("Video Recording", f"Started recording to {filepath}")

def stop_recording():
    global video_writer
    if video_writer is not None:
        video_writer.release()
        video_writer = None
        log_event("Video Recording", "Stopped recording.")

def run_security_system():
    global video_writer, recording_start_time
    cap = cv2.VideoCapture(0) # 0 for default webcam

    if not cap.isOpened():
        log_event("Error", "Cannot open webcam.")
        return

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    prev_frame = None
    log_event("System", "Security system started.")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                log_event("Error", "Failed to grab frame.")
                break

            display_frame = frame.copy()
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray_blurred = cv2.GaussianBlur(gray, (21, 21), 0)

            detection_occurred = False

            # --- Face Detection ---
            if ENABLE_FACE_DETECTION:
                faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
                for (x, y, w, h) in faces:
                    cv2.rectangle(display_frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                    log_event("Face Detected", f"Face found at x={x}, y={y}, w={w}, h={h}")
                    detection_occurred = True

            # --- Motion Detection ---
            if ENABLE_MOTION_DETECTION:
                if prev_frame is None:
                    prev_frame = gray_blurred
                    continue

                frame_delta = cv2.absdiff(prev_frame, gray_blurred)
                thresh = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)[1]
                thresh = cv2.dilate(thresh, None, iterations=2)
                contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

                for contour in contours:
                    if cv2.contourArea(contour) < MIN_MOTION_AREA:
                        continue
                    (x, y, w, h) = cv2.boundingRect(contour)
                    cv2.rectangle(display_frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                    log_event("Motion Detected", f"Motion area: {cv2.contourArea(contour)}")
                    detection_occurred = True

                prev_frame = gray_blurred # Update previous frame for next iteration

            # --- Video Recording Logic ---
            if detection_occurred and RECORD_VIDEO_ON_DETECTION:
                if video_writer is None:
                    start_recording(frame_width, frame_height)
                elif video_writer is not None: # Reset timer if detection continues
                    recording_start_time = time.time()

            if video_writer is not None:
                video_writer.write(frame) # Write original frame
                if time.time() - recording_start_time > VIDEO_RECORD_DURATION:
                    stop_recording()

            # --- Display ---
            cv2.imshow('Jarvis Security Feed', display_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                log_event("System", "Shutdown requested by user.")
                break
    finally:
        if video_writer is not None:
            stop_recording()
        cap.release()
        cv2.destroyAllWindows()
        log_event("System", "Security system stopped.")

if __name__ == '__main__':
    # This check is important for OpenCV GUI functions on some platforms
    if platform.system() == "Linux" and not os.environ.get("DISPLAY"):
        print("No display server found (e.g., X11). OpenCV GUI will not work.")
        print("If running headless, ensure this script is adapted for that.")
        # Potentially disable GUI-dependent parts or run in a mode that doesn't require imshow
    else:
        try:
            run_security_system()
        except Exception as e:
            log_event("Critical Error", str(e))
            # Ensure resources are released in case of an unhandled exception
            if 'cap' in locals() and cap.isOpened():
                cap.release()
            cv2.destroyAllWindows()
