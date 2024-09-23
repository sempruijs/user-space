// toggles between signin / signup form
function toggleFormType(): void {
    const form = document.getElementById("credential-form");
    const optionalContent = document.getElementById("optional-form-content");
    const submitButton = document.getElementById("submit-button");

    if (form.classList.contains("signin")) {
        optionalContent.classList.remove("hidden");
        form.classList.remove("signin");
        submitButton.innerHTML = "Sign Up";
    }
    else {
        optionalContent.classList.add("hidden");
        form.classList.add("signin");
        submitButton.innerHTML = "Sign In";
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

        // console.log(data, isSignInForm);

       // TODO send data 
    });

    // check if login credentials are saved
    // and yes I am storing the password in plaintext in a cookie
    // deal with it
    const username = getCookie("username");

}

document.body.onload = load;