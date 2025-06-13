// Portfolio Categories Data
const portfolioCategories = {
    'digital-invitations': {
        name: 'Digital Invitation Cards',
        innerCategories: {
            'wedding': 'Wedding Invitations',
            'birthday': 'Birthday Invitations',
            'corporate': 'Corporate Events',
            'festival': 'Festival Cards'
        }
    },
    'business-branding': {
        name: 'Business Branding',
        innerCategories: {
            'logo': 'Logo Design',
            'stationery': 'Business Stationery',
            'social-media': 'Social Media Graphics',
            'packaging': 'Packaging Design'
        }
    },
    'promotional-graphics': {
        name: 'Promotional Graphics',
        innerCategories: {
            'posters': 'Posters, Flyers & Banners',
            'social-creatives': 'Social Media Creatives',
            'reels': 'Reels & Ad Graphics'
        }
    }
};

// DOM Elements
const uploadForm = document.getElementById('upload-form');
const categorySelect = document.getElementById('category');
const innerCategorySelect = document.getElementById('inner-category');
const imageInput = document.getElementById('image');
const previewImg = document.getElementById('preview');
const worksGrid = document.getElementById('works-grid');
const adminNavBtns = document.querySelectorAll('.admin-nav-btn');
const adminSections = document.querySelectorAll('.admin-section');
const fileNameSpan = document.getElementById('file-name');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadWorks();
    setupEventListeners();
    setupTabNavigation();
});

// Event Listeners
function setupEventListeners() {
    categorySelect?.addEventListener('change', updateInnerCategories);
    imageInput?.addEventListener('change', handleImagePreview);
    uploadForm?.addEventListener('submit', handleFormSubmit);
    
    adminNavBtns.forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    if (imageInput && fileNameSpan) {
        imageInput.addEventListener('change', function() {
            fileNameSpan.textContent = this.files?.[0]?.name || 'No file chosen';
        });
    }
}

function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            adminSections.forEach(section => {
                section.classList.toggle('active', section.id === btn.dataset.section + '-section');
            });
        });
    });
}

// Update Inner Categories
function updateInnerCategories() {
    if (!innerCategorySelect) return;
    
    const category = categorySelect.value;
    innerCategorySelect.innerHTML = '<option value="">Select Subcategory</option>';

    if (category && portfolioCategories[category]) {
        Object.entries(portfolioCategories[category].innerCategories).forEach(([key, name]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = name;
            innerCategorySelect.appendChild(option);
        });
    }
}

// Image Preview
function handleImagePreview(e) {
    const file = e.target.files?.[0];
    if (!file || !previewImg) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
        previewImg.parentElement.querySelector('p').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();
    if (!uploadForm || !previewImg) return;

    const formData = new FormData(uploadForm);
    const workData = {
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        description: formData.get('description'),
        category: formData.get('category'),
        innerCategory: formData.get('inner-category'),
        image: previewImg.src,
        size: {
            width: previewImg.naturalWidth,
            height: previewImg.naturalHeight
        }
    };

    const works = JSON.parse(localStorage.getItem('portfolioItems')) || [];
    works.push(workData);
    localStorage.setItem('portfolioItems', JSON.stringify(works));

    uploadForm.reset();
    previewImg.style.display = 'none';
    previewImg.parentElement.querySelector('p').style.display = 'block';

    loadWorks();
    alert('Work uploaded successfully!');
}

// Load Works
function loadWorks() {
    if (!worksGrid) return;
    
    const works = JSON.parse(localStorage.getItem('portfolioItems')) || [];
    worksGrid.innerHTML = '';
    
    if (works.length === 0) return;

    const grouped = works.reduce((acc, work, idx) => {
        if (!acc[work.category]) acc[work.category] = [];
        acc[work.category].push({ ...work, _idx: idx });
        return acc;
    }, {});

    Object.entries(grouped).forEach(([cat, items]) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'admin-category-group';
        
        const header = document.createElement('div');
        header.className = 'admin-category-header';
        header.innerHTML = `
            <span class="admin-category-visual"></span>
            ${portfolioCategories[cat]?.name || cat}
            <span class="admin-category-line"></span>
        `;
        
        groupDiv.appendChild(header);
        
        items.forEach(work => {
            const workElement = document.createElement('div');
            workElement.className = 'admin-item';
            workElement.innerHTML = `
                <button class="delete-btn" title="Delete" onclick="deleteWork(${work._idx})">&times;</button>
                <img src="${work.image}" alt="${work.title}">
                <h3>${work.title}</h3>
                <p>${work.subtitle}</p>
                <div class="admin-item-actions"></div>
            `;
            groupDiv.appendChild(workElement);
        });
        
        worksGrid.appendChild(groupDiv);
    });
}

// Delete Work
function deleteWork(index) {
    if (confirm('Are you sure you want to delete this work?')) {
        const works = JSON.parse(localStorage.getItem('portfolioItems')) || [];
        works.splice(index, 1);
        localStorage.setItem('portfolioItems', JSON.stringify(works));
        loadWorks();
    }
}

// Switch Section
function switchSection(section) {
    adminNavBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });

    adminSections.forEach(section => {
        section.classList.toggle('active', section.id === `${section}-section`);
    });
}

// Clear All Items
const clearAllBtn = document.getElementById('clear-all-btn');
if (clearAllBtn) {
    clearAllBtn.onclick = function() {
        if (confirm('Are you sure you want to delete ALL works?')) {
            localStorage.removeItem('portfolioItems');
            loadWorks();
        }
    };
}