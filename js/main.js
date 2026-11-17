/**
 * 2026 Next-Gen Master Controller - Single Screen Application
 * Coordinates:
 * - Single-Screen Immersive Viewport & 13 Cinematic Occasion Scenes
 * - 5-Second Automated Smooth Scene Carousel with Luxury Progress Bar
 * - Dynamic Climate & Living Sky Integration (Rotating Sun, Moon, Stars, Volumetric Fog)
 * - Romantic Ambient Music Engine & Sound Crossfader
 * - Multilingual Switcher (Telugu, English, Hindi)
 * - Mobile Touch Swipe & Keyboard Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Multilingual Engine
    if (window.weddingI18n) {
        window.weddingI18n.init();
    }

    // 2. Initialize 2026 Atmosphere & Living Sky Canvas
    const atmosphere = new NextGenAtmosphereEngine();
    window.atmosphereEngine = atmosphere;

    // 3. Initialize Sacred Particle Engine (Akshantalu Physics)
    const particles = new SacredParticleEngine('sacred-canvas');
    window.particles = particles;

    // 4. Initialize Live Subha Muhurtham Countdown
    const countdown = new MuhurthamCountdown();

    // 5. Sound & Music Engine
    const sound = window.modernSoundEngine;
// 6. Graceful Ambient Sound Start on First User Interaction
    let hasUserInteracted = false;
    function handleFirstInteraction() {
        if (hasUserInteracted) return;
        hasUserInteracted = true;
        
        const portal = document.getElementById('devotional-landing-portal');
        const isPortalActive = portal && !portal.classList.contains('portal-dismissed');

        if (isPortalActive) {
            if (sound && !sound.isChakraPlaying) {
                sound.playChakraAudio();
            }
        } else {
            if (sound && !sound.isPlaying) {
                sound.startMusic(24);
            }
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
    }
    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    // ==========================================================================
    // 7. SINGLE-SCREEN APPLICATION CONTROLLER (5s AUTO-ADVANCE & SMOOTH 3D TRANSITIONS)
    // ==========================================================================
    class SingleScreenApp {
        constructor(atmosphere, sound, particles) {
            this.atmosphere = atmosphere;
            this.sound = sound;
            this.particles = particles;

            this.scenes = Array.from(document.querySelectorAll('.app-scene'));
            this.totalScenes = this.scenes.length;
            this.currentIndex = 0;
            this.isAutoPlaying = true;
            this.slideDuration = 5000; // 5 seconds
            this.timer = null;
            this.startTime = 0;
            this.remainingTime = this.slideDuration;
            this.isPaused = false;
            this.isTransitioning = false;

            // DOM Elements
            this.progressBarContainer = document.getElementById('story-progress-bar-container');
            this.bottomDockInner = document.getElementById('dock-inner-glass');
            this.autoplayBtn = document.getElementById('app-autoplay-toggle');
            this.playIcon = document.getElementById('hud-play-icon');
            this.playText = document.getElementById('hud-play-text');
            this.counterEl = document.getElementById('hud-scene-counter');
            this.prevBtn = document.getElementById('app-nav-prev');
            this.nextBtn = document.getElementById('app-nav-next');
            this.stage = document.getElementById('app-stage');

            // 12 Scenes Metadata (Icons & Names)
            this.showerHandTimer = null;
            this.sceneMeta = [
                { name: "Couple", icon: "assets/images/varun_alekhya_hero.jpg", type: "image" },
                { name: "Muhurtham", icon: "assets/images/varun_alekhya_couple.jpg", type: "image" },
                { name: "Pellikoduku", icon: "assets/images/varun_pellikoduku.jpg", type: "image" },
                { name: "Pellikuturu", icon: "assets/images/alekhya_pellikuthuru.jpg", type: "image" },
                { name: "Mehandi", icon: "assets/images/varun_alekhya_mehandi.jpg", type: "image" },
                { name: "Haldi", icon: "assets/images/varun_alekhya_haldi.jpg", type: "image" },
                { name: "Sangeet", icon: "assets/images/varun_alekhya_sangeet.jpg", type: "image" },
                { name: "Reception", icon: "assets/images/varun_alekhya_reception.jpg", type: "image" },
                { name: "Pelli", icon: "assets/images/varun_alekhya_pelli.jpg", type: "image" },
                { name: "Vratham", icon: "assets/images/timeline/event_9_satyanarayana_vratham.png", type: "image" },
                { name: "Venue", icon: "🏛️", type: "emoji" },
                { name: "Blessings", icon: "🌸", type: "emoji" }
            ];

            this.init();
        }

        init() {
            if (this.totalScenes === 0) return;

            this.buildStoryProgressBar();
            this.buildBottomDock();
            this.attachEventListeners();

            // Set initial state
            this.goToScene(0, 'init');
        }

        buildStoryProgressBar() {
            if (!this.progressBarContainer) return;
            this.progressBarContainer.innerHTML = '';

            this.progressSegments = [];
            for (let i = 0; i < this.totalScenes; i++) {
                const seg = document.createElement('div');
                seg.className = 'story-progress-segment';
                seg.setAttribute('data-seg-idx', i);
                seg.title = `Jump to ${this.sceneMeta[i]?.name || 'Scene ' + (i + 1)}`;

                const fill = document.createElement('div');
                fill.className = 'story-progress-fill';
                seg.appendChild(fill);

                seg.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.goToScene(i, i > this.currentIndex ? 'next' : 'prev');
                });

                this.progressBarContainer.appendChild(seg);
                this.progressSegments.push(seg);
            }
        }

        buildBottomDock() {
            if (!this.bottomDockInner) return;
            this.bottomDockInner.innerHTML = '';

            this.dockItems = [];
            for (let i = 0; i < this.totalScenes; i++) {
                const item = document.createElement('button');
                item.className = 'dock-item' + (i === 0 ? ' dock-active' : '');
                item.setAttribute('data-dock-idx', i);
                item.setAttribute('data-tooltip', this.sceneMeta[i]?.name || `Scene ${i + 1}`);
                item.setAttribute('aria-label', `Navigate to ${this.sceneMeta[i]?.name || 'Scene ' + (i + 1)}`);

                const meta = this.sceneMeta[i];
                if (meta && meta.type === 'image') {
                    const img = document.createElement('img');
                    img.src = meta.icon;
                    img.alt = meta.name;
                    img.loading = 'lazy';
                    item.appendChild(img);
                } else {
                    item.textContent = (meta && meta.icon) || String(i + 1);
                }

                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.goToScene(i, i > this.currentIndex ? 'next' : 'prev');
                });

                this.bottomDockInner.appendChild(item);
                this.dockItems.push(item);
            }
        }

        attachEventListeners() {
            // Previous & Next Lateral Buttons
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.goToScene(this.currentIndex - 1, 'prev');
                });
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.goToScene(this.currentIndex + 1, 'next');
                });
            }

            // Autoplay Play/Pause Toggle Pill
            if (this.autoplayBtn) {
                this.autoplayBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePlayPause();
                });
            }

            // Vratham Mandapam Darshanam Toggle
            const vrathamBgBtn = document.getElementById('vratham-view-bg-btn');
            const vrathamScene = document.getElementById('scene-varatham');
            if (vrathamBgBtn) {
                vrathamBgBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const card = document.querySelector('.card-vratham');
                    if (card) {
                        const isDimmed = card.classList.toggle('vratham-card-dimmed');
                        vrathamBgBtn.setAttribute('aria-pressed', isDimmed ? 'true' : 'false');
                    }
                });
            }
            if (vrathamScene) {
                vrathamScene.addEventListener('click', (e) => {
                    const card = document.querySelector('.card-vratham');
                    if (card && card.classList.contains('vratham-card-dimmed')) {
                        card.classList.remove('vratham-card-dimmed');
                        if (vrathamBgBtn) vrathamBgBtn.setAttribute('aria-pressed', 'false');
                    }
                });
            }
            // Raaga Convention Venue Darshanam Toggle
            const venueBgBtn = document.getElementById('venue-view-bg-btn');
            const venueScene = document.getElementById('scene-venue');
            if (venueBgBtn) {
                venueBgBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const card = document.querySelector('.card-venue');
                    if (card) {
                        const isDimmed = card.classList.toggle('venue-card-dimmed');
                        venueBgBtn.setAttribute('aria-pressed', isDimmed ? 'true' : 'false');
                    }
                });
            }
            if (venueScene) {
                venueScene.addEventListener('click', (e) => {
                    const card = document.querySelector('.card-venue');
                    if (card && card.classList.contains('venue-card-dimmed')) {
                        card.classList.remove('venue-card-dimmed');
                        if (venueBgBtn) venueBgBtn.setAttribute('aria-pressed', 'false');
                    }
                });
            }

            // Family Compliments Screen Darshanam Toggle
            const familyBgBtn = document.getElementById('family-view-bg-btn');
            const familyScene = document.getElementById('scene-family');
            if (familyBgBtn) {
                familyBgBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const card = document.querySelector('.family-luxury-card');
                    if (card) {
                        const isDimmed = card.classList.toggle('family-card-dimmed');
                        familyBgBtn.setAttribute('aria-pressed', isDimmed ? 'true' : 'false');
                    }
                });
            }
            if (familyScene) {
                familyScene.addEventListener('click', (e) => {
                    const card = document.querySelector('.family-luxury-card');
                    if (card && card.classList.contains('family-card-dimmed')) {
                        card.classList.remove('family-card-dimmed');
                        if (familyBgBtn) familyBgBtn.setAttribute('aria-pressed', 'false');
                    }
                });
            }


            // Mouse hover & movement pause on app stage & active card
            if (this.stage) {
                const handlePointerIn = () => {
                    if (this.isAutoPlaying && !this.isPaused) {
                        this.pauseTimer();
                    }
                };

                const handlePointerOut = (e) => {
                    if (this.isAutoPlaying && this.isPaused) {
                        // Avoid resuming if cursor just moved between child elements
                        if (e && e.relatedTarget && this.stage.contains(e.relatedTarget)) {
                            return;
                        }
                        this.resumeTimer();
                    }
                };

                this.stage.addEventListener('mouseenter', handlePointerIn);
                this.stage.addEventListener('mousemove', handlePointerIn);
                this.stage.addEventListener('mouseleave', handlePointerOut);

                // Touch support for mobile devices
                this.stage.addEventListener('touchstart', handlePointerIn, { passive: true });
            }

            // Mobile Touch Swipe Navigation
            let touchStartX = 0;
            let touchStartY = 0;
            window.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches[0]) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            window.addEventListener('touchend', (e) => {
                if (!e.changedTouches || !e.changedTouches[0]) return;
                const deltaX = e.changedTouches[0].clientX - touchStartX;
                const deltaY = e.changedTouches[0].clientY - touchStartY;

                // Detect horizontal swipe if deltaX is dominant and exceeds 45px
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
                    if (deltaX < 0) {
                        // Swipe Left -> Next
                        this.goToScene(this.currentIndex + 1, 'next');
                    } else {
                        // Swipe Right -> Prev
                        this.goToScene(this.currentIndex - 1, 'prev');
                    }
                }
            }, { passive: true });

            // Keyboard Navigation (Arrow Keys & Space)
            window.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.goToScene(this.currentIndex + 1, 'next');
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.goToScene(this.currentIndex - 1, 'prev');
                } else if (e.key === ' ') {
                    e.preventDefault();
                    this.togglePlayPause();
                }
            });
        }

        scheduleShowerHandHint(delayMs = 1000) {
            if (this.showerHandTimer) {
                clearTimeout(this.showerHandTimer);
                this.showerHandTimer = null;
            }
            const handHint = document.getElementById('shower-hand-click-hint');
            if (handHint) {
                handHint.classList.remove('shower-hand-visible');
            }

            // Scene index 11 is the last Compliments Card (#scene-family)
            if (this.currentIndex === 11) {
                this.showerHandTimer = setTimeout(() => {
                    if (this.currentIndex === 11) {
                        const hint = document.getElementById('shower-hand-click-hint');
                        if (hint) {
                            hint.classList.add('shower-hand-visible');
                        }
                    }
                }, delayMs);
            }
        }

        goToScene(targetIndex, direction = 'next') {
            const nextIdx = (targetIndex + this.totalScenes) % this.totalScenes;
            if (direction !== 'init' && nextIdx === this.currentIndex && this.isTransitioning) return;

            this.isTransitioning = true;
            clearTimeout(this.timer);

            const prevIdx = this.currentIndex;
            const currentScene = this.scenes[prevIdx];
            const nextScene = this.scenes[nextIdx];

            // Animate exit of current scene
            if (currentScene && direction !== 'init') {
                currentScene.classList.remove('scene-active');
                currentScene.classList.remove('scene-exit-prev', 'scene-exit-next');
                currentScene.classList.add(direction === 'next' ? 'scene-exit-prev' : 'scene-exit-next');
                setTimeout(() => {
                    currentScene.classList.remove('scene-exit-prev', 'scene-exit-next');
                }, 650);
            }

            // Animate entrance of target scene
            if (nextScene) {
                nextScene.classList.remove('scene-exit-prev', 'scene-exit-next');
                nextScene.classList.add('scene-active');
            }

            this.currentIndex = nextIdx;
            this.scheduleShowerHandHint(1000);
            // Expand stage width for all 9 Diptych Ceremony Showcase Scenes (Scenes 0 through 8: Hero, Muhurtham, Pellikoduku, Pellikuturu, Mehandi, Haldi, Sangeet, Reception, Pelli)
            if (this.stage) {
                this.stage.classList.toggle('stage-hero-active', nextIdx >= 0 && nextIdx <= 8);
                this.stage.classList.toggle('stage-vratham-active', false);
            }

            // 1. Sync Climate & Atmosphere Engine
            const targetMood = nextScene ? (nextScene.getAttribute('data-climate') || 'morning-sun') : 'morning-sun';
            if (this.atmosphere) {
                this.atmosphere.setClimate(targetMood);
            }
            if (this.sound) {
                this.sound.setMood(targetMood);
            }
            if (this.particles) {
                this.particles.setTheme(targetMood);
            }

            // In Scene 12 (Compliments Screen), deactivate default celestial sun/moon to show family portrait
            const cSun = document.getElementById('celestial-sun');
            const cMoon = document.getElementById('celestial-moon');
            if (this.currentIndex === 11 || this.currentIndex === 12) {
                if (cSun) cSun.classList.remove('celestial-active');
                if (cMoon) cMoon.classList.remove('celestial-active');
            }

            // 2. Update Scene Counter Pill
            if (this.counterEl) {
                const currentFormatted = String(this.currentIndex + 1).padStart(2, '0');
                const totalFormatted = String(this.totalScenes).padStart(2, '0');
                this.counterEl.textContent = `${currentFormatted} / ${totalFormatted}`;
            }

            // 3. Update Story Progress Bar
            this.updateProgressBar();

            // 4. Update Bottom Dock Active Item & Auto-Scroll
            this.updateBottomDock();

            // 5. Trigger Auto-Slide Timer if enabled
            this.remainingTime = this.slideDuration;
            if (this.isAutoPlaying) {
                // If cursor is already hovering over stage or active card, pause immediately!
                const isHovered = (this.stage && this.stage.matches(':hover')) ||
                                  (document.querySelector('.app-scene.scene-active') && document.querySelector('.app-scene.scene-active').matches(':hover'));
                if (isHovered) {
                    this.pauseTimer(true);
                } else {
                    this.isPaused = false;
                    this.startTimer(this.slideDuration);
                }
            }

            setTimeout(() => {
                this.isTransitioning = false;
            }, 550);
        }

        updateProgressBar() {
            if (!this.progressSegments) return;

            this.progressSegments.forEach((seg, idx) => {
                seg.classList.remove('segment-active', 'segment-done', 'progress-animating', 'segment-paused');
                const fill = seg.querySelector('.story-progress-fill');

                if (idx < this.currentIndex) {
                    seg.classList.add('segment-done');
                    if (fill) fill.style.width = '100%';
                } else if (idx === this.currentIndex) {
                    seg.classList.add('segment-active');
                    if (fill) fill.style.width = '0%';
                    // Reflow to restart CSS keyframe animation
                    void seg.offsetWidth;
                    if (this.isAutoPlaying && !this.isPaused) {
                        seg.classList.add('progress-animating');
                    }
                } else {
                    if (fill) fill.style.width = '0%';
                }
            });
        }

        updateBottomDock() {
            if (!this.dockItems) return;

            this.dockItems.forEach((item, idx) => {
                const isActive = idx === this.currentIndex;
                item.classList.toggle('dock-active', isActive);

                if (isActive) {
                    // Smoothly center active item in dock viewport
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        }

        startTimer(duration) {
            clearTimeout(this.timer);
            this.startTime = Date.now();
            this.remainingTime = duration;

            this.timer = setTimeout(() => {
                this.goToScene(this.currentIndex + 1, 'next');
            }, duration);
        }

        pauseTimer(force = false) {
            if (this.isPaused && !force) return;
            this.isPaused = true;
            clearTimeout(this.timer);

            const elapsed = Date.now() - this.startTime;
            this.remainingTime = Math.max(500, this.slideDuration - elapsed);

            // Pause active progress segment animation
            const activeSeg = this.progressSegments && this.progressSegments[this.currentIndex];
            if (activeSeg) {
                activeSeg.classList.add('segment-paused');
            }

            if (this.playIcon) this.playIcon.textContent = '▶';
            if (this.playText) this.playText.textContent = '';
            if (this.autoplayBtn) this.autoplayBtn.setAttribute('title', 'Resume Auto-Slide');
        }

        resumeTimer(force = false) {
            if (!this.isPaused && !force) return;
            this.isPaused = false;

            const activeSeg = this.progressSegments && this.progressSegments[this.currentIndex];
            if (activeSeg) {
                activeSeg.classList.remove('segment-paused');
            }

            this.startTimer(this.remainingTime);

            if (this.playIcon) this.playIcon.textContent = '⏸';
            if (this.playText) this.playText.textContent = '';
            if (this.autoplayBtn) this.autoplayBtn.setAttribute('title', 'Pause Auto-Slide');
        }

        togglePlayPause() {
            if (this.isAutoPlaying) {
                this.isAutoPlaying = false;
                this.pauseTimer(true);
            } else {
                this.isAutoPlaying = true;
                this.resumeTimer(true);
            }
        }
    }

    // Initialize Single Screen Application
    const singleScreenApp = new SingleScreenApp(atmosphere, sound, particles);
    window.singleScreenApp = singleScreenApp;

    // ==========================================================================
    // 8. DEVOTIONAL SRI CHAKRA LANDING PORTAL CONTROLLER
    // ==========================================================================
    const landingPortal = document.getElementById('devotional-landing-portal');
    const chakraTrigger = document.getElementById('sri-chakra-trigger');
    const chakraEnterBtn = document.getElementById('sri-chakra-enter-btn');
    const hudChakraBtn = document.getElementById('hud-sri-chakra-btn');
    const earphoneModalOverlay = document.getElementById('earphone-plug-modal-overlay');
    const earphoneOkBtn = document.getElementById('earphone-ok-btn');
    const sriChakraHandHint = document.getElementById('sri-chakra-hand-tap-hint');
    let hasEnteredPortal = false;
    let handTapTimer = null;

    // Schedule Guided Hand Tap Hint on Sri Chakra (Reveals after 5 seconds of idle contemplation)
    function scheduleSriChakraHandTapHint(delayMs = 10000) {
        if (handTapTimer) clearTimeout(handTapTimer);
        handTapTimer = setTimeout(() => {
            const portal = document.getElementById('devotional-landing-portal');
            const handHint = document.getElementById('sri-chakra-hand-tap-hint');
            if (handHint && portal && !portal.classList.contains('portal-dismissed') && !hasEnteredPortal) {
                handHint.classList.add('hand-hint-visible');
            }
        }, delayMs);
    }

    // Dismiss Earphone Modal & Start Sri Chakra Gayatri Mantra Audio
    function dismissEarphoneModalAndStartAudio() {
        if (earphoneModalOverlay) {
            earphoneModalOverlay.classList.add('notice-dismissed');
        }
        if (sound) {
            sound.init();
            sound.playChakraAudio();
        }
        // Start 10-second countdown to guide user to click Sri Chakra
        scheduleSriChakraHandTapHint(10000);
    }

    if (earphoneOkBtn) {
        earphoneOkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dismissEarphoneModalAndStartAudio();
        });
    }

    if (earphoneModalOverlay) {
        earphoneModalOverlay.addEventListener('click', (e) => {
            if (e.target === earphoneModalOverlay) {
                e.stopPropagation();
                dismissEarphoneModalAndStartAudio();
            }
        });
        earphoneModalOverlay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                dismissEarphoneModalAndStartAudio();
            }
        });
    }

    // Pause auto-play while on landing portal so Scene 0 starts fresh on entrance
    if (landingPortal && singleScreenApp) {
        singleScreenApp.isAutoPlaying = false;
        if (singleScreenApp.timer) {
            clearInterval(singleScreenApp.timer);
            singleScreenApp.timer = null;
        }
    }

    // Play sacred Sri Chakra Gayatri Mantra on landing screen
    if (landingPortal && !landingPortal.classList.contains('portal-dismissed')) {
        if (sound) {
            sound.playChakraAudio();
        }
    }

    // Tap Sri Chakra -> Stop Chakra Audio, Sound Shankham & Start Inner Wedding Anthem
    function enterDevotionalPortal() {
        if (hasEnteredPortal) return;
        hasEnteredPortal = true;

        if (handTapTimer) {
            clearTimeout(handTapTimer);
            handTapTimer = null;
        }
        const handHint = document.getElementById('sri-chakra-hand-tap-hint');
        if (handHint) {
            handHint.classList.remove('hand-hint-visible');
        }

        // Stop Chakra Audio completely, sound Shankham, start Inner Wedding Anthem
        if (sound) {
            sound.pauseChakraAudio(0);
            sound.init();
            sound.playShankham();
            sound.startMusic();
        }

        // Sacred Particle Shower (Akshantalu) from center of Sri Chakra
        if (particles) {
            const rect = chakraTrigger ? chakraTrigger.getBoundingClientRect() : null;
            const cx = rect ? (rect.left + rect.width / 2) : (window.innerWidth / 2);
            const cy = rect ? (rect.top + rect.height / 2) : (window.innerHeight * 0.42);
            particles.showerBlessings(cx, cy);
        }

        // Cinematic Fast Rotation & Hyper-Zoom Warp
        if (landingPortal) {
            landingPortal.classList.add('portal-fast-zooming');

            setTimeout(() => {
                landingPortal.classList.add('portal-dismissed');
                landingPortal.classList.remove('portal-fast-zooming');

                // Start Application Flow from Scene 0
                if (singleScreenApp) {
                    singleScreenApp.goToScene(0, 'init');
                    singleScreenApp.isAutoPlaying = true;
                    singleScreenApp.resumeTimer(true);
                }
            }, 1250);
        }
    }

    if (chakraTrigger) {
        chakraTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            enterDevotionalPortal();
        });
        chakraTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                enterDevotionalPortal();
            }
        });
    }

    if (chakraEnterBtn) {
        chakraEnterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            enterDevotionalPortal();
        });
    }

    if (sriChakraHandHint) {
        sriChakraHandHint.addEventListener('click', (e) => {
            e.stopPropagation();
            enterDevotionalPortal();
        });
    }

    const invTextTrigger = document.querySelector('.devotional-invitation-text');
    if (invTextTrigger) {
        invTextTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            enterDevotionalPortal();
        });
        invTextTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                enterDevotionalPortal();
            }
        });
    }

    // Portal background click: start chakra audio if not playing, or enter if already playing
    if (landingPortal) {
        landingPortal.addEventListener('click', (e) => {
            if (landingPortal.classList.contains('portal-fast-zooming') || landingPortal.classList.contains('portal-dismissed')) return;
            if (sound && !sound.isChakraPlaying) {
                sound.playChakraAudio();
            } else {
                enterDevotionalPortal();
            }
        });
    }

    // Replay Sri Chakra Portal on demand from top HUD
    if (hudChakraBtn && landingPortal) {
        hudChakraBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hasEnteredPortal = false;
            landingPortal.classList.remove('portal-dismissed', 'portal-fast-zooming');
            if (earphoneModalOverlay) {
                earphoneModalOverlay.classList.add('notice-dismissed');
            }
            scheduleSriChakraHandTapHint(10000);
            if (singleScreenApp) {
                singleScreenApp.pauseTimer();
            }
            if (sound) {
                sound.stopMusic();
                sound.playChakraAudio();
            }
        });
    }


    // Segmented Language Switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.currentTarget.getAttribute('data-lang');
            if (window.weddingI18n) {
                window.weddingI18n.setLanguage(lang);
            }
            if (window.modernSoundEngine) {
                window.modernSoundEngine.updateUI();
            }
        });
    });

    // Modern Music Toggle
    const hudSoundToggle = document.getElementById('hud-sound-toggle');
    if (hudSoundToggle && sound) {
        hudSoundToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sound.togglePlayPause();
            sound.updateUI();
        });
    }

    // Interactive Shower Blessings on Compliments Card
    const btnShowerBlessings = document.getElementById('btn-shower-blessings');
    if (btnShowerBlessings) {
        btnShowerBlessings.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerBlessingShower();
        });
    }

    const showerHandHint = document.getElementById('shower-hand-click-hint');
    if (showerHandHint) {
        showerHandHint.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerBlessingShower();
        });
    }

    function triggerBlessingShower() {
        const showerHint = document.getElementById('shower-hand-click-hint');
        if (showerHint) {
            showerHint.classList.remove('shower-hand-visible');
        }
        const symbols = ['🌸', '🌹', '✨', '🪔', '💛', '🌼', '🌾'];
        const container = document.body;
        for (let i = 0; i < 36; i++) {
            const petal = document.createElement('div');
            petal.className = 'floating-blessing-petal';
            petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            const left = Math.random() * 100;
            const size = 18 + Math.random() * 22;
            const duration = 2.4 + Math.random() * 2.0;
            const delay = Math.random() * 0.7;
            const rot = (Math.random() * 720) - 360;
            const tx = (Math.random() * 160) - 80;

            petal.style.left = left + 'vw';
            petal.style.fontSize = size + 'px';
            petal.style.animationDuration = duration + 's';
            petal.style.animationDelay = delay + 's';
            petal.style.setProperty('--tx', tx + 'px');
            petal.style.setProperty('--rot', rot + 'deg');

            container.appendChild(petal);
            setTimeout(() => {
                if (petal && petal.parentNode) {
                    petal.parentNode.removeChild(petal);
                }
            }, (duration + delay) * 1000 + 200);
        }

        // Show royal appreciation toast
        let toast = document.getElementById('blessing-toast-popup');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'blessing-toast-popup';
            toast.className = 'blessing-toast-popup';
            document.body.appendChild(toast);
        }
        const msg = (window.weddingI18n && window.weddingI18n.get('toastBlessingThanks')) || 
                    "✨ Thank you for showering your heartfelt blessings on Varun & Alekhya! ✨";
        toast.textContent = msg;
        toast.classList.remove('toast-active');
        void toast.offsetWidth; // force reflow
        toast.classList.add('toast-active');
        setTimeout(() => {
            toast.classList.remove('toast-active');
        }, 3800);

        // Soft royal chime note via Web Audio API
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.12);
                gain.gain.setValueAtTime(0.001, now + idx * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.12 + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.9);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.12);
                osc.stop(now + idx * 0.12 + 0.95);
            });
        } catch (err) {}
    }
});
