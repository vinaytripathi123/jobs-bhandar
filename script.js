/* =========================================================
   JOBSBHANDAR
   PUBLIC WEBSITE
   SUPABASE + CATEGORY INTEGRATION + SEARCH
   ========================================================= */

   document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       MOBILE MENU
       EXISTING FEATURE PRESERVED
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


        mainNav
            .querySelectorAll("a")
            .forEach(link => {

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
       EXISTING ANIMATION PRESERVED
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

                            if (
                                entry.isIntersecting
                            ) {

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
       MAIN ELEMENTS
    ===================================================== */

    const latestJobs =
        document.getElementById(
            "latestJobs"
        );


    const noResults =
        document.getElementById(
            "noResults"
        );


    const searchForm =
        document.getElementById(
            "searchForm"
        );


    const searchInput =
        document.getElementById(
            "jobSearch"
        );


    /* =====================================================
       CATEGORY CONTAINERS
    ===================================================== */

    const categoryGrids = {

        government:
            document.querySelector(
                "#government .jobs-grid"
            ),

        private:
            document.querySelector(
                "#private .jobs-grid"
            ),

        internship:
            document.querySelector(
                "#internships .jobs-grid"
            ),

        wfh:
            document.querySelector(
                "#work-from-home .jobs-grid"
            )

    };


    /* =====================================================
       ALL JOB DATA
    ===================================================== */

    let allJobs = [];


    /* =====================================================
       HTML SAFETY
    ===================================================== */

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function escapeAttribute(value) {

        const text =
            String(value || "#")
                .trim();


        if (
            text
                .toLowerCase()
                .startsWith("javascript:")
        ) {

            return "#";

        }


        return escapeHtml(text);

    }


    /* =====================================================
       CATEGORY NORMALIZATION
    ===================================================== */

    function normalizeCategory(category) {

        const value =
            String(category || "")
                .trim()
                .toLowerCase();


        if (
            value.includes("government") ||
            value.includes("govt") ||
            value.includes("sarkari")
        ) {

            return "government";

        }


        if (
            value.includes("internship") ||
            value.includes("intern")
        ) {

            return "internship";

        }


        if (
            value.includes("work from home") ||
            value.includes("work-from-home") ||
            value.includes("wfh") ||
            value.includes("remote")
        ) {

            return "wfh";

        }


        if (
            value.includes("private") ||
            value.includes("corporate")
        ) {

            return "private";

        }


        return "";

    }


    /* =====================================================
       CREATE JOB CARD
    ===================================================== */

    function createJobCard(job) {

        const card =
            document.createElement(
                "article"
            );


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


        const jobId =
            job.id;


        /* =================================================
           COMPANY INITIALS
        ================================================= */

        const logoText =
            company
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(word =>
                    word.charAt(0)
                )
                .join("")
                .toUpperCase();


        /* =================================================
           CATEGORY STYLE
        ================================================= */

        const categoryKey =
            normalizeCategory(
                category
            );


        let logoClass = "";

        let statusClass = "";


        if (
            categoryKey === "private"
        ) {

            logoClass =
                "purple";

        }


        if (
            categoryKey === "internship"
        ) {

            logoClass =
                "orange";

            statusClass =
                "orange-status";

        }


        if (
            categoryKey === "wfh"
        ) {

            logoClass =
                "green-logo";

            statusClass =
                "green";

        }


        if (
            categoryKey === "government"
        ) {

            statusClass =
                "green";

        }


        /* =================================================
           SEARCH DATA
        ================================================= */

        card.dataset.search = [

            title,
            company,
            location,
            category,
            jobType,
            salary,
            qualification,
            experience,
            job.description || ""

        ]
            .join(" ")
            .toLowerCase();


        card.dataset.category =
            categoryKey;


        card.dataset.jobId =
            jobId ?? "";


        /* =================================================
           JOB DETAILS LINK
        ================================================= */

        const detailsLink =
            (
                jobId !== undefined &&
                jobId !== null
            )
                ? "job-details.html?id=" +
                  encodeURIComponent(jobId)
                : "#";


        /* =================================================
           CARD HTML
        ================================================= */

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
                    Last Date:
                    ${escapeHtml(lastDate)}
                </span>


                <div class="job-card-actions">

                    <a
                        class="job-button"
                        href="${escapeAttribute(detailsLink)}"
                    >
                        View Details
                    </a>


                    <a
                        class="job-button"
                        href="${escapeAttribute(applyLink)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Apply Now
                    </a>

                </div>

            </div>

        `;


        return card;

    }


    /* =====================================================
       CLEAR OLD STATIC / DEMO CARDS
    ===================================================== */

    function clearAllJobGrids() {

        if (latestJobs) {

            latestJobs.innerHTML = "";

        }


        Object
            .values(categoryGrids)
            .forEach(grid => {

                if (grid) {

                    grid.innerHTML = "";

                }

            });

    }


    /* =====================================================
       EMPTY CATEGORY MESSAGE
    ===================================================== */

    function showEmptyMessage(
        grid,
        categoryName
    ) {

        if (!grid) {

            return;

        }


        grid.innerHTML = `

            <div
                class="category-empty-message"
                style="
                    grid-column:1/-1;
                    padding:28px;
                    text-align:center;
                    border:1px dashed #d9e0ea;
                    border-radius:16px;
                    background:#ffffff;
                    color:#667085;
                "
            >
                No ${escapeHtml(categoryName)}
                jobs available right now.
            </div>

        `;

    }


    /* =====================================================
       CATEGORY "SEE JOBS →"
    ===================================================== */

    function setupCategoryLinks() {

        const sections = [

            {
                id: "government",
                grid: categoryGrids.government
            },

            {
                id: "private",
                grid: categoryGrids.private
            },

            {
                id: "internships",
                grid: categoryGrids.internship
            },

            {
                id: "work-from-home",
                grid: categoryGrids.wfh
            }

        ];


        sections.forEach(section => {

            const container =
                document.getElementById(
                    section.id
                );


            if (!container) {

                return;

            }


            const link =
                container.querySelector(
                    ".view-all"
                );


            if (!link) {

                return;

            }


            link.textContent =
                "See Jobs →";


            link.href =
                "#";


            link.style.cursor =
                "pointer";


            link.onclick =
                event => {

                    event.preventDefault();


                    if (
                        section.grid
                    ) {

                        section.grid.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                };

        });

    }


    /* =====================================================
       RENDER ALL JOBS
    ===================================================== */

    function renderJobs() {

        clearAllJobGrids();


        /* =================================================
           LATEST JOBS
        ================================================= */

        if (
            latestJobs &&
            allJobs.length
        ) {

            allJobs.forEach(job => {

                latestJobs.appendChild(
                    createJobCard(job)
                );

            });

        }


        /* =================================================
           CATEGORY COUNTERS
        ================================================= */

        const counts = {

            government: 0,
            private: 0,
            internship: 0,
            wfh: 0

        };


        /* =================================================
           CATEGORY RENDER
        ================================================= */

        allJobs.forEach(job => {

            const categoryKey =
                normalizeCategory(
                    job.category
                );


            const grid =
                categoryGrids[
                    categoryKey
                ];


            if (
                !grid ||
                !categoryKey
            ) {

                return;

            }


            grid.appendChild(
                createJobCard(job)
            );


            counts[
                categoryKey
            ]++;

        });


        /* =================================================
           EMPTY CATEGORY HANDLING
        ================================================= */

        if (
            counts.government === 0
        ) {

            showEmptyMessage(
                categoryGrids.government,
                "Government"
            );

        }


        if (
            counts.private === 0
        ) {

            showEmptyMessage(
                categoryGrids.private,
                "Private"
            );

        }


        if (
            counts.internship === 0
        ) {

            showEmptyMessage(
                categoryGrids.internship,
                "Internship"
            );

        }


        if (
            counts.wfh === 0
        ) {

            showEmptyMessage(
                categoryGrids.wfh,
                "Work From Home"
            );

        }


        /* =================================================
           NO LATEST JOBS
        ================================================= */

        if (noResults) {

            noResults.hidden =
                allJobs.length !== 0;

        }


        setupCategoryLinks();


        setupRevealObserver();


        console.log(
            "JobsBhandar category counts:",
            counts
        );

    }


    /* =====================================================
       LOAD JOBS FROM SUPABASE
       ONLY ONE QUERY
    ===================================================== */

    async function loadJobs() {

        if (
            typeof supabaseClient ===
                "undefined" ||
            !supabaseClient
        ) {

            console.error(
                "Supabase client not found."
            );

            return;

        }


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("jobs")
                    .select("*")
                    .eq(
                        "is_active",
                        true
                    )
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

                return;

            }


            allJobs =
                Array.isArray(data)
                    ? data
                    : [];


            console.log(
                "Public jobs loaded:",
                allJobs
            );


            renderJobs();

        }
        catch (error) {

            console.error(
                "Unexpected error while loading jobs:",
                error
            );

        }

    }


    /* =====================================================
       SEARCH
       NO DROPDOWN / NO SUGGESTION BOX
    ===================================================== */

    function normalizeSearchText(
        value
    ) {

        return String(value || "")
            .toLowerCase()
            .replace(
                /[^a-z0-9\s&+.-]/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }


    function performSearch() {

        if (!searchInput) {

            return;

        }


        const searchValue =
            normalizeSearchText(
                searchInput.value
            );


        const terms =
            searchValue
                ? searchValue
                    .split(" ")
                    .filter(Boolean)
                : [];


        /*
         * Search ONLY the Latest Jobs area.
         *
         * Category sections remain untouched.
         * Therefore a job can never be moved
         * into another category because of search.
         */

        const cards =
            latestJobs
                ? latestJobs.querySelectorAll(
                    ".job-card"
                )
                : [];


        let visibleCount = 0;


        cards.forEach(card => {

            const searchableText =
                normalizeSearchText(
                    card.dataset.search ||
                    card.innerText ||
                    ""
                );


            const matches =
                terms.length === 0 ||
                terms.every(term =>
                    searchableText.includes(
                        term
                    )
                );


            card.style.display =
                matches
                    ? ""
                    : "none";


            if (matches) {

                visibleCount++;

            }

        });


        if (noResults) {

            noResults.hidden =
                visibleCount !== 0;

        }

    }


    /* =====================================================
       SEARCH EVENTS
    ===================================================== */

    if (
        searchForm &&
        searchInput
    ) {

        searchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                performSearch();


                if (latestJobs) {

                    latestJobs.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );


        searchInput.addEventListener(
            "input",
            performSearch
        );

    }


    /* =====================================================
       POPULAR SEARCH LINKS
       Existing links are kept functional.
    ===================================================== */

    if (searchForm) {

        const popularLinks =
            document.querySelectorAll(
                ".popular-searches a"
            );


        popularLinks.forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const text =
                        link.textContent
                            .trim();


                    /*
                     * Category popular links
                     * should scroll to category.
                     */

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        href &&
                        href.startsWith("#")
                    ) {

                        const target =
                            document.querySelector(
                                href
                            );


                        if (target) {

                            event.preventDefault();


                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });


                            return;

                        }

                    }


                    /*
                     * Otherwise use the text
                     * as a normal search.
                     */

                    if (
                        searchInput &&
                        text
                    ) {

                        event.preventDefault();


                        searchInput.value =
                            text;


                        performSearch();


                        if (latestJobs) {

                            latestJobs.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }

                    }

                }
            );

        });

    }


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const footerBottom =
        document.querySelector(
            ".footer-bottom"
        );


    if (footerBottom) {

        const year =
            new Date().getFullYear();


        footerBottom.innerHTML =
            footerBottom.innerHTML.replace(
                /2026/g,
                year
            );

    }


    /* =====================================================
       START APPLICATION
    ===================================================== */

    await loadJobs();


    /* =====================================================
       FINAL REVEAL SAFETY
       Prevent invisible front-end if observer
       has not initialized correctly.
    ===================================================== */

    document
        .querySelectorAll(
            ".reveal:not(.visible)"
        )
        .forEach(element => {

            if (
                element.dataset.revealReady ===
                "true"
            ) {

                return;

            }


            /*
             * Static page elements that are
             * already on screen should remain
             * visible.
             */

            const rect =
                element.getBoundingClientRect();


            if (
                rect.top <
                window.innerHeight
            ) {

                element.classList.add(
                    "visible"
                );

            }

        });

});
