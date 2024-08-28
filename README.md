# Third Eye

## Overview

**Third Eye** is a project that leverages the power of IoT and AI to create a portable, image-capturing system. It utilizes an ESP32 microcontroller equipped with an OV5640-AF camera module to capture images. These images are then sent to an Express.js backend, which processes the images and provides answers to questions about the images. The project is designed to be accessed and controlled via a smartphone through a PWA, enabling users to interact with the system in real-time.

## Features

- **Image Capturing:** The ESP32, connected to an OV5640-AF camera, captures high-quality images.
- **Wireless Communication:** Images are transmitted wirelessly from the ESP32 to the Express.js backend.
- **AI-Powered Image Analysis:** The backend processes the images and can answer questions about them using integrated AI models.
- **Mobile Access:** Users can interact with the system using a smartphone, making it accessible and easy to use.

## Components

### Hardware

- **ESP32:** A powerful microcontroller with built-in Wi-Fi and Bluetooth capabilities.
- **OV5640-AF Camera Module:** A 5MP camera module with autofocus capability, ideal for capturing clear and detailed images.

### Software

- **ESP32 Firmware:** Written in C/C++, this firmware controls the ESP32 and manages the camera module, including capturing images and sending them to the backend.
- **Express.js Backend:** A Node.js framework that handles image processing, stores images, and responds to user queries.
- **AI Models:** Integrated into the backend to analyze the images and provide intelligent responses to user questions.

## Getting Started

### Prerequisites

- **ESP32 Development Board**
- **OV5640-AF Camera Module**
- **A Computer with the Arduino IDE or PlatformIO (for ESP32 development)**
- **Node.js and npm (for running the Express backend)**

### Installation

#### 1. Setting Up the ESP32

1. **Install the ESP32 Board in Arduino IDE:**
   - Open the Arduino IDE.
   - Go to `File` -> `Preferences`.
   - In "Additional Board Manager URLs", add:
     ```
     https://dl.espressif.com/dl/package_esp32_index.json
     ```
   - Go to `Tools` -> `Board` -> `Boards Manager`, search for `ESP32`, and install it.

2. **Download the Third Eye ESP32 Firmware:**
   - Clone this repository:
     ```
     git clone https://github.com/yourusername/third-eye.git
     ```
   - Navigate to the `firmware` directory.

3. **Upload the Firmware to the ESP32:**
   - Connect your ESP32 to your computer.
   - Open the `third_eye_firmware.ino` file in Arduino IDE.
   - Select the correct board and port under `Tools`.
   - Upload the firmware.

#### 2. Setting Up the Express.js Backend

1. **Install Node.js:**
   - Download and install Node.js from [nodejs.org](https://nodejs.org/).

2. **Set Up the Backend:**
   - Navigate to the `backend` directory in the cloned repository.
   - Install the necessary dependencies:
     ```
     npm install
     ```
   - Start the Express server:
     ```
     npm start
     ```
   - The server will start on `http://localhost:3000`.

#### 3. Connecting the ESP32 and Backend

1. **Configure the ESP32:**
   - In the `firmware` directory, edit the `WiFi` settings in the firmware code to match your network.
   - Set the backend server IP address in the firmware to match your computer's IP address.

2. **Run the System:**
   - Once the ESP32 is connected to your Wi-Fi network, it will start capturing images and sending them to the backend.

### Usage

- **Capturing Images:** The ESP32 will automatically capture images and send them to the backend.
- **Interacting with the System:** Use your smartphone's browser to connect to the Express backend's IP address. From there, you can view the captured images and ask questions about them.
- **Example Questions:** "What is in the image?", "Describe the scene", "Identify objects".

### Project Structure

```plaintext
third-eye/
│
├── firmware/                # ESP32 firmware
│   └── third_eye_firmware.ino
│
├── backend/                 # Express.js backend
│   ├── app.js
│   ├── routes/
│
├── README.md                # Project documentation
└── .gitignore
```

## Contributing

Contributions are welcome! Please feel free to submit issues, fork the repository, and create pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **ESP32 Community:** For extensive documentation and support.
- **Express.js:** For providing a robust and flexible backend framework.
- **OpenAI:** For AI models and API integration.

---

**Third Eye** is an ongoing project, and we are continuously improving it. Stay tuned for updates!