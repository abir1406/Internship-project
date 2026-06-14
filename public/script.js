// Active Navbar Highlight
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 100) {
            currentSection = sec.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
});

// Skill Animation
const skillBars = document.querySelectorAll(".skill-fill");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.getAttribute("data-width");
            bar.style.width = targetWidth + "%";
        }
    });
}, {
    threshold: 0.3
});

skillBars.forEach((bar) => observer.observe(bar));

// Contact Form
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("form-status");

if(contactForm){
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };

        formStatus.textContent = "Sending...";

        try {
            const response = await fetch(
                "http://localhost:5000/api/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const result = await response.json();

            if(result.success){
                formStatus.textContent =
                    "Message sent successfully!";
                formStatus.style.color = "green";
                contactForm.reset();
            }else{
                formStatus.textContent =
                    "Error: " + result.error;
                formStatus.style.color = "red";
            }

        } catch(error){
            formStatus.textContent =
                "Could not connect to server.";
            formStatus.style.color = "red";
        }
    });
}