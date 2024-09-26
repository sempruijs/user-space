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

interface User {
    name: string;
    age: number;
    email: string
}

/**
 * Checks if locally stored credentials are valid
 * @returns true on valid, false on invalid login information
 */
async function checkUsernameExists(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

        // check username with server
        fetch("http://78.47.165.157:3030/users", {
            method: "GET"
        })
            .then(response => response.json())
            .then(response => {
    
                response.forEach((value: User, index: number) => {
                    if (value.name === username) 
                    {
                        resolve(true);
                        return;
                    }
                });

                resolve(false);

            });
    });
}

/**
 * checks if local login information is valid. If yes, return. If no, send user to login page
 */
async function requestLogin(): Promise<void> {
    const username = getCookie("username");

    if (username === undefined) window.location.replace("login.html");

    const loginValid = await checkUsernameExists(username);

    if (loginValid) return;

    // login is invalid, send user to login page
    window.location.replace("login.html");
}

(window as any).custom = {
    getCookie, setCookie,
    checkUsernameExists, requestLogin
};