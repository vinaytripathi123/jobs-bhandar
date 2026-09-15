/* =========================================================
   JOBSBHANDAR
   PUBLIC WEBSITE
   SUPABASE + CATEGORY SYSTEM + SEARCH
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

        const url =
            String(value || "#").trim();

        if (
            url.toLowerCase().startsWith("javascript:")
        ) {
            return "#";
        }

        return escapeHtml(url);

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
       PAGE ELEMENTS
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
       CATEGORY NORMALIZATION
    ===================================================== */

    function normalizeCategory(category) {

        const value =
            String(category || "")
                .trim()
                .toLowerCase()
                .replace(/[_-]+/g, " ")
                .replace(/\s+/g, " ");

        if (
            value.includes("government") ||
            value.includes("govt") ||
            value.includes("sarkari")
        ) {
            return "government";
        }

        if (
            value.includes("internship") ||
            value === "intern" ||
            value.includes("intern ")
        ) {
            return "internship";
        }

        if (
            value.includes("work from home") ||
            value.includes("remote") ||
            value.includes("wfh")
        ) {
            return "wfh";
        }

        if (
            value.includes("private") ||
            value.includes("corporate")
        ) {
            return "private";
        }

        return null;

    }


    /* =====================================================
       CREATE JOB CARD
       
       IMPORTANT:
       FULL DESCRIPTION IS NOT SHOWN HERE.
       Description is available on job-details.html.
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
            "Not specified";

        const qualification =
            job.qualification ||
            "Not specified";

        const experience =
            job.experience ||
            "Not specified";

        const lastDate =
            job.last_date ||
            "Apply soon";

        const applyLink =
            job.apply_link ||
            "#";

        const jobId =
            job.id;


        /* =================================================
           COMPANY LOGO
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

        const categoryLower =
            category.toLowerCase();

        let logoClass = "";
        let statusClass = "";


        if (
            categoryLower.includes("private")
        ) {

            logoClass = "purple";

        } else if (
            categoryLower.includes("intern")
        ) {

            logoClass = "orange";

            statusClass =
                "orange-status";

        } else if (
            categoryLower.includes("work") ||
            categoryLower.includes("remote") ||
            categoryLower.includes("wfh")
        ) {

            logoClass =
                "green-logo";

            statusClass =
                "green";

        } else {

            statusClass =
                "green";

        }


        /* =================================================
           SEARCH DATA
           
           Description is searchable but NOT displayed
           inside the card.
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
                job.description || ""
            ]
                .join(" ")
                .toLowerCase();


        /* =================================================
           DETAILS LINK
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
           
           NO FULL DESCRIPTION HERE.
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


            <span class="job-type">
                ${escapeHtml(jobType)}
            </span>


            <h3>
                ${escapeHtml(title)}
            </h3>


            <p class="company">
                ${escapeHtml(company)}
            </p>


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
       EMPTY CATEGORY MESSAGE
    ===================================================== */

    function showCategoryEmpty(grid, message) {

        if (!grid) {
            return;
        }

        grid.innerHTML = `

            <div
                class="category-empty-message"
                style="
                    grid-column:1/-1;
                    width:100%;
                    padding:28px 20px;
                    text-align:center;
                    border:1px dashed #d9e0ea;
                    border-radius:14px;
                    background:#fafbfd;
                "
            >

                <div
                    style="
                        font-size:28px;
                        margin-bottom:8px;
                    "
                >
                    🔎
                </div>

                <strong>
                    ${escapeHtml(message)}
                </strong>

                <p
                    style="
                        margin:8px 0 0;
                        color:#6b7280;
                    "
                >
                    New opportunities will appear here
                    when they are published.
                </p>

            </div>

        `;

    }


    /* =====================================================
       CLEAR STATIC / DEMO CARDS
    ===================================================== */

    function clearStaticCards() {

        if (latestJobs) {

            latestJobs.innerHTML = "";

        }


        Object.values(categoryGrids)
            .forEach(grid => {

                if (grid) {

                    grid.innerHTML = "";

                }

            });

    }


    /* =====================================================
       LOAD JOBS FROM SUPABASE
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

            const {
                data,
                error
            } = await supabaseClient
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


            console.log(
                "Public jobs loaded:",
                allJobs
            );


            /* =============================================
               REMOVE ALL OLD STATIC CARDS
            ============================================= */

            clearStaticCards();


            /* =============================================
               LATEST JOBS
               
               All active jobs appear here.
            ============================================= */

            if (latestJobs) {

                if (allJobs.length === 0) {

                    if (noResults) {

                        noResults.hidden = false;

                    }

                } else {

                    if (noResults) {

                        noResults.hidden = true;

                    }


                    allJobs.forEach(job => {

                        const card =
                            createJobCard(job);

                        latestJobs.appendChild(card);

                    });

                }

            }


            /* =============================================
               CATEGORY-WISE JOBS
            ============================================= */

            const categoryCounts = {

                government: 0,
                private: 0,
                internship: 0,
                wfh: 0

            };


            allJobs.forEach(job => {

                const category =
                    normalizeCategory(
                        job.category
                    );


                if (!category) {

                    console.warn(
                        "Unknown job category:",
                        job.category,
                        job.title
                    );

                    return;

                }


                const grid =
                    categoryGrids[category];


                if (!grid) {

                    return;

                }


                const card =
                    createJobCard(job);


                grid.appendChild(card);


                categoryCounts[category]++;

            });


            /* =============================================
               EMPTY CATEGORY SECTIONS
            ============================================= */

            if (
                categoryGrids.government &&
                categoryCounts.government === 0
            ) {

                showCategoryEmpty(
                    categoryGrids.government,
                    "No Government Jobs Available"
                );

            }


            if (
                categoryGrids.private &&
                categoryCounts.private === 0
            ) {

                showCategoryEmpty(
                    categoryGrids.private,
                    "No Private Jobs Available"
                );

            }


            if (
                categoryGrids.internship &&
                categoryCounts.internship === 0
            ) {

                showCategoryEmpty(
                    categoryGrids.internship,
                    "No Internship Jobs Available"
                );

            }


            if (
                categoryGrids.wfh &&
                categoryCounts.wfh === 0
            ) {

                showCategoryEmpty(
                    categoryGrids.wfh,
                    "No Work From Home Jobs Available"
                );

            }


            /* =============================================
               RESTART REVEAL ANIMATION FOR NEW CARDS
            ============================================= */

            setupRevealObserver();


            console.log(
                "Category counts:",
                categoryCounts
            );

        } catch (error) {

            console.error(
                "Unexpected job loading error:",
                error
            );

        }

    }


    /* =====================================================
       SEARCH
       
       SEARCH ONLY FILTERS LATEST JOBS.
       IT DOES NOT MOVE JOBS BETWEEN CATEGORIES.
       
       NO SUGGESTION DROPDOWN.
    ===================================================== */

    function normalizeSearchText(value) {

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

        if (!latestJobs || !searchInput) {

            return;

        }


        const searchValue =
            normalizeSearchText(
                searchInput.value
            );


        const searchTerms =
            searchValue
                ? searchValue
                    .split(" ")
                    .filter(Boolean)
                : [];


        const jobCards =
            latestJobs.querySelectorAll(
                ".job-card"
            );


        let visibleJobs = 0;


        jobCards.forEach(card => {

            const searchableText =
                normalizeSearchText(
                    card.dataset.search ||
                    ""
                );


            const matches =
                searchTerms.length === 0 ||
                searchTerms.every(
                    term =>
                        searchableText.includes(term)
                );


            card.style.display =
                matches
                    ? ""
                    : "none";


            if (matches) {

                visibleJobs++;

            }

        });


        if (noResults) {

            noResults.hidden =
                visibleJobs !== 0;

        }

    }


    if (
        searchForm &&
        searchInput &&
        latestJobs
    ) {

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
       CATEGORY "SEE JOBS →" BUTTONS
    ===================================================== */

    function setupCategoryButtons() {

        const sections = [

            {
                section:
                    document.getElementById(
                        "government"
                    ),
                grid:
                    categoryGrids.government
            },

            {
                section:
                    document.getElementById(
                        "private"
                    ),
                grid:
                    categoryGrids.private
            },

            {
                section:
                    document.getElementById(
                        "internships"
                    ),
                grid:
                    categoryGrids.internship
            },

            {
                section:
                    document.getElementById(
                        "work-from-home"
                    ),
                grid:
                    categoryGrids.wfh
            }

        ];


        sections.forEach(item => {

            if (
                !item.section ||
                !item.grid
            ) {

                return;

            }


            const button =
                item.section.querySelector(
                    ".view-all"
                );


            if (!button) {

                return;

            }


            button.textContent =
                "See Jobs →";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    item.grid.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });

    }


    setupCategoryButtons();


    /* =====================================================
       POPULAR SEARCH LINKS
    ===================================================== */

    document
        .querySelectorAll(
            ".popular-searches a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    const target =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        target &&
                        target.startsWith("#")
                    ) {

                        setTimeout(() => {

                            const section =
                                document.querySelector(
                                    target
                                );

                            if (section) {

                                section.scrollIntoView({
                                    behavior: "smooth"
                                });

                            }

                        }, 50);

                    }

                }
            );

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
       LOAD EVERYTHING
    ===================================================== */

    await loadJobs();


    /* =====================================================
       FINAL REVEAL
    ===================================================== */

    setupRevealObserver();

});
