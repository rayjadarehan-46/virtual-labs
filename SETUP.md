# 🚀 QUICK START GUIDE - TERMINAL COMMANDS

## ✅ What's Already Done
- ✓ Backend FastAPI application created
- ✓ Frontend HTML/CSS/JS created
- ✓ Requirements file created
- ✓ Git setup ready

## 📋 NEXT STEPS - Run These Commands

### STEP 1: Navigate to Project (Open Terminal in VS Code)
```
cd virtual-labs
```

### STEP 2: Install Backend Dependencies
```
cd backend
pip install -r requirements.txt
```

This will install:
- fastapi
- uvicorn  
- numpy
- pydantic
- python-multipart

**Time**: ~1-2 minutes

### STEP 3: Start Backend Server
```
python main.py
```

**You should see:**
```
Uvicorn running on http://0.0.0.0:8000
```

**DO NOT CLOSE THIS TERMINAL**

### STEP 4: Open NEW Terminal (Keep backend running)
Press `Ctrl + Shift + ~` in VS Code to open another terminal

### STEP 5: Navigate to Frontend
```
cd frontend
```

### STEP 6: Start Frontend Server
```
python -m http.server 8080
```

**You should see:**
```
Serving HTTP on 0.0.0.0 port 8080 ...
```

### STEP 7: Open Browser
Visit: `http://localhost:8080`

You should see the LD College Virtual Labs interface!

---

## 📱 Using the Labs

1. **PN Junction Tab**: Adjust temperature and voltage range, click "Simulate"
2. **Zener Diode Tab**: Adjust Zener voltage and temperature, click "Simulate"  
3. **Four Probe Tab**: Enter voltage, current, distance, thickness, click "Calculate"

---

## 🔄 Git Commands (When ready)

### Stage and Commit All Changes
```
git add .
git commit -m "Initial virtual labs project - PN Junction, Zener, Four Probe"
```

### Push to GitHub
```
git push origin main
```

---

## 🛑 To Stop the Servers

In **Backend Terminal**: Press `Ctrl + C`
In **Frontend Terminal**: Press `Ctrl + C`

---

## ✨ Features

✓ Real-time interactive simulations
✓ Live graph plotting with Canvas API
✓ LD College of Engineering branding (Green, Black, White theme)
✓ Physics-accurate calculations
✓ Responsive design
✓ No dependencies needed on frontend (pure HTML/CSS/JS)

---

## 📞 Troubleshooting

### Issue: "pip install failed"
**Solution**: Make sure Python is added to PATH
```
python --version
```

### Issue: "Port 8000 already in use"
**Solution**: Use different port
```
python main.py
# Edit uvicorn.run port in main.py if needed
```

### Issue: "CORS error" (unlikely, but if it happens)
**Solution**: Backend already has CORS enabled, ensure it's running

### Issue: "Graph not showing"
**Solution**: 
- Open browser console (F12)
- Check if backend is running on localhost:8000
- Try refreshing page

---

## 📚 File Structure Created

```
virtual-labs/
├── backend/
│   ├── main.py                 # FastAPI backend (3 experiments)
│   └── requirements.txt         # Python packages
├── frontend/
│   ├── index.html              # Main interface
│   ├── styles.css              # Green/Black/White theme
│   └── script.js               # Simulations & graphs
├── README.md                   # Full documentation
├── SETUP.md                    # This file
└── .gitignore                  # Git ignore rules
```

---

## 🎓 Physics Formulas Implemented

### PN Junction
I = I_s × (e^(qV/kT) - 1)

### Zener Diode
Forward: Same as PN Junction
Reverse: Sharp breakdown at V_z

### Four Probe Resistivity
ρ = R × 2π × s × t
σ = 1/ρ

---

**Ready to run? Let's go!** 🧪

First terminal command:
```
cd virtual-labs/backend
pip install -r requirements.txt
```
