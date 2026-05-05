# Virtual Labs - LD College of Engineering

Virtual Physics Laboratory for Semester 2 Physics Experiments

## 📋 Experiments Included

1. **PN Junction Diode** - V-I Characteristics using Shockley Equation
2. **Zener Diode** - Reverse bias breakdown characteristics
3. **Four Probe Resistivity** - Material resistivity measurement

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Canvas API)
- **Backend**: Python FastAPI
- **Server**: Uvicorn

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+ (Already installed)
- Git (Already installed)
- Modern web browser

### Step 1: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs:
- fastapi
- uvicorn
- numpy
- pydantic

### Step 2: Start the Backend Server

```bash
cd backend
python main.py
```

The backend will start at `http://localhost:8000`

**Expected output:**
```
Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Step 3: Open Frontend

Open `frontend/index.html` in your web browser:
- Simply double-click the file, OR
- Use a local server (recommended):

```bash
# From the frontend directory
python -m http.server 8080
```

Then visit: `http://localhost:8080`

## 📁 Project Structure

```
virtual-labs/
├── backend/
│   ├── main.py                 # FastAPI application
│   └── requirements.txt         # Python dependencies
└── frontend/
    ├── index.html              # Main HTML
    ├── styles.css              # Styling (Green, Black, White theme)
    └── script.js               # JavaScript logic & Canvas graphs
```

## 🎨 Theme

- **Primary Color**: Green (#1e7e34)
- **Secondary Color**: Dark Green (#2d9645)
- **Background**: White (#ffffff)
- **Text**: Dark (#1a1a1a)
- **Header**: LD COLLEGE OF ENGINEERING

## 🚀 Features

- **Interactive Simulations**: Real-time parameter adjustment
- **Live Graphs**: Canvas-based plotting with grid
- **Physics Calculations**: Accurate physics models
- **Responsive Design**: Works on desktop and tablets
- **College Branding**: Official LD College theme

## 📊 Experiment Details

### PN Junction Diode
- Uses Shockley ideal diode equation
- Adjustable temperature and voltage range
- Shows forward bias conduction and reverse saturation

**Equation**: I = I_s × (e^(qV/kT) - 1)

### Zener Diode
- Models reverse bias breakdown
- Adjustable Zener voltage (2-12V)
- Shows sharp breakdown characteristics

### Four Probe Resistivity
- Calculates resistivity from voltage and current measurements
- Accounts for probe spacing and sample thickness
- Shows resistance, resistivity, conductivity, and sheet resistance

**Formula**: ρ = R × 2π × s × t

## ⚙️ API Endpoints

### PN Junction Diode
**POST** `/api/pn-junction`

Request:
```json
{
  "temperature": 300,
  "v_range_max": 1.0,
  "points": 100
}
```

Response:
```json
{
  "voltages": [...],
  "currents": [...],
  "V_t": 0.026,
  "I_s": 1e-14
}
```

### Zener Diode
**POST** `/api/zener-diode`

Request:
```json
{
  "zener_voltage": 5.0,
  "temperature": 300,
  "points": 100
}
```

### Four Probe Resistivity
**POST** `/api/four-probe`

Request:
```json
{
  "voltage": 1.0,
  "current": 0.01,
  "distance": 0.001,
  "thickness": 0.0001
}
```

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
# Try with different port: python main.py --host 0.0.0.0 --port 9000
```

### CORS errors
- Backend already has CORS enabled
- Ensure backend is running on localhost:8000

### Graphs not showing
- Check browser console (F12) for JavaScript errors
- Ensure canvas is supported (all modern browsers)

## 📝 Notes

- Backend should run continuously while using the lab
- Frontend is purely client-side once backend is running
- All calculations are physics-accurate
- Supports live parameter adjustment and real-time updates

## 👨‍💼 Created by
LD College of Engineering - Physics Department
Virtual Labs Project - Semester 2

---

**Happy experimenting! 🧪**
