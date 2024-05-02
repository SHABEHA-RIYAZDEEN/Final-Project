import os
import cv2
import time

# Define the list of emotions
emotions = ['happy', 'disgust', 'sad', 'angry', 'fear', 'surprise', 'neutral']

# Function to display emotions and get user input
def get_user_choice():
    print("Please select an emotion by entering the corresponding number:")
    for i, emotion in enumerate(emotions):
        print(f"{i + 1}. {emotion}")
    choice = int(input("Enter your choice (1-7): "))
    return emotions[choice - 1]

# Function to check/create a directory
def check_create_directory(emotion):
    path = os.path.join("MLmodel", "dataset", emotion)
    if not os.path.exists(path):
        os.makedirs(path)
    return path

# Function to capture images
def capture_images(directory):
    cap = cv2.VideoCapture(0)  # Initialize the webcam
    if not cap.isOpened():
        print("Error: Webcam could not be opened.")
        return

    try:
        for i in range(1, 51):  # Capture 50 images
            ret, frame = cap.read()
            if not ret:
                print("Failed to capture image from webcam.")
                break
            cv2.imshow("Capture", frame)  # Display the captured frame
            filename = os.path.join(directory, f"{i}.jpg")
            cv2.imwrite(filename, frame)
            print(f"Saved {filename}")
            time.sleep(1)  # Wait for 1 second

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    finally:
        cap.release()
        cv2.destroyAllWindows()

def main():
    emotion = get_user_choice()
    directory = check_create_directory(emotion)
    capture_images(directory)
    print("Images saved successfully.")

if __name__ == "__main__":
    main()
