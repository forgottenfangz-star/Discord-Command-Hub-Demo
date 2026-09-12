const rolesData = {
  NZP: ["Constable","Senior Constable","Sergeant","Senior Sergeant","Inspector"],
  FENZ: ["Firefighter","Senior Firefighter","Station Officer"],
  "St John": ["EMT","Paramedic","Clinical Lead"],
  DOT: ["Traffic Officer","Senior Traffic Officer","Supervisor"],
  Staff: ["Moderator","Senior Moderator","Supervisor","Administrator","Management"]
};

const units = [
  ["NZP 2A-21","NZP","Ford Explorer","NZP-201",31,43,"🚓",82,"North","Normal"],
  ["NZP 4A-17","NZP","BMW M5","NZP-417",60,29,"🚓",104,"East","Normal"],
  ["FENZ 12","FENZ","Scania P-Series","FENZ-12",74,62,"🚒",71,"South","Normal"],
  ["STJ 104","STJ","Mercedes Sprinter","STJ-104",44,68,"🚑",63,"West","Normal"],
  ["DOT 88","DOT","Toyota Hilux","DOT-88",18,72,"🚧",55,"North","Normal"],
  ["NZP 9A-11","NZP","Kia Stinger","NZP-911",82,26,"🚓",118,"East","High"],
  ["FENZ 21","FENZ","Isuzu F-Series","FENZ-21",67,80,"🚒",58,"South","Normal"],
  ["STJ 221","STJ","Toyota HiAce","STJ-221",27,22,"🚑",76,"West","Normal"]
];

let selectedUnit = units[0];

function go(id) {
  document.querySelector(`[data-page="${id}"]`).click();
}

document.querySelectorAll("nav button").forEach(button => {

  button.onclick = () => {

    document.querySelectorAll("nav button")
      .forEach(x => x.classList.remove("active"));

    button.classList.add("active");

    document.querySelectorAll(".page")
      .forEach(x => x.classList.remove("active"));

    document
      .getElementById(button.dataset.page)
      .classList.add("active");

    let title = button.textContent
      .trim()
      .replace("2","");

    document.getElementById("title").textContent = title;
    document.getElementById("crumb").textContent = title.toUpperCase();

    if(button.dataset.page === "operations"){
      draw();
    }
  };

});


function draw(filter = "ALL", btn) {

  if(btn){

    document.querySelectorAll(".filter")
      .forEach(x => x.classList.remove("active"));

    btn.classList.add("active");

  }

  const map = document.getElementById("map");

  map.querySelectorAll(".blip").forEach(x => x.remove());

  const filtered = units.filter(unit =>
    filter === "ALL" || unit[1] === filter
  );

  filtered.forEach(unit => {

    const marker = document.createElement("button");

    marker.className =
      "blip " + unit[1].toLowerCase();

    marker.style.left = unit[4] + "%";
    marker.style.top = unit[5] + "%";

    marker.textContent = unit[6];

    marker.title = unit[0];

    marker.onclick = () => selectUnit(unit);

    map.appendChild(marker);

  });

  document.getElementById("mapUnitCount").textContent =
    filtered.length;

}


function renderUnits() {

  document.getElementById("units").innerHTML =
    units.map(unit => {

      return `
        <div class="unit" onclick='selectUnit(${JSON.stringify(unit)})'>

          <span class="tag">● ACTIVE</span>

          <b>${unit[0]}</b>

          <small>
            ${unit[1]} · ${unit[2]}
          </small>

          <div class="unit-mini">

            <span>◉ ${unit[6]}</span>

            <span>${unit[7]} km/h</span>

          </div>

        </div>
      `;

    }).join("");

}


function selectUnit(unit) {

  selectedUnit = unit;

  document.getElementById("selectedName").textContent =
    unit[0];

  document.getElementById("selectedDepartment").textContent =
    unit[1] + " • " + departmentName(unit[1]);

  document.getElementById("selectedVehicle").textContent =
    unit[2];

  document.getElementById("selectedReg").textContent =
    unit[3];

  document.getElementById("selectedSpeed").textContent =
    unit[7];

  document.getElementById("selectedHeading").textContent =
    unit[8];

  document.getElementById("selectedAccel").textContent =
    unit[9];

  document.getElementById("selectedIcon").textContent =
    unit[6];

  document.getElementById("selectedLocation").textContent =
    getLocation(unit[4], unit[5]);

  document.getElementById("selectedStatus").textContent =
    unit[9] === "High" ? "ALERT" : "ACTIVE";

}


function departmentName(department){

  if(department === "NZP")
    return "Police";

  if(department === "FENZ")
    return "Fire & Emergency";

  if(department === "STJ")
    return "St John";

  if(department === "DOT")
    return "Transport";

  return department;

}


function getLocation(x,y){

  if(x > 70 && y < 40)
    return "Northern District";

  if(x > 55 && y > 55)
    return "Southern District";

  if(x < 40 && y > 55)
    return "Western District";

  if(x < 40)
    return "Central District";

  return "Liberty County";

}


function roles(){

  const department =
    document.getElementById("dept").value;

  document.getElementById("role").innerHTML =
    rolesData[department]
      .map(role => `<option>${role}</option>`)
      .join("");

}


function openCase(){

  document
    .getElementById("modal")
    .classList.remove("hidden");

}


function closeCase(){

  document
    .getElementById("modal")
    .classList.add("hidden");

}


function tick(){

  const now =
    new Date().toLocaleTimeString([],{
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit"
    });

  document.getElementById("time").textContent = now;

  document.getElementById("lastUpdate").textContent = now;

}


function simulateTelemetry(){

  units.forEach(unit => {

    const change =
      Math.floor(Math.random() * 7) - 3;

    unit[7] =
      Math.max(0, unit[7] + change);

    unit[4] += (Math.random() - 0.5) * 0.8;
    unit[5] += (Math.random() - 0.5) * 0.8;

    unit[4] = Math.max(5,Math.min(95,unit[4]));
    unit[5] = Math.max(5,Math.min(90,unit[5]));

  });

  renderUnits();
  draw();

  if(selectedUnit){
    const updated =
      units.find(x => x[0] === selectedUnit[0]);

    if(updated){
      selectUnit(updated);
    }
  }

}


document.getElementById("modal").onclick =
  event => {

    if(event.target.id === "modal"){
      closeCase();
    }

  };


renderUnits();
draw();
roles();
tick();

setInterval(tick,1000);

setInterval(simulateTelemetry,5000);