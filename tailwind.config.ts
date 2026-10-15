import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./design-tokens/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      /* ── Semantic color tokens (pure CSS custom property mappings) ── */
      colors: {
        bg: "var(--bg)",
        "bg-subtle": "var(--bg-subtle)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        raised: "var(--surface-raised)",
        inset: "var(--surface-inset)",
        overlay: "var(--overlay)",
        "surface-overlay": "var(--surface-overlay)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        ring: "var(--ring)",

        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          active: "var(--primary-active)",
          subtle: "var(--primary-subtle)",
          border: "var(--primary-border)",
          fg: "var(--primary-fg)",
          foreground: "var(--primary-foreground)",
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          950: "var(--primary-950)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          active: "var(--accent-active)",
          subtle: "var(--accent-subtle)",
          border: "var(--accent-border)",
          fg: "var(--accent-fg)",
          foreground: "var(--accent-foreground)",
          50: "var(--accent-50)",
          100: "var(--accent-100)",
          200: "var(--accent-200)",
          300: "var(--accent-300)",
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "var(--accent-700)",
          800: "var(--accent-800)",
          900: "var(--accent-900)",
          950: "var(--accent-950)",
        },
        success: {
          DEFAULT: "var(--success)",
          hover: "var(--success-hover)",
          subtle: "var(--success-subtle)",
          border: "var(--success-border)",
          fg: "var(--success-fg)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          hover: "var(--warning-hover)",
          subtle: "var(--warning-subtle)",
          border: "var(--warning-border)",
          fg: "var(--warning-fg)",
          foreground: "var(--warning-foreground)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          hover: "var(--danger-hover)",
          subtle: "var(--danger-subtle)",
          border: "var(--danger-border)",
          fg: "var(--danger-fg)",
          foreground: "var(--danger-foreground)",
        },
        info: {
          DEFAULT: "var(--info)",
          hover: "var(--info-hover)",
          subtle: "var(--info-subtle)",
          border: "var(--info-border)",
          fg: "var(--info-fg)",
          foreground: "var(--info-foreground)",
        },
        "badge-free": {
          DEFAULT: "var(--badge-free)",
          foreground: "var(--badge-free-foreground)",
          subtle: "var(--badge-free-subtle)",
        },
        "badge-paid": {
          DEFAULT: "var(--badge-paid)",
          foreground: "var(--badge-paid-foreground)",
          subtle: "var(--badge-paid-subtle)",
        },
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-placeholder": "var(--text-placeholder)",
        "text-disabled": "var(--text-disabled)",
        "text-inverse": "var(--text-inverse)",
        "text-link": "var(--text-link)",
        "accent-text": "var(--accent-text)",

        /* Chart visual series */
        "chart-1": "var(--chart-1)",
        "chart-2": "var(--chart-2)",
        "chart-3": "var(--chart-3)",
        "chart-4": "var(--chart-4)",
        "chart-5": "var(--chart-5)",
        "chart-6": "var(--chart-6)",
        "chart-grid": "var(--chart-grid)",
        "chart-axis": "var(--chart-axis)",

        /* 8 Whole-Person Talent Categories */
        talent: {
          technical: "var(--talent-technical)",
          "technical-subtle": "var(--talent-technical-subtle)",
          "technical-fg": "var(--talent-technical-fg)",
          dance: "var(--talent-dance)",
          "dance-subtle": "var(--talent-dance-subtle)",
          "dance-fg": "var(--talent-dance-fg)",
          music: "var(--talent-music)",
          "music-subtle": "var(--talent-music-subtle)",
          "music-fg": "var(--talent-music-fg)",
          sports: "var(--talent-sports)",
          "sports-subtle": "var(--talent-sports-subtle)",
          "sports-fg": "var(--talent-sports-fg)",
          drama: "var(--talent-drama)",
          "drama-subtle": "var(--talent-drama-subtle)",
          "drama-fg": "var(--talent-drama-fg)",
          creative: "var(--talent-creative)",
          "creative-subtle": "var(--talent-creative-subtle)",
          "creative-fg": "var(--talent-creative-fg)",
          communication: "var(--talent-communication)",
          "communication-subtle": "var(--talent-communication-subtle)",
          "communication-fg": "var(--talent-communication-fg)",
          leadership: "var(--talent-leadership)",
          "leadership-subtle": "var(--talent-leadership-subtle)",
          "leadership-fg": "var(--talent-leadership-fg)",
        },
      },

      /* ── Typography ───────────────────────────────────────── */
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Space Grotesk", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },

      /* ── Box shadows ─────────────────────────────────────── */
      boxShadow: {
        xs: "0 1px 2px rgba(var(--shadow-color) / 0.05)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        glow: "var(--glow-primary)",
      },

      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
      },

      /* ── Animations ──────────────────────────────────────── */
      animation: {
        "fade-in": "fadeIn 0.25s cubic-bezier(0.2,0,0,1) both",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.2,0,0,1) both",
        "slide-right": "slideInRight 0.3s cubic-bezier(0.2,0,0,1) both",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px -2px var(--primary)" },
          "50%": { boxShadow: "0 0 20px 2px var(--primary)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },

      /* ── Background images (gradients) ──────────────────── */
      backgroundImage: {
        "gradient-brand": "var(--gradient-brand)",
        "gradient-aurora": "var(--gradient-aurora)",
      },
    },
  },
  plugins: [],
};

export default config;
