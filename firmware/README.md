# ESP32 Camera and HTTPS Server Communication

This project demonstrates how to use an ESP32 microcontroller with a camera module to capture images and interact with an HTTPS server. The ESP32 captures an image when a button is pressed and sends it to a server. Additionally, a long button press retrieves an answer from the server.

## Features

- Connects to a WiFi network.
- Initializes and configures an ESP32 camera module.
- Captures an image when a button is pressed.
- Sends the captured image to an HTTPS server.
- Retrieves and displays a response from the server when the button is held down.

## Hardware Required

- ESP32 development board
- Camera module (e.g., OV5640)
- Button
- LED (optional for status indication)

## Pin Configuration

- **Camera Module:**
  - `RESET_GPIO_NUM` - GPIO 5
  - `XCLK_GPIO_NUM` - GPIO 15
  - `SIOD_GPIO_NUM` - GPIO 22
  - `SIOC_GPIO_NUM` - GPIO 23
  - `D0_GPIO_NUM` - GPIO 2
  - `D1_GPIO_NUM` - GPIO 14
  - `D2_GPIO_NUM` - GPIO 35
  - `D3_GPIO_NUM` - GPIO 12
  - `D4_GPIO_NUM` - GPIO 27
  - `D5_GPIO_NUM` - GPIO 33
  - `D6_GPIO_NUM` - GPIO 34
  - `D7_GPIO_NUM` - GPIO 39
  - `VSYNC_GPIO_NUM` - GPIO 18
  - `HREF_GPIO_NUM` - GPIO 36
  - `PCLK_GPIO_NUM` - GPIO 26

- **Additional Components:**
  - `LED_GPIO_NUM` - GPIO 25
  - `BUTTON_GPIO_NUM` - GPIO 0

## Software Requirements

- Arduino IDE
- ESP32 board package installed via Arduino Board Manager
- Libraries: `esp_http_server`, `esp_camera`, `fb_gfx`, `WiFi`, `WiFiClientSecure`, `HTTPClient`

## Setup

1. **Install the Arduino IDE**: [Download and install Arduino IDE](https://www.arduino.cc/en/software).

2. **Install the ESP32 Board Package**:
   - Open Arduino IDE and go to `File` -> `Preferences`.
   - In the "Additional Board Manager URLs" field, add `https://dl.espressif.com/dl/package_esp32_index.json`.
   - Go to `Tools` -> `Board` -> `Boards Manager`, search for `esp32`, and install it.

3. **Install Required Libraries**:
   - Open Arduino IDE and go to `Sketch` -> `Include Library` -> `Manage Libraries`.
   - Search for and install the following libraries: `esp_http_server`, `esp_camera`, `fb_gfx`, `WiFi`, `WiFiClientSecure`, `HTTPClient`.

4. **Configure Your WiFi and Server Settings**:
   - In the code, set `WIFI_SSID` and `WIFI_PASSWORD` with your network credentials.
   - Set `SERVER_URL` to your server’s URL.
   - Provide the server's root CA certificate in `rootCACertificate`.

5. **Upload the Code**:
   - Connect your ESP32 board to your computer.
   - Select the correct board and port in Arduino IDE.
   - Upload the code.

## Usage

1. **Power the ESP32**: Connect it to a power source.
2. **Button Interaction**:
   - **Short Press**: Press and release the button quickly to capture and send an image to the server.
   - **Long Press**: Press and hold the button to retrieve an answer from the server.

## Troubleshooting

- Ensure that the camera module is properly connected to the ESP32.
- Verify that your WiFi credentials and server URL are correctly set.
- Check the server's root CA certificate for correctness.
- Monitor the serial output for debugging information and errors.