const modal = document.getElementById('profileModal') as HTMLElement;
const profilesGrid = document.querySelector('.profilesGrid') as HTMLElement;
const modalName = modal.querySelector('h2') as HTMLElement;
const modalDepartment = modal.querySelector('p') as HTMLElement;
const modalPhone = modal.querySelector('p:nth-of-type(2)') as HTMLElement;
const modalEmail = modal.querySelector('p:nth-of-type(3)') as HTMLElement;

document.addEventListener('DOMContentLoaded', function () {

    const searchBar = document.getElementById('search-bar');
    const searchIcon = document.getElementById('search-icon');
    const closeBtn = document.getElementById('closeModal');
    const viewProfileButtons = document.querySelectorAll('button[id^="viewProfile"]');

    viewProfileButtons.forEach(button => {
        button.addEventListener('click', () => openModal(modal));
    });

    closeBtn.addEventListener('click', () => closeModal(modal));

    searchBar?.addEventListener('focus', function () {
        searchIcon?.classList.add('hidden');
    });

    searchBar?.addEventListener('blur', function () {
        searchIcon?.classList.remove('hidden');
    });
});

function openModal(modal: HTMLElement) {
    modal.classList.add('show');
    modal.classList.remove('hidden');
}

function closeModal(modal: HTMLElement) {
    modal.classList.remove('show');
    modal.classList.add('hidden');
}

async function main() {
    const users = await getUsers();
    console.log("Length of users: " + users.length);
}

async function getUsers(): Promise<Array<{ name: string, age: number, email: string }>> {
    const userObjects: { name: string; age: number; email: string }[] = [];

    try {
        const response = await fetch('http://78.47.165.157:3030/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            }
        });

        const users = await response.json();

        if (Array.isArray(users)) {
            profilesGrid.innerHTML = '';  // Clear 'loading' profiles

            users.forEach((user, index) => {
                const profileCard = createProfileCard(user, index + 1);
                profilesGrid.appendChild(profileCard);
            });

            return userObjects;
        } else {
            console.error('Unexpected response format:', users);
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function createProfileCard(user: { name: string, age: number, email: string }, index: number): HTMLElement {
    const profileCard = document.createElement('div');
    profileCard.classList.add('profile');

    profileCard.innerHTML = `
               <img src="media/pfp.png" alt="profile picture" class="profilePicture">
            <a href="mailto:${user.email}">
                <img src="media/message.svg" alt="send message" class="sendMessage">
            </a>
            <a href="intent://vnd.android.cursor.dir/raw_contact/#Intent;action=android.intent.action.INSERT;S.email=randomMail@gmail.com;S.phone=+31 6 123456789end;">
                <img src="media/add-contact.svg" alt="add contact" class="addContact">
            </a>
            <p>${user.name}</p>
            <p>Age: ${user.age}</p>
            <button id="viewProfile${index}">View Profile</button>
    `;

    const viewProfileButton = profileCard.querySelector(`#viewProfile${index}`);
    viewProfileButton?.addEventListener('click', () => {
        updateModalContent(user);
        openModal(modal);
    });

    return profileCard;
}

function updateModalContent(user: { name: string, age: number, email: string }) {
    modalName.textContent = user.name;
    modalEmail.textContent = user.email;
    modalPhone.textContent = `+31 6 123456789`;
    modalDepartment.textContent = `Age: ${user.age}`;
}

main();
