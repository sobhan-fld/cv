# 3D Interactive CV

A stunning 3D interactive CV website built with Three.js, featuring particle effects, floating 3D objects, and smooth animations.

## Overview
This is my personal CV website with a modern 3D interface. You can check it out [here](https://sobhan-fld.github.io/cv/).

## Features
- **3D Interactive Experience**: Particle system and floating 3D geometric shapes
- **Responsive Design**: Mobile-friendly and adjusts to different screen sizes
- **Smooth Animations**: Scroll-triggered animations and transitions
- **Modern UI**: Glassmorphism effects and gradient designs
- **Multilingual Support**: Content available in English and Spanish through JSON files

## File Structure
```
cv/
├── index.html          # Main HTML file
├── styles.css          # Styles and animations
├── scripts.js          # Three.js 3D scene and interactions
├── english.json        # English content
├── espanol.json        # Spanish content (if needed)
├── assets/
│   ├── cv.pdf          # PDF version of CV
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
- Adjust 3D effects in `scripts.js`

## Technologies Used
- Three.js for 3D graphics
- GSAP for animations
- Vanilla JavaScript
- CSS3 with Glassmorphism effects

## License
This project is available under the [MIT License](LICENSE).
