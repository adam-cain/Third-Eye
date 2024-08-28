#include "esp_http_server.h"
#include "esp_camera.h"
#include "fb_gfx.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <string.h>

#define RESET_GPIO_NUM   5
#define XCLK_GPIO_NUM    15
#define SIOD_GPIO_NUM    22
#define SIOC_GPIO_NUM    23

#define D0_GPIO_NUM      2
#define D1_GPIO_NUM      14
#define D2_GPIO_NUM      35
#define D3_GPIO_NUM      12
#define D4_GPIO_NUM      27
#define D5_GPIO_NUM      33
#define D6_GPIO_NUM      34
#define D7_GPIO_NUM      39
#define VSYNC_GPIO_NUM   18
#define HREF_GPIO_NUM    36
#define PCLK_GPIO_NUM    26

#define LED_GPIO_NUM     25
#define BUTTON_GPIO_NUM  0

#define WIFI_SSID        ""
#define WIFI_PASSWORD    ""
#define SHORT_PRESS_DURATION 500  // 500 milliseconds for short press

const int SERVER_PORT = 443; //server port for HTTPS
const String SERVER_URL = "squid-app-hyn6l.ondigitalocean.app";
const char* rootCACertificate = // Root CA certificate of the server
"-----BEGIN CERTIFICATE-----\n" \
"MIIDdzCCAl+gAwIBAgIEAgAAuTANBgkqhkiG9w0BAQUFADBaMQswCQYDVQQGEwJJ\n" \
"RTESMBAGA1UEChMJQmFsdGltb3JlMRMwEQYDVQQLEwpDeWJlclRydXN0MSIwIAYD\n" \
"VQQDExlCYWx0aW1vcmUgQ3liZXJUcnVzdCBSb290MB4XDTAwMDUxMjE4NDYwMFoX\n" \
"DTI1MDUxMjIzNTkwMFowWjELMAkGA1UEBhMCSUUxEjAQBgNVBAoTCUJhbHRpbW9y\n" \
"ZTETMBEGA1UECxMKQ3liZXJUcnVzdDEiMCAGA1UEAxMZQmFsdGltb3JlIEN5YmVy\n" \
"VHJ1c3QgUm9vdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKMEuyKr\n" \
"mD1X6CZymrV51Cni4eiVgLGw41uOKymaZN+hXe2wCQVt2yguzmKiYv60iNoS6zjr\n" \
"IZ3AQSsBUnuId9Mcj8e6uYi1agnnc+gRQKfRzMpijS3ljwumUNKoUMMo6vWrJYeK\n" \
"mpYcqWe4PwzV9/lSEy/CG9VwcPCPwBLKBsua4dnKM3p31vjsufFoREJIE9LAwqSu\n" \
"XmD+tqYF/LTdB1kC1FkYmGP1pWPgkAx9XbIGevOF6uvUA65ehD5f/xXtabz5OTZy\n" \
"dc93Uk3zyZAsuT3lySNTPx8kmCFcB5kpvcY67Oduhjprl3RjM71oGDHweI12v/ye\n" \
"jl0qhqdNkNwnGjkCAwEAAaNFMEMwHQYDVR0OBBYEFOWdWTCCR1jMrPoIVDaGezq1\n" \
"BE3wMBIGA1UdEwEB/wQIMAYBAf8CAQMwDgYDVR0PAQH/BAQDAgEGMA0GCSqGSIb3\n" \
"DQEBBQUAA4IBAQCFDF2O5G9RaEIFoN27TyclhAO992T9Ldcw46QQF+vaKSm2eT92\n" \
"9hkTI7gQCvlYpNRhcL0EYWoSihfVCr3FvDB81ukMJY2GQE/szKN+OMY3EU/t3Wgx\n" \
"jkzSswF07r51XgdIGn9w/xZchMB5hbgF/X++ZRGjD8ACtPhSNzkE1akxehi/oCr0\n" \
"Epn3o0WC4zxe9Z2etciefC7IpJ5OCBRLbf1wbWsaY71k5h+3zvDyny67G7fyUIhz\n" \
"ksLi4xaNmjICq44Y3ekQEe5+NauQrz4wlHrQMz2nZQ/1/I6eYs9HRCwBXbsdtTLS\n" \
"R9I4LtD+gdwyah617jzV/OeBHRnDJELqYzmp\n" \
"-----END CERTIFICATE-----\n";

void sendImage();  // Forward declaration of sendImage function
void getAnswer();  // Forward declaration of getAnswer function

