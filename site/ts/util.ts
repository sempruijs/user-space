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