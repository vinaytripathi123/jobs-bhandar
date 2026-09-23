/* =========================================================
   JOBSBHANDAR
   PUBLIC WEBSITE
   SUPABASE + CATEGORY SYSTEM + SEARCH
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
            url
                .toLowerCase()
                .startsWith("javascript:")
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
                "Supabase client is not available."
            );

            showCategoryEmpty(
                latestJobs,
                "Jobs are temporarily unavailable."
            );

            return;

        }


        try {

            clearStaticCards();


            const {
                data,
                error
            } =
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
                    "Error loading jobs:",
                    error
                );

                showCategoryEmpty(
                    latestJobs,
                    "Unable to load jobs right now."
                );

                return;

            }


            allJobs =
                Array.isArray(data)
                    ? data
                    : [];


            console.log(
                "Public jobs loaded:",
                allJobs.length
            );


            renderLatestJobs(
                allJobs
            );


            renderCategorySections(
                allJobs
            );


        } catch (error) {

            console.error(
                "Unexpected error loading jobs:",
                error
            );

            showCategoryEmpty(
                latestJobs,
                "Something went wrong while loading jobs."
            );

        }

    }


    /* =====================================================
       RENDER LATEST JOBS
    ===================================================== */

    function renderLatestJobs(jobs) {

        if (!latestJobs) {
            return;
        }


        latestJobs.innerHTML = "";


        if (!jobs.length) {

            showCategoryEmpty(
                latestJobs,
                "No jobs available right now."
            );

            return;

        }


        jobs.forEach(job => {

            const card =
                createJobCard(job);

            latestJobs.appendChild(card);

        });


        setupRevealObserver();

    }


    /* =====================================================
       RENDER CATEGORY SECTIONS
    ===================================================== */

    function renderCategorySections(jobs) {

        Object.values(categoryGrids)
            .forEach(grid => {

                if (grid) {

                    grid.innerHTML = "";

                }

            });


        const groupedJobs = {

            government: [],
            private: [],
            internship: [],
            wfh: []

        };


        jobs.forEach(job => {

            const normalized =
                normalizeCategory(
                    job.category
                );


            if (
                normalized &&
                groupedJobs[normalized]
            ) {

                groupedJobs[normalized].push(job);

            }

        });


        Object.entries(groupedJobs)
            .forEach(
                ([category, categoryJobs]) => {

                    const grid =
                        categoryGrids[category];


                    if (!grid) {
                        return;
                    }


                    if (!categoryJobs.length) {

                        showCategoryEmpty(
                            grid,
                            "No jobs available in this category."
                        );

                        return;

                    }


                    categoryJobs.forEach(job => {

                        const card =
                            createJobCard(job);

                        grid.appendChild(card);

                    });

                }
            );


        setupRevealObserver();

    }


    /* =====================================================
       START JOB LOADING
    ===================================================== */

    await loadJobs();
        /* =====================================================
       RICH SEARCH
       ===================================================== */

       function normalizeSearchText(value) {

        return String(value || "")
            .toLowerCase()
            .replace(/&/g, " and ")
            .replace(/[^a-z0-9\s.+#/-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    }


    function normalizeSearchPhrases(value) {

        let text =
            normalizeSearchText(value);


        const phraseRules = [

            [
                /\bbachelor\s+of\s+commerce\b/g,
                "bcom"
            ],

            [
                /\bb\s*\.?\s*com\b/g,
                "bcom"
            ],

            [
                /\bcommerce\s+graduate\b/g,
                "bcom"
            ],

            [
                /\bwork\s+from\s+home\b/g,
                "remote"
            ],

            [
                /\bwork\s+at\s+home\b/g,
                "remote"
            ],

            [
                /\bremote\s+work\b/g,
                "remote"
            ],

            [
                /\bremote\s+job\b/g,
                "remote"
            ],

            [
                /\bgovernment\s+job\b/g,
                "government"
            ],

            [
                /\bgovt\s+job\b/g,
                "government"
            ],

            [
                /\bsarkari\s+job\b/g,
                "government"
            ],

            [
                /\bprivate\s+job\b/g,
                "private"
            ],

            [
                /\bprivate\s+sector\b/g,
                "private"
            ],

            [
                /\bhuman\s+resources\b/g,
                "hr"
            ],

            [
                /\bbusiness\s+development\b/g,
                "sales"
            ],

            [
                /\bdata\s+entry\b/g,
                "dataentry"
            ],

            [
                /\bfull\s+stack\b/g,
                "fullstack"
            ],

            [
                /\bfront\s+end\b/g,
                "frontend"
            ],

            [
                /\bback\s+end\b/g,
                "backend"
            ]

        ];


        phraseRules.forEach(
            ([pattern, replacement]) => {

                text =
                    text.replace(
                        pattern,
                        ` ${replacement} `
                    );

            }
        );


        return text
            .replace(/\s+/g, " ")
            .trim();

    }


    /* =====================================================
       SEARCH ALIASES
    ===================================================== */

    const searchAliases = {

        bcom: [
            "bcom",
            "b.com",
            "bachelor",
            "commerce",
            "commerce graduate"
        ],

        account: [
            "account",
            "accounts",
            "accountant",
            "accounting",
            "bookkeeping",
            "bookkeeper"
        ],

        finance: [
            "finance",
            "financial",
            "banking",
            "accounts"
        ],

        bank: [
            "bank",
            "banking",
            "finance"
        ],

        intern: [
            "intern",
            "internship",
            "trainee",
            "fresher"
        ],

        government: [
            "government",
            "govt",
            "sarkari",
            "public"
        ],

        private: [
            "private",
            "corporate",
            "company"
        ],

        remote: [
            "remote",
            "wfh",
            "workfromhome",
            "work from home"
        ],

        graduate: [
            "graduate",
            "graduation",
            "degree",
            "bachelor",
            "fresher"
        ],

        developer: [
            "developer",
            "development",
            "programmer",
            "software",
            "coding"
        ],

        hr: [
            "hr",
            "human",
            "resources",
            "recruiter",
            "recruitment"
        ],

        marketing: [
            "marketing",
            "digital marketing",
            "promotion"
        ],

        sales: [
            "sales",
            "business development",
            "bd",
            "business"
        ],

        dataentry: [
            "dataentry",
            "data",
            "entry"
        ],

        fullstack: [
            "fullstack",
            "full",
            "stack"
        ],

        frontend: [
            "frontend",
            "front",
            "end"
        ],

        backend: [
            "backend",
            "back",
            "end"
        ]

    };


    /* =====================================================
       GENERIC SEARCH WORDS
    ===================================================== */

    const ignoredSearchWords =
        new Set([

            "job",
            "jobs",
            "vacancy",
            "vacancies",
            "career",
            "careers",
            "opening",
            "openings",
            "work",
            "position",
            "positions",
            "role",
            "roles",
            "opportunity",
            "opportunities",
            "apply",
            "employment",

            "of",
            "in",
            "for",
            "and",
            "the",
            "to",
            "with",
            "at",
            "from",
            "on",
            "a",
            "an",
            "is",
            "are",
            "as",
            "by",
            "or",
            "be",
            "this",
            "that",
            "me",
            "my",
            "near",
            "find",
            "show",
            "looking"

        ]);


    /* =====================================================
       LEVENSHTEIN DISTANCE
    ===================================================== */

    function levenshteinDistance(
        first,
        second
    ) {

        if (first === second) {

            return 0;

        }

        if (!first) {

            return second.length;

        }

        if (!second) {

            return first.length;

        }


        const previousRow =
            Array.from(
                {
                    length:
                        second.length + 1
                },
                (_, index) => index
            );


        for (
            let i = 1;
            i <= first.length;
            i++
        ) {

            let previousDiagonal =
                previousRow[0];

            previousRow[0] = i;


            for (
                let j = 1;
                j <= second.length;
                j++
            ) {

                const current =
                    previousRow[j];


                const substitutionCost =
                    first[i - 1] ===
                    second[j - 1]
                        ? 0
                        : 1;


                previousRow[j] =
                    Math.min(

                        previousRow[j] + 1,

                        previousRow[j - 1] + 1,

                        previousDiagonal +
                            substitutionCost

                    );


                previousDiagonal =
                    current;

            }

        }


        return previousRow[
            second.length
        ];

    }


    /* =====================================================
       FUZZY WORD MATCH
    ===================================================== */

    function fuzzyWordMatch(
        searchWord,
        targetWord
    ) {

        if (
            !searchWord ||
            !targetWord
        ) {

            return false;

        }


        if (
            targetWord.includes(searchWord) ||
            searchWord.includes(targetWord)
        ) {

            return true;

        }


        const lengthDifference =
            Math.abs(
                searchWord.length -
                targetWord.length
            );


        if (
            lengthDifference > 2
        ) {

            return false;

        }


        let allowedDistance = 1;


        if (
            searchWord.length >= 6
        ) {

            allowedDistance = 2;

        }


        return (
            levenshteinDistance(
                searchWord,
                targetWord
            ) <= allowedDistance
        );

    }


    /* =====================================================
       GET SEARCH VARIATIONS
    ===================================================== */

    function getSearchVariations(term) {

        const normalized =
            normalizeSearchText(term);


        const variations =
            new Set();


        if (normalized) {

            variations.add(
                normalized
            );

        }


        Object.entries(
            searchAliases
        ).forEach(
            ([alias, values]) => {

                const normalizedValues =
                    values.map(
                        value =>
                            normalizeSearchText(
                                value
                            )
                    );


                if (
                    alias === normalized ||
                    normalizedValues.includes(
                        normalized
                    )
                ) {

                    variations.add(alias);

                    values.forEach(value => {

                        const cleanValue =
                            normalizeSearchText(
                                value
                            );

                        if (cleanValue) {

                            variations.add(
                                cleanValue
                            );

                        }

                    });

                }

            }
        );


        return Array.from(
            variations
        );

    }


    /* =====================================================
       SEARCH TERM MATCH
    ===================================================== */

    function searchTermMatches(
        term,
        searchableText
    ) {

        const normalizedText =
            normalizeSearchText(
                searchableText
            );


        if (!term) {

            return true;

        }


        const variations =
            getSearchVariations(term);


        const textWords =
            normalizedText
                .split(/\s+/)
                .filter(Boolean);


        return variations.some(
            variation => {

                if (!variation) {

                    return false;

                }


                if (
                    normalizedText.includes(
                        variation
                    )
                ) {

                    return true;

                }


                const variationWords =
                    variation
                        .split(/\s+/)
                        .filter(Boolean);


                return variationWords.every(
                    variationWord =>
                        textWords.some(
                            textWord =>
                                fuzzyWordMatch(
                                    variationWord,
                                    textWord
                                )
                        )
                );

            }
        );

    }


    /* =====================================================
       BUILD SEARCH TERMS
    ===================================================== */

    function buildSearchTerms(value) {

        const normalized =
            normalizeSearchPhrases(
                value
            );


        if (!normalized) {

            return [];

        }


        return normalized
            .split(/\s+/)
            .map(term =>
                term.trim()
            )
            .filter(term =>
                term &&
                !ignoredSearchWords.has(term)
            );

    }


    /* =====================================================
       PERFORM RICH SEARCH
    ===================================================== */

    function performSearch() {

        if (
            !latestJobs ||
            !searchInput
        ) {

            return;

        }


        const rawSearchValue =
            searchInput.value || "";


        const searchTerms =
            buildSearchTerms(
                rawSearchValue
            );


        const jobCards =
            latestJobs.querySelectorAll(
                ".job-card"
            );


        let visibleJobs = 0;


        jobCards.forEach(card => {

            const searchableText =
                card.dataset.search ||
                "";


            const matches =
                searchTerms.length === 0 ||
                searchTerms.every(
                    term =>
                        searchTermMatches(
                            term,
                            searchableText
                        )
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
        /* =====================================================
       SEARCH EVENTS
    ===================================================== */

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
       FINAL REVEAL
    ===================================================== */

    setupRevealObserver();


});
document.addEventListener("DOMContentLoaded", function () {
    const sectionIds = ["contact", "privacy", "terms"];

    function hideInformationSections() {
        sectionIds.forEach(function (id) {
            const section = document.getElementById(id);

            if (section) {
                section.classList.remove("page-section-active");
            }
        });
    }

    function showInformationSection(id) {
        hideInformationSections();

        const section = document.getElementById(id);

        if (!section) return;

        section.classList.add("page-section-active");

        setTimeout(function () {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 50);
    }

    document.querySelectorAll('a[href="#contact"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            showInformationSection("contact");
        });
    });

    document.querySelectorAll('a[href="#privacy"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            showInformationSection("privacy");
        });
    });

    document.querySelectorAll('a[href="#terms"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            showInformationSection("terms");
        });
    });
});
function openInfoSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) return;

    section.classList.add("active");

    setTimeout(() => {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 50);
}
