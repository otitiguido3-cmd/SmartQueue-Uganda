
/* =========================================================
   SMARTQUEUE UGANDA
   QUEUE TICKET PAGE
   queue-ticket.js

   CURRENT MODE:
   - Frontend testing
   - Uses localStorage
   - Uses simulated queue movement

   FUTURE MODE:
   - PHP backend
   - MySQL database
   - Real-time queue information
   ========================================================= */
console.log("SMARTQUEUE JS FILE LOADED");

/* =========================================================
   1. TEST CONFIGURATION
   ========================================================= */

const SMARTQUEUE_CONFIG = {

    /* Set to true while testing the frontend */
    testMode: true,

    /* Simulate queue movement every X seconds */
    simulationInterval: 30000,

    /* Average service time per customer */
    averageServiceTime: 5

};


/* =========================================================
   2. TEST TICKET DATA
   =========================================================

   This data is temporary.

   Later PHP will provide the real data from MySQL.
   ========================================================= */

const defaultTicket = {

    organization: {
        name: "ABC Bank Uganda",
        branch: "Kampala Main Branch"
    },

    service: {
        name: "Account Opening"
    },

    ticket: {
        number: "B012",
        id: "SQ-8F29K2"
    },

    queue: {
        position: 7,
        peopleAhead: 6,
        totalAtJoin: 20,
        estimatedWait: 30
    },

    status: "WAITING",

    joined: {
        time: "10:42 AM",
        date: "27 September 2026"
    }

};


/* =========================================================
   3. STORAGE KEY
   ========================================================= */

const STORAGE_KEY = "smartqueue_current_ticket";


/* =========================================================
   4. GET SAVED TICKET
   ========================================================= */

function getTicket() {

    const savedTicket =
        localStorage.getItem(STORAGE_KEY);


    if (!savedTicket) {

        /*
         * No ticket has been saved yet.
         * Create a copy of the default test ticket.
         */

        const newTicket =
            JSON.parse(
                JSON.stringify(defaultTicket)
            );

        saveTicket(newTicket);

        return newTicket;
    }


    try {

        return JSON.parse(savedTicket);

    } catch (error) {

        console.error(
            "SmartQueue: Unable to read saved ticket.",
            error
        );

        return JSON.parse(
            JSON.stringify(defaultTicket)
        );
    }
}


/* =========================================================
   5. SAVE TICKET
   ========================================================= */

function saveTicket(ticket) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(ticket)
    );
}


/* =========================================================
   6. CURRENT TICKET
   ========================================================= */

let currentTicket = getTicket();


/* =========================================================
   7. GET PAGE ELEMENTS
   ========================================================= */

const elements = {

    organizationName:
        document.getElementById("organizationName"),

    branchName:
        document.getElementById("branchName"),

    serviceName:
        document.getElementById("serviceName"),

    ticketNumber:
        document.getElementById("ticketNumber"),

    queuePosition:
        document.getElementById("queuePosition"),

    progressPosition:
        document.getElementById("progressPosition"),

    peopleAhead:
        document.getElementById("peopleAhead"),

    estimatedWait:
        document.getElementById("estimatedWait"),

    queueStatus:
        document.getElementById("queueStatus"),

    joinedTime:
        document.getElementById("joinedTime"),

    joinedDate:
        document.getElementById("joinedDate"),

    ticketId:
        document.getElementById("ticketId"),

    progressBar:
        document.getElementById("progressBar"),

    trackQueueBtn:
        document.getElementById("trackQueueBtn"),

    cancelQueueBtn:
        document.getElementById("cancelQueueBtn")

};


/* =========================================================
   8. DISPLAY TICKET INFORMATION
   ========================================================= */

function displayTicket() {

    const ticket = currentTicket;


    /* Organization */

    if (elements.organizationName) {

        elements.organizationName.textContent =
            ticket.organization.name;
    }


    /* Branch */

    if (elements.branchName) {

        elements.branchName.textContent =
            ticket.organization.branch;
    }


    /* Service */

    if (elements.serviceName) {

        elements.serviceName.textContent =
            ticket.service.name;
    }


    /* Ticket number */

    if (elements.ticketNumber) {

        elements.ticketNumber.textContent =
            ticket.ticket.number;
    }


    /* Queue position */

    if (elements.queuePosition) {

        elements.queuePosition.textContent =
            ticket.queue.position;
    }


    /* Progress position */

    if (elements.progressPosition) {

        elements.progressPosition.textContent =
            ticket.queue.position;
    }


    /* People ahead */

    if (elements.peopleAhead) {

        elements.peopleAhead.textContent =
            ticket.queue.peopleAhead;
    }


    /* Estimated waiting time */

    if (elements.estimatedWait) {

        elements.estimatedWait.textContent =
            ticket.queue.estimatedWait;
    }


    /* Joined time */

    if (elements.joinedTime) {

        elements.joinedTime.textContent =
            ticket.joined.time;
    }


    /* Joined date */

    if (elements.joinedDate) {

        elements.joinedDate.textContent =
            ticket.joined.date;
    }


    /* Ticket ID */

    if (elements.ticketId) {

        elements.ticketId.textContent =
            ticket.ticket.id;
    }


    updateStatus();

    updateProgress();

    updateButtons();

}


