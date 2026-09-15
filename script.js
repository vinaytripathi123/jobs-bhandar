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


        /* =================================================
           JOB ID
        ================================================= */

        const jobId =
            job.id;


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
         * Job Details URL
         *
         * Example:
         * job-details.html?id=123
         */

        const detailsLink =
            jobId !== undefined &&
            jobId !== null
                ? "job-details.html?id=" +
                  encodeURIComponent(jobId)
                : "#";


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
       SMART SEARCH
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

        function normalizeSearchText(value) {

            return String(value || "")
                .toLowerCase()
                .trim()
                .replace(/\s+/g, " ");

        }


        function performSearch() {

            const searchValue =
                normalizeSearchText(
                    searchInput.value
                );


            const searchTerms =
                searchValue
                    ? searchValue.split(" ")
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
                        card.innerText ||
                        ""
                    );


                /*
                 * Every search word must exist.
                 *
                 * Examples:
                 * Accountant Varanasi
                 * Banking Varanasi
                 * Work From Home
                 */

                const matches =
                    searchTerms.length === 0 ||
                    searchTerms.every(term =>
                        searchableText.includes(term)
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
/* =========================================================
   SAFE RICH SEARCH / SUGGESTION BOX
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const searchInput =
        document.getElementById("jobSearch");

    const searchForm =
        document.getElementById("searchForm");

    const latestJobs =
        document.getElementById("latestJobs");


    if (
        !searchInput ||
        !searchForm ||
        !latestJobs
    ) {
        return;
    }


    /* =====================================================
       CREATE SUGGESTION BOX
    ===================================================== */

    let suggestionBox =
        document.getElementById(
            "searchSuggestions"
        );


    if (!suggestionBox) {

        suggestionBox =
            document.createElement("div");

        suggestionBox.id =
            "searchSuggestions";

        suggestionBox.setAttribute(
            "role",
            "listbox"
        );

        suggestionBox.style.display =
            "none";

        suggestionBox.style.position =
            "absolute";

        suggestionBox.style.left =
            "0";

        suggestionBox.style.right =
            "0";

        suggestionBox.style.top =
            "100%";

        suggestionBox.style.zIndex =
            "9999";

        suggestionBox.style.marginTop =
            "8px";

        suggestionBox.style.background =
            "#ffffff";

        suggestionBox.style.borderRadius =
            "14px";

        suggestionBox.style.border =
            "1px solid rgba(23,59,122,0.12)";

        suggestionBox.style.boxShadow =
            "0 14px 35px rgba(0,0,0,0.12)";

        suggestionBox.style.overflow =
            "hidden";


        /*
         * Put suggestion box inside the
         * search input wrapper if available.
         */

        const inputWrap =
            searchInput.closest(
                ".search-input-wrap"
            );


        if (inputWrap) {

            if (
                getComputedStyle(
                    inputWrap
                ).position === "static"
            ) {

                inputWrap.style.position =
                    "relative";

            }

            inputWrap.appendChild(
                suggestionBox
            );

        } else {

            searchInput.parentElement.appendChild(
                suggestionBox
            );

        }

    }


    /* =====================================================
       GET JOB INFORMATION
    ===================================================== */

    function getJobSuggestions() {

        const cards =
            latestJobs.querySelectorAll(
                ".job-card"
            );


        const suggestions = [];


        cards.forEach(card => {

            const titleElement =
                card.querySelector("h3");

            const companyElement =
                card.querySelector(".company");


            const title =
                titleElement
                    ? titleElement.innerText.trim()
                    : "";


            const company =
                companyElement
                    ? companyElement.innerText.trim()
                    : "";


            if (title) {

                suggestions.push({
                    text: title,
                    type: "Job",
                    company: company
                });

            }

        });


        return suggestions;

    }


    /* =====================================================
       POPULAR SEARCH TERMS
    ===================================================== */

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


    /* =====================================================
       SHOW SUGGESTIONS
    ===================================================== */

    function showSuggestions() {

        const value =
            searchInput.value
                .trim()
                .toLowerCase();


        suggestionBox.innerHTML = "";


        /*
         * Don't show anything for empty input.
         */

        if (!value) {

            suggestionBox.style.display =
                "none";

            return;

        }


        const jobSuggestions =
            getJobSuggestions();


        const matchingJobs =
            jobSuggestions
                .filter(item => {

                    const text =
                        (
                            item.text +
                            " " +
                            item.company
                        )
                            .toLowerCase();


                    return text.includes(value);

                })
                .slice(0, 6);


        const matchingPopular =
            popularSearches
                .filter(item =>
                    item
                        .toLowerCase()
                        .includes(value)
                )
                .slice(0, 5);


        /*
         * Add job suggestions.
         */

        matchingJobs.forEach(item => {

            const suggestion =
                document.createElement("button");

            suggestion.type =
                "button";

            suggestion.style.display =
                "block";

            suggestion.style.width =
                "100%";

            suggestion.style.textAlign =
                "left";

            suggestion.style.padding =
                "12px 15px";

            suggestion.style.border =
                "0";

            suggestion.style.background =
                "#ffffff";

            suggestion.style.cursor =
                "pointer";


            suggestion.innerHTML = `
                <strong>
                    ${escapeHtml(item.text)}
                </strong>
                ${
                    item.company
                        ? `<small style="
                            display:block;
                            margin-top:3px;
                            opacity:.65;
                        ">
                            ${escapeHtml(item.company)}
                        </small>`
                        : ""
                }
            `;


            suggestion.addEventListener(
                "click",
                () => {

                    searchInput.value =
                        item.text;

                    suggestionBox.style.display =
                        "none";

                    searchForm.dispatchEvent(
                        new Event(
                            "submit",
                            {
                                bubbles: true,
                                cancelable: true
                            }
                        )
                    );

                }
            );


            suggestionBox.appendChild(
                suggestion
            );

        });


        /*
         * Add popular search suggestions.
         */

        matchingPopular.forEach(item => {

            const suggestion =
                document.createElement("button");

            suggestion.type =
                "button";

            suggestion.style.display =
                "block";

            suggestion.style.width =
                "100%";

            suggestion.style.textAlign =
                "left";

            suggestion.style.padding =
                "11px 15px";

            suggestion.style.border =
                "0";

            suggestion.style.borderTop =
                "1px solid rgba(0,0,0,0.05)";

            suggestion.style.background =
                "#ffffff";

            suggestion.style.cursor =
                "pointer";


            suggestion.innerHTML = `
                <span style="
                    margin-right:8px;
                ">
                    🔎
                </span>
                ${escapeHtml(item)}
            `;


            suggestion.addEventListener(
                "click",
                () => {

                    searchInput.value =
                        item;

                    suggestionBox.style.display =
                        "none";

                    searchForm.dispatchEvent(
                        new Event(
                            "submit",
                            {
                                bubbles: true,
                                cancelable: true
                            }
                        )
                    );

                }
            );


            suggestionBox.appendChild(
                suggestion
            );

        });


        /*
         * Show box only if results exist.
         */

        if (
            suggestionBox.children.length > 0
        ) {

            suggestionBox.style.display =
                "block";

        } else {

            suggestionBox.style.display =
                "none";

        }

    }


    /* =====================================================
       INPUT EVENT
    ===================================================== */

    searchInput.addEventListener(
        "input",
        showSuggestions
    );


    searchInput.addEventListener(
        "focus",
        showSuggestions
    );


    /* =====================================================
       KEYBOARD SUPPORT
    ===================================================== */

    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                suggestionBox.style.display =
                    "none";

            }

        }
    );


    /* =====================================================
       CLOSE SUGGESTIONS
       WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                !suggestionBox.contains(
                    event.target
                ) &&
                event.target !== searchInput
            ) {

                suggestionBox.style.display =
                    "none";

            }

        }
    );


    /* =====================================================
       SEARCH SUBMIT
    ===================================================== */

    searchForm.addEventListener(
        "submit",
        () => {

            suggestionBox.style.display =
                "none";

        }
    );

});
