/**
 * Sacred Particle Atmosphere & Akshantalu Physics Engine
 * Dedicated Strictly to Sacred Akshantalu (Turmeric Rice Grains) on Interactive Blessing
 * Flower flakes / petals completely removed for clean 2026 luxury aesthetic
 * Crafted for Varun & Alekhya's Kalyana Mandapam
 */

class SacredParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.akshantaluBurst = [];
        this.width = 0;
        this.height = 0;
        this.isRunning = true;
        // Zero ambient flower flakes
        this.maxAmbientParticles = 0;
        this.currentTheme = 'theme-morning-sandalwood';

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    setTheme(themeName) {
        this.currentTheme = themeName;
    }

    /**
     * Trigger high-energy shower of Sacred Akshantalu (Pure Turmeric Rice Grains)
     * No flower flakes or petals
     */
    showerBlessings(originX = null, originY = null) {
        const count = 180;
        const startX = originX || this.width / 2;
        const startY = originY || 100;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 2.5;

            // 100% Sacred Golden Turmeric Rice Grains (Akshantalu)
            this.akshantaluBurst.push({
                x: startX + (Math.random() - 0.5) * 50,
                y: startY + (Math.random() - 0.5) * 30,
                vx: Math.cos(angle) * speed * 0.75,
                vy: Math.sin(angle) * speed - (Math.random() * 5 + 3),
                gravity: 0.22,
                drag: 0.98,
                length: Math.random() * 6 + 4,
                width: Math.random() * 2.2 + 1.2,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.16,
                // Auspicious turmeric gold hues
                color: Math.random() > 0.4 ? '#F7C815' : (Math.random() > 0.2 ? '#EAA221' : '#FCE280'),
                opacity: 1,
                life: 1.0,
                decay: Math.random() * 0.006 + 0.004
            });
        }
    }

    update() {
        // Update Akshantalu burst physics (100% sacred rice)
        for (let i = this.akshantaluBurst.length - 1; i >= 0; i--) {
            const p = this.akshantaluBurst[i];
            p.vx *= p.drag;
            p.vy = (p.vy + p.gravity) * p.drag;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            p.life -= p.decay;
            p.opacity = Math.max(0, p.life);

            if (p.life <= 0 || p.y > this.height + 50) {
                this.akshantaluBurst.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Sacred Akshantalu shower grains
        for (const p of this.akshantaluBurst) {
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.globalAlpha = p.opacity;

            // Realistic Rice Grain Shape
            this.ctx.fillStyle = p.color;
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 4;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, p.length, p.width, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Specular Golden Light Shine
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
            this.ctx.beginPath();
            this.ctx.ellipse(-p.length * 0.2, -p.width * 0.2, p.length * 0.4, p.width * 0.3, 0, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

window.SacredParticleEngine = SacredParticleEngine;
