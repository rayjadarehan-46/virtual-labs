from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== PN JUNCTION DIODE =====
class PNJunctionInput(BaseModel):
    temperature: float = 300
    v_range_max: float = 1.0
    points: int = 100

class PNSinglePoint(BaseModel):
    voltage: float
    temperature: float = 300

@app.post("/api/pn-junction")
def calculate_pn_junction(data: PNJunctionInput):
    """Calculate PN Junction diode V-I characteristics using Shockley equation"""
    T = data.temperature
    V_t = 0.026 * (T / 300)  # Thermal voltage
    I_s = 1e-14  # Saturation current in Amperes
    q = 1.6e-19
    k = 1.38e-23
    
    V = np.linspace(-0.2, data.v_range_max, data.points)
    I = np.zeros_like(V)
    
    for i, v in enumerate(V):
        if v >= 0:
            # Forward bias: I = I_s * (exp(qV/kT) - 1)
            I[i] = I_s * (np.exp(v / V_t) - 1) * 1e3  # Convert to mA
        else:
            # Reverse bias
            I[i] = -I_s * 1e3  # Saturation current
    
    return {
        "voltages": V.tolist(),
        "currents": I.tolist(),
        "V_t": V_t,
        "I_s": I_s
    }

@app.post("/api/pn-junction-single")
def calculate_pn_single_point(data: PNSinglePoint):
    """Calculate current for a single voltage point"""
    T = data.temperature
    V_t = 0.026 * (T / 300)
    I_s = 1e-14
    
    if data.voltage >= 0:
        I = I_s * (np.exp(data.voltage / V_t) - 1) * 1e3
    else:
        I = -I_s * 1e3
    
    return {
        "voltage": data.voltage,
        "current": float(I),
        "V_t": V_t,
        "I_s": I_s
    }

# ===== ZENER DIODE =====
class ZenerDiodeInput(BaseModel):
    zener_voltage: float = 5.0
    temperature: float = 300
    points: int = 100

class ZenerSinglePoint(BaseModel):
    voltage: float
    zener_voltage: float = 5.0
    temperature: float = 300

@app.post("/api/zener-diode")
def calculate_zener_diode(data: ZenerDiodeInput):
    """Calculate Zener Diode V-I characteristics"""
    T = data.temperature
    V_t = 0.026 * (T / 300)
    I_s = 1e-14
    V_z = data.zener_voltage
    
    V = np.linspace(-V_z - 2, 0.7, data.points)
    I = np.zeros_like(V)
    
    for i, v in enumerate(V):
        if v >= 0:
            # Forward bias (normal diode)
            I[i] = I_s * (np.exp(v / V_t) - 1) * 1e3
        else:
            # Reverse bias with Zener breakdown
            if v <= -V_z:
                # Zener breakdown region - sharp increase
                breakdown_factor = 1 + (abs(v) - V_z) / 0.5
                I[i] = -(I_s * 1e3) - (breakdown_factor ** 2) * 10
            else:
                # Before breakdown - saturation current
                I[i] = -I_s * 1e3
    
    return {
        "voltages": V.tolist(),
        "currents": I.tolist(),
        "zener_voltage": V_z,
        "breakdown_point": -V_z
    }

@app.post("/api/zener-diode-single")
def calculate_zener_single_point(data: ZenerSinglePoint):
    """Calculate current for a single voltage point"""
    T = data.temperature
    V_t = 0.026 * (T / 300)
    I_s = 1e-14
    V_z = data.zener_voltage
    v = data.voltage
    
    if v >= 0:
        I = I_s * (np.exp(v / V_t) - 1) * 1e3
    else:
        if v <= -V_z:
            breakdown_factor = 1 + (abs(v) - V_z) / 0.5
            I = -(I_s * 1e3) - (breakdown_factor ** 2) * 10
        else:
            I = -I_s * 1e3
    
    return {
        "voltage": v,
        "current": float(I),
        "zener_voltage": V_z,
        "V_t": V_t
    }

# ===== FOUR PROBE RESISTIVITY =====
class FourProbeInput(BaseModel):
    voltage: float  # Applied voltage in V
    current: float  # Measured current in A
    distance: float  # Distance between probes in meters
    thickness: float  # Thickness of sample in meters

