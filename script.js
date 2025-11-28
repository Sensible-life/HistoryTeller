// ==========================================
// Section 1: Interactive People Circles
// ==========================================

class Person {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseRadius = radius;
        this.targetRadius = radius;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.intelligence = Math.floor(Math.random() * 40) + 60; // 60-100
        this.character = Math.floor(Math.random() * 40) + 60;
        this.potential = Math.floor(Math.random() * 40) + 60;
        this.color = '#95a5a6';
        this.hovered = false;
    }

    update(canvas) {
        // Gentle floating animation
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx = -this.vx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy = -this.vy;
        }

        // Smooth radius animation
        if (this.hovered) {
            this.targetRadius = this.baseRadius * 1.3;
        } else {
            this.targetRadius = this.baseRadius;
        }
        this.radius += (this.targetRadius - this.radius) * 0.1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add subtle border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    isHovered(mouseX, mouseY) {
        const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        return distance < this.radius;
    }
}

// Initialize Section 1
const peopleCanvas = document.getElementById('people-canvas');
const peopleCtx = peopleCanvas.getContext('2d');
const tooltip = document.getElementById('person-tooltip');
let people = [];

function initPeopleCanvas() {
    peopleCanvas.width = window.innerWidth;
    peopleCanvas.height = window.innerHeight;

    // Create people circles
    people = [];
    const numPeople = Math.floor((peopleCanvas.width * peopleCanvas.height) / 15000);

    for (let i = 0; i < numPeople; i++) {
        const radius = Math.random() * 15 + 8;
        const x = Math.random() * (peopleCanvas.width - radius * 2) + radius;
        const y = Math.random() * (peopleCanvas.height - radius * 2) + radius;
        people.push(new Person(x, y, radius));
    }
}

function animatePeople() {
    peopleCtx.clearRect(0, 0, peopleCanvas.width, peopleCanvas.height);

    people.forEach(person => {
        person.update(peopleCanvas);
        person.draw(peopleCtx);
    });

    requestAnimationFrame(animatePeople);
}

// Mouse interaction for Section 1
peopleCanvas.addEventListener('mousemove', (e) => {
    const rect = peopleCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let hoveredPerson = null;

    people.forEach(person => {
        person.hovered = person.isHovered(mouseX, mouseY);
        if (person.hovered) {
            hoveredPerson = person;
        }
    });

    if (hoveredPerson) {
        tooltip.classList.remove('hidden');
        tooltip.style.left = e.clientX + 20 + 'px';
        tooltip.style.top = e.clientY + 20 + 'px';

        document.getElementById('intelligence').textContent = hoveredPerson.intelligence;
        document.getElementById('character').textContent = hoveredPerson.character;
        document.getElementById('potential').textContent = hoveredPerson.potential;
    } else {
        tooltip.classList.add('hidden');
    }
});

peopleCanvas.addEventListener('mouseleave', () => {
    tooltip.classList.add('hidden');
    people.forEach(person => person.hovered = false);
});

// ==========================================
// Section 2: System Comparison Animations
// ==========================================

const systemsCanvas = document.getElementById('systems-canvas');
const systemsCtx = systemsCanvas.getContext('2d');
let circles = [];
let currentSystem = 'intro';

class Circle {
    constructor(x, y, radius, color = '#95a5a6') {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.radius = radius;
        this.targetRadius = radius;
        this.color = color;
        this.targetColor = color;
        this.alpha = 1;
        this.targetAlpha = 1;
    }

    update() {
        // Smooth transitions
        this.x += (this.targetX - this.x) * 0.05;
        this.y += (this.targetY - this.y) * 0.05;
        this.radius += (this.targetRadius - this.radius) * 0.05;
        this.alpha += (this.targetAlpha - this.alpha) * 0.05;

        // Color transition
        this.color = this.targetColor;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}

function initSystemsCanvas() {
    systemsCanvas.width = window.innerWidth;
    systemsCanvas.height = window.innerHeight;

    // Create initial grid of circles
    circles = [];
    const rows = 6;
    const cols = 10;
    const spacing = Math.min(systemsCanvas.width / (cols + 1), 80);
    const startX = (systemsCanvas.width - (cols - 1) * spacing) / 2;
    const startY = (systemsCanvas.height - (rows - 1) * spacing) / 2;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = startX + j * spacing;
            const y = startY + i * spacing;
            circles.push(new Circle(x, y, 15));
        }
    }
}

function animateSystems() {
    systemsCtx.clearRect(0, 0, systemsCanvas.width, systemsCanvas.height);

    circles.forEach(circle => {
        circle.update();
        circle.draw(systemsCtx);
    });

    requestAnimationFrame(animateSystems);
}

// System visualization functions
function resetCircles() {
    const rows = 6;
    const cols = 10;
    const spacing = Math.min(systemsCanvas.width / (cols + 1), 80);
    const startX = (systemsCanvas.width - (cols - 1) * spacing) / 2;
    const startY = (systemsCanvas.height - (rows - 1) * spacing) / 2;

    circles.forEach((circle, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        circle.targetX = startX + col * spacing;
        circle.targetY = startY + row * spacing;
        circle.targetRadius = 15;
        circle.targetColor = '#95a5a6';
        circle.targetAlpha = 1;
    });
}

function showLottery() {
    resetCircles();

    setTimeout(() => {
        // Randomly select some circles to turn blue
        const selected = new Set();
        while (selected.size < 8) {
            selected.add(Math.floor(Math.random() * circles.length));
        }

        circles.forEach((circle, index) => {
            if (selected.has(index)) {
                circle.targetColor = '#3b5998';
            }
        });
    }, 500);
}

