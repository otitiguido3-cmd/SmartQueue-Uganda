
/* =========================================================
   SMARTQUEUE UGANDA
   TRACK MY QUEUE - JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. STORAGE
   ========================================================= */

const QUEUE_KEY = "smartqueue_current_ticket";


/* =========================================================
   2. TESTING SETTINGS
   ========================================================= */

const QUEUE_UPDATE_TIME = 30000; // 30 seconds

const MINUTES_PER_PERSON = 5;


/* =========================================================
   3. GET PAGE ELEMENTS
   ========================================================= */

const queuePosition = document.getElementById("queuePosition");
const ticketNumber = document.getElementById("ticketNumber");

const peopleAhead = document.getElementById("peopleAhead");
const estimatedWait = document.getElementById("estimatedWait");

const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");

const organizationName =
    document.getElementById("organizationName");

const branchName =
    document.getElementById("branchName");

const serviceName =
    document.getElementById("serviceName");

const joinedTime =
    document.getElementById("joinedTime");

const joinedDate =
    document.getElementById("joinedDate");

const ticketId =
    document.getElementById("ticketId");

const detailTicketNumber =
    document.getElementById("detailTicketNumber");

const detailService =
    document.getElementById("detailService");

const journeyPeopleAhead =
    document.getElementById("journeyPeopleAhead");

const journeyStatus =
    document.getElementById("journeyStatus");

const estimatedCall =
    document.getElementById("estimatedCall");

const lastUpdated =
    document.getElementById("lastUpdated");

const refreshQueueBtn =
    document.getElementById("refreshQueueBtn");

const leaveQueueBtn =
    document.getElementById("leaveQueueBtn");

const notificationToggle =
    document.getElementById("notificationToggle");


/* =========================================================
   4. GET SAVED TICKET
   ========================================================= */

function getTicket() {

    const savedTicket =
        localStorage.getItem(QUEUE_KEY);

    if (!savedTicket) {
        return null;
    }

    try {

        return JSON.parse(savedTicket);

    } catch (error) {

        console.error(
            "SmartQueue: Invalid ticket data.",
            error
        );

        return null;
    }
}


/* =========================================================
   5. SAVE TICKET
   ========================================================= */

function saveTicket(ticket) {

    localStorage.setItem(
        QUEUE_KEY,
        JSON.stringify(ticket)
    );

}


/* =========================================================
   6. LOAD TICKET INFORMATION
   ========================================================= */

function loadTicketInformation() {

    const ticket = getTicket();

    if (!ticket) {

        showNoTicket();

        return;
    }


    /* Organization */

    if (organizationName) {

        organizationName.textContent =
            ticket.organization?.name ||
            "Organization";

    }


    /* Branch */

    if (branchName) {

        branchName.textContent =
            ticket.organization?.branch ||
            "Branch";

    }


    /* Service */

    if (serviceName) {

        serviceName.textContent =
            ticket.service?.name ||
            "Selected Service";

    }


    if (detailService) {

        detailService.textContent =
            ticket.service?.name ||
            "Selected Service";

    }


    /* Ticket number */

    if (ticketNumber) {

        ticketNumber.textContent =
            ticket.ticket?.number ||
            "--";

    }


    if (detailTicketNumber) {

        detailTicketNumber.textContent =
            ticket.ticket?.number ||
            "--";

    }


    /* Ticket ID */

    if (ticketId) {

        ticketId.textContent =
            ticket.ticket?.id ||
            "--";

    }


    /* Joined time */

    if (joinedTime) {

        joinedTime.textContent =
            ticket.joined?.time ||
            "--";

    }


    /* Joined date */

    if (joinedDate) {

        joinedDate.textContent =
            ticket.joined?.date ||
            "--";

    }


    updateQueue();

}


/* =========================================================
   7. UPDATE QUEUE INFORMATION
   ========================================================= */

