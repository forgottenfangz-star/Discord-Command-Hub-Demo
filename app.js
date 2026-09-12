const units = [
  {
    id: "NZP-21",
    dept: "NZP",
    name: "2A-21",
    vehicle: "Ford Explorer",
    reg: "NZP-201",
    speed: 82,
    heading: "North",
    x: 32,
    y: 38,
    icon: "🚓",
    status: "Available"
  },
  {
    id: "NZP-17",
    dept: "NZP",
    name: "4A-17",
    vehicle: "BMW M5",
    reg: "NZP-417",
    speed: 64,
    heading: "East",
    x: 58,
    y: 30,
    icon: "🚓",
    status: "En Route"
  },
  {
    id: "FENZ-12",
    dept: "FENZ",
    name: "12",
    vehicle: "Scania P-Series",
    reg: "FENZ-12",
    speed: 51,
    heading: "South",
    x: 72,
    y: 62,
    icon: "🚒",
    status: "Available"
  },
  {
    id: "STJ-104",
    dept: "STJ",
    name: "104",
    vehicle: "Mercedes Sprinter",
    reg: "STJ-104",
    speed: 58,
    heading: "West",
    x: 44,
    y: 68,
    icon: "🚑",
    status: "On Scene"
  },
  {
    id: "DOT-88",
    dept: "DOT",
    name: "88",
    vehicle: "Toyota Hilux",
    reg: "DOT-88",
    speed: 43,
    heading: "North",
    x: 20,
    y: 72,
    icon: "🚧",
    status: "Available"
  }
];

let calls = [
  {
    id: "CALL-001",
    type: "Traffic Collision",
    location: "Liberty County Highway",
    priority: "HIGH",
    units: ["NZP-17", "STJ-104"]
  },
  {
    id: "CALL-002",
    type: "Structure Fire",
    location: "Central Liberty County",
    priority: "CRITICAL",
    units: ["FENZ-12"]
  }
];

let selectedUnit = null;
let currentFilter = "ALL";

/* NAVIGATION */

function openPage(page) {

  document.querySelectorAll(".page").forEach(section => {
    section.classList.remove("active");
  });

  document.querySelectorAll(".nav").forEach(button => {
    button.classList.remove("active");
  });

  const target = document.getElementById(page);

  if (target) {
    target.classList.add("active");
  }

  const nav = document.querySelector(`[data-page="${page}"]`);

  if (nav) {
    nav.classList.add("active");
  }

  const titles = {
    overview: "Overview",
    map: "Live Map",
    dispatch: "Dispatch",
    units: "Units",
    departments: "Departments",
    reports: "Reports",
    applications: "Applications",
    watchdog: "AI Watchdog",
    management: "Management"
  };

  document.getElementById("pageTitle").textContent =
    titles[page] || "Command Hub";
}

document.querySelectorAll(".nav").forEach(button => {

  button.addEventListener("click", () => {
    openPage(button.dataset.page);
  });

});

/* FILTERS */

document.querySelectorAll(".filter").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".filter").forEach(b => {
      b.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderMap();
    renderUnitList();
  });

});

/* MAP */

function renderMap() {

  const container = document.getElementById("markers");

  container.innerHTML = "";

  const filtered = units.filter(unit => {
    return currentFilter === "ALL" ||
      unit.dept === currentFilter;
  });

  filtered.forEach(unit => {

    const marker = document.createElement("button");

    marker.className = `marker ${unit.dept}`;

    marker.style.left = `${unit.x}%`;
    marker.style.top = `${unit.y}%`;

    marker.innerHTML = unit.icon;

    marker.title = `${unit.dept} ${unit.name}`;

    marker.addEventListener("click", () => {
      selectUnit(unit);
    });

    container.appendChild(marker);

  });

}

/* UNIT LIST */

function renderUnitList() {

  const lists = [
    document.getElementById("unitList"),
    document.getElementById("overviewUnits"),
    document.getElementById("allUnits")
  ];

  const filtered = units.filter(unit => {
    return currentFilter === "ALL" ||
      unit.dept === currentFilter;
  });

  lists.forEach(list => {

    if (!list) return;

    list.innerHTML = "";

    filtered.forEach(unit => {

      const element = document.createElement("div");

      element.className = "unit";

      element.innerHTML = `
        <div class="unit-icon">${unit.icon}</div>

        <div class="unit-main">
          <strong>${unit.dept} ${unit.name}</strong>
          <span>${unit.vehicle} · ${unit.status}</span>
        </div>

        <div class="unit-speed">
          ${unit.speed} km/h
        </div>
      `;

      element.addEventListener("click", () => {
        selectUnit(unit);
        openPage("map");
      });

      list.appendChild(element);

    });

  });

  document.getElementById("unitCount").textContent =
    `${filtered.length} unit${filtered.length === 1 ? "" : "s"}`;

  document.getElementById("statUnits").textContent =
    units.length;
}

/* SELECT UNIT */

function selectUnit(unit) {

  selectedUnit = unit;

  document.getElementById("selectedStatus").textContent =
    `${unit.dept} ${unit.name} · ${unit.status}`;

  document.getElementById("unitDetails").innerHTML = `

    <div class="details-grid">

      <div class="detail">
        <span>UNIT</span>
        <strong>${unit.dept} ${unit.name}</strong>
      </div>

      <div class="detail">
        <span>STATUS</span>
        <strong>${unit.status}</strong>
      </div>

      <div class="detail">
        <span>VEHICLE</span>
        <strong>${unit.vehicle}</strong>
      </div>

      <div class="detail">
        <span>REGISTRATION</span>
        <strong>${unit.reg}</strong>
      </div>

      <div class="detail">
        <span>SPEED</span>
        <strong>${unit.speed} km/h</strong>
      </div>

      <div class="detail">
        <span>HEADING</span>
        <strong>${unit.heading}</strong>
      </div>

    </div>
  `;
}

/* CALLS */

function renderCalls() {

  const targets = [
    document.getElementById("overviewCalls"),
    document.getElementById("dispatchCalls")
  ];

  targets.forEach(target => {

    if (!target) return;

    target.innerHTML = "";

    calls.forEach(call => {

      const element = document.createElement("div");

      element.className = "call";

      element.innerHTML = `
        <strong>${call.type}</strong>
        <span>${call.location}</span>
        <span>
          Priority: ${call.priority} ·
          ${call.units.join(", ")}
        </span>
      `;

      target.appendChild(element);

    });

  });

  document.getElementById("statCalls").textContent =
    calls.length;
}

/* CREATE CALL */

function createCall() {

  const call = {
    id: `CALL-${String(calls.length + 1).padStart(3, "0")}`,
    type: "New Incident",
    location: "Location Pending",
    priority: "MEDIUM",
    units: []
  };

  calls.push(call);

  renderCalls();
}

/* SIMULATED TELEMETRY FOR NOW */

function updateTelemetry() {

  units.forEach(unit => {

    const change =
      Math.floor(Math.random() * 11) - 5;

    unit.speed = Math.max(
      0,
      unit.speed + change
    );

  });

  renderMap();
  renderUnitList();

  if (selectedUnit) {
    const latest = units.find(
      unit => unit.id === selectedUnit.id
    );

    if (latest) {
      selectUnit(latest);
    }
  }

  document.getElementById("mapUpdated").textContent =
    `Updated ${new Date().toLocaleTimeString()}`;
}

/* START */

renderMap();
renderUnitList();
renderCalls();

setInterval(updateTelemetry, 5000);