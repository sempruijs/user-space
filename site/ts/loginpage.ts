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
    login = 0,
    signup,
    wrongCredentials,
    unknownCredentials,
    timeout,
    genericError
};

// shows a status header and description in the login container
function setSubmitStatus(status?: SubmitStatus) {
    const domHeader = document.getElementById("status-header");
    const domDescription = document.getElementById("status-description");

    domHeader.style.color = "red";

    switch (status) {

        case SubmitStatus.login: {
            
            // nothing wrong, success text
            domHeader.innerHTML = "Logged in!";
            domHeader.style.color = "green";
            domDescription.innerHTML = "Sucessfully logged in! Welcome";
            document.getElementById("try-again-text").classList.add("hidden");

            setTimeout(() => {

                window.location.href = "index.html";

            }, 1000);

        } break;

        case SubmitStatus.signup: {

            domHeader.innerHTML = "Signed up!";
            domHeader.style.color = "green";
            domDescription.innerHTML = "Sucessfully signed up! Welcome";
            document.getElementById("try-again-text").classList.add("hidden");

            setTimeout(() => {

                window.location.href = "index.html";

            }, 1000);

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

        case SubmitStatus.genericError: {

            domHeader.innerHTML = "Error";
            domDescription.innerHTML = "Something went wrong";

        } break;

    }
}

async function interceptSubmit(credentialForm: HTMLFormElement, event: SubmitEvent) {
    // intercept form action
    event.preventDefault();
        
    // extract form data
    const data = new FormData(credentialForm as HTMLFormElement);

    const isSignInForm = credentialForm.classList.contains("signin");

    showLoading();

    if (!isSignInForm) {

        const username = data.get("username") as string;
        const age = (data.get("age") as unknown) as number; // scuffed typescript >_>
        const mail = data.get("email") as string;

        if (username === undefined || age === undefined || mail === undefined) {
            showPostSubmitStatus(SubmitStatus.genericError);
            return;
        }

        const success = await addUser(username, age, mail);

        if (success) {
            showPostSubmitStatus(SubmitStatus.signup);
        } else {
            showPostSubmitStatus(SubmitStatus.genericError);
        }

    } else {
        // remove email property
        data.delete("email");
        data.delete("age");
    
        const username = data.get("username") as string;
    
        if (username === undefined) {
            showPostSubmitStatus(SubmitStatus.unknownCredentials);
            return;
        }
    
    
        const success = await checkUsernameExists(username);
    
        if (success) {
            showPostSubmitStatus(SubmitStatus.login);
            return;
        } else {
            showPostSubmitStatus(SubmitStatus.wrongCredentials);
            return;
        }
    }

}

function load(): void {

    document.getElementById("link-text").addEventListener("click", (event) => toggleFormType());
    document.getElementById("try-again-u").addEventListener("click", () => showForm());

    // attach submit listener
    const credentialForm: HTMLElement = document.getElementById("credential-form");
    credentialForm.addEventListener("submit", (event) => interceptSubmit(credentialForm as HTMLFormElement, event));
    // TODO send data
    
}


// document.body.onload causes html content to be loaded prematurely and a subsequent page flicker, and is not adviced
document.addEventListener("DOMContentLoaded", load);