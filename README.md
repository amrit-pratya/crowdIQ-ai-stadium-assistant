# 🚀 CrowdIQ – AI-Powered Stadium Assistant

CrowdIQ is a real-time AI-powered stadium assistant that enhances the live event experience by helping users navigate crowds, find optimal entry gates, locate food stalls, and reach their seats efficiently using intelligent recommendations and map-based visualization.

---

## 🎯 Problem Statement

Large stadiums often face:
- 🚧 Heavy crowd congestion at gates  
- ⏳ Long wait times at food stalls  
- 🧭 Difficulty in seat navigation  
- ❌ Lack of real-time coordination  

CrowdIQ solves these problems using **AI + real-time data + map visualization**.

---

## 💡 Key Features

### 🤖 AI Assistant
- Powered by Hugging Face (Qwen model)
- Context-aware responses with memory
- Provides quick, actionable suggestions

---

### 📊 Real-Time Crowd Data (Firebase)
- Crowd data stored in **Firebase Firestore**
- Simulated real-time updates
- Backend fetches latest data dynamically

---

### 🔄 Live Updates
- Frontend auto-refreshes data every few seconds
- Map updates without user input
- Reflects changing crowd conditions

---

### 🧭 Seat Navigation System
- Detects seat queries (e.g., *B2, C1*)
- Provides directions from user location
- Instantly visualized on map

---

### 🗺️ Google Maps Integration
- Real-world map visualization
- Displays:
  - Entry gates
  - Seat sections
  - User position
- Highlights target seat and optimal gates

---

### 🎨 Premium UI/UX
- ChatGPT-style interface
- Animated typing indicator
- Smooth transitions and responsive layout
- Clean and modern design

---

## 🏗️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### AI
- Hugging Face Inference API (Qwen 2.5-72B)

### Cloud Services
- Firebase Firestore (real-time data)
- Google Maps JavaScript API

---

## 🏗️ Project Structure

```text
crowdIQ-ai-stadium-assistant/
├── backend/
│   ├── data/           # Mock datasets
│   ├── routes/         # Express API routes
│   ├── services/       # AI logic (aiService.js)
│   ├── firebase.js     # Firebase Admin initialization
│   ├── server.js       # Entry point
│   ├── updateData.js   # Script to simulate live crowd updates
│   └── package.json
├── frontend/
│   ├── index.html      # Main UI with Google Maps integration
│   ├── styles.css
│   ├── script.js       # Frontend logic & Map handling
│   └── CrowdIQ_logo.png
├── .gitignore          # Excludes .env and firebaseKey.json
├── README.md
└── package.json
```


---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/crowdIQ-ai-stadium-assistant.git
cd crowdIQ-ai-stadium-assistant
```

### 2. Install backend dependencies
```
cd backend
npm install
```
### 3. Setup environment variables

Create .env inside backend/:
```
HF_API_KEY=your_huggingface_api_key
PORT=5000
```
### 4. Setup Firebase
```
Create Firebase project
Enable Firestore
Download service account key
Place it in:
backend/firebaseKey.json
```
### 5. Run backend
```
node server.js
```
### 6. Simulate real-time data (optional)
```
node updateData.js
```
### 7. Setup Google Maps

Get API key from Google Cloud
Enable Maps JavaScript API
Add key in index.html:
```
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
```
### 8. Run frontend

Use Live Server (VS Code):

Right-click index.html → Open with Live Server

## 🧪 Example Queries

- “Which gate is fastest?”
- “Where is seat B2?”
- “Best food stall near me?”
- “How to reach C1 from Gate A?”

---

## 🧠 How It Works

1. User sends a query  
2. Backend:
   - Fetches real-time data from Firebase  
   - Processes query  
   - Calls AI (if needed)  
3. AI generates response  
4. Frontend:
   - Displays response  
   - Updates map (if seat query)  
   - Highlights optimal routes  

---

## 🔐 Security

- API keys stored in `.env`  
- `.env` excluded via `.gitignore`  
- Firebase credentials not committed  
- Google Maps API key restricted by domain  

---

## 📈 Evaluation Criteria Coverage

| Criteria | Implementation |
|--------|---------------|
| Code Quality | Modular structure, clean separation |
| Security | Environment variables, restricted API keys |
| Efficiency | Smart fallback + minimal API calls |
| Real-Time Capability | Firebase + polling updates |
| Accessibility | Simple and intuitive UI |
| Google Services | Firebase + Google Maps integration |

---

## 🚀 Future Enhancements

- Live GPS-based navigation  
- Route path visualization on map  
- Congestion heatmaps  
- Google Places API for real vendors  
- Push notifications for alerts  
- Multi-user simulation  

---

## 🎤 Demo Pitch (Short)

CrowdIQ is an AI-powered stadium assistant that improves crowd flow, reduces waiting time, and helps users navigate to their seats using real-time data and map-based visualization.

---

## 👨‍💻 Author

Amrit Pratya

---

## ⭐ If you like this project

Give it a star ⭐ and share feedback!