@app.post("/api/four-probe")
def calculate_four_probe_resistivity(data: FourProbeInput):
    """Calculate resistivity using Four Probe method"""
    V = data.voltage
    I = data.current
    s = data.distance
    t = data.thickness
    
    # Resistance
    R = V / I if I != 0 else 0
    
    # Geometric factor for collinear probe configuration
    G = 2 * np.pi * s
    
    # Resistivity = R * G * t
    resistivity = R * G * t
    
    # Sheet resistance
    sheet_resistance = R
    
    # Conductivity
    conductivity = 1 / resistivity if resistivity != 0 else 0
    
    return {
        "resistance_ohms": round(R, 6),
        "resistivity_ohm_m": round(resistivity, 6),
        "conductivity_siemens_m": round(conductivity, 6),
        "sheet_resistance_ohms_per_square": round(sheet_resistance, 6),
        "geometric_factor": G
    }

# ===== LASER DIVERGENCE =====
class LaserDivergenceInput(BaseModel):
    wavelength: float  # in nanometers
    beam_diameter: float  # in millimeters
    distance: float  # in meters

@app.post("/api/laser-divergence")
def calculate_laser_divergence(data: LaserDivergenceInput):
    """Calculate laser beam divergence"""
    wavelength = data.wavelength * 1e-9  # Convert nm to m
    diameter = data.beam_diameter * 1e-3  # Convert mm to m
    distance = data.distance
    
    # Divergence angle (in radians) = 4 * lambda / (pi * d)
    divergence_angle_rad = (4 * wavelength) / (np.pi * diameter)
    divergence_angle_deg = np.degrees(divergence_angle_rad)
    
    # Beam radius at distance z
    beam_radius_at_z = (diameter / 2) + (distance * np.tan(divergence_angle_rad))
    beam_diameter_at_z = beam_radius_at_z * 2
    
    return {
        "divergence_angle_rad": round(divergence_angle_rad, 6),
        "divergence_angle_deg": round(divergence_angle_deg, 4),
        "beam_diameter_at_distance": round(beam_diameter_at_z * 1e3, 4),
        "wavelength_nm": data.wavelength,
        "initial_diameter_mm": data.beam_diameter,
        "distance_m": distance
    }

# ===== LASER DISTANCE METER =====
class LaserDistanceMeterInput(BaseModel):
    time_of_flight: float  # in microseconds
    speed_of_light: float = 3e8  # m/s

@app.post("/api/laser-distance")
def calculate_laser_distance(data: LaserDistanceMeterInput):
    """Calculate distance using time of flight"""
    tof = data.time_of_flight * 1e-6  # Convert microseconds to seconds
    c = data.speed_of_light
    
    # Distance = (speed * time) / 2 (divide by 2 because light travels to object and back)
    distance = (c * tof) / 2
    
    return {
        "distance_meters": round(distance, 4),
        "distance_cm": round(distance * 100, 2),
        "distance_mm": round(distance * 1000, 2),
        "time_of_flight_us": data.time_of_flight,
        "speed_of_light": c
    }

# ===== WAVELENGTH BY DIFFRACTION GRATING =====
class WavelengthDiffractionInput(BaseModel):
    order: int  # Diffraction order (1, 2, 3...)
    grating_spacing: float  # in micrometers (d)
    diffraction_angle: float  # in degrees
    distance_to_screen: float = None  # Optional
    fringe_distance: float = None  # Optional

@app.post("/api/wavelength-diffraction")
def calculate_wavelength_diffraction(data: WavelengthDiffractionInput):
    """Calculate wavelength using diffraction grating"""
    m = data.order
    d = data.grating_spacing * 1e-6  # Convert micrometers to meters
    theta = np.radians(data.diffraction_angle)
    
    # Grating equation: d * sin(theta) = m * lambda
    wavelength = (d * np.sin(theta)) / m
    wavelength_nm = wavelength * 1e9  # Convert to nanometers
    
    result = {
        "wavelength_nm": round(wavelength_nm, 2),
        "wavelength_m": round(wavelength, 10),
        "order": m,
        "grating_spacing_um": data.grating_spacing,
        "diffraction_angle_deg": data.diffraction_angle
    }
    
    # If distance and fringe distance provided, calculate wavelength alternative way
    if data.distance_to_screen and data.fringe_distance:
        L = data.distance_to_screen
        y = data.fringe_distance
        # tan(theta) = y/L
        theta_alt = np.arctan(y / L)
        wavelength_alt = (d * np.sin(theta_alt)) / m
        result["wavelength_nm_alt"] = round(wavelength_alt * 1e9, 2)
        result["calculated_angle_deg"] = round(np.degrees(theta_alt), 4)
    
    return result

# ===== HEALTH CHECK =====
@app.get("/api/health")
def health_check():
    return {"status": "Backend running successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
