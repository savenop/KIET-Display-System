# 🎓 KIET CS Department Digital Display System

A high-fidelity digital signage application engineered for the Computer Science Department at KIET University. This system is designed for large-format kiosk displays, featuring a ceremonial "Inauguration Mode" and an automated content cycle that highlights department news, student achievements (Wall of Fame), and upcoming events.

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Tech Stack](https://img.shields.io/badge/Stack-MERN%20(Frontend)-blue)

## ✨ Key Features

### 🚀 Inauguration Mode (Ceremonial Launch)
- **Smart Pre-fetching:** The system remains in a "Waiting" state, silently loading all API data (News, Awards, Events) in the background.
- **Interactive Launch:** Features a "Inaugurate Display" button that activates only when all systems are healthy.
- **Visual Effects:** Triggers a `canvas-confetti` celebration animation upon launch before transitioning to the main content.
- **Graceful Error Handling:** If APIs fail (e.g., 503 Service Unavailable), the launch button transforms into a "Retry" mechanism, preventing the audience from seeing broken data or loading spinners.

### 📺 Automated Slideshow Engine
The application auto-cycles through four main modules:
1.  **News:** Latest department updates with visual context or auto-generated gradients.
2.  **Wall of Fame (Awards):** Highlights student achievements (1st, 2nd, 3rd place) with dynamic Gold, Silver, and Bronze theming.
3.  **Events:** Displays posters and videos of recent or upcoming events.
4.  **Opportunities:** Internship and job opportunity highlights.

### 🛠 Technical Highlights
- **Global State Persistence:** Caching logic in `Event.jsx` and `Award.jsx` ensures the slideshow remembers its last index when cycling back, rather than resetting to the first slide every time.
- **Resilient Media Loading:** Automatic fallbacks for broken image links, converting Google Drive view links to direct image sources, and fallback gradients if images fail to load.
- **Keyboard Control:**
    - `N` or `ArrowRight`: Next Slide
    - `P` or `ArrowLeft`: Previous Slide

---

## 🏗 Tech Stack

This project is built using modern frontend tooling for maximum performance and visual fidelity.

### Core Framework
- **[React.js (v18+)](https://react.dev/)**: Component-based UI library.
- **[Vite](https://vitejs.dev/)**: Next Generation Frontend Tooling for fast HMR and optimized builds.

### Styling & Animation
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid styling.
- **[Framer Motion](https://www.framer.com/motion/)**: Production-ready motion library for complex animations (transitions, entering/exiting slides).
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)**: Lightweight confetti animations for the inauguration sequence.

### Data & Networking
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client.
    - *Implementation Note:* Uses `Promise.allSettled` to ensure the application launches even if specific API endpoints fail, preventing a total system crash.

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 2. Clone the Repository
```bash
git clone [https://github.com/your-username/kiet-display-system.git](https://github.com/your-username/kiet-display-system.git)
cd kiet-display-system
