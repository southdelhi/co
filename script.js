// Blog Carousel functionality
let currentBlogSlide = 0
let totalBlogSlides = 0
let currentTestimonialSlide = 0
let totalTestimonialSlides = 0

// Store references to the active blog carousel elements on the current page
let activeBlogCarouselElement = null
let activeBlogGrids = []
let activeBlogPrevBtn = null
let activeBlogNextBtn = null
let activeBlogTouchStartX = 0
let activeBlogTouchStartY = 0
let activeBlogStartTime = 0

// Enhanced JavaScript for SDCG website with improved responsive functionality

// --- Navbar auto-hide on scroll with enhanced mobile support ---
function initNavbarAutoHide() {
  const navbar = document.querySelector(".navbar")
  if (!navbar) return

  let lastScrollTop = 0
  const delta = 15
  const hideDelay = 3000
  let timeoutId
  let ticking = false

  function updateNavbar() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    clearTimeout(timeoutId)

    if (Math.abs(lastScrollTop - scrollTop) <= delta && scrollTop > 0) {
      ticking = false
      return
    }

    if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
      navbar.classList.add("hidden")
    } else {
      navbar.classList.remove("hidden")
    }
    lastScrollTop = scrollTop

    if (scrollTop > navbar.offsetHeight) {
      timeoutId = setTimeout(() => {
        if (window.pageYOffset > navbar.offsetHeight) {
          navbar.classList.add("hidden")
        }
      }, hideDelay)
    }
    ticking = false
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar)
      ticking = true
    }
  })

  // Initially show navbar if at top
  if (window.pageYOffset <= navbar.offsetHeight) {
    navbar.classList.remove("hidden")
  }
}

// --- Enhanced Modal Functions with better mobile support ---
function openModal() {
  const modal = document.getElementById("applicationModal")
  if (modal) {
    modal.style.display = "flex"
    document.body.style.overflow = "hidden"
    const firstInput = modal.querySelector("input, select, textarea, button")
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100)
    }
  }
}

function closeModal() {
  const modal = document.getElementById("applicationModal")
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "visible"
  }
}

document.addEventListener("click", (e) => {
  const applicationModal = document.getElementById("applicationModal")
  if (e.target === applicationModal) {
    closeModal()
  }
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal()
  }
})

function openAppointmentModal() {
  openModal()
}

// --- Enhanced Blog Carousel functionality (works for both index.html and blogs.html) ---
function slideBlogCarousel(direction) {
  if (!activeBlogCarouselElement || activeBlogGrids.length === 0) return

  activeBlogGrids[currentBlogSlide].classList.remove("active")
  activeBlogGrids[currentBlogSlide].classList.remove("prev-slide")

  const prevSlideIndex = currentBlogSlide

  if (direction === "next") {
    currentBlogSlide = (currentBlogSlide + 1) % totalBlogSlides
  } else if (direction === "prev") {
    currentBlogSlide = (currentBlogSlide - 1 + totalBlogSlides) % totalBlogSlides
  }

  activeBlogGrids[currentBlogSlide].classList.remove("prev-slide")
  activeBlogGrids[currentBlogSlide].classList.add("active")

  if (direction === "next" && activeBlogGrids[prevSlideIndex]) {
    activeBlogGrids[prevSlideIndex].classList.add("prev-slide")
  } else if (direction === "prev" && activeBlogGrids[prevSlideIndex]) {
    // Optional: handle reverse animation if needed, for now, simple slide
  }
  updateBlogCarouselButtons()
}

function updateBlogCarouselButtons() {
  if (!activeBlogPrevBtn || !activeBlogNextBtn) return

  activeBlogPrevBtn.disabled = currentBlogSlide === 0
  activeBlogPrevBtn.style.opacity = currentBlogSlide === 0 ? "0.5" : "1"

  activeBlogNextBtn.disabled = currentBlogSlide >= totalBlogSlides - 1
  activeBlogNextBtn.style.opacity = currentBlogSlide >= totalBlogSlides - 1 ? "0.5" : "1"
}