/* =========================================================
   9. UPDATE QUEUE STATUS
   ========================================================= */

function updateStatus() {

    if (!elements.queueStatus) {

        return;
    }


    const status =
        currentTicket.status;


    elements.queueStatus.innerHTML = `
        <span></span>
        ${status}
    `;


    const dot =
        elements.queueStatus.querySelector("span");


    /* WAITING */

    if (status === "WAITING") {

        elements.queueStatus.style.backgroundColor =
            "#ecfdf3";

        elements.queueStatus.style.color =
            "#15803d";

        dot.style.backgroundColor =
            "#16a34a";
    }


    /* SERVING */

    else if (status === "SERVING") {

        elements.queueStatus.style.backgroundColor =
            "#eff6ff";

        elements.queueStatus.style.color =
            "#2563eb";

        dot.style.backgroundColor =
            "#2563eb";
    }


    /* COMPLETED */

    else if (status === "COMPLETED") {

        elements.queueStatus.style.backgroundColor =
            "#f3f4f6";

        elements.queueStatus.style.color =
            "#374151";

        dot.style.backgroundColor =
            "#6b7280";
    }


    /* CANCELLED */

    else if (status === "CANCELLED") {

        elements.queueStatus.style.backgroundColor =
            "#fef2f2";

        elements.queueStatus.style.color =
            "#dc2626";

        dot.style.backgroundColor =
            "#dc2626";
    }

}


/* =========================================================
   10. UPDATE QUEUE PROGRESS
   ========================================================= */

function updateProgress() {

    if (!elements.progressBar) {

        return;
    }


    const total =
        Number(currentTicket.queue.totalAtJoin);


    const position =
        Number(currentTicket.queue.position);


    if (total <= 0) {

        elements.progressBar.style.width =
            "0%";

        return;
    }


    let progress =
        ((total - position) / total) * 100;


    progress =
        Math.max(5, Math.min(progress, 100));


    elements.progressBar.style.width =
        progress + "%";

}


/* =========================================================
   11. UPDATE PEOPLE AHEAD
   ========================================================= */

function updatePeopleAhead() {

    currentTicket.queue.peopleAhead =
        Math.max(
            currentTicket.queue.position - 1,
            0
        );

}


/* =========================================================
   12. CALCULATE WAITING TIME
   ========================================================= */

function calculateWaitingTime() {

    const peopleAhead =
        currentTicket.queue.peopleAhead;


    currentTicket.queue.estimatedWait =
        peopleAhead *
        SMARTQUEUE_CONFIG.averageServiceTime;

}


/* =========================================================
   13. UPDATE BUTTONS
   ========================================================= */

function updateButtons() {

    const status =
        currentTicket.status;


    if (
        status === "CANCELLED" ||
        status === "COMPLETED"
    ) {

        if (elements.trackQueueBtn) {

            elements.trackQueueBtn.disabled =
                true;

            elements.trackQueueBtn.style.opacity =
                "0.6";
        }

        if (elements.cancelQueueBtn) {

            elements.cancelQueueBtn.disabled =
                true;

            elements.cancelQueueBtn.style.opacity =
                "0.6";

            elements.cancelQueueBtn.textContent =
                status === "CANCELLED"
                    ? "Queue Cancelled"
                    : "Queue Completed";
        }

        return;
    }


    if (elements.trackQueueBtn) {

        elements.trackQueueBtn.disabled =
            false;

        elements.trackQueueBtn.style.opacity =
            "1";
    }


    if (elements.cancelQueueBtn) {

        elements.cancelQueueBtn.disabled =
            false;

        elements.cancelQueueBtn.style.opacity =
            "1";

        elements.cancelQueueBtn.textContent =
            "Leave Queue";
    }

}