void setup() {
  Serial.begin(115200);
  Serial.println("Start");

  pinMode(LED_GPIO_NUM, OUTPUT);
  digitalWrite(LED_GPIO_NUM, LOW);

  pinMode(BUTTON_GPIO_NUM, INPUT_PULLUP); // Configure GPIO0 as an input with a pull-up resistor

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to WiFi");

  camera_config_t config;
  config.pin_d0 = D0_GPIO_NUM;
  config.pin_d1 = D1_GPIO_NUM;
  config.pin_d2 = D2_GPIO_NUM;
  config.pin_d3 = D3_GPIO_NUM;
  config.pin_d4 = D4_GPIO_NUM;
  config.pin_d5 = D5_GPIO_NUM;
  config.pin_d6 = D6_GPIO_NUM;
  config.pin_d7 = D7_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = -1;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.frame_size = FRAMESIZE_SVGA;
  config.pixel_format = PIXFORMAT_JPEG;
  config.grab_mode = CAMERA_GRAB_LATEST;
  // config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 8;
  config.fb_count = 1;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t *s = esp_camera_sensor_get();
  s->set_vflip(s, 1);

  Serial.println("Camera init OK.");
}

void loop() {
  static bool buttonPressed = false;
  static unsigned long buttonPressTime = 0;

  if (digitalRead(BUTTON_GPIO_NUM) == LOW) {
    if (!buttonPressed) {
      buttonPressed = true;
      buttonPressTime = millis();
    }
  } else {
    if (buttonPressed) {
      buttonPressed = false;
      unsigned long pressDuration = millis() - buttonPressTime;
      if (pressDuration < SHORT_PRESS_DURATION) {
        Serial.println("Short button press detected!");
        sendImage();
      } else {
        Serial.println("Long button press detected!");
        getAnswer();
      }
    }
  }

  delay(100); // Debounce delay
}

//Image
void sendImage() {
  String getAll;
  String getBody;

  WiFiClientSecure client;
  client.setCACert(rootCACertificate);

  // Capture an image
  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    return;
  }

  Serial.println("Connecting to server: " + SERVER_URL);
  if (client.connect(SERVER_URL.c_str(), SERVER_PORT)) {
    Serial.println("Connection successful!");
String head = "--ThirdEye\r\nContent-Disposition: form-data; name=\"image\"; filename=\"image.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n";    String tail = "\r\n--ThirdEye--\r\n";

    uint32_t imageLen = fb->len;
    uint32_t extraLen = head.length() + tail.length();
    uint32_t totalLen = imageLen + extraLen;
    
    client.println("POST /add-image HTTP/1.1");
    client.println("Host: " + SERVER_URL);
    client.println("Content-Length: " + String(totalLen));
    client.println("Content-Type: multipart/form-data; boundary=ThirdEye");
    client.println();
    client.print(head);

    uint8_t *fbBuf = fb->buf;
    size_t fbLen = fb->len;
    for (size_t n = 0; n < fbLen; n += 1024) {
      if (n + 1024 < fbLen) {
        client.write(fbBuf, 1024);
        fbBuf += 1024;
      } else if (fbLen % 1024 > 0) {
        size_t remainder = fbLen % 1024;
        client.write(fbBuf, remainder);
      }
    }
    client.print(tail);
    
    esp_camera_fb_return(fb);

    int timoutTimer = 10000;
    long startTimer = millis();
    boolean state = false;
    
    while ((startTimer + timoutTimer) > millis()) {
      Serial.print(".");
      delay(100);      
      while (client.available()) {
        char c = client.read();
        if (c == '\n') {
          if (getAll.length() == 0) { state = true; }
          getAll = "";
        } else if (c != '\r') { getAll += String(c); }
        if (state == true) { getBody += String(c); }
        startTimer = millis();
      }
      if (getBody.length() > 0) { break; }
    }
    Serial.println();
    client.stop();
    Serial.println(getBody);
  } else {
    getBody = "Connection to " + SERVER_URL + " failed.";
    Serial.println(getBody);
  }
}

//Answer
void getAnswer() {
  WiFiClientSecure client;
  client.setCACert(rootCACertificate);
  
  HTTPClient https;  // Use HTTPS instead of HTTP

  // Specify the URL
  String url = "https://" + SERVER_URL + "/answer";
  Serial.println("Making GET request to: " + url);

  // Begin the HTTPS request
  if (https.begin(client, url)) {
    // Send the request
    int httpResponseCode = https.GET();

    // Check the response code
    if (httpResponseCode > 0) {
      // Get the response payload
      String response = https.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.print("Error on sending GET request: ");
      Serial.println(https.errorToString(httpResponseCode).c_str());
    }

    // End the request
    https.end();
  } else {
    Serial.println("Unable to connect to server");
  }
}