function updateQueue() {

    const ticket = getTicket();

    if (!ticket || !ticket.queue) {
        return;
    }


    const position =
        Number(ticket.queue.position) || 1;


    const totalAtJoin =
        Number(ticket.queue.totalAtJoin) ||
        position;


    const ahead =
        Math.max(position - 1, 0);


    const waitTime =
        ahead * MINUTES_PER_PERSON;


    /* Position */

    if (queuePosition) {

        queuePosition.textContent =
            position;

    }


    /* People ahead */

    if (peopleAhead) {

        peopleAhead.textContent =
            ahead;

    }


    if (journeyPeopleAhead) {

        if (ahead === 0) {

            journeyPeopleAhead.textContent =
                "You are next";

        } else {

            journeyPeopleAhead.textContent =
                `${ahead} people ahead`;

        }

    }


    /* Estimated waiting time */

    if (estimatedWait) {

        estimatedWait.textContent =
            waitTime;

    }


    /* Save calculated information */

    ticket.queue.peopleAhead =
        ahead;

    ticket.queue.estimatedWait =
        waitTime;

    saveTicket(ticket);


    updateProgress(
        position,
        totalAtJoin
    );

    updateEstimatedCall(
        ahead
    );

    updateStatus();

    updateLastUpdated();

}


/* =========================================================
   8. UPDATE PROGRESS
   ========================================================= */

function updateProgress(
    position,
    totalAtJoin
) {

    let progress;


    if (totalAtJoin <= 1) {

        progress = 100;

    } else {

        progress =
            ((totalAtJoin - position) /
            (totalAtJoin - 1)) * 100;

    }


    progress =
        Math.round(
            Math.max(
                0,
                Math.min(100, progress)
            )
        );


    if (progressPercent) {

        progressPercent.textContent =
            `${progress}%`;

    }


    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;

    }

}


/* =========================================================
   9. UPDATE ESTIMATED CALL TIME
   ========================================================= */

function updateEstimatedCall(ahead) {

    if (!estimatedCall) {
        return;
    }


    if (ahead === 0) {

        estimatedCall.textContent =
            "Your turn is next";

        return;
    }


    const minutes =
        ahead * MINUTES_PER_PERSON;


    const time =
        new Date(
            Date.now() +
            minutes * 60000
        );


    estimatedCall.textContent =
        `Around ${formatTime(time)}`;

}


/* =========================================================
   10. FORMAT TIME
   ========================================================= */

