// toggles between signin / signup form
function toggleFormType(): void {
    const form = document.getElementById("credential-form");
    const optionalContent = document.getElementById("optional-form-content");
    const submitButton = document.getElementById("submit-button");
    const title = document.getElementById("form-title");
    const linkText = document.getElementById("link-text");

    if (form.classList.contains("signin")) {
        // switch to sign UP form
        optionalContent.classList.remove("hidden");
        form.classList.remove("signin");
        submitButton.innerHTML = "Sign Up";
        title.innerHTML = "Please sign up";
        linkText.innerHTML = "sign in";
    }
    else {
        // switch to sign IN form
        optionalContent.classList.add("hidden");
        form.classList.add("signin");
        submitButton.innerHTML = "Sign In";
        title.innerHTML = "Please sign in";
        linkText.innerHTML = "sign up";
    }
}

// show form and hide hide the rest
function showForm(): void {
    const form = document.getElementById("credential-form");
    const postSubmitContent = document.getElementById("post-submit-content");
    
    form.classList.remove("invisible-content");
    postSubmitContent.classList.add("invisible-content");
}

function showLoading(): void {
    const form = document.getElementById("credential-form");
    const postSubmitContent = document.getElementById("post-submit-content");
    const submitStatus = document.getElementById("submit-status");
    const loadingAnimation = document.getElementById("loading-animation");

    form.classList.add("invisible-content");
    postSubmitContent.classList.remove("invisible-content");
    submitStatus.classList.add("hidden");
    loadingAnimation.classList.remove("hidden");
}

function showPostSubmitStatus(status?: SubmitStatus) {
    setSubmitStatus(status);

    const form = document.getElementById("credential-form");
    const postSubmitContent = document.getElementById("post-submit-content");
    const submitStatus = document.getElementById("submit-status");
    const loadingAnimation = document.getElementById("loading-animation");

    form.classList.add("invisible-content");
    postSubmitContent.classList.remove("invisible-content");
    submitStatus.classList.remove("hidden");
    loadingAnimation.classList.add("hidden");
}

enum SubmitStatus {
    success = 0,
    wrongCredentials,
    unknownCredentials,
    timeout
};

// shows a status header and description in the login container
function setSubmitStatus(status?: SubmitStatus) {
    const domHeader = document.getElementById("status-header");
    const domDescription = document.getElementById("status-description");

    domHeader.style.color = "red";

    switch (status) {

        case SubmitStatus.success: {
            
            // nothing wrong, success text
            domHeader.innerHTML = "Logged in!";
            domHeader.style.color = "green";
            domDescription.innerHTML = "Sucessfully logged in! Welcome";

        } break;

        case SubmitStatus.wrongCredentials: {
            
            domHeader.innerHTML = "Error";
            domDescription.innerHTML = "Wrong credentials were provided";

        } break;

        case SubmitStatus.unknownCredentials: {
            
            domHeader.innerHTML = "Error";
            domDescription.innerHTML= "Unknown username was provided, try signing up";

        } break;

        case SubmitStatus.timeout: {

            domHeader.innerHTML = "Error";
            domDescription.innerHTML = "Timed out";

        } break;

        default: {

            domHeader.innerHTML = "Error";
            domDescription.innerHTML = "Something went wrong";

        }

    }
}

function interceptSubmit(credentialForm: HTMLFormElement, event: SubmitEvent) {
    // intercept form action
    event.preventDefault();
        
    // extract form data
    const data = new FormData(credentialForm as HTMLFormElement);

    const isSignInForm = credentialForm.classList.contains("signin");

    if (isSignInForm) data.delete("email");

    showLoading();

    console.log(data);

    // DEBUG
    setTimeout(() => {
        showPostSubmitStatus(SubmitStatus.timeout);
    }, 3000);

    // TODO send data
}

function load(): void {

    // attach submit listener
    const credentialForm: HTMLElement = document.getElementById("credential-form");
    credentialForm.addEventListener("submit", (event) => interceptSubmit(credentialForm as HTMLFormElement, event));
    // TODO send data
    
}


// document.body.onload causes html content to be loaded prematurely and a subsequent page flicker, and is not adviced
document.addEventListener("DOMContentLoaded", load);