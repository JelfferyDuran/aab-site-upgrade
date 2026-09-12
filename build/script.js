// script.js - Basic interactivity for AAB site

// Toggle FAQ items
function toggleFaq(el) {
  const question = el;
  const answer = question.nextElementSibling;
  
  question.classList.toggle('active');
  answer.classList.toggle('open');
}

// Image error fallback
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.src = '';
    this.style.background = '#f0f0f0';
    this.style.minHeight = '150px';
  });
});

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { 
    if (e.isIntersecting) { 
      e.target.classList.add('visible'); 
      io.unobserve(e.target); 
    } 
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Newsletter form handling
function handleNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector("input[type=email]").value;
  
  if (!email || !email.includes("@")) {
    alert("Please enter a valid email");
    return;
  }
  
  // In a real implementation, this would submit to a form service
  alert("Thank you for subscribing!");
  e.target.reset();
}

document.addEventListener("DOMContentLoaded", function() {
  const nf = document.getElementById("newsletter-form");
  if (nf) {
    nf.addEventListener("submit", handleNewsletter);
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});