function handleBlogTouchStart(e) {
  const touchobj = e.changedTouches[0]
  activeBlogTouchStartX = touchobj.pageX
  activeBlogTouchStartY = touchobj.pageY
  activeBlogStartTime = new Date().getTime()
}

function handleBlogTouchEnd(e) {
  if (!activeBlogCarouselElement) return
  const touchobj = e.changedTouches[0]
  const distX = touchobj.pageX - activeBlogTouchStartX
  const distY = touchobj.pageY - activeBlogTouchStartY
  const elapsedTime = new Date().getTime() - activeBlogStartTime
  const threshold = 80 // Min distance for swipe
  const restraint = 100 // Max vertical distance
  const allowedTime = 400 // Max time for swipe

  if (elapsedTime <= allowedTime) {
    if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
      if (distX > 0) {
        slideBlogCarousel("prev")
      } else {
        slideBlogCarousel("next")
      }
    }
  }
}

function initBlogCarousel() {
  const homepageCarousel = document.getElementById("blogsCarousel") // For index.html
  const blogPageCarousel = document.getElementById("blogsPageCarousel") // For blogs.html

  if (homepageCarousel) {
    activeBlogCarouselElement = homepageCarousel
    activeBlogPrevBtn = document.getElementById("prevBtn")
    activeBlogNextBtn = document.getElementById("nextBtn")
  } else if (blogPageCarousel) {
    activeBlogCarouselElement = blogPageCarousel
    activeBlogPrevBtn = document.getElementById("prevBlogPageBtn") // ID from blogs.html
    activeBlogNextBtn = document.getElementById("nextBlogPageBtn") // ID from blogs.html
  } else {
    return // No blog carousel on this page
  }

  activeBlogGrids = activeBlogCarouselElement.querySelectorAll(".blogs-grid")
  totalBlogSlides = activeBlogGrids.length

  if (totalBlogSlides > 0) {
    activeBlogGrids.forEach((grid, index) => {
      grid.classList.remove("active", "prev-slide")
      if (index === 0) {
        grid.classList.add("active")
      }
    })
    currentBlogSlide = 0
    updateBlogCarouselButtons()

    // Add touch support
    activeBlogCarouselElement.removeEventListener("touchstart", handleBlogTouchStart) // Remove if already added
    activeBlogCarouselElement.addEventListener("touchstart", handleBlogTouchStart, { passive: true })
    activeBlogCarouselElement.removeEventListener("touchend", handleBlogTouchEnd) // Remove if already added
    activeBlogCarouselElement.addEventListener("touchend", handleBlogTouchEnd, { passive: true })
  } else {
    // Disable buttons if no slides
    if (activeBlogPrevBtn) activeBlogPrevBtn.disabled = true
    if (activeBlogNextBtn) activeBlogNextBtn.disabled = true
  }
}

// --- Enhanced Testimonial Carousel functionality with touch support ---
function slideTestimonialCarousel(direction) {
  const carousel = document.getElementById("testimonialsCarousel")
  if (!carousel) return
  const testimonialGrids = carousel.querySelectorAll(".testimonials-grid")

  if (testimonialGrids.length === 0) return
  totalTestimonialSlides = testimonialGrids.length

  testimonialGrids[currentTestimonialSlide].classList.remove("active", "prev-slide")
  const prevSlideIndex = currentTestimonialSlide

  if (direction === "next") {
    currentTestimonialSlide = (currentTestimonialSlide + 1) % totalTestimonialSlides
  } else if (direction === "prev") {
    currentTestimonialSlide = (currentTestimonialSlide - 1 + totalTestimonialSlides) % totalTestimonialSlides
  }

  testimonialGrids[currentTestimonialSlide].classList.remove("prev-slide")
  testimonialGrids[currentTestimonialSlide].classList.add("active")

  if (direction === "next" && testimonialGrids[prevSlideIndex]) {
    testimonialGrids[prevSlideIndex].classList.add("prev-slide")
  }
  updateTestimonialCarouselButtons()
}

