let lastMsg = "Prevent Annoying Duplicates";

// Warnings fire once, to avoid bombarding the user with repetitious errors
// Eg: "Can"t connect to server!" might get repetitive.
export function warning(message: string, title = "Warning", color = "yellow") {
    if (lastMsg === message) {
        console.warn(message);
    } else {
        createToast(message, title, color);
    };
    lastMsg = message;
}

// Errors can fire multiple times for situations such as password guessing
export function error(message: string, title = "Error", color = "red") {
    createToast(message, title, color);
}

export function success(message: string, title = "Success", color = "green") {
    createToast(message, title, color);
}

let createToast = (message: string, title: string, color: string) => {
    /** Get container */
    let tc = document.querySelector(".toast-container");

    /** Instantiate */
    let timer = 7;
    let isHovered = false;

    /** Create necessary elements */
    let toastEl = document.createElement("div");
    let titleEl = document.createElement("h4");
    let messageEl = document.createElement("div");
    let loaderEl = document.createElement("div");
    let leftLoaderEl = document.createElement("div");
    let rightLoaderEl = document.createElement("div");
    let spinnerLoaderEl = document.createElement("div");

    /** Fill the contents */
    titleEl.innerText = title;
    messageEl.innerText = message;

    /** Add the classes */
    toastEl.classList.add("toast");
    toastEl.classList.add(color);
    titleEl.classList.add("toast-title");
    messageEl.classList.add("toast-message");
    loaderEl.classList.add("toast-loader");
    leftLoaderEl.classList.add("toast-loader-right");
    leftLoaderEl.classList.add(color);
    rightLoaderEl.classList.add("toast-loader-left");
    rightLoaderEl.classList.add(color);
    spinnerLoaderEl.classList.add("toast-loader-spinner");

    /** Add events */
    toastEl.addEventListener("click", function (e: any) {
        e.currentTarget.classList.add("poof");
        setTimeout(function () {
            tc.removeChild(toastEl);
        }, 200);
    });
    toastEl.addEventListener("mouseenter", function (e: any) {
        let children = e.currentTarget.children[2].children;
        for (let i = 0; i < children.length; i++) {
            children[i].style.animationPlayState = "paused";
        }
        isHovered = true;
    });
    toastEl.addEventListener("mouseleave", function (e: any) {
        let children = e.currentTarget.children[2].children;
        for (let i = 0; i < children.length; i++) {
            children[i].style.animationPlayState = "running";
        }
        isHovered = false;
    });

    /** Append the children */
    loaderEl.appendChild(leftLoaderEl);
    loaderEl.appendChild(rightLoaderEl);
    loaderEl.appendChild(spinnerLoaderEl);
    toastEl.appendChild(titleEl);
    toastEl.appendChild(messageEl);
    toastEl.appendChild(loaderEl);
    tc.appendChild(toastEl);

    /** Start */
    let int = setInterval(function () {
        if (!isHovered && timer <= 2) {
            toastEl.classList.add("poof");
        }
        if (!isHovered) {
            timer--;
            if (timer <= 0) {
                clearInterval(int);
                if (toastEl && toastEl.parentNode === tc) {
                    tc.removeChild(toastEl);
                }
            }
        }
    }, 1000);
};

export function init() {
    /** Create container and append it */
    let toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container");
    document.body.appendChild(toastContainer);
}