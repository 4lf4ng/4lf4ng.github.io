(() => {
    "use strict";

    const root = document.documentElement;
    const themeButton = document.querySelector(".theme-toggle");
    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".primary-nav");
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const storageKey = "4lf4-theme";

    const getSavedTheme = () => {
        try {
            const value = window.localStorage.getItem(storageKey);
            return value === "light" || value === "dark" ? value : null;
        } catch (error) {
            return null;
        }
    };

    const saveTheme = (theme) => {
        try {
            window.localStorage.setItem(storageKey, theme);
        } catch (error) {
            // Theme switching still works when storage is unavailable.
        }
    };

    const applyTheme = (theme) => {
        const nextTheme = theme === "light" ? "light" : "dark";
        root.dataset.theme = nextTheme;

        if (themeButton) {
            const targetTheme = nextTheme === "light" ? "dark" : "light";
            themeButton.setAttribute("aria-label", `Switch to ${targetTheme} theme`);
            themeButton.setAttribute("title", `Switch to ${targetTheme} theme`);
        }

        if (themeColorMeta) {
            themeColorMeta.setAttribute(
                "content",
                nextTheme === "light" ? "#f5f6fa" : "#090b12"
            );
        }
    };

    // Restore the saved preference; the HTML default remains dark.
    applyTheme(getSavedTheme() || root.dataset.theme || "dark");

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
            applyTheme(nextTheme);
            saveTheme(nextTheme);
        });
    }

    const closeMenu = () => {
        if (!menuButton || !nav) return;
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.setAttribute("title", "Open navigation");
    };

    if (menuButton && nav) {
        menuButton.addEventListener("click", () => {
            const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
            nav.classList.toggle("is-open", isOpen);
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
            menuButton.setAttribute("title", isOpen ? "Close navigation" : "Open navigation");
        });

        nav.addEventListener("click", (event) => {
            if (event.target.closest("a")) closeMenu();
        });

        document.addEventListener("click", (event) => {
            if (
                nav.classList.contains("is-open") &&
                !nav.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) closeMenu();
        });
    }

    // Keep the footer year current on every page.
    document.querySelectorAll("[data-year]").forEach((element) => {
        element.textContent = String(new Date().getFullYear());
    });
})();
