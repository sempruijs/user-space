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

function toggleLoading(): void {
    const form = document.getElementById("credential-form");
    const postSubmitContent = document.getElementById("post-submit-content");
    const loadingText = document.getElementById("loading-text");

    if (form.classList.contains("invisible-content")) {
        form.classList.remove("invisible-content");
        postSubmitContent.classList.add("invisible-content");
    } else {
        form.classList.add("invisible-content");
        postSubmitContent.classList.remove("invisible-content");
        loadingText.style.content = 'Loading';
    }
}

function load(): void {

    const credentialForm: HTMLElement = document.getElementById("credential-form");
    credentialForm.addEventListener("submit", event => {
        // intercept form action
        event.preventDefault();
    
        // extract form data
        const data = new FormData(credentialForm as HTMLFormElement);

        const isSignInForm = credentialForm.classList.contains("signin");

        if (isSignInForm) data.delete("email");

        toggleLoading();

        console.log(data);

       // TODO send data
    });

}

document.body.onload = load;