/* =========================================================
   14. TRACK QUEUE
   ========================================================= */

function trackQueue() {

    const status =
        currentTicket.status;


    if (status === "CANCELLED") {

        showMessage(
            "This queue ticket has been cancelled."
        );

        return;
    }


    if (status === "COMPLETED") {

        showMessage(
            "This queue ticket has already been completed."
        );

        return;
    }


    if (status === "SERVING") {

        showMessage(
            "It is your turn. Please proceed to the service point."
        );

        return;
    }


    const position =
        currentTicket.queue.position;


    const people =
        currentTicket.queue.peopleAhead;


    const wait =
        currentTicket.queue.estimatedWait;


    showMessage(
        "You are currently number " +
        position +
        " in the queue.\n\n" +

        people +
        " people are ahead of you.\n\n" +

        "Estimated waiting time: " +
        wait +
        " minutes."
    );

}


/* =========================================================
   15. LEAVE QUEUE
   ========================================================= */

function leaveQueue() {

    if (
        currentTicket.status === "CANCELLED"
    ) {

        return;
    }


    if (
        currentTicket.status === "COMPLETED"
    ) {

        showMessage(
            "This queue has already been completed."
        );

        return;
    }


    const confirmation =
        confirm(
            "Are you sure you want to leave the queue?\n\n" +

            "Ticket number: " +
            currentTicket.ticket.number
        );


    if (!confirmation) {

        return;
    }


    currentTicket.status =
        "CANCELLED";


    saveTicket(currentTicket);

    displayTicket();


    showMessage(
        "Your queue ticket has been cancelled successfully."
    );

}


/* =========================================================
   16. FRONTEND QUEUE SIMULATION
   =========================================================

   This function is ONLY for testing.

   It pretends that customers ahead of you
   are being served.

   PHP will replace this later.
   ========================================================= */

function simulateQueueMovement() {

    if (!SMARTQUEUE_CONFIG.testMode) {

        return;
    }


    if (
        currentTicket.status !== "WAITING"
    ) {

        return;
    }


    /* Move one position forward */

    if (
        currentTicket.queue.position > 1
    ) {

        currentTicket.queue.position--;

        updatePeopleAhead();

        calculateWaitingTime();

        saveTicket(currentTicket);

        displayTicket();


        console.log(
            "SmartQueue Test:",
            "Queue moved to position",
            currentTicket.queue.position
        );

        return;
    }


    /* When position reaches 1 */

    currentTicket.queue.position =
        1;

    currentTicket.queue.peopleAhead =
        0;

    currentTicket.queue.estimatedWait =
        0;

    currentTicket.status =
        "SERVING";


    saveTicket(currentTicket);

    displayTicket();


    showMessage(
        "Your turn has arrived!\n\n" +
        "Please proceed to the service point."
    );

}


/* =========================================================
   17. SIMPLE MESSAGE FUNCTION
   =========================================================

   Currently uses alert().

   Later this can be replaced with a
   professional SmartQueue modal/toast.
   ========================================================= */

function showMessage(message) {

    alert(message);

}


/* =========================================================
   18. TRACK BUTTON EVENT
   ========================================================= */

if (elements.trackQueueBtn) {

    elements.trackQueueBtn.addEventListener(
        "click",
        trackQueue
    );

}


/* =========================================================
   19. CANCEL BUTTON EVENT
   ========================================================= */

if (elements.cancelQueueBtn) {

    elements.cancelQueueBtn.addEventListener(
        "click",
        leaveQueue
    );

}


/* =========================================================
   20. TEST QUEUE SIMULATION
   =========================================================

   Every 30 seconds:

   7 → 6 → 5 → 4 → 3 → 2 → 1
                           ↓
                       SERVING

   Comment this section when you do not
   want automatic testing.
   ========================================================= */

if (
    SMARTQUEUE_CONFIG.testMode
) {

    setInterval(
        simulateQueueMovement,
        SMARTQUEUE_CONFIG.simulationInterval
    );

}


/* =========================================================
   21. REFRESH WHEN USER RETURNS TO PAGE
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (!document.hidden) {

            currentTicket =
                getTicket();

            displayTicket();

        }

    }
);


/* =========================================================
   22. INITIALIZE APPLICATION
   ========================================================= */

displayTicket();


/* =========================================================
   RESET TEST TICKET (FOR DEVELOPMENT PURPOSES ONLY)
   ========================================================= */
function resetTestTicket() {

    localStorage.removeItem("smartqueue_current_ticket");

    location.reload();

}