function updateTestimonialCarouselButtons() {
  const prevBtn = document.getElementById("prevTestimonialBtn")
  const nextBtn = document.getElementById("nextTestimonialBtn")
  if (!prevBtn || !nextBtn) return

  prevBtn.disabled = currentTestimonialSlide === 0
  prevBtn.style.opacity = currentTestimonialSlide === 0 ? "0.5" : "1"
  nextBtn.disabled = currentTestimonialSlide >= totalTestimonialSlides - 1
  nextBtn.style.opacity = currentTestimonialSlide >= totalTestimonialSlides - 1 ? "0.5" : "1"
}

function initTestimonialCarousel() {
  const carousel = document.getElementById("testimonialsCarousel")
  if (!carousel) return
  const testimonialGrids = carousel.querySelectorAll(".testimonials-grid")
  totalTestimonialSlides = testimonialGrids.length

  if (totalTestimonialSlides > 0) {
    testimonialGrids.forEach((grid, index) => {
      grid.classList.remove("active", "prev-slide")
      if (index === 0) grid.classList.add("active")
    })
    currentTestimonialSlide = 0
    updateTestimonialCarouselButtons()

    let startX = 0,
      startY = 0,
      startTime = 0
    carousel.addEventListener(
      "touchstart",
      (e) => {
        const touchobj = e.changedTouches[0]
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime()
      },
      { passive: true },
    )
    carousel.addEventListener(
      "touchend",
      (e) => {
        const touchobj = e.changedTouches[0]
        const distX = touchobj.pageX - startX,
          distY = touchobj.pageY - startY
        const elapsedTime = new Date().getTime() - startTime
        const threshold = 80,
          restraint = 100,
          allowedTime = 400
        if (elapsedTime <= allowedTime && Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          if (distX > 0) slideTestimonialCarousel("prev")
          else slideTestimonialCarousel("next")
        }
      },
      { passive: true },
    )
  } else {
    const prevBtn = document.getElementById("prevTestimonialBtn")
    const nextBtn = document.getElementById("nextTestimonialBtn")
    if (prevBtn) prevBtn.disabled = true
    if (nextBtn) nextBtn.disabled = true
  }
}

// Scroll to blogs section
function scrollToBlogsSection() {
  const blogsSectionTarget = document.getElementById("blogs-grid") // ID on index.html
  const blogsPageTarget = document.getElementById("blogsPageCarousel") // ID on blogs.html
  const targetElement = blogsSectionTarget || blogsPageTarget

  if (targetElement) {
    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 70
    const offsetTop = targetElement.offsetTop - navbarHeight - 20
    window.scrollTo({ top: offsetTop, behavior: "smooth" })
  }
}

// --- Enhanced smooth scrolling with navbar offset ---
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      // Ensure it's an internal link and not just "#"
      if (href.length > 1 && href.startsWith("#")) {
        // Check if the target element exists on the current page
        try {
          const target = document.querySelector(href)
          if (target) {
            e.preventDefault() // Prevent default only if target is on the current page
            const navbar = document.querySelector(".navbar")
            const navbarHeight = navbar ? navbar.offsetHeight : 0
            const offsetTop = target.offsetTop - navbarHeight - 20 // Added 20px buffer
            window.scrollTo({ top: offsetTop, behavior: "smooth" })
          }
          // If target is not found, let the default browser behavior handle it (might be a link to another page's anchor)
        } catch (error) {
          console.warn("Smooth scroll target not found or invalid selector:", href, error)
          // Allow default behavior if selector is invalid
        }
      }
      // For links like "contact.html", "blogs.html", etc., let the default navigation happen.
    })
  })
}

// --- Enhanced form handling with better validation ---
function handleFormSubmission(form, message) {
  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true
  let firstInvalidField = null

  requiredFields.forEach((field) => {
    const value = field.value.trim()
    let fieldValid = true
    field.style.borderColor = "#e0e0e0" // Reset border
    field.removeAttribute("aria-invalid")

    if (!value) fieldValid = false
    else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fieldValid = false
    else if (field.type === "tel" && !/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ""))) fieldValid = false

    if (!fieldValid) {
      isValid = false
      field.style.borderColor = "#ef4444"
      field.setAttribute("aria-invalid", "true")
      if (!firstInvalidField) firstInvalidField = field
    }
  })

  if (isValid) {
    showNotification(message, "success")
    form.reset()
    // closeModal(); // Close modal on successful submission if it's a modal form
  } else {
    showNotification("Please fill all required fields correctly.", "error")
    if (firstInvalidField) firstInvalidField.focus()
  }
}

