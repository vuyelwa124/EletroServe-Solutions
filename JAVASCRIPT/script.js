/* script.js
   - dynamic services load
   - search filtering
   - accordion
   - lightbox gallery
   - leaflet map
   - contact + enquiry form validation and AJAX-like behavior
*/

document.addEventListener('DOMContentLoaded', function() {
  initServices();
  initSearch();
  initGallery();
  initAccordion();
  initMap();
  initContactForm();
  initEnquiryForm();
});

/* ---------------------------
   Services (simulate JSON)
   --------------------------- */
const SERVICES = [
  { id: 'residential', title: 'Residential Wiring', desc: 'Safe and modern electrical installations for every home.', pricePerM2: 12 },
  { id: 'commercial', title: 'Commercial Projects', desc: 'Efficient electrical systems for offices, stores, and factories.', pricePerM2: 18 },
  { id: 'maintenance', title: 'Maintenance & Repair', desc: 'Quick troubleshooting, repairs, and system upgrades.', pricePerM2: 80 }
];

function initServices(){
  const grid = document.getElementById('servicesGrid');
  if(!grid) return;
  grid.innerHTML = '';
  SERVICES.forEach(s=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<h4>${s.title}</h4><p>${s.desc}</p><p><strong>From:</strong> R${estimateStart(s).toFixed(2)}</p>
    <a class="btn" href="enquiry.html?service=${s.id}">Request Quote</a>`;
    grid.appendChild(card);
  });
}

/* simple starting estimate shown on cards */
function estimateStart(service){
  // minimal example: small flat price or per-m2 baseline
  if(service.id==='maintenance') return 200;
  return Math.max(120, (service.pricePerM2 || 10) * 20);
}

/* ---------------------------
   Search
   --------------------------- */
function initSearch(){
  const input = document.getElementById('serviceSearch');
  if(!input) return;
  input.addEventListener('input', function(){
    const q = input.value.trim().toLowerCase();
    const grid = document.getElementById('servicesGrid');
    Array.from(grid.children).forEach(card=>{
      const txt = card.textContent.toLowerCase();
      card.style.display = txt.includes(q) ? '' : 'none';
    });
  });
}

/* ---------------------------
   Gallery + Lightbox
   --------------------------- */
function initGallery(){
  const gallery = document.getElementById('gallery');
  if(!gallery) return;
  gallery.addEventListener('click', function(e){
    const t = e.target;
    if(t.tagName !== 'IMG' || !t.dataset.full) return;
    openLightbox(t.dataset.full, t.alt || '');
  });
}

function openLightbox(src, alt=''){
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<button class="close" aria-label="Close">✕</button><img src="${src}" alt="${escapeHtml(alt)}">`;
  document.body.appendChild(lb);
  lb.querySelector('.close').addEventListener('click', ()=> lb.remove());
  lb.addEventListener('click', (ev)=> { if(ev.target === lb) lb.remove(); });
}

function escapeHtml(s){ return (s+'').replace(/[&<>"]/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ---------------------------
   Accordion
   --------------------------- */
function initAccordion(){
  const acc = document.querySelectorAll('.acc-btn');
  if(!acc) return;
  acc.forEach(btn=>{
    btn.addEventListener('click', function(){
      const panel = btn.nextElementSibling;
      const open = panel.style.display === 'block';
      // close any other panels in same container
      btn.parentElement.querySelectorAll('.acc-panel').forEach(p=>p.style.display='none');
      if(!open) panel.style.display = 'block';
    });
  });
}

/* ---------------------------
   Map (Leaflet)
   --------------------------- */
function initMap(){
  const el = document.getElementById('map');
  if(!el) return;
  try{
    const map = L.map('map').setView([-26.2041,28.0473], 10); // sample: Johannesburg coords
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.marker([-26.2041,28.0473]).addTo(map).bindPopup('EletroServe Solutions (service area)').openPopup();
  }catch(e){
    console.warn('Leaflet not available or failed to init', e);
  }
}

/* ---------------------------
   Contact form
   --------------------------- */
function initContactForm(){
  const form = document.getElementById('contactForm');
  const sendMailBtn = document.getElementById('sendMailBtn');
  const feedback = document.getElementById('contactFeedback');
  if(!form) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();
    feedback.textContent = '';
    if(!validateContact(form)) return;
    // Simulate AJAX submission (replace URL with real endpoint when available)
    const data = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      type: form.msgType.value,
      message: form.message.value
    };
    feedback.textContent = 'Sending...';
    // simulate network with setTimeout
    setTimeout(()=> {
      feedback.textContent = 'Message received — we will respond within 2 business days.';
      form.reset();
    }, 800);
  });

  if(sendMailBtn){
    sendMailBtn.addEventListener('click', function(){
      if(!validateContact(form)) return;
      const subject = encodeURIComponent('Contact from website: ' + form.msgType.value);
      const body = encodeURIComponent(`Name: ${form.name.value}\nEmail: ${form.email.value}\nPhone: ${form.phone.value}\n\n${form.message.value}`);
      const mailto = `mailto:info@eletroserve.example?subject=${subject}&body=${body}`;
      window.location.href = mailto; // open client
    });
  }
}

function validateContact(form){
  // basic checks
  if(!form.name.value || form.name.value.length < 2){
    showContactError('Please enter your name (2+ characters).'); return false;
  }
  if(!form.email.value || !form.email.checkValidity()){
    showContactError('Please enter a valid email.'); return false;
  }
  if(!form.message.value || form.message.value.length < 10){
    showContactError('Please enter a message (10+ characters).'); return false;
  }
  return true;
}

function showContactError(msg){
  const feedback = document.getElementById('contactFeedback');
  if(feedback) feedback.textContent = msg;
}

/* ---------------------------
   Enquiry form
   --------------------------- */
function initEnquiryForm(){
  const form = document.getElementById('enquiryForm');
  if(!form) return;
  const enqType = document.getElementById('enqType');
  const serviceFields = document.getElementById('serviceFields');
  const result = document.getElementById('enqResult');

  // toggle conditional fields
  enqType.addEventListener('change', ()=> {
    if(enqType.value === 'service') serviceFields.style.display = '';
    else serviceFields.style.display = 'none';
  });

  // pre-select service if passed in querystring
  const params = new URLSearchParams(location.search);
  const serviceParam = params.get('service');
  if(serviceParam){
    const sSelect = document.getElementById('serviceSelect');
    if(sSelect) sSelect.value = serviceParam;
    enqType.value = 'service';
    serviceFields.style.display = '';
  } else {
    serviceFields.style.display = 'none';
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    result.textContent = '';
    // basic validation
    const name = document.getElementById('enqName').value.trim();
    const email = document.getElementById('enqEmail').value.trim();
    if(name.length < 2) { result.textContent = 'Please enter your name.'; return; }
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { result.textContent = 'Please enter a valid email.'; return; }

    if(enqType.value === 'service'){
      const service = document.getElementById('serviceSelect').value;
      const area = Number(document.getElementById('area').value) || 50;
      const svc = SERVICES.find(s=>s.id===service) || SERVICES[0];
      // simple cost estimation logic
      const labour = svc.pricePerM2 * area;
      const materials = labour * 0.35;
      const total = labour + materials + 200; // travel/base fee
      result.innerHTML = `<strong>Estimate:</strong> R${Math.round(total)} (approx). We will contact you to confirm availability.`;
      form.reset();
    } else if(enqType.value === 'volunteer'){
      result.textContent = 'Thanks for your interest in volunteering — we will contact you with next steps.';
      form.reset();
    } else if(enqType.value === 'sponsor'){
      result.textContent = 'Thank you for your sponsorship enquiry — someone will be in touch shortly.';
      form.reset();
    } else {
      result.textContent = 'Please choose an enquiry type.';
    }
  });
}
