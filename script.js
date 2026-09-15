/* =========================================================
   JOBSBHANDAR
   PUBLIC WEBSITE - JOB LOADING + CATEGORY + SEARCH
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuButton = document.getElementById("menuButton");
    const mainNav = document.getElementById("mainNav");

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

        const stringValue =
            String(value || "#").trim();

        if (
            stringValue
                .toLowerCase()
                .startsWith("javascript:")
        ) {
            return "#";
        }

        return escapeHtml(stringValue);
    }


    /* =====================================================
       CATEGORY NORMALIZATION
    ===================================================== */

    function normalizeCategory(category) {

        return String(category || "")
            .trim()
            .toLowerCase()
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ");
    }


    function getCategoryKey(category) {

        const value =
            normalizeCategory(category);

        if (
            value.includes("government") ||
            value.includes("govt")
        ) {
            return "government";
        }

        if (value.includes("private")) {
            return "private";
        }

        if (
            value.includes("internship") ||
            value.includes("intern")
        ) {
            return "internship";
        }

        if (
            value.includes("work from home") ||
            value === "wfh" ||
            value.includes("remote")
        ) {
            return "wfh";
        }

        return null;
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
            job.title || "Job Opportunity";

        const company =
            job.company || "Company";

        const location =
            job.location || "India";

        const category =
            job.category || "Job";

        const jobType =
            job.job_type || "Full Time";

        const salary =
            job.salary || "Salary not specified";

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
            job.apply_link || "#";

        const jobId =
            job.id;

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

        const categoryKey =
            getCategoryKey(category);

        let logoClass = "";
        let statusClass = "";

        if (categoryKey === "private") {

            logoClass = "purple";

        } else if (categoryKey === "internship") {

            logoClass = "orange";
            statusClass = "orange-status";

        } else if (categoryKey === "wfh") {

            logoClass = "green-logo";
            statusClass = "green";
        }


        /* =================================================
           SEARCH DATA
        ================================================= */

        card.dataset.search =
            [
                title,
                company,
                location,
                category,
                jobType,
                salary,
                qualification,
                experience,
                lastDate
            ]
                .join(" ")
                .toLowerCase();


        /* =================================================
           JOB DETAILS LINK
        ================================================= */

        const detailsLink =
            jobId !== undefined &&
            jobId !== null
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


                <div
                    class="job-actions"
                    style="
                        display:flex;
                        gap:10px;
                        align-items:center;
                        flex-wrap:wrap;
                    "
                >

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
       ELEMENTS
    ===================================================== */

    const latestJobs =
        document.getElementById("latestJobs");

    const noResults =
        document.getElementById("noResults");

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("jobSearch");


    /* =====================================================
       CATEGORY GRIDS
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
       CATEGORY SECTION HEADERS
       SEE JOBS BUTTON
    ===================================================== */

    const categorySections = {

        government:
            document.getElementById("government"),

        private:
            document.getElementById("private"),

        internship:
            document.getElementById("internships"),

        wfh:
            document.getElementById("work-from-home")
    };


    function setupSeeJobsButton(
        categoryKey,
        grid
    ) {

        const section =
            categorySections[categoryKey];

        if (!section) {
            return;
        }

        const button =
            section.querySelector(".view-all");

        if (!button) {
            return;
        }

        button.textContent =
            "See Jobs →";

        button.removeAttribute("href");

        button.style.cursor =
            "pointer";

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                if (!grid) {
                    return;
                }

                const firstJob =
                    grid.querySelector(
                        ".job-card"
                    );

                if (firstJob) {

                    firstJob.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                } else {

                    grid.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            }
        );
    }


    Object.entries(categoryGrids)
        .forEach(([key, grid]) => {

            setupSeeJobsButton(
                key,
                grid
            );

        });


    /* =====================================================
       LOAD ALL JOBS
    ===================================================== */

    let allJobs = [];


    async function loadJobs() {

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            console.error(
                "Supabase client not found."
            );

            return;
        }


        try {

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

                return;
            }


            allJobs =
                Array.isArray(data)
                    ? data
                    : [];


            /* =============================================
               REMOVE STATIC JOB CARDS
            ============================================= */

            if (latestJobs) {
                latestJobs.innerHTML = "";
            }


            Object.values(categoryGrids)
                .forEach(grid => {

                    if (grid) {
                        grid.innerHTML = "";
                    }

                });


            /* =============================================
               LATEST JOBS
               ALL ACTIVE JOBS
            ============================================= */

            if (latestJobs) {

                allJobs.forEach(job => {

                    const card =
                        createJobCard(job);

                    latestJobs.appendChild(card);

                });
            }


            /* =============================================
               CATEGORY-WISE JOBS
            ============================================= */

            allJobs.forEach(job => {

                const categoryKey =
                    getCategoryKey(
                        job.category
                    );

                if (!categoryKey) {
                    return;
                }


                const grid =
                    categoryGrids[
                        categoryKey
                    ];

                if (!grid) {
                    return;
                }


                const card =
                    createJobCard(job);

                grid.appendChild(card);

            });


            /* =============================================
               SHOW / HIDE EMPTY CATEGORY
            ============================================= */

            Object.entries(categoryGrids)
                .forEach(([key, grid]) => {

                    const section =
                        categorySections[key];

                    if (!grid || !section) {
                        return;
                    }

                    const jobs =
                        grid.querySelectorAll(
                            ".job-card"
                        );


                    if (jobs.length === 0) {

                        grid.innerHTML = `

                            <div
                                class="category-empty"
                                style="
                                    grid-column:1/-1;
                                    text-align:center;
                                    padding:30px 20px;
                                    opacity:.75;
                                "
                            >

                                <strong>
                                    No jobs available
                                </strong>

                                <p>
                                    New ${escapeHtml(
                                        getCategoryLabel(key)
                                    )} jobs will appear here.
                                </p>

                            </div>

                        `;

                    }

                });


            setupRevealObserver();

            setupSearchSuggestions();

            performSearch();

        } catch (error) {

            console.error(
                "Unexpected job loading error:",
                error
            );

        }
    }


    /* =====================================================
       CATEGORY LABEL
    ===================================================== */

    function getCategoryLabel(key) {

        if (key === "government") {
            return "Government";
        }

        if (key === "private") {
            return "Private";
        }

        if (key === "internship") {
            return "Internship";
        }

        if (key === "wfh") {
            return "Work From Home";
        }

        return "Job";
    }


    /* =====================================================
       SEARCH
       SEARCHES ALL CATEGORY SECTIONS
       BUT KEEPS JOB IN ITS OWN CATEGORY
    ===================================================== */

    function performSearch() {

        if (!searchInput) {
            return;
        }


        const rawValue =
            searchInput.value
                .trim()
                .toLowerCase();


        const searchTerms =
            rawValue
                .split(/\s+/)
                .filter(Boolean);


        let totalMatches = 0;


        Object.values(categoryGrids)
            .forEach(grid => {

                if (!grid) {
                    return;
                }


                const cards =
                    grid.querySelectorAll(
                        ".job-card"
                    );


                let categoryMatches = 0;


                cards.forEach(card => {

                    const searchableText =
                        (
                            card.dataset.search ||
                            card.innerText ||
                            ""
                        )
                            .toLowerCase();


                    const matches =
                        searchTerms.length === 0 ||
                        searchTerms.every(term =>
                            searchableText.includes(
                                term
                            )
                        );


                    card.style.display =
                        matches
                            ? ""
                            : "none";


                    if (matches) {

                        categoryMatches++;
                        totalMatches++;

                    }

                });


                /*
                 * Category section remains visible.
                 * Only its matching cards are shown.
                 */

                const emptyMessage =
                    grid.querySelector(
                        ".category-empty"
                    );


                if (emptyMessage) {

                    emptyMessage.style.display =
                        searchTerms.length === 0
                            ? ""
                            : "none";
                }

            });


        /*
         * Latest Jobs search
         */

        if (latestJobs) {

            const latestCards =
                latestJobs.querySelectorAll(
                    ".job-card"
                );


            latestCards.forEach(card => {

                const searchableText =
                    (
                        card.dataset.search ||
                        card.innerText ||
                        ""
                    )
                        .toLowerCase();


                const matches =
                    searchTerms.length === 0 ||
                    searchTerms.every(term =>
                        searchableText.includes(
                            term
                        )
                    );


                card.style.display =
                    matches
                        ? ""
                        : "none";

            });

        }


        /*
         * No Results
         */

        if (noResults) {

            noResults.hidden =
                rawValue !== "" &&
                totalMatches === 0;

        }
    }


    /* =====================================================
       SEARCH SUGGESTIONS
    ===================================================== */

    let searchSuggestions =
        document.getElementById(
            "searchSuggestions"
        );


    function setupSearchSuggestions() {

        if (
            !searchForm ||
            !searchInput
        ) {
            return;
        }


        if (!searchSuggestions) {

            searchSuggestions =
                document.createElement(
                    "div"
                );

            searchSuggestions.id =
                "searchSuggestions";

            searchSuggestions.className =
                "rich-search-suggestions";

            searchSuggestions.style.display =
                "none";

            searchForm.style.position =
                "relative";

            searchForm.appendChild(
                searchSuggestions
            );
        }


        const popularSearches = [

            "Government Jobs",
            "Private Jobs",
            "Internship",
            "Work From Home",
            "Banking Jobs",
            "IT Jobs",
            "Finance Jobs",
            "Marketing Jobs",
            "Jobs in Varanasi",
            "Jobs in Uttar Pradesh"

        ];


        function getJobSuggestions() {

            const suggestions = [];

            allJobs.forEach(job => {

                if (job.title) {

                    suggestions.push(
                        job.title
                    );
                }

                if (job.company) {

                    suggestions.push(
                        job.company
                    );
                }

            });


            return [
                ...new Set(suggestions)
            ]
                .slice(0, 8);
        }


        function renderSuggestions(
            filterText = ""
        ) {

            const text =
                filterText
                    .trim()
                    .toLowerCase();


            const jobSuggestions =
                getJobSuggestions();


            const combined =
                [
                    ...jobSuggestions,
                    ...popularSearches
                ];


            const unique =
                [
                    ...new Set(combined)
                ];


            const filtered =
                text === ""
                    ? unique.slice(0, 8)
                    : unique
                        .filter(item =>
                            item
                                .toLowerCase()
                                .includes(text)
                        )
                        .slice(0, 8);


            if (filtered.length === 0) {

                searchSuggestions.style.display =
                    "none";

                searchSuggestions.innerHTML =
                    "";

                return;
            }


            searchSuggestions.innerHTML =
                filtered
                    .map(item => `

                        <button
                            type="button"
                            class="search-suggestion-item"
                            data-search-value="${escapeAttribute(item)}"
                        >
                            🔎
                            ${escapeHtml(item)}
                        </button>

                    `)
                    .join("");


            searchSuggestions.style.display =
                "block";


            searchSuggestions
                .querySelectorAll(
                    ".search-suggestion-item"
                )
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        () => {

                            searchInput.value =
                                button.dataset.searchValue ||
                                "";

                            searchSuggestions.style.display =
                                "none";

                            performSearch();

                            if (latestJobs) {

                                latestJobs.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                });
                            }

                        }
                    );

                });
        }


        searchInput.addEventListener(
            "focus",
            () => {

                renderSuggestions(
                    searchInput.value
                );

            }
        );


        searchInput.addEventListener(
            "input",
            () => {

                renderSuggestions(
                    searchInput.value
                );

                performSearch();

            }
        );


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

                if (searchSuggestions) {

                    searchSuggestions.style.display =
                        "none";
                }

            }
        );


        document.addEventListener(
            "click",
            event => {

                if (
                    !searchForm.contains(
                        event.target
                    )
                ) {

                    searchSuggestions.style.display =
                        "none";
                }

            }
        );


        searchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    searchSuggestions.style.display =
                        "none";

                    searchInput.blur();
                }

            }
        );
    }


    /* =====================================================
       CATEGORY NAVIGATION
    ===================================================== */

    const categoryLinks = {

        government:
            "#government",

        private:
            "#private",

        internships:
            "#internships",

        "work-from-home":
            "#work-from-home"

    };


    Object.entries(categoryLinks)
        .forEach(([key, selector]) => {

            document
                .querySelectorAll(
                    `a[href="${selector}"]`
                )
                .forEach(link => {

                    link.addEventListener(
                        "click",
                        event => {

                            const section =
                                document.querySelector(
                                    selector
                                );

                            if (!section) {
                                return;
                            }

                            event.preventDefault();

                            section.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }
                    );

                });

        });


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
       LOAD
    ===================================================== */

    await loadJobs();

});