// --- Enhanced Notification system with better mobile support ---
function showNotification(message, type) {
  const notification = document.createElement("div")
  const bgColor = type === "error" ? "#ef4444" : type === "info" ? "#3b82f6" : "#10b981"
  notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: ${bgColor}; color: white;
        padding: 1rem 1.5rem; border-radius: 10px; z-index: 3000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: slideInNotification 0.3s ease;
        max-width: 90vw; font-weight: 500; cursor: pointer; word-wrap: break-word;
        transition: opacity 0.3s ease, transform 0.3s ease;`
  notification.textContent = message

  if (window.innerWidth <= 768) {
    notification.style.right = "10px"
    notification.style.left = "10px"
    notification.style.top = "10px"
    notification.style.maxWidth = "calc(100vw - 20px)"
  }

  notification.addEventListener("click", function () {
    this.remove()
  })
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateX(100%)" // Or translateY for mobile
    setTimeout(() => notification.remove(), 300)
  }, 5000)
}

if (!document.getElementById("notification-styles")) {
  const style = document.createElement("style")
  style.id = "notification-styles"
  style.textContent = `
        @keyframes slideInNotification {
            from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 768px) {
            @keyframes slideInNotification {
                from { transform: translateY(-120%); opacity: 0; } to { transform: translateY(0); opacity: 1; }
            }
        }`
  document.head.appendChild(style)
}

// --- Enhanced mobile menu toggle with better accessibility ---
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  if (!hamburger || !navMenu) return

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation()
    const isActive = navMenu.classList.toggle("active")
    hamburger.classList.toggle("active")
    hamburger.setAttribute("aria-expanded", isActive)
    if (isActive) {
      const firstLink = navMenu.querySelector(".nav-link, .nav-btn")
      if (firstLink) setTimeout(() => firstLink.focus(), 100)
    }
  })

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        hamburger.classList.remove("active")
        hamburger.setAttribute("aria-expanded", "false")
      }
    })
  })

  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
      hamburger.setAttribute("aria-expanded", "false")
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
      hamburger.setAttribute("aria-expanded", "false")
      hamburger.focus()
    }
  })
  hamburger.setAttribute("aria-expanded", "false")
  hamburger.setAttribute("aria-label", "Toggle navigation menu")
}

// --- Enhanced scroll animations with intersection observer ---
function initScrollAnimations() {
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        obs.unobserve(entry.target)
      }
    })
  }, observerOptions)
  const sections = document.querySelectorAll(
    ".lenders-section, .services-section, .process-section, .blogs-section .blogs-content, .blogs-carousel-container, .interests-section, .testimonials-section, .contact-us-section, .contact-hero, .contact-methods, .contact-form-section, .about-content-section, .blogs-page-hero, .all-articles-section, .latest-blogs-carousel-section, .services-page-hero, .service-detail-section",
  )
  sections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(30px)"
    section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"
    observer.observe(section)
  })
}

// --- Enhanced service cards interaction ---
function initServiceCards() {
  const serviceCards = document.querySelectorAll(
    ".service-card, .interest-card, .testimonial-card, .contact-card, .blog-card, .team-member-card, .service-item",
  )
  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-6px) scale(1.01)"
    })
    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
    if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0")
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        const link = this.querySelector("a, .service-link, .blog-read-more, .contact-link, .btn-primary")
        if (link) link.click()
        else if (this.onclick) this.onclick() // For cards with direct onclick
      }
    })
  })
}

// --- Contact form submission handler (for contact.html page) ---
function handlePageContactFormSubmission(form) {
  // Re-using generic handleFormSubmission
  handleFormSubmission(form, "Thank you for your message! Our team will get back to you within 24 hours.")
  if (form.checkValidity()) {
    // Additional check if form is valid after our custom validation
    form.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

// --- Enhanced resize handler ---
function handleResize() {
  const navMenu = document.querySelector(".nav-menu")
  const hamburger = document.querySelector(".hamburger")
  if (window.innerWidth > 1023 && navMenu && hamburger && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
    hamburger.setAttribute("aria-expanded", "false")
  }
  // Notification position update already handled in showNotification
}

// --- Keyboard navigation enhancement ---
function initKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    if (e.target.classList.contains("carousel-btn") && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      e.target.click()
    }
  })
  // Card keyboard nav already in initServiceCards
}

// --- Performance optimization ---
function initPerformanceOptimizations() {
  const images = document.querySelectorAll("img[data-src]") // Assuming you'll use data-src for lazy loading
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        observer.unobserve(img)
      }
    })
  })
  images.forEach((img) => imageObserver.observe(img))

  // Debounce scroll events for complex operations (navbar hide is already throttled by rAF)
}

// --- DOMContentLoaded Event Listener (Main Initialization) ---
document.addEventListener("DOMContentLoaded", () => {
  initNavbarAutoHide()
  initMobileMenu()
  initSmoothScrolling()
  initServiceCards() // Also handles blog cards, etc.
  initScrollAnimations()
  initBlogCarousel() // This will now correctly find the carousel on either page
  initTestimonialCarousel()
  initKeyboardNavigation()
  initPerformanceOptimizations()

  const applicationModal = document.getElementById("applicationModal")
  if (applicationModal) {
    const applicationForms = applicationModal.querySelectorAll("form") // Could be multiple if IDs are not unique
    applicationForms.forEach((applicationForm) => {
      applicationForm.addEventListener("submit", function (e) {
        e.preventDefault()
        handleFormSubmission(this, "Application submitted successfully! Our team will review and contact you soon.")
        if (this.checkValidity()) closeModal() // Close modal only if form submission logic deems it valid
      })
    })
  }

  const contactPageForm = document.getElementById("contactForm") // Specific to contact.html
  if (contactPageForm) {
    contactPageForm.addEventListener("submit", function (e) {
      e.preventDefault()
      handlePageContactFormSubmission(this)
    })
  }

  const bankLogos = document.querySelectorAll(".bank-logo")
  bankLogos.forEach((logo) => {
    logo.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)"
      const svg = this.querySelector("svg")
      if (svg) {
        svg.style.filter = "grayscale(0%)"
        svg.style.opacity = "1"
      }
    })
    logo.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)"
      const svg = this.querySelector("svg")
      if (svg) {
        svg.style.filter = "grayscale(100%)"
        svg.style.opacity = "0.7"
      }
    })
    if (!logo.hasAttribute("tabindex")) logo.setAttribute("tabindex", "0")
    logo.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        this.dispatchEvent(new Event("mouseenter"))
        setTimeout(() => {
          this.dispatchEvent(new Event("mouseleave"))
        }, 200)
      }
    })
  })

  window.addEventListener("resize", debounce(handleResize, 200))
  handleResize() // Initial call
})

// --- Auto-advance carousels (optional) ---
function initAutoAdvance() {
  const autoAdvanceInterval = 8000
  setInterval(() => {
    if (document.visibilityState === "visible" && activeBlogCarouselElement && totalBlogSlides > 1) {
      slideBlogCarousel("next")
    }
  }, autoAdvanceInterval)
  setInterval(() => {
    if (
      document.visibilityState === "visible" &&
      document.getElementById("testimonialsCarousel") &&
      totalTestimonialSlides > 1
    ) {
      slideTestimonialCarousel("next")
    }
  }, autoAdvanceInterval + 1500)
}
// document.addEventListener("DOMContentLoaded", initAutoAdvance);

// --- Utility functions ---
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Global SDCG object for public functions
window.SDCG = {
  openModal,
  closeModal,
  openAppointmentModal,
  slideBlogCarousel,
  slideTestimonialCarousel,
  showNotification,
}
