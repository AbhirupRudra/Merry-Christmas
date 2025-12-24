# 🎄 MerryChristmas • Interactive Festive Experience

[![Version](https://img.shields.io/badge/version-1.0.0-rose.svg)](https://github.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google-gemini)](https://ai.google.dev/)

A magical, mobile-first Christmas web application designed to bring the spirit of the holidays to your fingertips. Built with cutting-edge web technologies, featuring AI-powered interactions and immersive synthesized audio.

---

## ✨ Experience the Magic

### 🎅 AI Santa Character
Tap Santa to hear a personalized greeting! Powered by **Google Gemini 2.5 Flash TTS**, Santa speaks with unique personality while his beard and suit animate in sync with his voice using real-time audio analysis.

### 🌲 The Curio Tree
An interactive decorating experience. 
- **Synthesized Audio**: No MP3 files required. Every ornament, bell, and the crowning star uses the **Web Audio API** to generate high-fidelity festive sounds dynamically.
- **Dynamic Glow**: The tree reacts to your touch, changing atmosphere as you decorate.

### 🎁 Enchanted Gifts
Discover hidden messages of joy. Each gift box features smooth 3D-perspective animations, custom physics-based confetti, and festive quotes to brighten your day.

### ✉️ Spirit Post
Send your Christmas wishes directly to the North Pole. 
- Integrated with **Firebase Firestore** for real-time wish delivery.
- Securely authenticated with **Firebase Auth**.

---

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/) (ESM modules)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with native snap-scrolling
- **AI/ML**: [Google Gemini API](https://ai.google.dev/) (@google/genai)
- **Backend**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **Audio**: Custom [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) Synthesis
- **Animations**: CSS3 Keyframes & SVG filter effects

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Safari, or Edge recommended for Audio API support)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation
1. Clone the repository
2. Set up your environment variables (Firebase config & Gemini API Key)
3. Open `index.html` via a local development server (like VS Code Live Server)

---

## 📱 Mobile-First Design
The app is optimized for a native mobile feel:
- **Snap-to-section** navigation.
- **Haptic feedback** via the Vibration API.
- **Zero-latency** interactive elements.
- **No-scroll body** lock for immersive full-screen experience.

---

## 📜 License
This project is for festive educational purposes. Spread the joy!

---

<p align="center">
  Made with ❤️ and ❄️ by a developer who loves Christmas.
</p>