/*

This file contains code which is *supposed to be (convenient to be)* shared across all the different pages.

*/


// https://javascript.info/cookie

// returns the cookie with the given name,
// or undefined if not found
function getCookie(name: string): string | undefined {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// sets cookie with given name, value, and expirationdate
function setCookie(name: string, value: string, expiresMillis: number) {
    const expiresDate = new Date();
    expiresDate.setTime(expiresDate.getTime() + expiresMillis);

    const cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expiresDate.toUTCString()}; secure; samesite=lax;`;

    document.cookie = cookie;
}

/**
 * Checks if locally stored credentials are valid
 * @returns true on valid, false on invalid login information
 */
async function checkLocalCredentials(): Promise<boolean> {
    return new Promise((resolve, reject) => {

        let username = getCookie("username");

        if (username === undefined) resolve(false);
        else resolve(true);

    });
}

/**
 * checks if local login information is valid. If yes, return. If no, send user to login page
 */
async function requestLogin(): Promise<void> {

    const loginValid = await checkLocalCredentials();

    if (loginValid) return;

    // login is invalid, send user to login page
    let newUrl = new URL(window.location.href).host + "/login.html";
    console.log(newUrl);

}