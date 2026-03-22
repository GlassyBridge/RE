const wareSpan = document.querySelector('.ware');
const words = ["hardware", "software"];
let i = 0;

function glitchSwap() {
    let count = 0;
    const glitchInterval = setInterval(() => {
        wareSpan.innerText = Math.random().toString(36).substring(2, 10);
        count++;
        
        if (count > 6) {
            clearInterval(glitchInterval);
            i = (i + 1) % words.length;
            wareSpan.innerText = words[i];
        }
    }, 40);
}

setInterval(glitchSwap, 10000);

const faqBtn = document.querySelector('#FAQ');
const faqModal = document.getElementById('faq-modal');
const closeBtn = document.getElementById('close-faq');

faqBtn.addEventListener('click', (e) => {
    e.preventDefault();
    faqModal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    faqModal.style.display = 'none';
});

const qHeaders = document.querySelectorAll('.q-header');

qHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const parent = header.parentElement;
        
        document.querySelectorAll('.q-item').forEach(item => {
            if (item !== parent) item.classList.remove('open');
        });

        parent.classList.toggle('open');
    });
});