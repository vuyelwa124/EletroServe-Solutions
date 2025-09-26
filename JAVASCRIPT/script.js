// Contact form functionality
document.getElementById('sendMsg').addEventListener('click', function() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMsg = document.getElementById('formMsg');
  
    if (name === '' || email === '' || message === '') {
      formMsg.innerText = "Please fill in all fields before sending.";
      formMsg.style.color = 'red';
      return;
    }
  
    // Simulate sending the message
    formMsg.innerText = "Thank you! Your message has been sent.";
    formMsg.style.color = 'green';
  
    // Clear the form
    document.getElementById('contactForm').reset();
  });
  
  // Optional: You can add more functionality here later
  // For example, interactive service cards, sliders, or animations
  