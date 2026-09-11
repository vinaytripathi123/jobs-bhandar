/* =========================================================
   JOBSBHANDAR
   PUBLIC WEBSITE - FRONTEND + SUPABASE JOB LOADING
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuButton =
        document.getElementById("menuButton");

    const mainNav =
        document.getElementById("mainNav");

    if (menuButton && mainNav) {

        menuButton.addEventListener("click", () => {

            const isOpen =
                mainNav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        });

        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                document.body.classList.remove(
                    "menu-open"
                );

            });

        });

    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    let revealObserver = null;

    function setupRevealObserver() {

        const revealElements =
            document.querySelectorAll(
                ".reveal:not([data-reveal-ready])"
            );

        if (!("IntersectionObserver" in window)) {

            revealElements.forEach(element => {

                element.classList.add("visible");

                element.setAttribute(
                    "data-reveal-ready",
                    "true"
                );

            });

            return;
        }

        if (!revealObserver) {

            revealObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(entry => {

                            if (entry.isIntersecting) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        });

                    },
                    {
                        threshold: 0.12
                    }
                );

        }

        revealElements.forEach(element => {

            element.setAttribute(
                "data-reveal-ready",
                "true"
            );

            revealObserver.observe(element);

        });

    }

    setupRevealObserver();


    /* =====================================================
       SUPABASE JOB LOADING
    ===================================================== */

    const latestJobs =
        document.getElementById("latestJobs");

    const noResults =
        document.getElementById("noResults");
       /*
     * CATEGORY JOB SECTIONS
     * Government / Private / Internship / Work From Home
     */

    const categorySections = {
        government: document.querySelector("#government .jobs-grid"),
        private: document.querySelector("#private .jobs-grid"),
        internship: document.querySelector("#internships .jobs-grid"),
        remote: document.querySelector("#work-from-home .jobs-grid")
    };

    function showCategoryMessage(container, title, message) {
        if (!container) return;

        container.innerHTML = `
            <div class="category-empty-message">
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
    }

    function renderCategoryJobs(jobs) {

        Object.values(categorySections).forEach(container => {
            if (container) {
                container.innerHTML = "";
            }
        });

        const categories = {
            government: [],
            private: [],
            internship: [],
            remote: []
        };

        jobs.forEach(job => {

            const category =
                String(job.category || "")
                    .trim()
                    .toLowerCase();

            if (category.includes("government")) {
                categories.government.push(job);
            }

            else if (category.includes("private")) {
                categories.private.push(job);
            }

            else if (category.includes("intern")) {
                categories.internship.push(job);
            }

            else if (
                category.includes("work") ||
                category.includes("remote")
            ) {
                categories.remote.push(job);
            }
        });

        const render = (
            container,
            jobs,
            emptyTitle,
            emptyMessage
        ) => {

            if (!container) return;

            if (jobs.length === 0) {

                showCategoryMessage(
                    container,
                    emptyTitle,
                    emptyMessage
                );

                return;
            }

            jobs.forEach(job => {

                container.appendChild(
                    createJobCard(job)
                );

            });
        };

        render(
            categorySections.government,
            categories.government,
            "No Government Jobs Available",
            "New government opportunities will be added soon."
        );

        render(
            categorySections.private,
            categories.private,
            "No Private Jobs Available",
            "New private sector opportunities will be added soon."
        );

        render(
            categorySections.internship,
            categories.internship,
            "No Internships Available",
            "New internship opportunities will be added soon."
        );

        render(
            categorySections.remote,
            categories.remote,
            "No Work From Home Jobs Available",
            "New remote opportunities will be added soon."
        );

        setupRevealObserver();
    }

    if (latestJobs) {

        try {

            if (
                typeof supabaseClient === "undefined" ||
                !supabaseClient
            ) {

                console.error(
                    "Supabase client not found."
                );

            } else {

                const { data, error } =
                    await supabaseClient
                        .from("jobs")
                        .select("*")
                        .eq("is_active", true)
                        .order(
                            "created_at",
                            {
                                ascending: false
                            }
                        );

                if (error) {

                    console.error(
                        "Failed to load jobs:",
                        error
                    );

                } else {

                    console.log(
                        "Public jobs loaded:",
                        data
                    );

                    /*
                     * Remove old static job cards.
                     * Supabase jobs will be displayed here.
                     */

                    latestJobs.innerHTML = "";
                   renderCategoryJobs(data || []);
            


                    if (!data || data.length === 0) {

                        if (noResults) {
                            noResults.hidden = false;
                        }

                    } else {

                        if (noResults) {
                            noResults.hidden = true;
                        }


                        data.forEach(job => {

                            const card =
                                createJobCard(job);

                            latestJobs.appendChild(
                                card
                            );

                        });


                        /*
                         * Start reveal animation
                         * for newly-created cards.
                         */

                        setupRevealObserver();

                    }

                }

            }

        } catch (error) {

            console.error(
                "Unexpected error while loading jobs:",
                error
            );

        }

    }


    /* =====================================================
       CREATE JOB CARD
    ===================================================== */

    function createJobCard(job) {

        const card =
            document.createElement("article");

        card.className =
            "job-card reveal";


        const title =
            job.title ||
            "Job Opportunity";

        const company =
            job.company ||
            "Company";

        const location =
            job.location ||
            "India";

        const category =
            job.category ||
            "Job";

        const jobType =
            job.job_type ||
            "Full Time";

        const salary =
            job.salary ||
            "Salary not specified";

        const qualification =
            job.qualification ||
            "Qualification not specified";

        const experience =
            job.experience ||
            "Experience not specified";

        const lastDate =
            job.last_date ||
            "Apply soon";

        const applyLink =
            job.apply_link ||
            "#";


        /*
         * Company logo letters
         */

        const logoText =
            company
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(word => word.charAt(0))
                .join("")
                .toUpperCase();


        /*
         * Category styling
         */

        const categoryLower =
            category.toLowerCase();

        let logoClass =
            "";

        let statusClass =
            "";

        if (
            categoryLower.includes("private")
        ) {

            logoClass =
                "purple";

        } else if (
            categoryLower.includes("intern")
        ) {

            logoClass =
                "orange";

            statusClass =
                "orange-status";

        } else if (
            categoryLower.includes("work") ||
            categoryLower.includes("remote")
        ) {

            logoClass =
                "green-logo";

            statusClass =
                "green";

        }


        /*
         * Searchable text
         */

        card.dataset.search =
            [
                title,
                company,
                location,
                category,
                jobType,
                salary,
                qualification,
                experience
            ]
                .join(" ")
                .toLowerCase();


        /*
         * Card HTML
         */

        card.innerHTML = `
            <div class="job-top">

                <div class="company-logo ${logoClass}">
                    ${escapeHtml(logoText)}
                </div>

                <span class="job-status ${statusClass}">
                    ${escapeHtml(category)}
                </span>

            </div>


            <div class="job-type">
                ${escapeHtml(jobType)}
            </div>


            <h3>
                ${escapeHtml(title)}
            </h3>


            <div class="company">
                ${escapeHtml(company)}
            </div>


            <div class="job-meta">

                <span>
                    📍 ${escapeHtml(location)}
                </span>

                <span>
                    💰 ${escapeHtml(salary)}
                </span>

                <span>
                    🎓 ${escapeHtml(qualification)}
                </span>

                <span>
                    💼 ${escapeHtml(experience)}
                </span>

            </div>


            <div class="job-bottom">

                <span>
                    Last Date: ${escapeHtml(lastDate)}
                </span>

                <a
                    class="job-button"
                    href="${escapeAttribute(applyLink)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Apply Now
                </a>

            </div>
        `;


        return card;

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("jobSearch");


    if (
        searchForm &&
        searchInput &&
        latestJobs
    ) {

        function performSearch() {

            const searchValue =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const jobCards =
                latestJobs.querySelectorAll(
                    ".job-card"
                );

            let visibleJobs = 0;


            jobCards.forEach(card => {

                const searchableText =
                    (
                        card.dataset.search ||
                        card.innerText ||
                        ""
                    ).toLowerCase();


                const matches =
                    searchValue === "" ||
                    searchableText.includes(
                        searchValue
                    );


                card.style.display =
                    matches ? "" : "none";


                if (matches) {
                    visibleJobs++;
                }

            });


            if (noResults) {

                noResults.hidden =
                    visibleJobs !== 0;

            }

        }


        searchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                performSearch();

                latestJobs.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );


        searchInput.addEventListener(
            "input",
            performSearch
        );

    }


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const footerBottom =
        document.querySelector(
            ".footer-bottom"
        );

    if (footerBottom) {

        const currentYear =
            new Date().getFullYear();

        footerBottom.innerHTML =
            footerBottom.innerHTML.replace(
                /2026/g,
                currentYear
            );

    }


    /* =====================================================
       HTML SAFETY HELPERS
    ===================================================== */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function escapeAttribute(value) {

        const stringValue =
            String(value || "#")
                .trim();

        /*
         * Allow normal web URLs.
         * Prevent javascript: URLs.
         */

        if (
            stringValue
                .toLowerCase()
                .startsWith("javascript:")
        ) {

            return "#";

        }

        return escapeHtml(
            stringValue
        );

    }

});
