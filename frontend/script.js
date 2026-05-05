const API_URL = "https://virtual-labs-7o4w.onrender.com/api";

// Store readings for tables
let readingsStore = {
    pn: [],
    zener: [],
    fourprobe: [],
    laserDiv: [],
    laserDist: [],
    wavelength: []
};
function switchExperiment(experiment) {
    // Hide all sections
    document.querySelectorAll(".experiment-section").forEach(section => {
        section.classList.remove("active");
    });

    // Remove active class from all nav links
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    // Show selected section
    if (experiment === "pn") {
        document.getElementById("pn-section").classList.add("active");
    } else if (experiment === "zener") {
        document.getElementById("zener-section").classList.add("active");
    } else if (experiment === "fourprobe") {
        document.getElementById("fourprobe-section").classList.add("active");
    } else if (experiment === "laser-div") {
        document.getElementById("laser-div-section").classList.add("active");
    } else if (experiment === "laser-dist") {
        document.getElementById("laser-dist-section").classList.add("active");
    } else if (experiment === "wavelength") {
        document.getElementById("wavelength-section").classList.add("active");
    }

    // Set active nav link
    event.target.classList.add("active");
}

// ===== UPDATE READINGS TABLE =====
function updateReadingsTable(experimentId, data) {
    if (experimentId === "fourprobe") {
        const tbody = document.getElementById("fourprobe-readings");
        if (tbody.querySelector('.empty')) {
            tbody.innerHTML = '';
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${readingsStore.fourprobe.length + 1}</td>
            <td>${data.voltage}</td>
            <td>${data.current}</td>
            <td>${data.resistivity_ohm_m.toExponential(3)}</td>
        `;
        tbody.appendChild(row);
    }
}

function addReadingRow(tableId, values) {
    const tbody = document.getElementById(tableId);
    
    // Remove empty placeholder row
    const emptyRow = tbody.querySelector('tr .empty');
    if (emptyRow) {
        tbody.innerHTML = '';
    }
    
    // Count actual data rows
    const rowCount = tbody.querySelectorAll('tr').length;
    
    const row = document.createElement('tr');
    row.innerHTML = `<td>${rowCount + 1}</td>`;
    values.forEach(val => {
        const value = typeof val === 'number' ? val.toFixed(4) : val;
        row.innerHTML += `<td>${value}</td>`;
    });
    tbody.appendChild(row);
}

// ===== LIVE VALUE DISPLAY UPDATES =====
document.addEventListener("DOMContentLoaded", () => {
    // PN Junction setup
    const pnType = document.getElementById("pn-type");
    if (pnType) {
        pnType.addEventListener("change", updatePNInfo);
    }

    // Zener setup
    const zenerType = document.getElementById("zener-type");
    if (zenerType) {
        zenerType.addEventListener("change", updateZenerInfo);
    }

    updatePNInfo();
    updateZenerInfo();

    // Initial simulations for other experiments
    if (document.getElementById("fourprobe-readings")) {
        // Four probe doesn't auto-simulate
    }
});

// ===== PN JUNCTION FUNCTIONS =====
function updatePNInfo() {
    const type = document.getElementById("pn-type").value;
    const hintEl = document.getElementById("pn-voltage-hint");
    const infoEl = document.getElementById("pn-info-text");
    const voltageInput = document.getElementById("pn-voltage");

    if (type === "forward") {
        hintEl.textContent = "Range: 0 to 1V";
        infoEl.textContent = "Forward bias: Apply positive voltage to see exponential increase in current. Record 10 different voltage values.";
        voltageInput.min = "0";
        voltageInput.max = "1";
        voltageInput.value = "0.5";
    } else {
        hintEl.textContent = "Range: -0.2 to 0V";
        infoEl.textContent = "Reverse bias: Apply negative voltage to observe saturation current. Record 10 different voltage values.";
        voltageInput.min = "-0.2";
        voltageInput.max = "0";
        voltageInput.value = "-0.1";
    }
}

async function recordPNReading() {
    const voltage = parseFloat(document.getElementById("pn-voltage").value);
    const temperature = parseFloat(document.getElementById("pn-temperature").value);

    try {
        const response = await fetch(`${API_URL}/pn-junction-single`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                voltage: voltage,
                temperature: temperature
            })
        });

        const data = await response.json();
        
        // Add to readings
        readingsStore.pn.push({
            voltage: data.voltage,
            current: data.current
        });

        // Update display
        const tbody = document.getElementById("pn-readings");
        if (tbody.querySelector('.empty')) {
            tbody.innerHTML = '';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${readingsStore.pn.length}</td>
            <td>${data.voltage.toFixed(4)}</td>
            <td>${data.current.toFixed(4)}</td>
        `;
        tbody.appendChild(row);

        // Update counter
        document.getElementById("pn-count").textContent = readingsStore.pn.length;

        // If 10 readings, show graph
        if (readingsStore.pn.length === 10) {
            showPNGraph();
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error recording reading");
    }
}

function clearPNReadings() {
    readingsStore.pn = [];
    document.getElementById("pn-readings").innerHTML = '<tr><td colspan="3" class="empty">No readings yet</td></tr>';
    document.getElementById("pn-count").textContent = "0";
    document.getElementById("pn-graph-container").style.display = "none";
}

function showPNGraph() {
    const voltages = readingsStore.pn.map(r => r.voltage);
    const currents = readingsStore.pn.map(r => r.current);
    
    document.getElementById("pn-graph-container").style.display = "block";
    plotGraph("pn-canvas", voltages, currents, "Voltage (V)", "Current (mA)", "PN Junction Diode - Your Readings");
}

// ===== ZENER DIODE FUNCTIONS =====
function updateZenerInfo() {
    const type = document.getElementById("zener-type").value;
    const hintEl = document.getElementById("zener-voltage-hint");
    const infoEl = document.getElementById("zener-info-text");
    const voltageInput = document.getElementById("zener-voltage");

    if (type === "forward") {
        hintEl.textContent = "Range: 0 to 0.7V";
        infoEl.textContent = "Forward bias: Zener acts like normal diode. Record 10 voltage values to see the forward curve.";
        voltageInput.min = "0";
        voltageInput.max = "0.7";
        voltageInput.value = "0.3";
    } else {
        hintEl.textContent = "Range: -6 to 0V";
        infoEl.textContent = "Reverse bias: Observe breakdown at Zener voltage. Record 10 different voltage values including breakdown region.";
        voltageInput.min = "-6";
        voltageInput.max = "0";
        voltageInput.value = "-3";
    }
}

async function recordZenerReading() {
    const voltage = parseFloat(document.getElementById("zener-voltage").value);
    const zenerVz = parseFloat(document.getElementById("zener-vz").value);
    const temperature = parseFloat(document.getElementById("zener-temperature").value);

    try {
        const response = await fetch(`${API_URL}/zener-diode-single`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                voltage: voltage,
                zener_voltage: zenerVz,
                temperature: temperature
            })
        });

        const data = await response.json();
        
        // Add to readings
        readingsStore.zener.push({
            voltage: data.voltage,
            current: data.current
        });

        // Update display
        const tbody = document.getElementById("zener-readings");
        if (tbody.querySelector('.empty')) {
            tbody.innerHTML = '';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${readingsStore.zener.length}</td>
            <td>${data.voltage.toFixed(4)}</td>
            <td>${data.current.toFixed(4)}</td>
        `;
        tbody.appendChild(row);

        // Update counter
        document.getElementById("zener-count").textContent = readingsStore.zener.length;

        // If 10 readings, show graph
        if (readingsStore.zener.length === 10) {
            showZenerGraph();
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error recording reading");
    }
}

function clearZenerReadings() {
    readingsStore.zener = [];
    document.getElementById("zener-readings").innerHTML = '<tr><td colspan="3" class="empty">No readings yet</td></tr>';
    document.getElementById("zener-count").textContent = "0";
    document.getElementById("zener-graph-container").style.display = "none";
}

function showZenerGraph() {
    const voltages = readingsStore.zener.map(r => r.voltage);
    const currents = readingsStore.zener.map(r => r.current);
    
    document.getElementById("zener-graph-container").style.display = "block";
    plotGraph("zener-canvas", voltages, currents, "Voltage (V)", "Current (mA)", "Zener Diode - Your Readings");
}

// ===== FOUR PROBE CALCULATION =====
async function calculateFourProbe() {
    const voltage = parseFloat(document.getElementById("fp-voltage").value);
    const current = parseFloat(document.getElementById("fp-current").value);
    const distance = parseFloat(document.getElementById("fp-distance").value);
    const thickness = parseFloat(document.getElementById("fp-thickness").value);

    if (voltage <= 0 || current <= 0 || distance <= 0 || thickness <= 0) {
        alert("Please enter valid positive values");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/four-probe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                voltage: voltage,
                current: current,
                distance: distance,
                thickness: thickness
            })
        });

        const data = await response.json();

        // Update results
        document.getElementById("fp-resistance").textContent = data.resistance_ohms.toFixed(4);
        document.getElementById("fp-resistivity").textContent = data.resistivity_ohm_m.toExponential(3);
        document.getElementById("fp-conductivity").textContent = data.conductivity_siemens_m.toExponential(3);
        document.getElementById("fp-sheet").textContent = data.sheet_resistance_ohms_per_square.toFixed(4);

        // Add reading
        addReadingRow("fourprobe-readings", [
            voltage,
            current,
            data.resistivity_ohm_m
        ]);
    } catch (error) {
        console.error("Error:", error);
        alert("Error calculating resistivity");
    }
}

// ===== LASER DIVERGENCE CALCULATION =====
async function calculateLaserDivergence() {
    const wavelength = parseFloat(document.getElementById("ld-wavelength").value);
    const diameter = parseFloat(document.getElementById("ld-diameter").value);
    const distance = parseFloat(document.getElementById("ld-distance").value);

    try {
        const response = await fetch(`${API_URL}/laser-divergence`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                wavelength: wavelength,
                beam_diameter: diameter,
                distance: distance
            })
        });

        const data = await response.json();

        document.getElementById("ld-angle").textContent = data.divergence_angle_deg.toFixed(4);
        document.getElementById("ld-beam-dia").textContent = data.beam_diameter_at_distance.toFixed(2);

        addReadingRow("laser-div-readings", [
            wavelength,
            distance,
            data.beam_diameter_at_distance
        ]);
    } catch (error) {
        console.error("Error:", error);
    }
}

// ===== LASER DISTANCE METER CALCULATION =====
async function calculateLaserDistance() {
    const tof = parseFloat(document.getElementById("ldm-tof").value);

    try {
        const response = await fetch(`${API_URL}/laser-distance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                time_of_flight: tof
            })
        });

        const data = await response.json();

        document.getElementById("ldm-distance").textContent = data.distance_meters.toFixed(4);
        document.getElementById("ldm-distance-cm").textContent = data.distance_cm.toFixed(2);

        addReadingRow("laser-dist-readings", [
            tof,
            data.distance_meters,
            data.distance_cm
        ]);
    } catch (error) {
        console.error("Error:", error);
    }
}

