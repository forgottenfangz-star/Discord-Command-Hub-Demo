/*
    ERLC COMMAND HUB

    Current version:
    - Information-based Overview
    - GSRP-inspired dashboard layout
    - Navigation system
    - Dispatch placeholder
    - Live Map placeholder
    - Unit placeholder

    IMPORTANT:
    The ER:LC API is NOT connected yet.

    The next backend stage can replace the placeholder
    data with real ER:LC server information.
*/


/* ================= PAGE NAVIGATION ================= */

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

const pageTitles = {
    overview: "Overview",
    map: "Live Map",
    dispatch: "Dispatch",
    units: "Units",
    departments: "Departments",
    reports: "Reports",
    applications: "Applications",
    watchdog: "Watchdog",
    management: "Management"
};


function openPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    navItems.forEach(item => {
        item.classList.remove("active");
    });


    const selectedPage =
        document.getElementById(`page-${pageName}`);

    const selectedNav =
        document.querySelector(
            `.nav-item[data-page="${pageName}"]`
        );


    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    if (selectedNav) {
        selectedNav.classList.add("active");
    }


    const title =
        pageTitles[pageName] || "Overview";


    const titleElement =
        document.getElementById("pageTitle");

    const breadcrumb =
        document.getElementById("breadcrumbPage");


    if (titleElement) {
        titleElement.textContent = title;
    }

    if (breadcrumb) {
        breadcrumb.textContent =
            title.toUpperCase();
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


navItems.forEach(item => {

    item.addEventListener("click", () => {

        const page =
            item.dataset.page;

        openPage(page);

    });

});


/* ================= INTERNAL BUTTONS ================= */

document.querySelectorAll("[data-page-target]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const page =
                button.dataset.pageTarget;

            openPage(page);

        });

    });



/* ================= MAP FILTERS ================= */

const mapFilters =
    document.querySelectorAll(".map-filter");


mapFilters.forEach(filter => {

    filter.addEventListener("click", () => {

        mapFilters.forEach(button => {
            button.classList.remove("active");
        });

        filter.classList.add("active");

        const department =
            filter.dataset.filter;

        console.log(
            `Map filter selected: ${department}`
        );

        /*
            When the real ER:LC API is connected,
            this filter will show/hide live units
            belonging to the selected department.
        */
    });

});



/* ================= CURRENT UNIT SYSTEM ================= */

/*
    There is intentionally NO fake unit data here.

    When the API is connected, the backend can return
    live units and this function can render them.
*/


const unitList =
    document.getElementById("unitList");

const fullUnitList =
    document.getElementById("fullUnitList");

const unitCount =
    document.getElementById("unitCount");


function renderUnits(units) {

    if (!Array.isArray(units)) {
        units = [];
    }


    if (unitCount) {
        unitCount.textContent =
            units.length;
    }


    if (units.length === 0) {

        if (unitList) {

            unitList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">◉</div>

                    <h4>No live units detected</h4>

                    <p>
                        Units will appear automatically
                        when the ER:LC API is connected.
                    </p>
                </div>
            `;

        }


        if (fullUnitList) {

            fullUnitList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">▣</div>

                    <h4>No live units detected</h4>

                    <p>
                        Live ER:LC unit information will
                        appear here automatically.
                    </p>
                </div>
            `;

        }

        return;
    }


    /* ================= SMALL UNIT LIST ================= */

    if (unitList) {

        unitList.innerHTML = "";

        units.forEach(unit => {

            const element =
                document.createElement("div");

            element.className =
                "unit-entry";

            element.innerHTML = `
                <div>
                    <strong>
                        ${escapeHTML(unit.callsign || "UNIT")}
                    </strong>

                    <small>
                        ${escapeHTML(unit.department || "Unknown")}
                    </small>
                </div>

                <span>
                    ${escapeHTML(unit.status || "Available")}
                </span>
            `;

            unitList.appendChild(element);

        });

    }


    /* ================= FULL UNIT LIST ================= */

    if (fullUnitList) {

        fullUnitList.innerHTML = "";

        units.forEach(unit => {

            const element =
                document.createElement("div");

            element.className =
                "unit-entry";

            element.innerHTML = `
                <div>
                    <strong>
                        ${escapeHTML(unit.callsign || "UNIT")}
                    </strong>

                    <small>
                        ${escapeHTML(unit.department || "Unknown")}
                    </small>
                </div>

                <span>
                    ${escapeHTML(unit.status || "Available")}
                </span>
            `;

            fullUnitList.appendChild(element);

        });

    }

}



/* ================= DISPATCH ================= */

/*
    Dispatch intentionally contains NO
    "Create New Call" function.

    Calls are supposed to come from ER:LC.

    The future API response can be passed into:

        renderCalls(calls)
*/


const callsList =
    document.getElementById("callsList");


function renderCalls(calls) {

    if (!callsList) {
        return;
    }


    if (!Array.isArray(calls) || calls.length === 0) {

        callsList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">☷</div>

                <h4>No active calls</h4>

                <p>
                    Emergency calls detected in ER:LC
                    will automatically appear here.
                </p>

            </div>
        `;

        return;
    }


    callsList.innerHTML = "";


    calls.forEach(call => {

        const element =
            document.createElement("div");

        element.className =
            "call-entry";


        element.innerHTML = `
            <div>
                <strong>
                    ${escapeHTML(call.type || "Emergency Call")}
                </strong>

                <small>
                    ${escapeHTML(call.location || "Unknown location")}
                </small>
            </div>

            <div>
                <span>
                    ${escapeHTML(call.priority || "NORMAL")}
                </span>
            </div>
        `;


        callsList.appendChild(element);

    });

}



/* ================= SECURITY ================= */

/*
    Escape API data before inserting it
    into HTML.

    This becomes important once live data
    starts coming from external services.
*/


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}



/* ================= INITIAL STATE ================= */

/*
    Start with no fake calls and no fake units.
*/

renderUnits([]);

renderCalls([]);



/* ================= API CONNECTION PLACEHOLDER ================= */

/*
    FUTURE:

    Instead of fake data, the frontend will call
    a secure Vercel backend endpoint.

    Example:

        fetch("/api/erlc")
            .then(response => response.json())
            .then(data => {

                renderUnits(data.units);
                renderCalls(data.calls);

            });

    The ER:LC server key must NEVER be placed
    inside this frontend JavaScript file.
*/


console.log(
    "ERLC Command Hub loaded successfully."
);

console.log(
    "Waiting for secure ER:LC API connection."
);