function showElection() {
    resetCircles();

    setTimeout(() => {
        // Select 3 candidates
        const candidates = [10, 25, 45];

        candidates.forEach(index => {
            circles[index].targetColor = '#e74c3c';
            circles[index].targetRadius = 20;
        });

        // After a delay, supporters merge into candidates
        setTimeout(() => {
            circles.forEach((circle, index) => {
                if (!candidates.includes(index)) {
                    const nearestCandidate = candidates.reduce((nearest, candIdx) => {
                        const distToNearest = Math.abs(circles[nearest].x - circle.x) + Math.abs(circles[nearest].y - circle.y);
                        const distToCand = Math.abs(circles[candIdx].x - circle.x) + Math.abs(circles[candIdx].y - circle.y);
                        return distToCand < distToNearest ? candIdx : nearest;
                    }, candidates[0]);

                    circle.targetX = circles[nearestCandidate].x + (Math.random() - 0.5) * 40;
                    circle.targetY = circles[nearestCandidate].y + (Math.random() - 0.5) * 40;
                    circle.targetRadius = 8;
                    circle.targetAlpha = 0.6;
                }
            });

            // Grow the most popular candidate
            setTimeout(() => {
                circles[25].targetRadius = 35;
                circles[25].targetColor = '#3b5998';
            }, 1000);
        }, 800);
    }, 500);
}

function showHereditary() {
    circles.forEach(circle => {
        circle.targetAlpha = 0.2;
        circle.targetRadius = 10;
    });

    // Show family tree
    setTimeout(() => {
        const generations = [
            [{ x: 0.5, y: 0.2 }],
            [{ x: 0.3, y: 0.4 }, { x: 0.7, y: 0.4 }],
            [{ x: 0.2, y: 0.6 }, { x: 0.4, y: 0.6 }, { x: 0.6, y: 0.6 }, { x: 0.8, y: 0.6 }],
            [{ x: 0.15, y: 0.8 }, { x: 0.25, y: 0.8 }, { x: 0.35, y: 0.8 }, { x: 0.45, y: 0.8 },
             { x: 0.55, y: 0.8 }, { x: 0.65, y: 0.8 }, { x: 0.75, y: 0.8 }, { x: 0.85, y: 0.8 }]
        ];

        let circleIndex = 0;
        generations.forEach(generation => {
            generation.forEach(pos => {
                if (circleIndex < circles.length) {
                    circles[circleIndex].targetX = pos.x * systemsCanvas.width;
                    circles[circleIndex].targetY = pos.y * systemsCanvas.height;
                    circles[circleIndex].targetRadius = 18;
                    circles[circleIndex].targetColor = '#3b5998';
                    circles[circleIndex].targetAlpha = 1;
                    circleIndex++;
                }
            });
        });
    }, 500);
}

function showRecommendation() {
    resetCircles();

    setTimeout(() => {
        // Top circles (recommenders) turn blue
        const recommenders = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        recommenders.forEach(index => {
            circles[index].targetColor = '#3b5998';
            circles[index].targetY = systemsCanvas.height * 0.2;
        });

        // Select some from bottom
        setTimeout(() => {
            const selected = [42, 35, 47, 38, 51, 44];
            selected.forEach(index => {
                circles[index].targetColor = '#27ae60';
                circles[index].targetY = systemsCanvas.height * 0.5;
            });
        }, 1000);
    }, 500);
}

function showPurchase() {
    resetCircles();

    setTimeout(() => {
        // Draw a threshold line (visually represented by positioning)
        const threshold = systemsCanvas.height * 0.5;

        circles.forEach((circle, index) => {
            if (circle.y < threshold) {
                // Those who "cross" turn yellow (paid)
                setTimeout(() => {
                    circle.targetColor = '#f4c542';
                }, index * 20);
            }
        });
    }, 500);
}

function showTransition() {
    circles.forEach((circle, index) => {
        circle.targetX = systemsCanvas.width / 2 + (Math.random() - 0.5) * 200;
        circle.targetY = systemsCanvas.height / 2 + (Math.random() - 0.5) * 200;
        circle.targetRadius = 12;
        circle.targetColor = '#95a5a6';
        circle.targetAlpha = 0.5;
    });
}

// ==========================================
// Scrollama Setup for Section 2
// ==========================================

const scroller = scrollama();

function handleStepEnter(response) {
    const system = response.element.dataset.system;

    switch(system) {
        case 'intro':
            resetCircles();
            break;
        case 'lottery':
            showLottery();
            break;
        case 'election':
            showElection();
            break;
        case 'hereditary':
            showHereditary();
            break;
        case 'recommendation':
            showRecommendation();
            break;
        case 'purchase':
            showPurchase();
            break;
        case 'transition':
            showTransition();
            break;
    }
}

function initScrollama() {
    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            debug: false
        })
        .onStepEnter(handleStepEnter);

    // Resize handler
    window.addEventListener('resize', scroller.resize);
}

// ==========================================
// Intersection Observer for Fade-in Effects
// ==========================================

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe detail cards
    document.querySelectorAll('.detail-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(item);
    });
}

// ==========================================
// Initialize Everything
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    // Section 1: People Canvas
    initPeopleCanvas();
    animatePeople();

    // Section 2: Systems Canvas
    initSystemsCanvas();
    animateSystems();
    initScrollama();

    // Intersection Observer for animations
    initIntersectionObserver();

    // Resize handler
    window.addEventListener('resize', () => {
        // Resize people canvas
        peopleCanvas.width = window.innerWidth;
        peopleCanvas.height = window.innerHeight;

        // Resize systems canvas
        systemsCanvas.width = window.innerWidth;
        systemsCanvas.height = window.innerHeight;

        // Reinitialize if needed
        if (window.innerWidth !== peopleCanvas.width) {
            initPeopleCanvas();
            initSystemsCanvas();
        }
    });
});

// Smooth scrolling for better experience
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