function formatTime(date) {

    return date.toLocaleTimeString(
        [],
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   11. UPDATE QUEUE STATUS
   ========================================================= */

function updateStatus() {

    const ticket = getTicket();

    if (!ticket) {
        return;
    }


    const status =
        ticket.status || "WAITING";


    if (status === "WAITING") {

        showWaitingStatus();

    }


    else if (status === "SERVING") {

        showServingStatus();

    }


    else if (status === "COMPLETED") {

        showCompletedStatus();

    }


    else if (status === "CANCELLED") {

        showCancelledStatus();

    }

}


/* =========================================================
   12. WAITING STATUS
   ========================================================= */

function showWaitingStatus() {

    if (journeyStatus) {

        journeyStatus.textContent =
            "WAITING";

    }

    if (refreshQueueBtn) {

        refreshQueueBtn.disabled =
            false;

    }

    if (leaveQueueBtn) {

        leaveQueueBtn.disabled =
            false;

    }

}


/* =========================================================
   13. SERVING STATUS
   ========================================================= */

function showServingStatus() {

    if (journeyStatus) {

        journeyStatus.textContent =
            "YOUR TURN";

    }


    if (estimatedWait) {

        estimatedWait.textContent =
            "0";

    }


    if (estimatedCall) {

        estimatedCall.textContent =
            "Proceed to the service point";

    }


    if (progressPercent) {

        progressPercent.textContent =
            "100%";

    }


    if (progressBar) {

        progressBar.style.width =
            "100%";

    }

}


/* =========================================================
   14. COMPLETED STATUS
   ========================================================= */

function showCompletedStatus() {

    if (journeyStatus) {

        journeyStatus.textContent =
            "COMPLETED";

    }


    if (lastUpdated) {

        lastUpdated.textContent =
            "Queue completed";

    }


    disableButtons();

}


/* =========================================================
   15. CANCELLED STATUS
   ========================================================= */

function showCancelledStatus() {

    if (journeyStatus) {

        journeyStatus.textContent =
            "CANCELLED";

    }


    if (lastUpdated) {

        lastUpdated.textContent =
            "Queue cancelled";

    }


    disableButtons();

}


/* =========================================================
   16. DISABLE BUTTONS
   ========================================================= */

function disableButtons() {

    if (refreshQueueBtn) {

        refreshQueueBtn.disabled =
            true;

    }


    if (leaveQueueBtn) {

        leaveQueueBtn.disabled =
            true;

    }

}


/* =========================================================
   17. SHOW NO TICKET
   ========================================================= */

function showNoTicket() {

    if (queuePosition) {

        queuePosition.textContent =
            "--";

    }


    if (peopleAhead) {

        peopleAhead.textContent =
            "--";

    }


    if (estimatedWait) {

        estimatedWait.textContent =
            "--";

    }


    if (journeyStatus) {

        journeyStatus.textContent =
            "NO ACTIVE TICKET";

    }


    if (lastUpdated) {

        lastUpdated.textContent =
            "No active queue";

    }


    disableButtons();

}


/* =========================================================
   18. REFRESH QUEUE
   ========================================================= */

function refreshQueue() {

    loadTicketInformation();

    showToast(
        "Queue information updated."
    );

}


/* =========================================================
   19. LEAVE QUEUE
   ========================================================= */

function leaveQueue() {

    const ticket = getTicket();

    if (!ticket) {
        return;
    }


    if (
        ticket.status === "CANCELLED" ||
        ticket.status === "COMPLETED"
    ) {

        return;
    }


    const confirmLeave =
        confirm(
            "Are you sure you want to leave this queue?"
        );


    if (!confirmLeave) {
        return;
    }


    ticket.status =
        "CANCELLED";


    ticket.cancelledAt =
        new Date().toISOString();


    saveTicket(ticket);


    updateStatus();


    showToast(
        "You have left the queue."
    );

}


/* =========================================================
   20. NOTIFICATION TOGGLE
   ========================================================= */

function toggleNotifications() {

    const ticket = getTicket();

    if (!ticket) {
        return;
    }


    if (!ticket.notifications) {

        ticket.notifications = {
            enabled: true
        };

    }


    ticket.notifications.enabled =
        !ticket.notifications.enabled;


    saveTicket(ticket);


    updateNotificationButton(
        ticket.notifications.enabled
    );


    if (
        ticket.notifications.enabled
    ) {

        showToast(
            "Notifications turned ON."
        );

    } else {

        showToast(
            "Notifications turned OFF."
        );

    }

}


/* =========================================================
   21. UPDATE NOTIFICATION BUTTON
   ========================================================= */

function updateNotificationButton(enabled) {

    if (!notificationToggle) {
        return;
    }


    if (enabled) {

        notificationToggle.classList.add(
            "active"
        );

    } else {

        notificationToggle.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   22. REQUEST NOTIFICATION PERMISSION
   ========================================================= */

function requestNotificationPermission() {

    if (
        "Notification" in window &&
        Notification.permission === "default"
    ) {

        Notification.requestPermission();

    }

}


/* =========================================================
   23. SEND TURN NOTIFICATION
   ========================================================= */

function sendTurnNotification() {

    const ticket = getTicket();

    if (!ticket) {
        return;
    }


    if (
        ticket.notifications &&
        ticket.notifications.enabled === false
    ) {

        return;

    }


    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            "SmartQueue Uganda",
            {
                body:
                    "It is now your turn. Please proceed to the service point."
            }
        );

    }

}


/* =========================================================
   24. SIMULATE QUEUE MOVEMENT
   =========================================================

   This is ONLY for frontend testing.

   Example:

   #7 → #6 → #5 → #4 → #3 → #2 → #1
                                      ↓
                                   YOUR TURN

   Later PHP will provide the real position.
   ========================================================= */

function simulateQueueMovement() {

    const ticket = getTicket();

    if (!ticket) {
        return;
    }


    if (
        ticket.status !== "WAITING"
    ) {

        return;

    }


    if (!ticket.queue) {
        return;
    }


    let position =
        Number(ticket.queue.position) || 1;


    if (position > 1) {

        position--;

        ticket.queue.position =
            position;

        saveTicket(ticket);

        updateQueue();


        showToast(
            `Queue moved. You are now #${position}.`
        );

        return;
    }


    /* User has reached position 1 */

    ticket.status =
        "SERVING";


    ticket.queue.position =
        1;


    ticket.queue.peopleAhead =
        0;


    ticket.queue.estimatedWait =
        0;


    saveTicket(ticket);


    updateQueue();


    updateStatus();


    showToast(
        "It is now your turn!"
    );


    sendTurnNotification();

}


/* =========================================================
   25. LAST UPDATED
   ========================================================= */

function updateLastUpdated() {

    if (lastUpdated) {

        lastUpdated.textContent =
            "Updated just now";

    }

}


/* =========================================================
   26. TOAST MESSAGE
   ========================================================= */

function showToast(message) {

    const oldToast =
        document.querySelector(
            ".smartqueue-toast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement("div");


    toast.className =
        "smartqueue-toast";


    toast.textContent =
        message;


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("show");

    }, 10);


    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}


/* =========================================================
   27. TOAST CSS
   ========================================================= */

const toastStyle =
    document.createElement("style");


toastStyle.textContent = `

.smartqueue-toast {

    position: fixed;

    left: 50%;

    bottom: 90px;

    z-index: 9999;

    width: calc(100% - 30px);

    max-width: 420px;

    padding: 14px 18px;

    transform:
        translate(-50%, 20px);

    opacity: 0;

    color: white;

    background: #111827;

    border-radius: 12px;

    text-align: center;

    font-size: 12px;

    font-weight: 600;

    box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.20);

    transition:
        all 0.3s ease;
}


.smartqueue-toast.show {

    transform:
        translate(-50%, 0);

    opacity: 1;

}


.refresh-btn:disabled,
.leave-btn:disabled {

    opacity: 0.5;

    cursor: not-allowed;

}

`;


document.head.appendChild(
    toastStyle
);


/* =========================================================
   28. BUTTON EVENTS
   ========================================================= */

if (refreshQueueBtn) {

    refreshQueueBtn.addEventListener(
        "click",
        refreshQueue
    );

}


if (leaveQueueBtn) {

    leaveQueueBtn.addEventListener(
        "click",
        leaveQueue
    );

}


if (notificationToggle) {

    notificationToggle.addEventListener(
        "click",
        function () {

            toggleNotifications();

            requestNotificationPermission();

        }
    );

}


/* =========================================================
   29. REFRESH WHEN USER RETURNS TO PAGE
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            loadTicketInformation();

        }

    }
);


/* =========================================================
   30. START APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "SmartQueue Track Queue loaded successfully."
        );


        loadTicketInformation();


        /*
           Frontend testing:

           The queue will automatically move
           every 30 seconds.
        */

        setInterval(
            simulateQueueMovement,
            QUEUE_UPDATE_TIME
        );

    }
);


