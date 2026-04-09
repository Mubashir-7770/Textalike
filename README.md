# Textalike

**Your texts. Our precision.**

Textalike is a lightweight, browser-based text comparison tool that highlights word-level differences between two versions of a text and calculates their similarity percentage.

---

## Features

- **Side-by-side comparison** — paste two text versions and instantly see what changed
- **Word-level diff highlighting** — removed words are marked in red, added words in green
- **Similarity score** — displays a percentage indicating how similar the two texts are
- **Input validation** — clear error messages when one or both fields are empty
- **Clear button** — reset both inputs and results with a single click
- **Fully client-side** — no server, no data sent anywhere, works offline

---

## Usage

1. Open `index.html` in any modern browser
2. Paste your original text into the **Version 1** box
3. Paste the modified text into the **Version 2** box
4. Click **Compare**
5. View the highlighted differences and similarity score below

---

## Project Structure

```
Textalike/
├── index.html        # Main application UI
├── script.js         # Comparison logic and DOM manipulation
├── style.css         # Styling and layout
└── img/
    ├── logo.png          # Navbar logo
    ├── logo-BG.png       # Logo with background
    ├── favicon.png       # Browser tab icon
    └── favicon-BG.png    # Favicon with background
```

---

## How It Works

1. Both texts are split into tokens (words + whitespace)
2. Each word in Version 1 is checked against Version 2 — words missing from the other version are highlighted
3. Similarity is calculated as:

$$\text{Similarity} = \frac{\text{common words}}{\max(\text{words}_1,\ \text{words}_2)} \times 100$$

4. Results are rendered directly in the page with color-coded spans

---

## Tech Stack

- HTML5
- CSS3 (CSS Grid, Flexbox)
- Vanilla JavaScript (no dependencies)

---

## Getting Started

No build step or installation required.

```bash
# Clone the repo
git clone https://github.com/your-username/textalike.git

# Open in browser
cd textalike/Textalike
start index.html   # Windows
open index.html    # macOS
```

---

## License

© 2025 Textalike. All Rights Reserved.
