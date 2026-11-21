#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Keyboard.h>

// ============================================================================
// HARDWARE PIN DEFINITIONS (Waveshare RP2040-Zero)
// ============================================================================
#define OLED_SDA_PIN        0
#define OLED_SCL_PIN        1

#define ENC_A_PIN           2
#define ENC_B_PIN           3
#define ENC_SW_PIN          4

#define KEY_1_PIN           5   // Play / Pause
#define KEY_2_PIN           6   // Next Track
#define KEY_3_PIN           7   // Previous Track

// Standard USB HID Consumer Control Usage Codes (Universal Hex Values)
#define HID_VOL_UP          0x00E9
#define HID_VOL_DOWN        0x00EA
#define HID_MUTE            0x00E2
#define HID_PLAY_PAUSE      0x00CD
#define HID_NEXT_TRACK      0x00B5
#define HID_PREV_TRACK      0x00B6

// ============================================================================
// DISPLAY CONFIGURATION
// ============================================================================
#define SCREEN_WIDTH        128
#define SCREEN_HEIGHT       32
#define OLED_RESET          -1
#define OLED_I2C_ADDR       0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// ============================================================================
// QUADRATURE ENCODER STATE TABLE
// ============================================================================
const int8_t ENC_STATES[] = {
   0, -1,  1,  0,
   1,  0,  0, -1,
  -1,  0,  0,  1,
   0,  1, -1,  0
};

uint8_t encPrevNextCode = 0;
int8_t  encStore        = 0;

// ============================================================================
// NON-BLOCKING BUTTON DEBOUNCE ENGINE
// ============================================================================
struct MacroButton {
  uint8_t  pin;
  uint16_t hidUsageCode;
  const char* label;
  bool     stableState;
  bool     lastReading;
  uint32_t lastDebounceTime;
};

constexpr uint32_t DEBOUNCE_DELAY_MS = 18;

MacroButton buttons[] = {
  { ENC_SW_PIN, HID_MUTE,       "MUTE", HIGH, HIGH, 0 },
  { KEY_1_PIN,  HID_PLAY_PAUSE, "PLAY", HIGH, HIGH, 0 },
  { KEY_2_PIN,  HID_NEXT_TRACK, "NEXT", HIGH, HIGH, 0 },
  { KEY_3_PIN,  HID_PREV_TRACK, "PREV", HIGH, HIGH, 0 }
};

constexpr size_t NUM_BUTTONS = sizeof(buttons) / sizeof(buttons);

// ============================================================================
// UI & TELEMETRY STATE
// ============================================================================
bool     uiNeedsRedraw       = true;
uint32_t lastOledRefreshMs   = 0;
uint32_t lastActionTimeMs    = 0;
const char* activeActionText = nullptr;
bool     isMutedVisual       = false;

// ============================================================================
// FUNCTION PROTOTYPES
// ============================================================================
void sendConsumerKey(uint16_t usageCode);
void pollEncoder();
void pollButtons();
void renderAuraBarUI();
void drawMonitorIcon(int16_t x, int16_t y);
void drawSignalBars(int16_t x, int16_t y, uint8_t level);

// ============================================================================
// SETUP
// ============================================================================
void setup() {
  Keyboard.begin();

  pinMode(ENC_A_PIN, INPUT_PULLUP);
  pinMode(ENC_B_PIN, INPUT_PULLUP);

  for (size_t i = 0; i < NUM_BUTTONS; i++) {
    pinMode(buttons[i].pin, INPUT_PULLUP);
  }

  encPrevNextCode = (digitalRead(ENC_A_PIN) << 1) | digitalRead(ENC_B_PIN);

  Wire.setSDA(OLED_SDA_PIN);
  Wire.setSCL(OLED_SCL_PIN);
  Wire.begin();
  Wire.setClock(400000);

  if (display.begin(SSD1306_SWITCHCAPVCC, OLED_I2C_ADDR)) {
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);
    renderAuraBarUI();
  }
}

// ============================================================================
// MAIN LOOP
// ============================================================================
void loop() {
  pollEncoder();
  pollButtons();

  uint32_t now = millis();

  if (activeActionText != nullptr && (now - lastActionTimeMs > 900)) {
    activeActionText = nullptr;
    uiNeedsRedraw = true;
  }

  if (uiNeedsRedraw && (now - lastOledRefreshMs >= 40)) {
    renderAuraBarUI();
    lastOledRefreshMs = now;
    uiNeedsRedraw = false;
  }
}

