# Design System: React Cloud Resume
**Project ID:** cloud-resume-v2

## 1. Visual Theme & Atmosphere
The design aesthetic is best described as "The Engineer's Dashboard." The mood is highly technical, utilitarian, and developer-centric, balancing a refined, airy Light Mode with a deep, immersive Dark Mode. It utilizes high-contrast syntax highlighting, glass/surface layers, and a console-like feel for a premium engineering presentation.

## 2. Color Palette & Roles
* **Primary Action Blue (#137fec):** Used for primary buttons, prominent text accents, and key interactive elements.
* **Secondary Teal (#008080):** Used for subtle secondary accents.
* **Light Base Background (#f6f7f8):** The primary canvas for light mode, offering a soft off-white backdrop.
* **Dark Base Background (#0a0a0a):** The primary canvas for dark mode, providing deep contrast.
* **Light Surface Panel (#ffffff):** Used for cards, containers, and elevated components in light mode.
* **Dark Surface Panel (#121212):** Used for cards, containers, and elevated components in dark mode.
* **Subtle Surface Border (rgba(255, 255, 255, 0.12)):** Used to define container edges and create subtle separation between dark mode layers.
* **Dark Typography Primary (#1f2937):** High-contrast text on light backgrounds.
* **Dark Typography Secondary (#4b5563):** Muted supporting text on light backgrounds.
* **IDE Keyword Accent (#c678dd / #a626a4):** Used for code blocks and technical highlights (e.g. `const`, `function`).
* **IDE String Accent (#98c379 / #50a14f):** Used for code strings and data values inside code blocks.

## 3. Typography Rules
* **Display Font (Inter, sans-serif):** Used for overarching layout, primary headlines, body text, and narrative content. Clean, modern, and highly legible.
* **Monospace Font (Fira Code, monospace):** Used extensively for tech stacks, component names, metrics, IDE windows, and console-like elements to enforce the "developer" theme.

## 4. Component Stylings (Tailwind CSS v4)
* **Buttons:** Subtly rounded corners (`rounded-lg`), often appearing with transparent or ghost styles, border hovers, or solid primary colors for primary actions. They use subtle shadows (`shadow-sm`, `shadow-md`).
* **Cards/Containers:** Generously rounded corners (`rounded-xl`), creating distinct, pill-like or card-like boundaries. They utilize soft shadows in light mode and deeper, layered shadows in dark mode to signify elevation. Borders are subtle to maintain a clean aesthetic (`border border-slate-700/50` or similar).
* **IDE Code Windows:** Replicates code editors with Mac-style window controls (red, yellow, green dots), tab navigation (`profile.json`), and syntax-highlighted code lines with numerical gutters.
* **Inputs/Forms:** Typically bordered with soft grays in light mode or faint transparencies in dark mode (`surface-border`).

## 5. Layout Principles
* **Spacing:** Generous and airy whitespace using standard padding multipliers (Tailwind's `gap-8`, `space-y-6`), providing breathing room between sections. 
* **Alignment:** Grid-based and responsive. The layout employs a Flexbox or CSS Grid column structure (e.g., `flex-col md:flex-row`) that elegantly breaks down from desktop side-by-side modules into stacked mobile views.
* **Status Elements:** Frequent use of micro-animations (like a pulsing green "Open to Work" dot or a blinking IDE cursor) to create a dynamic, "live system" feel.