/* =========================================================
   END OF FILE
   ========================================================= */



//Reset Queue Function that must be removed later
/* =========================================================
   RESET QUEUE - FRONTEND TESTING
   ========================================================= */

const resetQueueBtn =
    document.getElementById("resetQueueBtn");


function resetQueue() {

    console.log("SmartQueue: Reset button clicked.");


    const savedTicket =
        localStorage.getItem(QUEUE_KEY);


    if (!savedTicket) {

        alert("No active queue ticket was found.");

        return;
    }


    try {

        const ticket =
            JSON.parse(savedTicket);


        /* -----------------------------------------
           Restore queue position
        ----------------------------------------- */

        if (!ticket.queue) {

            ticket.queue = {};

        }


        /*
           Restore the original testing position.

           If originalPosition exists, use it.
           Otherwise use totalAtJoin.
           If neither exists, use 7.
        */

        const originalPosition =
            Number(
                ticket.queue.originalPosition ||
                ticket.queue.totalAtJoin ||
                7
            );


        ticket.queue.position =
            originalPosition;


        ticket.queue.totalAtJoin =
            originalPosition;


        ticket.queue.peopleAhead =
            Math.max(
                originalPosition - 1,
                0
            );


        ticket.queue.estimatedWait =
            Math.max(
                originalPosition - 1,
                0
            ) * MINUTES_PER_PERSON;


        /* -----------------------------------------
           Restore ticket status
        ----------------------------------------- */

        ticket.status =
            "WAITING";


        /* -----------------------------------------
           Remove previous status information
        ----------------------------------------- */

        delete ticket.cancelledAt;

        delete ticket.completedAt;


        /* -----------------------------------------
           Restore notifications
        ----------------------------------------- */

        if (!ticket.notifications) {

            ticket.notifications = {};

        }


        ticket.notifications.enabled =
            true;


        /* -----------------------------------------
           Save the restored ticket
        ----------------------------------------- */

        localStorage.setItem(
            QUEUE_KEY,
            JSON.stringify(ticket)
        );


        console.log(
            "SmartQueue: Queue successfully reset.",
            ticket
        );


        /* -----------------------------------------
           Reload page
        ----------------------------------------- */

        window.location.reload();

    }

    catch (error) {

        console.error(
            "SmartQueue: Reset error:",
            error
        );


        alert(
            "The queue could not be reset. Check the browser console."
        );

    }

}


/* =========================================================
   RESET BUTTON EVENT
   ========================================================= */

if (resetQueueBtn) {

    resetQueueBtn.addEventListener(
        "click",
        resetQueue
    );

}