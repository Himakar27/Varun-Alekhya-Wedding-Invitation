/**
 * 2026 Realistic Winter Nature & Atmospheric Living Engine
 * Features:
 * - Authentic Winter Nature with volumetric rolling fog and natural mountain mist
 * - Hyper-realistic, organic winter snowfall with multi-plane depth (cinematic foreground bokeh, midground flutter, background snow dust)
 * - Deep velvet midnight dark theme for night occasions (Sangeet, Reception, Brahma Muhurtham Pelli)
 * - Rich astronomical night sky with twinkling multi-hued stars & diffraction cross-shimmer
 * - Hyper-realistic falling stars / shooting stars (meteors) with tapering luminous tails and glowing heads
 * - Decreased, naturalistic scale for celestial sun and 3D luminous moon
 * - Pure natural physics: gentle wind drift, aerodynamic air-resistance sway, soft feathered opacities (zero AI/clipart stars or robotic dots)
 * - Smooth dynamic transitions between daylight winter sun, sunset dusk, and moonlit starlit night
 */

class NextGenAtmosphereEngine {
    constructor() {
        this.canvas = document.getElementById('atmosphere-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        
        this.currentMood = 'morning-sun';
        this.targetMood = 'morning-sun';

        this.width = 0;
        this.height = 0;
        this.time = 0;

        // Dynamic atmospheric lighting tint overlays (applied over the winter nature photo)
        this.palettes = {
            'venue': { // Raaga Convention Twilight & Sunset Ambient
                top: [35, 20, 55, 0.38],
                mid: [75, 45, 95, 0.28],
                bottom: [251, 146, 60, 0.22],
                ambient: [245, 158, 11, 0.18]
            },

            'sunrise': { // 7:00 AM Kalagorulu (Light Dawn)
                top: [255, 230, 240, 0.28],
                mid: [254, 215, 170, 0.22],
                bottom: [254, 249, 238, 0.35],
                ambient: [251, 146, 60, 0.18]
            },
            'morning-sun': { // 9:00 AM, 10:00 AM Pellikoduku, Varatham (Light Theme)
                top: [255, 252, 245, 0.18],
                mid: [254, 243, 199, 0.15],
                bottom: [253, 248, 238, 0.28],
                ambient: [245, 158, 11, 0.14]
            },
            'haldi': { // 9:30 AM Haldi Ceremony (Auspicious Haldi Turmeric Gold)
                top: [255, 248, 220, 0.22],
                mid: [254, 240, 138, 0.26],
                bottom: [251, 191, 36, 0.30],
                ambient: [245, 158, 11, 0.22]
            },
            'mehandi': { // 4:00 PM Mehandi Night (Festive Emerald & Golden Twilight)
                top: [254, 205, 216, 0.24],
                mid: [251, 146, 60, 0.18],
                bottom: [20, 83, 45, 0.26],
                ambient: [16, 185, 129, 0.18]
            },
            'vratham': { // 10:00 AM Sri Satyanarayana Swamy Vratham (Sacred Puja Sandalwood & Divine Gold)
                top: [255, 250, 235, 0.22],
                mid: [254, 243, 199, 0.24],
                bottom: [251, 191, 36, 0.28],
                ambient: [245, 158, 11, 0.18]
            },
            'afternoon-sun': { // 11:15 AM Pellikuturu (Light Theme)
                top: [224, 242, 254, 0.20],
                mid: [254, 249, 195, 0.12],
                bottom: [248, 250, 252, 0.25],
                ambient: [255, 255, 255, 0.18]
            },
            'sunset': { // 5:00 PM Mehandi (Warm Sunset Light Theme)
                top: [254, 205, 216, 0.35],
                mid: [251, 146, 60, 0.30],
                bottom: [255, 237, 213, 0.40],
                ambient: [244, 63, 94, 0.25]
            },
            'sangeet': { // 7:00 PM Sangeet Gala Night (Royal Indigo, Violet & Golden Shimmer)
                top: [15, 10, 35, 0.92],
                mid: [45, 15, 65, 0.88],
                bottom: [10, 6, 24, 0.95],
                ambient: [192, 132, 252, 0.26]
            },
            'dark-night': { // 7:00 PM Reception (DEEP MIDNIGHT STARRY NIGHT & FALLING STARS)
                top: [6, 10, 26, 0.90],
                mid: [12, 16, 42, 0.92],
                bottom: [5, 4, 14, 0.96],
                ambient: [147, 197, 253, 0.22]
            },
            'early-dawn': { // 3:53 AM Brahma Muhurtham Pelli (DEEP NIGHT WITH SACRED INDIGO & AGNI GLOW)
                top: [18, 8, 34, 0.88],
                mid: [30, 10, 44, 0.90],
                bottom: [8, 4, 16, 0.95],
                ambient: [251, 146, 60, 0.24]
            }
        };

        this.currentColors = JSON.parse(JSON.stringify(this.palettes['morning-sun']));
        
        this.stars = [];
        this.snowflakes = [];
        this.fogBanks = [];
        this.meteors = [];
        this.meteorTimer = 55;
        this.nightAlpha = 0;

        if (this.canvas) {
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.initNatureScene();
            this.animate();
        }
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.initNatureScene();
    }

    initNatureScene() {
        // 1. Organic Rolling Fog Banks across mountains & valley
        this.fogBanks = [];
        const fogCount = 9;
        for (let i = 0; i < fogCount; i++) {
            this.fogBanks.push({
                x: Math.random() * this.width,
                y: (Math.random() * 0.65 + 0.15) * this.height,
                radiusX: Math.random() * 220 + 160,
                radiusY: Math.random() * 90 + 55,
                speed: (Math.random() * 0.12 + 0.04) * (i % 2 === 0 ? 1 : 1.15),
                baseOpacity: Math.random() * 0.14 + 0.08,
                phase: Math.random() * Math.PI * 2
            });
        }

        // 2. Realistic Multi-Plane Natural Winter Snowfall (Organic, non-AI)
        this.snowflakes = [];
        // Categorized into 3 natural depth planes:
        // A. Foreground Cinematic Bokeh (very few, large, soft, slightly out of focus)
        for (let i = 0; i < 5; i++) {
            this.snowflakes.push(this.createSnowflake('foreground', true));
        }
        // B. Midground Natural Flakes (gentle drift, authentic fluttering)
        const midCount = Math.min(65, Math.floor(this.width / 18));
        for (let i = 0; i < midCount; i++) {
            this.snowflakes.push(this.createSnowflake('midground', true));
        }
        // C. Background Snow Dust (faint, suspended in the misty mountain air)
        const bgCount = Math.min(50, Math.floor(this.width / 24));
        for (let i = 0; i < bgCount; i++) {
            this.snowflakes.push(this.createSnowflake('background', true));
        }

        // 3. Auspicious Falling Haldi Grains & Petals (Active during Haldi Ceremony)
        this.haldiParticles = [];
        const haldiCount = Math.min(105, Math.floor(this.width / 14));
        for (let i = 0; i < haldiCount; i++) {
            this.haldiParticles.push(this.createHaldiParticle(true));
        }

        // 4. Rich Celestial Night Sky Stars (Visible during night occasions)
        this.stars = [];
        const starCount = Math.min(750, Math.max(480, Math.floor((this.width * this.height) / 1400)));
        const celestialColors = [
            [255, 255, 255], // Diamond White (Sirius/Polaris)
            [255, 255, 255], // Pure White (Dominant celestial)
            [195, 230, 255], // Cool Starlight Blue (Rigel/Spica)
            [255, 248, 200], // Warm Starlight Gold (Capella/Arcturus)
            [230, 235, 255]  // Silvery Lavender (Vega)
        ];

        for (let i = 0; i < starCount; i++) {
            // Natural sky distribution: spans the heavens down towards mountain horizon
            const yDist = Math.pow(Math.random(), 1.18) * (this.height * 0.82);
            const tierRoll = Math.random();
            let radius, baseAlpha, isMilestone, hasHalo;

            if (tierRoll < 0.62) {
                // Tier 1: Faint Micro-Stardust (Deep cosmic field)
                radius = Math.random() * 0.45 + 0.35; // 0.35px to 0.80px pinpoint
                baseAlpha = Math.random() * 0.35 + 0.35; // 0.35 to 0.70
                isMilestone = false;
                hasHalo = false;
            } else if (tierRoll < 0.88) {
                // Tier 2: Midground Field Stars
                radius = Math.random() * 0.55 + 0.85; // 0.85px to 1.40px
                baseAlpha = Math.random() * 0.35 + 0.55; // 0.55 to 0.90
                isMilestone = false;
                hasHalo = false;
            } else {
                // Tier 3: Bright Navigational Milestone Stars (Sirius, Vega, Rigel, Capella)
                radius = Math.random() * 0.85 + 1.45; // 1.45px to 2.30px
                baseAlpha = Math.random() * 0.25 + 0.75; // 0.75 to 1.0
                isMilestone = true;
                hasHalo = true;
            }

            const color = celestialColors[Math.floor(Math.random() * celestialColors.length)];

            this.stars.push({
                x: Math.random() * this.width,
                y: yDist,
                radius: radius,
                baseAlpha: baseAlpha,
                speed1: Math.random() * 0.045 + 0.015,
                speed2: Math.random() * 0.035 + 0.012,
                phase1: Math.random() * Math.PI * 2,
                phase2: Math.random() * Math.PI * 2,
                isRapid: Math.random() < 0.22, // 22% rapid scintillation
                color: color,
                isBright: isMilestone,
                hasHalo: hasHalo
            });
        }
    }

    createSnowflake(plane = 'midground', randomY = false) {
        if (plane === 'foreground') {
            // Large, soft, cinematic foreground bokeh flake
            return {
                plane: 'foreground',
                x: Math.random() * this.width,
                y: randomY ? Math.random() * this.height : -30,
                radius: Math.random() * 6.0 + 5.0, // 5px to 11px
                speedY: Math.random() * 1.2 + 0.8,
                speedX: Math.random() * 0.4 - 0.2,
                swaySpeed: Math.random() * 0.015 + 0.008,
                swayOffset: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.18 + 0.08, // Soft bokeh alpha
                blur: 4.5
            };
        } else if (plane === 'background') {
            // Fine distant winter snow dust
            return {
                plane: 'background',
                x: Math.random() * this.width,
                y: randomY ? Math.random() * this.height : -10,
                radius: Math.random() * 0.8 + 0.4, // 0.4px to 1.2px
                speedY: Math.random() * 0.5 + 0.3,
                speedX: Math.random() * 0.3 - 0.15,
                swaySpeed: Math.random() * 0.01 + 0.005,
                swayOffset: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.30 + 0.15,
                blur: 0
            };
        } else {
            // Authentic midground snowflake (natural drift and sway)
            return {
                plane: 'midground',
                x: Math.random() * this.width,
                y: randomY ? Math.random() * this.height : -15,
                radius: Math.random() * 1.4 + 1.2, // 1.2px to 2.6px
                speedY: Math.random() * 0.85 + 0.55,
                speedX: Math.random() * 0.35 - 0.18,
                swaySpeed: Math.random() * 0.022 + 0.012,
                swayOffset: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.50 + 0.25,
                blur: 1.0
            };
        }
    }

    createHaldiParticle(randomY = false) {
        const typeRoll = Math.random();
        const colors = [
            '#FBBF24', // Marigold amber gold
            '#F59E0B', // Rich turmeric gold
            '#FDE047', // Radiant sunlit turmeric
            '#FEF08A', // Pale auspicious yellow
            '#D97706', // Sacred deep kumkum-turmeric
            '#EAB308'  // Golden yellow
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        if (typeRoll < 0.15) {
            // Foreground Golden Haldi Bokeh
            return {
                type: 'bokeh',
                x: Math.random() * this.width,
                y: randomY ? Math.random() * this.height : -30,
                radius: Math.random() * 7.0 + 4.5,
                speedY: Math.random() * 1.1 + 0.7,
                speedX: Math.random() * 0.4 - 0.2,
                swaySpeed: Math.random() * 0.015 + 0.008,
                swayOffset: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.22 + 0.10,
                color: color,
                rotation: 0,
                rotSpeed: 0
            };
        } else if (typeRoll < 0.65) {
            // Fluttering Haldi Petal / Turmeric Flake
            return {
                type: 'petal',
                x: Math.random() * this.width,
                y: randomY ? Math.random() * this.height : -20,
                width: Math.random() * 5 + 3.5,
                height: Math.random() * 8 + 5.5,
                speedY: Math.random() * 1.3 + 0.8,
                speedX: Math.random() * 0.5 - 0.25,
                swaySpeed: Math.random() * 0.025 + 0.015,
                swayOffset: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.45 + 0.35,
                color: color,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.04
            };
        } else {
            // Radiant Golden Haldi Micro-Grain
            return {
                type: 'grain',
                x: Math.random() * this.width,
                y: randomY ? Math.random() * this.height : -10,
                radius: Math.random() * 1.8 + 1.0,
                speedY: Math.random() * 0.9 + 0.5,
                speedX: Math.random() * 0.3 - 0.15,
                swaySpeed: Math.random() * 0.02 + 0.01,
                swayOffset: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.65 + 0.35,
                color: color,
                rotation: 0,
                rotSpeed: 0
            };
        }
    }

    // Hyper-Realistic Falling Stars / Shooting Stars (Meteors)
    spawnMeteor() {
        const startX = Math.random() * (this.width * 0.90) - 40;
        const startY = Math.random() * (this.height * 0.35) - 20;
        const angle = Math.PI * (0.18 + Math.random() * 0.08); // 32° to 47° diagonal downward sweep
        const speed = Math.random() * 10 + 18; // 18 to 28 px/frame (authentic hypersonic velocity)
        const length = Math.random() * 95 + 115; // 115px to 210px luminous needle-tail
        const thickness = Math.random() * 0.8 + 1.2; // 1.2px to 2.0px needle-thin
        const decay = Math.random() * 0.016 + 0.016; // Lifespan ~35 to 60 frames
        
        const colors = [
            [255, 255, 255], // Pure white-hot core
            [205, 235, 255], // High-altitude sapphire ionization
            [255, 245, 185]  // Golden incandescent trail
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        this.meteors.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            angle: angle,
            length: length,
            thickness: thickness,
            alpha: 1.0,
            decay: decay,
            color: color
        });

        // Delicate Crystalline Falling Star Sparkle Audio Effect
        if (window.modernSoundEngine && typeof window.modernSoundEngine.playFallingStarSparkle === 'function') {
            window.modernSoundEngine.playFallingStarSparkle();
        }
    }

    setClimate(mood) {
        if (!this.palettes[mood]) return;
        this.targetMood = mood;
        this.currentMood = mood;

        const body = document.body;
        body.setAttribute('data-current-climate', mood);

        // Explicit Theme Setting: LIGHT THEME by default, only NIGHT OCCASIONS get DARK THEME
        const isNightOccasion = (mood === 'dark-night' || mood === 'early-dawn' || mood === 'sangeet');
        body.setAttribute('data-theme-mode', isNightOccasion ? 'dark' : 'light');

        if (!isNightOccasion) {
            this.meteors = [];
        }

        // Update celestial elements in DOM
        const celestialSun = document.getElementById('celestial-sun');
        const celestialMoon = document.getElementById('celestial-moon');
        const celestialDusk = document.getElementById('celestial-dusk');

        const isSun = (mood === 'sunrise' || mood === 'morning-sun' || mood === 'afternoon-sun' || mood === 'sunset' || mood === 'haldi' || mood === 'mehandi');
        const isMoon = (mood === 'dark-night' || mood === 'early-dawn' || mood === 'sangeet');
        const isDusk = (mood === 'sunset' || mood === 'mehandi');

        if (celestialSun) {
            celestialSun.classList.toggle('celestial-active', isSun);
            if (mood === 'sunrise') {
                // 7:00 AM Sunrise (Kalagorulu): Rising low near horizon, softly dimmed warm amber dawn through mist
                celestialSun.style.top = '7%';
                celestialSun.style.filter = 'brightness(0.90) saturate(1.18) hue-rotate(338deg)';
                celestialSun.style.boxShadow = '0 0 50px rgba(251, 146, 60, 0.75), 0 0 100px rgba(245, 158, 11, 0.50), 0 0 170px rgba(254, 215, 170, 0.35)';
            } else if (mood === 'afternoon-sun') {
                // 11:15 AM Afternoon Sun (Pellikuturu): Peak daylight zenith, maximum brilliant golden-white daylight
                celestialSun.style.top = '0%';
                celestialSun.style.filter = 'brightness(1.20) saturate(0.98) contrast(1.08)';
                celestialSun.style.boxShadow = '0 0 85px rgba(254, 240, 138, 0.98), 0 0 170px rgba(245, 158, 11, 0.85), 0 0 270px rgba(251, 191, 36, 0.55)';
            } else if (mood === 'sunset') {
                // 5:00 PM Sunset: Sinking low near horizon, softly dimmed deep crimson-amber sunset
                celestialSun.style.top = '9%';
                celestialSun.style.filter = 'brightness(0.82) saturate(1.38) hue-rotate(320deg) contrast(1.15)';
                celestialSun.style.boxShadow = '0 0 60px rgba(225, 29, 72, 0.85), 0 0 125px rgba(234, 88, 12, 0.70), 0 0 200px rgba(245, 158, 11, 0.45)';
            } else if (mood === 'mehandi') {
                // 4:00 PM Mehandi Night: Festive twilight with warm golden-emerald radiance
                celestialSun.style.top = '8%';
                celestialSun.style.filter = 'brightness(0.92) saturate(1.25) contrast(1.10)';
                celestialSun.style.boxShadow = '0 0 65px rgba(251, 191, 36, 0.85), 0 0 130px rgba(16, 185, 129, 0.45), 0 0 210px rgba(245, 158, 11, 0.35)';
            } else if (mood === 'haldi') {
                // 9:30 AM Haldi: Radiant auspicious golden sun with warm marigold turmeric glow
                celestialSun.style.top = '2%';
                celestialSun.style.filter = 'brightness(1.18) saturate(1.28) contrast(1.05)';
                celestialSun.style.boxShadow = '0 0 75px rgba(245, 158, 11, 0.95), 0 0 150px rgba(251, 191, 36, 0.75), 0 0 240px rgba(254, 240, 138, 0.55)';
            } else if (mood === 'vratham') {
                // 10:00 AM Vratham: Divine golden sacred morning radiance with sandalwood glow
                celestialSun.style.top = '2%';
                celestialSun.style.filter = 'brightness(1.15) saturate(1.20) contrast(1.04)';
                celestialSun.style.boxShadow = '0 0 70px rgba(245, 158, 11, 0.90), 0 0 145px rgba(251, 191, 36, 0.70), 0 0 235px rgba(254, 240, 138, 0.50)';
            } else {
                // 9:00 AM / 9:30 AM Morning Sun (Hero, Pellikoduku): Fresh crisp morning golden radiance
                celestialSun.style.top = '3%';
                celestialSun.style.filter = 'brightness(1.05) saturate(1.04) contrast(1.02)';
                celestialSun.style.boxShadow = '0 0 65px rgba(245, 158, 11, 0.90), 0 0 135px rgba(234, 88, 12, 0.65), 0 0 225px rgba(251, 191, 36, 0.40)';
            }
        }

        if (celestialMoon) {
            celestialMoon.classList.toggle('celestial-active', isMoon);
            if (mood === 'early-dawn') {
                // 3:53 AM Brahma Muhurtham (Subha Muhurtham & Pelli): Sacred pre-dawn, moon waning lower on horizon, slightly dimmed soft mystical indigo glow
                celestialMoon.style.top = '6%';
                celestialMoon.style.filter = 'brightness(0.92) contrast(1.03) hue-rotate(15deg)';
                celestialMoon.style.boxShadow = '0 0 45px rgba(203, 213, 225, 0.85), 0 0 100px rgba(148, 163, 184, 0.52), 0 0 175px rgba(167, 139, 250, 0.32)';
            } else if (mood === 'sangeet') {
                // 7:00 PM Sangeet Gala Night: Starry midnight with luminous violet-gold shimmer
                celestialMoon.style.top = '3%';
                celestialMoon.style.filter = 'brightness(1.14) contrast(1.10) hue-rotate(280deg)';
                celestialMoon.style.boxShadow = '0 0 65px rgba(216, 180, 254, 0.90), 0 0 135px rgba(168, 85, 247, 0.60), 0 0 230px rgba(244, 114, 182, 0.35)';
            } else {
                // 7:00 PM Dark Night (Reception): Full midnight, high in sky, peak bright silver moonlight
                celestialMoon.style.top = '2%';
                celestialMoon.style.filter = 'brightness(1.16) contrast(1.08)';
                celestialMoon.style.boxShadow = '0 0 65px rgba(226, 232, 240, 0.96), 0 0 135px rgba(148, 163, 184, 0.68), 0 0 230px rgba(96, 165, 250, 0.42)';
            }
        }
        if (celestialDusk) celestialDusk.classList.toggle('celestial-active', isDusk);

        if (window.modernSoundEngine) {
            window.modernSoundEngine.setMood((mood.includes('night') || mood === 'sangeet') ? 'night' : (mood.includes('dawn') ? 'dawn' : (mood.includes('sunset') ? 'evening' : 'morning')));
        }
    }

    lerpColor(current, target, factor = 0.08) {
        return current.map((c, i) => c + (target[i] - c) * factor);
    }

    updateColors() {
        const target = this.palettes[this.targetMood] || this.palettes['morning-sun'];
        this.currentColors.top = this.lerpColor(this.currentColors.top, target.top);
        this.currentColors.mid = this.lerpColor(this.currentColors.mid, target.mid);
        this.currentColors.bottom = this.lerpColor(this.currentColors.bottom, target.bottom);
        this.currentColors.ambient = this.lerpColor(this.currentColors.ambient, target.ambient);
    }

    draw() {
        this.updateColors();
        this.time += 0.008;

        this.ctx.clearRect(0, 0, this.width, this.height);
        // Pure photograph presentation on venue; eliminate all canvas fog banks, ambient light circles and snow
        if (this.currentMood === 'venue') {
            return;
        }
        // Pure photograph presentation on desktop for sunset family scene; eliminate all canvas overlays, lighting washes and snow
        if (this.currentMood === 'sunset' && window.innerWidth > 860) {
            return;
        }

        const c = this.currentColors;
        const topRgba = `rgba(${Math.round(c.top[0])}, ${Math.round(c.top[1])}, ${Math.round(c.top[2])}, ${c.top[3].toFixed(2)})`;
        const midRgba = `rgba(${Math.round(c.mid[0])}, ${Math.round(c.mid[1])}, ${Math.round(c.mid[2])}, ${c.mid[3].toFixed(2)})`;
        const botRgba = `rgba(${Math.round(c.bottom[0])}, ${Math.round(c.bottom[1])}, ${Math.round(c.bottom[2])}, ${c.bottom[3].toFixed(2)})`;

        // 1. Atmospheric Sky Wash Gradient (Translucent wash over winter photo)
        const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        skyGrad.addColorStop(0, topRgba);
        skyGrad.addColorStop(0.55, midRgba);
        skyGrad.addColorStop(1, botRgba);

        this.ctx.fillStyle = skyGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 2. Soft Ambient Horizon Light Glow
        const amb = c.ambient;
        const ambX = this.width * 0.5 + Math.sin(this.time * 0.6) * (this.width * 0.15);
        const ambY = this.height * 0.35;
        const ambGrad = this.ctx.createRadialGradient(ambX, ambY, 20, ambX, ambY, this.width * 0.65);
        ambGrad.addColorStop(0, `rgba(${Math.round(amb[0])}, ${Math.round(amb[1])}, ${Math.round(amb[2])}, ${amb[3].toFixed(2)})`);
        ambGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = ambGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Smooth transition for night sky celestial objects (stars & meteors)
        const isNight = (this.currentMood === 'dark-night' || this.currentMood === 'early-dawn');
        this.nightAlpha += ((isNight ? 1 : 0) - this.nightAlpha) * 0.08;

        // 3. Dense Realistic Night Sky Stars & Atmospheric Scintillation (Full of Organic Blinking Stars)
        if (this.nightAlpha > 0.01) {
            for (const s of this.stars) {
                // Multi-harmonic compound wave for realistic atmospheric scintillation
                const w1 = Math.sin(this.time * 28 * s.speed1 + s.phase1);
                const w2 = Math.sin(this.time * 18 * s.speed2 + s.phase2);
                let blinkWave = w1 * 0.65 + w2 * 0.35;

                if (s.isRapid) {
                    const rapid = Math.sin(this.time * 62 * s.speed1 + s.phase2);
                    blinkWave = blinkWave * 0.58 + rapid * 0.42;
                }

                // Natural twinkle factor with organic intensity modulation
                const twinkleFactor = 0.22 + 0.78 * Math.max(0, (blinkWave + 1) * 0.5);
                const alpha = s.baseAlpha * twinkleFactor * this.nightAlpha;
                if (alpha <= 0.02) continue;

                this.ctx.save();
                this.ctx.globalAlpha = alpha;

                // Soft celestial halo aura for bright milestone stars
                if (s.hasHalo && twinkleFactor > 0.72) {
                    this.ctx.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${(alpha * 0.28).toFixed(3)})`;
                    this.ctx.beginPath();
                    this.ctx.arc(s.x, s.y, s.radius * 2.8, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                // Star core
                this.ctx.fillStyle = `rgb(${s.color[0]}, ${s.color[1]}, ${s.color[2]})`;
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                this.ctx.fill();

                // Subtle 4-point cross diffraction spikes for bright milestone stars at peak twinkle
                if (s.isBright && blinkWave > 0.65) {
                    const spikeLen = s.radius * (3.0 + blinkWave * 1.6);
                    this.ctx.strokeStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${(alpha * 0.75).toFixed(3)})`;
                    this.ctx.lineWidth = 0.7;
                    this.ctx.beginPath();
                    this.ctx.moveTo(s.x - spikeLen, s.y);
                    this.ctx.lineTo(s.x + spikeLen, s.y);
                    this.ctx.moveTo(s.x, s.y - spikeLen);
                    this.ctx.lineTo(s.x, s.y + spikeLen);
                    this.ctx.stroke();
                }

                this.ctx.restore();
            }

            // 3b. Hyper-Realistic Falling Stars / Shooting Stars (Meteors)
            if (isNight) {
                this.meteorTimer--;
                if (this.meteorTimer <= 0) {
                    this.spawnMeteor();
                    // 25% chance for twin shooting stars (meteor shower effect)
                    if (Math.random() < 0.25) {
                        setTimeout(() => this.spawnMeteor(), 190);
                    }
                    this.meteorTimer = Math.floor(Math.random() * 80 + 65); // Spawns every ~1.1 to 2.4 seconds
                }
            }

            // Update and render shooting stars
            for (let i = this.meteors.length - 1; i >= 0; i--) {
                const m = this.meteors[i];
                m.x += m.vx;
                m.y += m.vy;
                m.alpha -= m.decay;

                if (m.alpha <= 0.01 || m.x > this.width + 120 || m.y > this.height + 60) {
                    this.meteors.splice(i, 1);
                    continue;
                }

                const effectiveAlpha = m.alpha * this.nightAlpha;
                const tailX = m.x - Math.cos(m.angle) * m.length;
                const tailY = m.y - Math.sin(m.angle) * m.length;

                this.ctx.save();
                // Linear gradient from transparent needle tail to incandescent brilliant head
                const streakGrad = this.ctx.createLinearGradient(tailX, tailY, m.x, m.y);
                streakGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                streakGrad.addColorStop(0.55, `rgba(${m.color[0]}, ${m.color[1]}, ${m.color[2]}, ${(effectiveAlpha * 0.40).toFixed(3)})`);
                streakGrad.addColorStop(0.85, `rgba(${m.color[0]}, ${m.color[1]}, ${m.color[2]}, ${(effectiveAlpha * 0.75).toFixed(3)})`);
                streakGrad.addColorStop(1, `rgba(255, 255, 255, ${effectiveAlpha.toFixed(3)})`);

                this.ctx.strokeStyle = streakGrad;
                this.ctx.lineWidth = m.thickness;
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(tailX, tailY);
                this.ctx.lineTo(m.x, m.y);
                this.ctx.stroke();

                // Brilliant incandescent head spark
                this.ctx.fillStyle = `rgba(255, 255, 255, ${effectiveAlpha.toFixed(3)})`;
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(m.x, m.y, m.thickness * 1.05, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.restore();
            }
        }

        // 4. Volumetric Organic Rolling Fog Banks across mountain landscape (Daylight Only; Completely disabled in Night Theme, Haldi, Mehandi, Sangeet, Vratham, Venue and Sunset Family screen)
        const daylightFogFactor = Math.max(0, 1 - this.nightAlpha);
        if (this.currentMood !== 'haldi' && this.currentMood !== 'mehandi' && this.currentMood !== 'sangeet' && this.currentMood !== 'vratham' && this.currentMood !== 'venue' && this.currentMood !== 'sunset' && daylightFogFactor > 0.02) {
            const fogColor = 'rgba(255, 255, 255, ';
            for (const fog of this.fogBanks) {
                fog.x += fog.speed;
                if (fog.x - fog.radiusX > this.width) {
                    fog.x = -fog.radiusX;
                    fog.y = (Math.random() * 0.65 + 0.15) * this.height;
                }

                const currentAlpha = fog.baseOpacity * (0.8 + Math.sin(this.time + fog.phase) * 0.2) * daylightFogFactor;
                const fogGrad = this.ctx.createRadialGradient(
                    fog.x, fog.y, fog.radiusY * 0.1,
                    fog.x, fog.y, fog.radiusX
                );
                fogGrad.addColorStop(0, `${fogColor}${currentAlpha.toFixed(3)})`);
                fogGrad.addColorStop(0.55, `${fogColor}${(currentAlpha * 0.5).toFixed(3)})`);
                fogGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                this.ctx.fillStyle = fogGrad;
                this.ctx.beginPath();
                this.ctx.ellipse(fog.x, fog.y, fog.radiusX, fog.radiusY, 0, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        // 5. Authentic Natural Winter Snowfall (Active during daylight winter climates & Sunset Family Screen; Disabled in Haldi, Mehandi, Sangeet, Vratham, Venue)
        const daylightSnowFactor = Math.max(0, 1 - this.nightAlpha);

        if (this.currentMood !== 'haldi' && this.currentMood !== 'mehandi' && this.currentMood !== 'sangeet' && this.currentMood !== 'vratham' && this.currentMood !== 'venue' && daylightSnowFactor > 0.02) {
            const wind = Math.sin(this.time * 0.4) * 0.3;

            for (const flake of this.snowflakes) {
                flake.y += flake.speedY;
                flake.x += Math.sin(flake.swayOffset + this.time * 15 * flake.swaySpeed) * 0.75 + flake.speedX + wind;

                // Seamless wrap-around
                if (flake.y > this.height + 25) {
                    flake.y = -20;
                    flake.x = Math.random() * this.width;
                }
                if (flake.x > this.width + 20) flake.x = -15;
                if (flake.x < -20) flake.x = this.width + 15;

                this.ctx.save();
                this.ctx.globalAlpha = flake.opacity * daylightSnowFactor;

                if (flake.plane === 'foreground') {
                    // Soft cinematic bokeh flake (feathered blur)
                    const bokehGrad = this.ctx.createRadialGradient(flake.x, flake.y, flake.radius * 0.1, flake.x, flake.y, flake.radius);
                    bokehGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
                    bokehGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.20)');
                    bokehGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    this.ctx.fillStyle = bokehGrad;
                    this.ctx.beginPath();
                    this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (flake.plane === 'midground') {
                    // Delicate midground flake with soft halo
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
                    this.ctx.shadowBlur = 3;
                    this.ctx.beginPath();
                    this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    // Fine background snow dust
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                    this.ctx.beginPath();
                    this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                this.ctx.restore();
            }
        }

        // 6. Auspicious Falling Haldi & Sacred Vratham Petals System (Active during Haldi & Vratham Ceremonies)
        if ((this.currentMood === 'haldi' || this.currentMood === 'vratham') && this.haldiParticles) {
            const wind = Math.sin(this.time * 0.4) * 0.35;

            for (const p of this.haldiParticles) {
                p.y += p.speedY;
                p.x += Math.sin(p.swayOffset + this.time * 15 * p.swaySpeed) * 0.85 + p.speedX + wind;
                p.rotation += p.rotSpeed;

                // Seamless wrap-around
                if (p.y > this.height + 25) {
                    p.y = -20;
                    p.x = Math.random() * this.width;
                }
                if (p.x > this.width + 20) p.x = -15;
                if (p.x < -20) p.x = this.width + 15;

                this.ctx.save();
                this.ctx.globalAlpha = p.opacity;

                if (p.type === 'bokeh') {
                    const bokehGrad = this.ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
                    bokehGrad.addColorStop(0, p.color);
                    bokehGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.25)');
                    bokehGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
                    this.ctx.fillStyle = bokehGrad;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (p.type === 'petal') {
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.rotation);
                    this.ctx.fillStyle = p.color;
                    this.ctx.shadowColor = 'rgba(245, 158, 11, 0.55)';
                    this.ctx.shadowBlur = 4;
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, 0, p.width * 0.5, p.height * 0.5, Math.PI / 4, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    this.ctx.fillStyle = p.color;
                    this.ctx.shadowColor = '#FDE047';
                    this.ctx.shadowBlur = 5;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                this.ctx.restore();
            }
        }
    }

    animate() {
        if (!this.ctx) return;
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

window.NextGenAtmosphereEngine = NextGenAtmosphereEngine;
