/* =========================================================
   JOBSBHANDAR ADMIN DASHBOARD
   SUPABASE CONNECTED VERSION
   ========================================================= */

   document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarClose = document.getElementById("sidebarClose");

    const navItems = document.querySelectorAll(".nav-item[data-page]");
    const pages = document.querySelectorAll(".admin-page");

    const pageTitle = document.getElementById("pageTitle");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    const jobForm = document.getElementById("jobForm");
    const saveDraftButton = document.getElementById("saveDraftButton");

    const jobSearch = document.getElementById("jobSearch");
    const statusFilter = document.getElementById("statusFilter");
    const categoryFilter = document.getElementById("categoryFilter");

    const manageJobsTable = document.getElementById("manageJobsTable");

    const totalJobs = document.getElementById("totalJobs");
    const activeJobs = document.getElementById("activeJobs");
    const draftJobs = document.getElementById("draftJobs");
    const closedJobs = document.getElementById("closedJobs");

    /* =====================================================
       SUPABASE CHECK
    ====================================================== */

    if (typeof supabaseClient === "undefined") {
        console.error("Supabase client not found.");
        alert("Supabase connection not found.");
        return;
    }

    /* =====================================================
       PAGE TITLES
    ====================================================== */

    const pageTitles = {
        "dashboard": "Dashboard",
        "post-job": "Post New Job",
        "manage-jobs": "Manage Jobs",
        "drafts": "Draft Jobs",
        "closed-jobs": "Closed Jobs",
        "settings": "Settings"
    };

    /* =====================================================
       TOAST
    ====================================================== */

    let toastTimer;

    function showToast(message) {

        if (!toast || !toastMessage) {
            alert(message);
            return;
        }

        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    /* =====================================================
       MOBILE SIDEBAR
    ====================================================== */

    function openSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.add("open");
    }

    function closeSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.remove("open");
    }

    if (menuToggle) {

        menuToggle.addEventListener("click", function () {
            openSidebar();
        });

    }

    if (sidebarClose) {

        sidebarClose.addEventListener("click", function () {
            closeSidebar();
        });

    }

    if (sidebarOverlay) {

        sidebarOverlay.addEventListener("click", function () {
            closeSidebar();
        });

    }

    /* =====================================================
       SHOW PAGE
    ====================================================== */

    function showPage(pageName) {

        if (!pageName) {
            pageName = "dashboard";
        }

        let pageFound = false;

        pages.forEach(function (page) {

            const sectionName = page.dataset.section;

            if (sectionName === pageName) {

                page.classList.add("active");
                pageFound = true;

            } else {

                page.classList.remove("active");

            }

        });

        if (!pageFound) {

            pageName = "dashboard";

            pages.forEach(function (page) {

                if (page.dataset.section === "dashboard") {
                    page.classList.add("active");
                } else {
                    page.classList.remove("active");
                }

            });

        }

        if (pageTitle) {

            pageTitle.textContent =
                pageTitles[pageName] || "Dashboard";

        }

        navItems.forEach(function (item) {

            if (item.dataset.page === pageName) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }

        });

        closeSidebar();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (
            pageName === "dashboard" ||
            pageName === "manage-jobs" ||
            pageName === "drafts" ||
            pageName === "closed-jobs"
        ) {

            loadJobs();

        }

    }

    /* =====================================================
       NAVIGATION
    ====================================================== */

    navItems.forEach(function (item) {

        item.addEventListener("click", function (event) {

            event.preventDefault();

            const pageName = item.dataset.page;

            showPage(pageName);

            history.replaceState(
                null,
                "",
                "#" + pageName
            );

        });

    });

    /* =====================================================
       QUICK ACTION BUTTONS
    ====================================================== */

    const pageButtons =
        document.querySelectorAll("[data-go-page]");

    pageButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const pageName =
                button.dataset.goPage;

            showPage(pageName);

            history.replaceState(
                null,
                "",
                "#" + pageName
            );

        });

    });

    /* =====================================================
       HASH NAVIGATION
    ====================================================== */

    function loadPageFromHash() {

        let hash =
            window.location.hash.replace("#", "");

        if (!hash) {
            hash = "dashboard";
        }

        const validPages = [
            "dashboard",
            "post-job",
            "manage-jobs",
            "drafts",
            "closed-jobs",
            "settings"
        ];

        if (!validPages.includes(hash)) {
            hash = "dashboard";
        }

        showPage(hash);
    }

    window.addEventListener(
        "hashchange",
        loadPageFromHash
    );

    /* =====================================================
       GET FORM DATA
    ====================================================== */

    function getJobFormData() {

        const title =
            document.getElementById("jobTitle");

        const company =
            document.getElementById("companyName");

        const category =
            document.getElementById("category");

        const location =
            document.getElementById("location");

        const jobType =
            document.getElementById("jobType");

        const education =
            document.getElementById("education");

        const experience =
            document.getElementById("experience");

        const salary =
            document.getElementById("salary");

        const lastDate =
            document.getElementById("lastDate");

        const description =
            document.getElementById("description");

        const applyUrl =
            document.getElementById("applyUrl");

        return {

            title: title
                ? title.value.trim()
                : "",

            company: company
                ? company.value.trim()
                : "",

            category: category
                ? category.value
                : "",

            location: location
                ? location.value.trim()
                : "",

            jobtype: jobType
                ? jobType.value
                : "",

            qualification: education
                ? education.value.trim()
                : "",

            experience: experience
                ? experience.value.trim()
                : "",

            salary: salary
                ? salary.value.trim()
                : "",

            lastdate: lastDate
                ? lastDate.value || null
                : null,

            description: description
                ? description.value.trim()
                : "",

            apply_link: applyUrl
                ? applyUrl.value.trim()
                : ""

        };

    }

    /* =====================================================
       VALIDATE JOB
    ====================================================== */

    function validateJob(job) {

        if (!job.title) {

            showToast(
                "Please enter the job title."
            );

            const title =
                document.getElementById("jobTitle");

            if (title) {
                title.focus();
            }

            return false;
        }

        if (!job.company) {

            showToast(
                "Please enter the company name."
            );

            const company =
                document.getElementById("companyName");

            if (company) {
                company.focus();
            }

            return false;
        }

        return true;
    }

    /* =====================================================
       PUBLISH JOB
    ====================================================== */

    if (jobForm) {

        jobForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const job =
                    getJobFormData();

                if (!validateJob(job)) {
                    return;
                }

                const submitButton =
                    jobForm.querySelector(
                        'button[type="submit"]'
                    );

                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "Publishing...";

                }

                try {

                    const { data, error } =
                        await supabaseClient
                            .from("jobs")
                            .insert([
                                {
                                    title: job.title,
                                    company: job.company,
                                    location: job.location,
                                    category: job.category,
                                    job_type: job.jobtype,
                                    salary: job.salary,
                                    qualification: job.qualification,
                                    experience: job.experience,
                                    description: job.description,
                                    apply_link: job.apply_link,
                                    last_date: job.lastdate,
                                    is_active: true
                                }
                            ])
                            .select()
                            .single();

                    if (error) {

                        console.error(
                            "Publish error:",
                            error
                        );

                        showToast(
                            "Job publish failed: " +
                            error.message
                        );

                        return;
                    }

                    console.log(
                        "Published job:",
                        data
                    );

                    showToast(
                        "Job published successfully! 🎉"
                    );

                    jobForm.reset();

                    await loadJobs();

                    setTimeout(function () {

                        showPage("manage-jobs");

                        history.replaceState(
                            null,
                            "",
                            "#manage-jobs"
                        );

                    }, 700);

                } catch (error) {

                    console.error(error);

                    showToast(
                        "Something went wrong while publishing."
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            "Publish Job →";

                    }

                }

            }
        );

    }

    /* =====================================================
       SAVE DRAFT
    ====================================================== */

    if (saveDraftButton) {

        saveDraftButton.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();

                const job =
                    getJobFormData();

                if (!job.title) {

                    showToast(
                        "Please enter a job title first."
                    );

                    const title =
                        document.getElementById("jobTitle");

                    if (title) {
                        title.focus();
                    }

                    return;
                }

                saveDraftButton.disabled = true;

                saveDraftButton.textContent =
                    "Saving...";

                try {

                    const { error } =
                        await supabaseClient
                            .from("jobs")
                            .insert([
                                {
                                    title: job.title,
                                    company: job.company,
                                    location: job.location,
                                    category: job.category,
                                    job_type: job.jobtype,
                                    salary: job.salary,
                                    qualification: job.qualification,
                                    experience: job.experience,
                                    description: job.description,
                                    apply_link: job.apply_link,
                                    last_date: job.lastdate,
                                    is_active: false
                                }
                            ]);

                    if (error) {

                        console.error(
                            "Draft error:",
                            error
                        );

                        showToast(
                            "Draft save failed: " +
                            error.message
                        );

                        return;
                    }

                    showToast(
                        "Draft saved successfully! 💾"
                    );

                    jobForm.reset();

                    await loadJobs();

                } catch (error) {

                    console.error(error);

                    showToast(
                        "Something went wrong while saving draft."
                    );

                } finally {

                    saveDraftButton.disabled = false;

                    saveDraftButton.textContent =
                        "Save as Draft";

                }

            }
        );

    }

    /* =====================================================
       LOAD ALL JOBS
    ====================================================== */

    async function loadJobs() {

        try {

            const { data, error } =
                await supabaseClient
                    .from("jobs")
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );

            if (error) {

                console.error(
                    "Load jobs error:",
                    error
                );

                showToast(
                    "Could not load jobs: " +
                    error.message
                );

                return;
            }

            const jobs =
                data || [];

            updateDashboardStats(jobs);

            renderManageJobs(jobs);

        } catch (error) {

            console.error(
                "Unexpected load error:",
                error
            );

            showToast(
                "Could not load jobs."
            );

        }

    }

    /* =====================================================
       DASHBOARD STATS
    ====================================================== */

    function updateDashboardStats(jobs) {

        const total =
            jobs.length;

        const active =
            jobs.filter(function (job) {
                return job.is_active === true;
            }).length;

        const inactive =
            jobs.filter(function (job) {
                return job.is_active === false;
            }).length;

        if (totalJobs) {
            totalJobs.textContent = total;
        }

        if (activeJobs) {
            activeJobs.textContent = active;
        }

        if (draftJobs) {
            draftJobs.textContent = inactive;
        }

        if (closedJobs) {
            closedJobs.textContent = 0;
        }

    }

    /* =====================================================
       RENDER MANAGE JOBS
    ====================================================== */

    function renderManageJobs(jobs) {

        if (!manageJobsTable) {
            return;
        }

        manageJobsTable.innerHTML = "";

        if (!jobs.length) {

            manageJobsTable.innerHTML = `
                <tr class="empty-row">
                    <td colspan="7">
                        No jobs found.
                    </td>
                </tr>
            `;

            return;
        }

        jobs.forEach(function (job) {

            const row =
                document.createElement("tr");

            const status =
                job.is_active
                    ? "Active"
                    : "Draft";

            const statusClass =
                job.is_active
                    ? "active"
                    : "draft";

            const date =
                job.created_at
                    ? new Date(
                        job.created_at
                    ).toLocaleDateString(
                        "en-IN"
                    )
                    : "-";

            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHtml(
                            job.title || "-"
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(
                        job.company || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        job.category || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        job.location || "-"
                    )}
                </td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${status}
                    </span>
                </td>

                <td>
                    ${date}
                </td>

                <td class="job-actions">

                    <button
                        type="button"
                        class="edit-job-button"
                        data-id="${job.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-job-button"
                        data-id="${job.id}"
                    >
                        Delete
                    </button>

                </td>

            `;

            manageJobsTable.appendChild(row);

        });

        addActionListeners();

        applyFilters();

    }

    /* =====================================================
       ADD EDIT / DELETE LISTENERS
    ====================================================== */

    function addActionListeners() {

        const editButtons =
            document.querySelectorAll(
                ".edit-job-button"
            );

        const deleteButtons =
            document.querySelectorAll(
                ".delete-job-button"
            );

        editButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const jobId =
                        button.dataset.id;

                    editJob(jobId);

                }
            );

        });

        deleteButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const jobId =
                        button.dataset.id;

                    deleteJob(jobId);

                }
            );

        });

    }

    /* =====================================================
       EDIT JOB
    ====================================================== */

    async function editJob(jobId) {

        try {

            const { data: job, error } =
                await supabaseClient
                    .from("jobs")
                    .select("*")
                    .eq("id", jobId)
                    .single();

            if (error) {

                console.error(
                    "Get job error:",
                    error
                );

                showToast(
                    "Could not open job."
                );

                return;
            }

            const title =
                prompt(
                    "Job Title:",
                    job.title || ""
                );

            if (title === null) {
                return;
            }

            const company =
                prompt(
                    "Company Name:",
                    job.company || ""
                );

            if (company === null) {
                return;
            }

            const location =
                prompt(
                    "Location:",
                    job.location || ""
                );

            if (location === null) {
                return;
            }

            const category =
                prompt(
                    "Category:",
                    job.category || ""
                );

            if (category === null) {
                return;
            }

            const salary =
                prompt(
                    "Salary:",
                    job.salary || ""
                );

            if (salary === null) {
                return;
            }

            const qualification =
                prompt(
                    "Qualification:",
                    job.qualification || ""
                );

            if (qualification === null) {
                return;
            }

            const experience =
                prompt(
                    "Experience:",
                    job.experience || ""
                );

            if (experience === null) {
                return;
            }

            const description =
                prompt(
                    "Description:",
                    job.description || ""
                );

            if (description === null) {
                return;
            }

            const applyLink =
                prompt(
                    "Apply Link:",
                    job.apply_link || ""
                );

            if (applyLink === null) {
                return;
            }

            const { error: updateError } =
                await supabaseClient
                    .from("jobs")
                    .update({
                        title: title.trim(),
                        company: company.trim(),
                        location: location.trim(),
                        category: category.trim(),
                        salary: salary.trim(),
                        qualification: qualification.trim(),
                        experience: experience.trim(),
                        description: description.trim(),
                        apply_link: applyLink.trim()
                    })
                    .eq("id", jobId);

            if (updateError) {

                console.error(
                    "Update job error:",
                    updateError
                );

                showToast(
                    "Job update failed: " +
                    updateError.message
                );

                return;
            }

            showToast(
                "Job updated successfully! ✅"
            );

            await loadJobs();

        } catch (error) {

            console.error(
                "Edit error:",
                error
            );

            showToast(
                "Could not edit job."
            );

        }

    }

    /* =====================================================
       DELETE JOB
    ====================================================== */

    async function deleteJob(jobId) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this job?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const { error } =
                await supabaseClient
                    .from("jobs")
                    .delete()
                    .eq("id", jobId);

            if (error) {

                console.error(
                    "Delete job error:",
                    error
                );

                showToast(
                    "Delete failed: " +
                    error.message
                );

                return;
            }

            showToast(
                "Job deleted successfully."
            );

            await loadJobs();

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            showToast(
                "Could not delete job."
            );

        }

    }

    /* =====================================================
       HTML ESCAPE
    ====================================================== */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

    /* =====================================================
       SEARCH AND FILTER
    ====================================================== */

    function applyFilters() {

        const searchText =
            jobSearch
                ? jobSearch.value
                    .trim()
                    .toLowerCase()
                : "";

        const selectedStatus =
            statusFilter
                ? statusFilter.value
                    .trim()
                    .toLowerCase()
                : "";

        const selectedCategory =
            categoryFilter
                ? categoryFilter.value
                    .trim()
                    .toLowerCase()
                : "";

        const rows =
            document.querySelectorAll(
                "#manageJobsTable tr"
            );

        rows.forEach(function (row) {

            if (
                row.classList.contains(
                    "empty-row"
                )
            ) {

                return;
            }

            const rowText =
                row.textContent.toLowerCase();

            const searchMatch =
                !searchText ||
                rowText.includes(
                    searchText
                );

            let statusMatch = true;

            if (selectedStatus) {

                const statusElement =
                    row.querySelector(
                        ".status-badge"
                    );

                const statusText =
                    statusElement
                        ? statusElement.textContent
                            .trim()
                            .toLowerCase()
                        : "";

                statusMatch =
                    statusText ===
                    selectedStatus;

            }

            const categoryMatch =
                !selectedCategory ||
                rowText.includes(
                    selectedCategory
                );

            row.style.display =
                searchMatch &&
                statusMatch &&
                categoryMatch
                    ? ""
                    : "none";

        });

    }

    if (jobSearch) {

        jobSearch.addEventListener(
            "input",
            applyFilters
        );

    }

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            applyFilters
        );

    }

    /* =====================================================
       LOGOUT
    ====================================================== */

    const logoutButton =
        document.querySelector(
            ".logout-button"
        );

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function () {

                try {

                    const { error } =
                        await supabaseClient.auth.signOut();

                    if (error) {

                        console.error(error);

                        showToast(
                            "Logout failed."
                        );

                        return;
                    }

                    showToast(
                        "Logged out successfully."
                    );

                    setTimeout(function () {

                        window.location.href =
                            "../index.html";

                    }, 700);

                } catch (error) {

                    console.error(error);

                    showToast(
                        "Logout failed."
                    );

                }

            }
        );

    }

    /* =====================================================
       AVATAR
    ====================================================== */

    const avatarButton =
        document.querySelector(
            ".admin-avatar-button"
        );

    if (avatarButton) {

        avatarButton.addEventListener(
            "click",
            async function () {

                try {

                    const { data } =
                        await supabaseClient.auth.getUser();

                    if (
                        data &&
                        data.user
                    ) {

                        showToast(
                            "Logged in as " +
                            data.user.email
                        );

                    } else {

                        showToast(
                            "No logged-in admin found."
                        );

                    }

                } catch (error) {

                    console.error(error);

                    showToast(
                        "Could not check admin account."
                    );

                }

            }
        );

    }

    /* =====================================================
       LAST DATE MINIMUM
    ====================================================== */

    const lastDate =
        document.getElementById(
            "lastDate"
        );

    if (lastDate) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        lastDate.setAttribute(
            "min",
            today
        );

    }

    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeSidebar();
            }

        }
    );

    /* =====================================================
       ACTION BUTTON STYLES
    ====================================================== */

    const actionStyle =
        document.createElement("style");

    actionStyle.textContent = `
        .job-actions {
            white-space: nowrap;
        }

        .job-actions button {
            border: none;
            padding: 7px 11px;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 5px;
            font-size: 13px;
        }

        .edit-job-button {
            background: #2563eb;
            color: white;
        }

        .delete-job-button {
            background: #dc2626;
            color: white;
        }

        .edit-job-button:hover,
        .delete-job-button:hover {
            opacity: 0.85;
        }
    `;

    document.head.appendChild(actionStyle);

    /* =====================================================
       INITIAL LOAD
    ====================================================== */

    loadPageFromHash();

});