// ============================================================================
// QUADRATURE ENCODER POLLING
// ============================================================================
void pollEncoder() {
  encPrevNextCode <<= 2;
  if (digitalRead(ENC_A_PIN)) encPrevNextCode |= 0x02;
  if (digitalRead(ENC_B_PIN)) encPrevNextCode |= 0x01;
  encPrevNextCode &= 0x0F;

  int8_t delta = ENC_STATES[encPrevNextCode];
  if (delta != 0) {
    encStore += delta;

    if (encStore >= 4) {
      encStore = 0;
      isMutedVisual = false;
      sendConsumerKey(HID_VOL_UP);
      activeActionText = "VOL +";
      lastActionTimeMs = millis();
      uiNeedsRedraw = true;
    } 
    else if (encStore <= -4) {
      encStore = 0;
      isMutedVisual = false;
      sendConsumerKey(HID_VOL_DOWN);
      activeActionText = "VOL -";
      lastActionTimeMs = millis();
      uiNeedsRedraw = true;
    }
  }
}

// ============================================================================
// NON-BLOCKING SWITCH POLLING
// ============================================================================
void pollButtons() {
  uint32_t now = millis();

  for (size_t i = 0; i < NUM_BUTTONS; i++) {
    bool currentReading = digitalRead(buttons[i].pin);

    if (currentReading != buttons[i].lastReading) {
      buttons[i].lastDebounceTime = now;
    }

    if ((now - buttons[i].lastDebounceTime) >= DEBOUNCE_DELAY_MS) {
      if (currentReading != buttons[i].stableState) {
        buttons[i].stableState = currentReading;

        if (buttons[i].stableState == LOW) {
          sendConsumerKey(buttons[i].hidUsageCode);

          if (buttons[i].hidUsageCode == HID_MUTE) {
            isMutedVisual = !isMutedVisual;
            activeActionText = isMutedVisual ? "MUTED" : "UNMUTE";
          } else {
            activeActionText = buttons[i].label;
          }

          lastActionTimeMs = now;
          uiNeedsRedraw = true;
        }
      }
    }

    buttons[i].lastReading = currentReading;
  }
}

// ============================================================================
// USB HID REPORT DISPATCHER
// ============================================================================
void sendConsumerKey(uint16_t usageCode) {
  Keyboard.consumerPress(usageCode);
  delayMicroseconds(500);
  Keyboard.consumerRelease();
}

// ============================================================================
// AURABAR OLED GRAPHICS RENDERER
// ============================================================================
void renderAuraBarUI() {
  display.clearDisplay();

  const int16_t yOffset = (SCREEN_HEIGHT - 32) / 2;

  drawMonitorIcon(4, yOffset + 7);

  display.setTextSize(1);
  display.setCursor(24, yOffset + 6);
  display.print(F("AuraBar"));

  display.setCursor(24, yOffset + 18);
  display.print(F("HDMI+USB (Touch)"));

  if (activeActionText != nullptr) {
    int16_t badgeX = 90;
    int16_t badgeY = yOffset + 4;
    display.fillRoundRect(badgeX, badgeY, 36, 11, 2, SSD1306_WHITE);
    display.setTextColor(SSD1306_BLACK);
    display.setCursor(badgeX + 3, badgeY + 2);
    display.print(activeActionText);
    display.setTextColor(SSD1306_WHITE);
  } else {
    uint8_t signalLevel = isMutedVisual ? 1 : 4;
    drawSignalBars(110, yOffset + 16, signalLevel);
  }

  display.display();
}

void drawMonitorIcon(int16_t x, int16_t y) {
  display.drawRoundRect(x, y, 15, 11, 1, SSD1306_WHITE);
  display.drawFastVLine(x + 7, y + 11, 2, SSD1306_WHITE);
  display.drawFastHLine(x + 4, y + 13, 7, SSD1306_WHITE);
}

void drawSignalBars(int16_t x, int16_t y, uint8_t level) {
  for (uint8_t i = 0; i < 4; i++) {
    int16_t barHeight = (i + 1) * 3;
    int16_t barX = x + (i * 4);
    int16_t barY = y - barHeight;

    if (i < level) {
      display.fillRect(barX, barY, 2, barHeight, SSD1306_WHITE);
    } else {
      display.drawRect(barX, barY, 2, barHeight, SSD1306_WHITE);
    }
  }
}