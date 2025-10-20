// Improved mobile menu functionality
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenuBtn = document.getElementById("close-menu-btn");
const hamburger = document.getElementById("hamburger");
const overlay = document.getElementById("overlay");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.style.overflow = mobileMenu.classList.contains("active")
    ? "hidden"
    : "auto";
});

closeMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
  hamburger.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
});

overlay.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
  hamburger.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
});

document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    hamburger.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add scroll effect to navigation
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  if (window.scrollY > 100) {
    nav.classList.add("bg-black");
    nav.classList.remove("bg-black/90");
  } else {
    nav.classList.add("bg-black/90");
    nav.classList.remove("bg-black");
  }
});

// Form submission dengan Google Apps Script
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = this;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Show loading state
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  // Get form data
  const formData = {
    name: form.querySelector('input[type="text"]').value,
    email: form.querySelector('input[type="email"]').value,
    project_name: form.querySelectorAll('input[type="text"]')[1].value,
    description: form.querySelector("textarea").value,
    timestamp: new Date().toLocaleString(),
  };

  // Basic validation
  if (!formData.name || !formData.email || !formData.description) {
    showNotification("Please fill in all required fields", "error");
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    return;
  }

  if (!isValidEmail(formData.email)) {
    showNotification("Please enter a valid email address", "error");
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    return;
  }

  // Method 1: Google Apps Script (Recommended)
  submitToGoogleAppsScript(formData)
    .then(() => {
      showNotification(
        "Message sent successfully! I will get back to you soon.",
        "success"
      );
      form.reset();
    })
    .catch((error) => {
      console.error("Error:", error);
      // Fallback to method 2 if first method fails
      fallbackToMailto(formData);
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
});

// Method 1: Google Apps Script (Recommended)
function submitToGoogleAppsScript(formData) {
  return new Promise((resolve, reject) => {
    // Ganti URL ini dengan URL Google Apps Script Anda
    const scriptURL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

    fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
    })
      .then((response) => {
        if (response.ok) {
          resolve();
        } else {
          reject(new Error("Network response was not ok"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Method 2: Fallback menggunakan mailto
function fallbackToMailto(formData) {
  const subject = `New Message from ${formData.name} - ${formData.project_name}`;
  const body = `
Name: ${formData.name}
Email: ${formData.email}
Project: ${formData.project_name}

Message:
${formData.description}

Sent from portfolio website on ${formData.timestamp}
  `.trim();

  const mailtoLink = `mailto:your-email@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  showNotification(
    "Opening email client... Please send the pre-filled email.",
    "info"
  );

  // Buka email client
  setTimeout(() => {
    window.location.href = mailtoLink;
  }, 1000);
}

// Method 3: Alternative menggunakan FormSubmit.co (Free service)
function submitToFormSubmit(formData) {
  // Ganti action URL di form HTML dengan URL dari FormSubmit.co
  const form = document.querySelector("form");

  // FormSubmit.co akan automatically handle submission
  // Anda hanya perlu mengganti action attribute di form HTML
  return new Promise((resolve) => {
    // FormSubmit.co akan redirect, jadi kita anggap success
    setTimeout(resolve, 1000);
  });
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notification if any
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  const bgColor =
    type === "error" ? "#ef4444" : type === "success" ? "#10b981" : "#3b82f6";
  const icon = type === "error" ? "❌" : type === "success" ? "✅" : "ℹ️";

  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${icon}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    max-width: 400px;
    animation: slideInRight 0.3s ease-out;
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;

  notification.querySelector(".notification-content").style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;
  `;

  notification.querySelector(".notification-close").style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  `;

  notification
    .querySelector(".notification-close")
    .addEventListener("mouseenter", function () {
      this.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    });

  notification
    .querySelector(".notification-close")
    .addEventListener("mouseleave", function () {
      this.style.backgroundColor = "transparent";
    });

  // Add close functionality
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => notification.remove(), 300);
    });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);

  document.body.appendChild(notification);
}

// Add CSS animations for notifications
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification {
    font-family: inherit;
  }
  
  .notification-icon {
    font-size: 16px;
  }
  
  .notification-message {
    flex: 1;
    line-height: 1.4;
  }
`;
document.head.appendChild(style);

// Add hover effects to project cards
document.querySelectorAll(".group").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-5px)";
    this.style.transition = "transform 0.3s ease";
  });
  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// Download CV button functionality
document.querySelectorAll("button").forEach((button) => {
  if (button.textContent.includes("Download CV")) {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Ganti dengan URL file CV Anda
      const cvUrl = "path/to/your-cv.pdf";

      // Create temporary link for download
      const link = document.createElement("a");
      link.href = cvUrl;
      link.download = "Rianto_CV.pdf";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification("Downloading CV...", "info");
    });
  }
});

// Let's Talk button functionality
document.querySelectorAll("button").forEach((button) => {
  if (button.textContent.includes("Let's talk")) {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("contact").scrollIntoView({
        behavior: "smooth",
      });
    });
  }
});

// Social media links functionality
document.querySelectorAll(".w-8, .w-9").forEach((icon) => {
  icon.addEventListener("click", function () {
    const parent = this.closest("a");
    if (parent && parent.href) {
      window.open(parent.href, "_blank");
    }
  });
});


