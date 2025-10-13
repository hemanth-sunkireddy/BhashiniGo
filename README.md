# BhasiniGO – Mobile Application for Megathon Bhashini problem Statement

* [PPT Link](https://www.canva.com/design/DAG1qQskHpA/Awwo-aLZ-g62h8R-rtHFHw/edit?utm_content=DAG1qQskHpA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

This project is developed using **React Native CLI** with **TypeScript** for Android

* [APK and Demo Video Link](https://1drv.ms/f/c/dd419d073878fab6/EsPggOXr6LVPn5HTMaxqF_YBZZ4CGHYbEzI1VW6fdiVGdA?e=jKMihA)

---

## ⚙️ Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js (v18 or newer)** → [Download Node.js](https://nodejs.org/en/download/package-manager/)
- **npm (v10.7 or newer)** → [Download npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- **Java Development Kit (JDK) - v17** → [Download JDK](https://openjdk.org/)
- **Watchman** (optional but recommended) → [Install Watchman](https://facebook.github.io/watchman/docs/install#buildinstall)

For detailed setup instructions, refer to the [React Native documentation](https://reactnative.dev/docs/set-up-your-environment).

---

## 🤖 Android Setup

### 1. Install Android Studio

- [Download Android Studio](https://developer.android.com/studio/index.html)

### 2. Install Android SDK (API Level 34 - UpsideDownCake)

- Open **Android Studio**
- Go to **SDK Manager**
- Install **Android SDK version 14 (API level 34 - UpsideDownCake)**

Refer to the [React Native Android setup guide](https://reactnative.dev/docs/set-up-your-environment) for more information.

---

### 3. Preparing Your Android Device

You can run this app either on a **physical Android device** or an **Android emulator**.

#### **Option 1: Physical Device**
1. Connect your Android phone via USB.
2. Enable **Developer Options**:
   - Open **Settings → About Phone**
   - Tap **Build Number** seven times.
3. Enable **USB Debugging**:
   - Go to **Settings → Developer Options**
   - Turn on **USB Debugging**.

Refer to [React Native: Running on Device](https://reactnative.dev/docs/running-on-device) for detailed steps.

#### **Option 2: Emulator**
1. Open **Android Studio**
2. Go to **More Actions → Virtual Device Manager**
3. Click **Create Virtual Device**
4. Choose a device definition and click **Next**
5. Select a **system image (API Level 34 recommended)**
6. Configure AVD and click **Finish**

You can now launch the emulator and run your app.

For more details: [Managing AVDs](https://developer.android.com/studio/run/managing-avds.html)

---

## 🚀 Running the Application

Follow these steps to start the app on your Android device or emulator:

1. **Install dependencies**
   ```bash
   npm install
   ```
2. Run `npx react-native run-android` in one terminal.
3. Run `npx react-native start` in another terminall.

## 🌟 Main Features Implemented

### 🗣️ Real-time Speech-to-Speech Translation (S2S)
- Enables instant voice translation between **Hindi**, **Telugu**, and **English** using **Bhashini’s ASR and TTS models**.  
- Ideal for live interactions like **taxis**, **directions**, and **emergencies**.

### 🎧 Audio-to-Text Translation
- Converts spoken language (e.g., a local guide’s explanation) into **translated Hindi text** for better understanding.

### 📷 Optical Character Recognition (OCR) Translation
- Instantly scans and translates **printed or handwritten Telugu text** (menus, street signs, notices, prescriptions) into **Hindi**.

### 🌍 Multi-Scenario Usability
- Designed for **transport**, **tourism**, **dining**, and **medical** situations — ensuring **seamless communication** in real-world contexts.

### 📱 User-Friendly Interface
- Simple, **mobile-first UI** optimized for **quick and stress-free use** in dynamic environments.
