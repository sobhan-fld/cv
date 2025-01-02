document.addEventListener("DOMContentLoaded", function() {
    const terminalInput = document.getElementById("input");
    const terminalOutput = document.getElementById("output");

    const commandHistory = [];
    let historyIndex = -1;

    // Add the blinking cursor
    const cursor = document.createElement("div");
    cursor.id = "cursor";
    cursor.style.display = "inline-block";
    cursor.style.width = "10px";
    cursor.style.height = "1rem";
    cursor.style.backgroundColor = "#0f0";
    cursor.style.animation = "blink 0.6s step-end infinite";

    // Default terminal output
    function showDefaultOutput() {
        printToTerminal("Welcome to Sobhan's Terminal CV!");
        printToTerminal("Type 'cv --help' to get started with cv and 'portfolio' for open portfolio website page.");
    }

    function printToTerminal(message) {
        let index = 0;

        // Create a new line for the message
        const line = document.createElement("span");
        terminalOutput.appendChild(line);
        terminalOutput.appendChild(document.createElement("br"));

        function typeCharacter() {
            if (index < message.length) {
                line.textContent += message[index];
                index++;
                terminalOutput.scrollTop = terminalOutput.scrollHeight; // Scroll to bottom
                // Move the cursor to the end of the current line
                line.appendChild(cursor);
                setTimeout(typeCharacter, 8); // Adjust speed here (milliseconds per character)
            }
        }

        // Append the cursor to the current line before typing starts
        line.appendChild(cursor);
        typeCharacter();
    }

    function executeCommand(command) {
        const args = command.trim().split(" ");
        const cmd = args[0];
        const params = args.slice(1);

        switch (cmd) {
            case "cv":
                handleCVCommands(params);
                break;
            case "clear":
                terminalOutput.textContent = "";
                terminalOutput.appendChild(cursor); // Reset cursor
                showDefaultOutput();
                break;
            case "cowsay":
                handleCowsayCommand(params.join(" "));
                break;
            case "portfolio":
                window.open("portfolio/index.html");
                break;
            default:
                printToTerminal(`Command not found: ${cmd}`);
        }
    }

    function handleCowsayCommand(message) {
        if (!message) {
            printToTerminal("Usage: cowsay [message]");
            return;
        }

        const cowArt = `
        ${"_".repeat(message.length + 2)}
       < ${message} >
        ${"-".repeat(message.length + 2)}
           \\   ^__^
            \\  (oo)\\_______
               (__)\\       )\\/\\
                   ||----w |
                   ||     ||
        `;
        printToTerminal(cowArt);
    }

    function handleCVCommands(params) {
        fetch("english.json")
            .then(response => response.json())
            .then(data => {
                if (params[0] === "--help") {
                    printToTerminal("Available commands: cv --help --info --ps (for professional summary) --skills --ex (for experience) --edu (for education) --pdf (for pdf link)");
                } else if (params[0] === "--language") {
                    const languages = data.languages.join("\n"); // Format array for better display
                    printToTerminal(languages);
                } else if (params[0] === "--info") {
                    printToTerminal(`${data.fullName}\n${data.title}\nEmail: ${data.contact.email}\nPhone: ${data.contact.phone}`);
                } else if (params[0] === "--skills") {
                    const skills = data.skills.join("\n"); // Format array for better display
                    printToTerminal(skills);
                } else if (params[0] === "--ps") {
                    const objective = data.objective.join("\n"); // Format array for better display
                    printToTerminal(objective);
                } else if (params[0] === "--ex") {
                    const experience = data.experience.map(exp => {
                        return `Position: ${exp.position}\nLocation: ${exp.location}\nPeriod: ${exp.period}\nResponsibilities:\n- ${exp.responsibilities.join("\n- ")}`;
                    }).join("\n\n"); // Separate each experience with a blank line
                    printToTerminal(experience);
                } else if (params[0] === "--pdf") {
                    window.open("portfolio/cv.pdf", "_blank"); // Open the PDF in a new tab
                } else if (params[0] === "--edu") {
                    const education = data.education.join("\n");
                    printToTerminal(education);
                } else {
                    printToTerminal("Invalid cv command. Use 'cv --help' for guidance.");
                }
            })
            .catch(error => printToTerminal("Error fetching CV data."));
    }

    // Show default output
    showDefaultOutput();

    terminalInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const command = terminalInput.value;
            terminalInput.value = "";
            printToTerminal(`> ${command}`);
            executeCommand(command);

            // Add command to history
            if (command.trim()) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
            }
        } else if (event.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = "";
            }
        }
    });

    terminalInput.addEventListener("focus", function() {
        cursor.style.display = "inline-block";
    });

    terminalInput.addEventListener("blur", function() {
        cursor.style.display = "none";
    });

    // Append the cursor to the terminal output initially
    terminalOutput.appendChild(cursor);
});