// ===== WAVELENGTH CALCULATION =====
async function calculateWavelength() {
    const order = parseInt(document.getElementById("wdg-order").value);
    const spacing = parseFloat(document.getElementById("wdg-spacing").value);
    const angle = parseFloat(document.getElementById("wdg-angle").value);

    try {
        const response = await fetch(`${API_URL}/wavelength-diffraction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                order: order,
                grating_spacing: spacing,
                diffraction_angle: angle
            })
        });

        const data = await response.json();

        document.getElementById("wdg-wavelength").textContent = data.wavelength_nm.toFixed(2);

        addReadingRow("wavelength-readings", [
            order,
            angle,
            data.wavelength_nm
        ]);
    } catch (error) {
        console.error("Error:", error);
    }
}

// ===== CANVAS GRAPH PLOTTING =====
function plotGraph(canvasId, xData, yData, xLabel, yLabel, title) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error("Canvas not found:", canvasId);
        return;
    }
    
    const ctx = canvas.getContext("2d");

    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth - 20;
    canvas.height = 400;

    // Find data ranges
    const xMin = Math.min(...xData);
    const xMax = Math.max(...xData);
    const yMin = Math.min(...yData);
    const yMax = Math.max(...yData);

    // Margins
    const margin = { top: 40, right: 40, bottom: 60, left: 70 };
    const plotWidth = canvas.width - margin.left - margin.right;
    const plotHeight = canvas.height - margin.top - margin.bottom;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        // Vertical grid
        const x = margin.left + (i / 10) * plotWidth;
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, canvas.height - margin.bottom);
        ctx.stroke();

        // Horizontal grid
        const y = margin.top + (i / 10) * plotHeight;
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(canvas.width - margin.right, y);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, canvas.height - margin.bottom);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(xLabel, canvas.width / 2, canvas.height - 20);

    ctx.save();
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Draw title
    ctx.font = "bold 16px Arial";
    ctx.fillText(title, canvas.width / 2, 25);

    // Scale function
    function scaleX(value) {
        return margin.left + ((value - xMin) / (xMax - xMin)) * plotWidth;
    }

    function scaleY(value) {
        return canvas.height - margin.bottom - ((value - yMin) / (yMax - yMin)) * plotHeight;
    }

    // Draw curve
    ctx.strokeStyle = "#1e7e34";
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    for (let i = 0; i < xData.length; i++) {
        const x = scaleX(xData[i]);
        const y = scaleY(yData[i]);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    // Draw axis tick marks and labels
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";

    // X-axis ticks
    for (let i = 0; i <= 10; i++) {
        const value = xMin + (i / 10) * (xMax - xMin);
        const x = scaleX(value);
        ctx.fillText(value.toFixed(2), x, canvas.height - margin.bottom + 20);

        // Tick marks
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - margin.bottom);
        ctx.lineTo(x, canvas.height - margin.bottom + 5);
        ctx.stroke();
    }

    // Y-axis ticks
    ctx.textAlign = "right";
    for (let i = 0; i <= 10; i++) {
        const value = yMin + (i / 10) * (yMax - yMin);
        const y = scaleY(value);
        ctx.fillText(value.toFixed(3), margin.left - 10, y + 4);

        // Tick marks
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin.left - 5, y);
        ctx.lineTo(margin.left, y);
        ctx.stroke();
    }

    // Draw data points
    ctx.fillStyle = "#2d9645";
    for (let i = 0; i < xData.length; i += Math.max(1, Math.floor(xData.length / 50))) {
        const x = scaleX(xData[i]);
        const y = scaleY(yData[i]);

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
}
