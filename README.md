 Here is the complete, professional `README.md` file designed for your project root. It comprehensively presents your architecture, features, hardware specifications, and setup instructions without requiring external image links for now.

Create a new file named `README.md` in your root `Aurabar/` folder and paste this exact content:

```markdown
# AuraBar

> **An ultrawide auxiliary desktop touch console, physical stream deck, and real-time hardware telemetry HUD.**

AuraBar transforms an 8.8-inch (1920×480) ultrawide capacitive display into a dedicated, tactile desktop companion. Built to sit directly beneath a primary monitor, it delivers instant media control, live Discord channel awareness, deep hardware telemetry, and window management—eliminating desktop clutter, secondary web logins, and disruptive Alt-Tabbing.

---

## Key Features

### 1. 50/50 Dual Split-Screen Multitasking
- Seamlessly partitions the 1920×480 canvas into two dedicated 960×480 application spaces.
- Run media playback with live synced lyrics on the left while browsing documentation or monitoring chats on the right.
- Persistent top-rail controls provide quick access to global media controls and layout toggles.

### 2. Zero-Login Native Host Architecture
- Connects directly to Windows System Media Transport Controls (SMTC) using native Windows Runtime APIs.
- Reads real-time track metadata (track title, artist name, and playback state) from desktop sessions (Spotify, YouTube Music, Brave, Chrome) without requiring separate browser logins or memory-heavy sandboxes.
- Global media transport dispatching triggers system-level consumer keys (`VK_MEDIA_PLAY_PAUSE`, `VK_MEDIA_NEXT_TRACK`, `VK_MEDIA_PREV_TRACK`).

### 3. Deep Hardware Telemetry & Interactive Flyouts
- Lightweight system poller querying hardware counters via `systeminformation`.
- Monitors live CPU load and clock speeds, active RAM allocation (used/total), discrete NVIDIA GPU load, integrated GPU utilization, NVMe disk I/O, and real-time network throughput.
- Left-hand flyout rail reveals comprehensive core counts, architecture specs, and live thermal metrics on demand.

### 4. Hardware Macro & Rotary Control Deck
- Direct integration with a custom RP2040-Zero controller board, EC11 rotary encoder, and mechanical switches.
- Rotary dial adjustments directly modify Windows master volume in real time via USB-HID consumer control packets.
- Secondary 0.96" I2C SSD1306 OLED display mirrors device connection status and volume indicators.

### 5. Floating Auto-Hide Spring Dock
- macOS / Windows 11-inspired floating dock with spring-physics hover animations.
- Automatically glides down off-screen during focused application workflows to give running apps 100% of the display canvas.
- Re-emerges on bottom-bezel proximity detection with magnification scaling and extensible app shortcuts.

---

## Hardware Architecture & Tech Stack

### System Overview
```text
┌────────────────────────────────────────────────────────┐
│                   WINDOWS HOST PC                      │
│   Spotify / Browser • Discord Voice • Native Apps      │
└──────────────────────────┬─────────────────────────────┘
                           │ USB-C (Data/Touch) + HDMI
                           ▼
┌────────────────────────────────────────────────────────┐
│              AURABAR DESKTOP CONSOLE                   │
│                                                        │
│  [ 8.8" 1920x480 IPS ]  ──► React 18 / Electron HUD    │
│  [ RP2040-Zero Pod ]    ──► USB-HID Rotary & Macros    │
│  [ SSD1306 OLED Mini ]  ──► Hardware Status Mirror     │
└────────────────────────────────────────────────────────┘

```

### Specifications

| Component | Specification |
| --- | --- |
| **Primary Display** | 8.8-inch IPS Capacitive Touch LCD (1920×480 Ultrawide, 60Hz) |
| **Microcontroller** | Waveshare RP2040-Zero (Dual-core ARM Cortex M0+) |
| **Status Screen** | 0.96-inch I2C SSD1306 OLED Display (128×64 / 128×32) |
| **Input Hardware** | EC11 Rotary Encoder (with push mute) + 3× Mechanical Key Switches |
| **Enclosure** | 15° angled desktop wedge chassis with rear recessed I/O |
| **Software Stack** | Electron, React 18, Vite, Tailwind CSS |

---

## Repository Structure

```text
Aurabar/
├── cad/                     # 3D models, Blender source files, and STL exports
├── hardware/                # EasyEDA schematics, PCB layouts, and Gerber archives
├── firmware/                # RP2040 Arduino C++ USB-HID firmware
├── aurabar-dashboard/       # Electron backend and React frontend source
│   ├── src/                 # Quadrant UI, telemetry flyouts, and dock components
│   ├── electron.cjs         # Native host engine, Win32 bindings, and SMTC poller
│   ├── package.json
│   └── vite.config.js
├── bom.csv                  # Itemized Bill of Materials
├── JOURNAL.md               # Engineering progress and sprint dev logs
└── README.md                # Project documentation

```

---

## Getting Started

### Prerequisites

* Node.js (v18.0.0 or later)
* npm or yarn
* Windows 10/11 64-bit

### Installation & Run

1. **Clone the repository:**
```bash
git clone [https://github.com/098tanishq-source/Aurabar.git](https://github.com/098tanishq-source/Aurabar.git)
cd Aurabar/aurabar-dashboard

```


2. **Install dependencies:**
```bash
npm install

```


3. **Development Mode (Vite Server):**
```bash
npm run dev

```


4. **Production Build & Electron Launch:**
```bash
npm run build
npm start

```



---

## Controls & Key Mappings

| Control / Input | Trigger | Default Action |
| --- | --- | --- |
| **EC11 Knob Rotation** | Clockwise / CCW | Windows Master Volume Up / Down |
| **EC11 Push Button** | Press | System Audio Mute / Unmute Toggle |
| **Key Switch 1** | Press | Media Play / Pause (`0xB3`) |
| **Key Switch 2** | Press | Media Next Track (`0xB0`) |
| **Key Switch 3** | Press | Media Previous Track (`0xB1`) |
| **Dock Proximity** | Cursor / Touch Bottom Edge | Reveals Floating Spring Dock |
| **Escape Key** | Keyboard Press | Closes Active Split / Exits AuraBar |

---

## License

This project is developed under the MIT License. See [LICENSE](https://www.google.com/search?q=LICENSE) for details.

```

```