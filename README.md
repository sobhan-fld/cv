# 3D Interactive CV

An interactive CV website in plain HTML, CSS and JavaScript, where scrolling drives every transition.

## Overview
This is my personal CV website with a modern 3D interface. You can check it out [here](https://sobhan-fld.github.io/cv/).

## Features
- **Scroll-driven motion**: every transition follows the scroll position, so it can rest anywhere and plays in reverse when you scroll back
- **GitHub activity**: a year of contributions as a heat map that rises into a 3D skyline as you scroll
- **Responsive Design**: Mobile-friendly and adjusts to different screen sizes
- **Two layouts**: on large windows the sections stay in place and scrolling carries you from one to the next (Experience steps through its roles one at a time); phones, tablets and short windows scroll normally, with content settling in as it arrives. Each section has its own link (`#experience`, `#github`, …)
- **Modern UI**: Glassmorphism effects and gradient designs
- **Multilingual Support**: Content available in English and Spanish through JSON files

## File Structure
```
cv/
├── index.html          # Main HTML file
├── styles.css          # Styles and animations
├── scripts.js          # Content, layouts and the scroll-driven motion
├── skyline.js          # GitHub activity: heat map that rises into a 3D skyline
├── english.json        # English content
├── espanol.json        # Spanish content (if needed)
├── assets/
│   ├── cv.pdf          # PDF version of CV
│   ├── github-contributions.json  # Fallback snapshot if the live GitHub feed is down
│   └── profile.png     # Profile picture
└── README.md
```

## Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge)
- A local web server (for development)

### Running Locally

**Using Python (PowerShell):**
```powershell
cd C:\Users\sobha\Code\cv
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using VS Code:**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

## Customization
- Update content in `english.json` and `espanol.json`
- Replace `assets/profile.png` with your picture
- Modify `assets/cv.pdf` with your CV PDF
- Customize colors in `styles.css` (CSS variables at the top)
- Adjust how far you scroll per section in `scripts.js` (`TRANSITION_VH`, `HOLD_VH`, `ROLE_VH`)

## Technologies Used
- Vanilla JavaScript (no build step)
- Canvas 2D for the contribution skyline
- CSS3 with Glassmorphism effects

## License
This project is available under the [MIT License](LICENSE).
