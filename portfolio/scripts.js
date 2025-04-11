document.addEventListener("DOMContentLoaded", function() {
    loadLanguageData("../english.json");
});

function loadLanguageData(dataFile) {
    fetch(dataFile)
        .then(response => response.json())
        .then(data => {
            document.getElementById("profilePicture").src = data.profilePicture;
            document.getElementById("fullName").textContent = data.fullName;
            document.getElementById("title").textContent = data.title;
            document.getElementById("email").textContent = data.contact.email;
            document.getElementById("address").textContent = data.contact.address;
            // document.getElementById("phone").textContent = data.contact.phone;
            document.getElementById("dob").textContent = data.contact.dob;
            const linkedin = document.getElementById("linkedin");
            linkedin.href = data.contact.linkedin;
            linkedin.textContent = data.contact.linkedin;
            populateObjective("objectiveContent", data.objective);
            populateExperience("experienceList", data.experience);
            populateList("educationList", data.education);
            populateList("skillsList", data.skills);
            populateList("languagesList", data.languages);
            translateTitles(data.translations);
        })
        .catch(error => console.error("Error fetching JSON data:", error));
}

function changeLanguage() {
    const languageSelect = document.getElementById("languageSelect");
    const selectedLanguage = languageSelect.value;
    loadLanguageData(selectedLanguage);
}

document.getElementById("languageSelect").addEventListener("change", changeLanguage);

document.getElementById("toggleModeButton").addEventListener("click", function() {
    const body = document.body;
    const button = document.getElementById("toggleModeButton");
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        button.textContent = "Dark Mode";
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        button.textContent = "Light Mode";
    }
});

document.getElementById("burgerMenuButton").addEventListener("click", toggleMenu);
document.getElementById("closeMenuButton").addEventListener("click", toggleMenu);
document.addEventListener("click", function(event) {
    const menu = document.getElementById("menu");
    const burgerMenuButton = document.getElementById("burgerMenuButton");

    // Check if the menu is open and the click is outside both the menu and the button
    if (menu.classList.contains("open") &&
        !menu.contains(event.target) &&
        !burgerMenuButton.contains(event.target)) {
        menu.classList.remove("open");
        burgerMenuButton.classList.remove("hidden");
    }
});


function toggleMenu() {
    const menu = document.getElementById('menu');
    const burgerMenuButton = document.getElementById('burgerMenuButton');
    menu.classList.toggle('open');
    burgerMenuButton.classList.toggle('hidden');
}

document.getElementById("sendEmailButton").addEventListener("click", function() {
    window.location.href = 'mailto:fooladi.sobhan@outlook.com';
});

function translateTitles(translations) {
    document.getElementById("contactTitle").textContent = translations.contact;
    document.getElementById("objectiveTitle").textContent = translations.objective;
    document.getElementById("experienceTitle").textContent = translations.experience;
    document.getElementById("educationTitle").textContent = translations.education;
    document.getElementById("skillsTitle").textContent = translations.skills;
    document.getElementById("languagesTitle").textContent = translations.languages;

    document.getElementById("contactLink").textContent = translations.contact;
    document.getElementById("objectiveLink").textContent = translations.objective;
    document.getElementById("experienceLink").textContent = translations.experience;
    document.getElementById("educationLink").textContent = translations.education;
    document.getElementById("skillsLink").textContent = translations.skills;
    document.getElementById("languagesLink").textContent = translations.languages;
}

function populateObjective(objectiveId, objectiveArray) {
    const container = document.getElementById(objectiveId);
    container.innerHTML = "";
    objectiveArray.forEach(paragraph => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        container.appendChild(p);
    });
}

function populateExperience(experienceId, experienceArray) {
    const container = document.getElementById(experienceId);
    container.innerHTML = "";
    experienceArray.forEach(exp => {
        const expDiv = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = `${exp.position} (${exp.location}) - ${exp.period}`;
        expDiv.appendChild(title);
        const ul = document.createElement("ul");
        exp.responsibilities.forEach(responsibility => {
            const li = document.createElement("li");
            li.textContent = responsibility;
            ul.appendChild(li);
        });
        expDiv.appendChild(ul);
        container.appendChild(expDiv);
    });
}

function populateList(listId, items) {
    const list = document.getElementById(listId);
    list.innerHTML = "";
    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}

