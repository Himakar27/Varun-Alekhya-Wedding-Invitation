/**
 * 2026 Next-Gen Royal Wedding Music & Sound Engine
 * Features:
 * - Dynamic Climate-Synced Ambient Orchestration:
 *   1. Morning: Airy, Foggy Mountain Nature, Fresh Pine Breeze, Morning Birdsong & Bansuri Flute
 *   2. Night: Calm Starlit Midnight, Cascading Falling Stars, Celestial Bells & Meditative Peace
 * - Seamless Audio Crossfading between Morning and Night Occasions
 * - Real-time Web Audio Falling Stars Twinkle Soundscape
 * - Pure Crystal Temple Bell Chime & Sacred Shankham Sound FX
 */

class RoyalWeddingSoundEngine {
    constructor() {
        this.audioEl = null;
        this.ctx = null;
        this.analyser = null;
        this.sourceNode = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.volume = 0.70;
        this.currentTrackId = 'wedding';
        this.currentMood = 'morning';
        this.isFading = false;
        this.lastSparkleTime = 0;
        this.fadeTimer = null;
        this.chakraAudio = null;
        this.isChakraPlaying = false;
        this._unmuteArmed = false;

        // Curated Soundscapes
        this.tracks = {
            wedding: {
                titleTe: "సీతారాముల కళ్యాణ వైభోగమే • Seetha Kalyana Vaibhogame",
                titleEn: "Seetha Kalyana Vaibhogame • Royal Wedding Anthem",
                titleHi: "सीता कल्याण वैभोगमे • पावन विवाह उत्सव गीत",
                src: "assets/audio/seetha_kalyanam_wedding_theme.mp3"
            },
            morning: {
                titleTe: "శీతాకాల ఉదయ వేణుగానం • Morning Nature & Airy Freshness",
                titleEn: "Morning Nature • Airy Foggy Freshness & Bansuri Flute",
                titleHi: "प्रातःकालीन शीत प्रकृति • सुरमयी बांसुरी एवं पक्षी गान",
                src: "assets/audio/morning_nature_freshness.wav"
            },
            night: {
                titleTe: "నిశీధ తారారావం • Calm Midnight Falling Stars & Peace",
                titleEn: "Calm Night • Falling Stars & Celestial Peace Music",
                titleHi: "शांत तारों भरी रात • टूटते तारे एवं दिव्य शांति संगीत",
                src: "assets/audio/night_falling_stars_peace.wav"
            },
            local: {
                titleTe: "శీతాకాల ఉదయ వేణుగానం • Morning Nature & Airy Freshness",
                titleEn: "Morning Nature • Airy Foggy Freshness & Bansuri Flute",
                titleHi: "प्रातःकालीन शीत प्रकृति • सुरमयी बांसुरी एवं पक्षी गान",
                src: "assets/audio/morning_nature_freshness.wav"
            },
            shehnai: {
                titleTe: "మంగళ వాద్యం • Royal Wedding Shehnai & Nadaswaram",
                titleEn: "Royal Wedding Shehnai • Sacred Kalyana Vaadhyam",
                titleHi: "शहनाई मंगल वाद्य • पावन विवाह धुन",
                src: "assets/audio/royal_shehnai.wav"
            },
            sitar: {
                titleTe: "ప్రణయ రాగం • Soulful Sitar & Santoor Romance",
                titleEn: "Soulful Romance • Sitar & Santoor Melodies",
                titleHi: "प्रणय राग • मनमोहक सितार एवं संतूर",
                src: "assets/audio/soulful_sitar.wav"
            }
        };
    }

    init() {
        if (!this.audioEl) {
            this.audioEl = document.getElementById('wedding-master-audio');
            if (!this.audioEl) {
                this.audioEl = new Audio('assets/audio/seetha_kalyanam_wedding_theme.mp3');
                this.audioEl.id = 'wedding-master-audio';
                this.audioEl.loop = true;
                this.audioEl.preload = 'auto';
                document.body.appendChild(this.audioEl);
            }
            if (!this.audioEl.src || !this.audioEl.src.includes('seetha_kalyanam')) {
                this.audioEl.src = 'assets/audio/seetha_kalyanam_wedding_theme.mp3';
            }
            this.audioEl.volume = this.volume;
            this.audioEl.loop = true;

            // Continuous loop replay when song ends (replays from 24s)
            this.audioEl.addEventListener('ended', () => {
                this.audioEl.currentTime = 24;
                this.audioEl.play().catch(e => console.log('Replay notice:', e));
            });

            this.audioEl.addEventListener('play', () => {
                this.isPlaying = true;
                this.updateUI();
                this.startSpectrumVisualizer();
            });

            this.audioEl.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updateUI();
                this.stopSpectrumVisualizer();
            });

            this.audioEl.addEventListener('error', (e) => {
                console.warn('Audio playback notice:', e);
            });
        }

        this.initChakraAudio();

        // Web Audio Context for Falling Stars & Bell FX
        if (!this.ctx) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            } catch (e) {
                console.warn('Web Audio not supported:', e);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    initChakraAudio() {
        if (!this.chakraAudio) {
            this.chakraAudio = document.getElementById('chakra-landing-audio');
            if (!this.chakraAudio) {
                this.chakraAudio = new Audio('assets/audio/gayatri_mantra_chakra.mp3');
                this.chakraAudio.id = 'chakra-landing-audio';
                this.chakraAudio.loop = false;
                this.chakraAudio.preload = 'auto';
                document.body.appendChild(this.chakraAudio);
            }
            if (!this.chakraAudio.src || !this.chakraAudio.src.includes('gayatri_mantra_chakra')) {
                this.chakraAudio.src = 'assets/audio/gayatri_mantra_chakra.mp3';
            }
            this.chakraAudio.volume = this.isMuted ? 0 : this.volume;
            this.chakraAudio.loop = false;

            this.chakraAudio.addEventListener('play', () => {
                this.isChakraPlaying = true;
                this.updateUI();
            });
            this.chakraAudio.addEventListener('pause', () => {
                this.isChakraPlaying = false;
                this.updateUI();
            });
        }
    }

    playChakraAudio() {
        this.initChakraAudio();
        if (!this.chakraAudio) return;
        // Ensure wedding theme is paused while chakra audio plays
        if (this.audioEl && !this.audioEl.paused) {
            this.audioEl.pause();
            this.isPlaying = false;
        }

        // Try unmuted playback first
        this.chakraAudio.loop = false;
        this.chakraAudio.muted = this.isMuted;
        this.chakraAudio.volume = this.isMuted ? 0 : this.volume;

        const p = this.chakraAudio.play();
        if (p !== undefined) {
            p.then(() => {
                this.isChakraPlaying = true;
                this.hideAutoplayPrompt();
                this.updateUI();
            }).catch(err => {
                console.log('Chakra audio playback awaiting user Continue click:', err);
                this.isChakraPlaying = false;
            });
        }
    }

    showAutoplayPrompt() {
        const prompt = document.getElementById('chakra-audio-prompt');
        if (prompt) {
            prompt.classList.add('prompt-visible');
        }
    }

    hideAutoplayPrompt() {
        const prompt = document.getElementById('chakra-audio-prompt');
        if (prompt) {
            prompt.classList.remove('prompt-visible');
        }
    }

    armAutoplayUnmute() {
        // Disarmed: audio is strictly initiated upon user clicking Continue button
        return;
    }

    pauseChakraAudio(fadeMs = 800) {
        this.hideAutoplayPrompt();
        if (!this.chakraAudio) return;
        if (fadeMs <= 0 || this.chakraAudio.paused) {
            this.chakraAudio.pause();
            this.chakraAudio.currentTime = 0;
            this.isChakraPlaying = false;
            this.updateUI();
            return;
        }

        const startVol = this.chakraAudio.volume;
        const stepTime = 40;
        const steps = Math.max(4, Math.floor(fadeMs / stepTime));
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const fraction = Math.max(0, 1 - (step / steps));
            if (this.chakraAudio) {
                this.chakraAudio.volume = startVol * fraction;
            }
            if (step >= steps) {
                clearInterval(timer);
                if (this.chakraAudio) {
                    this.chakraAudio.pause();
                    this.chakraAudio.volume = this.isMuted ? 0 : this.volume;
                }
                this.isChakraPlaying = false;
            }
        }, stepTime);
    }

    startMusic(startOffset = null) {
        this.init();
        if (!this.audioEl) return;
        // Ensure chakra audio is stopped when wedding theme plays
        if (this.chakraAudio && !this.chakraAudio.paused) {
            this.chakraAudio.pause();
            this.isChakraPlaying = false;
        }

        // Trim first 23 seconds and start from 24th second
        const seekTime = (typeof startOffset === 'number') ? startOffset : 24;
        try {
            if (this.audioEl.currentTime < seekTime) {
                this.audioEl.currentTime = seekTime;
            }
        } catch (e) {
            console.log('Audio seek notice:', e);
        }

        // Initially start at 40% volume, then gradually increase smoothly up to 70%
        const targetVol = this.isMuted ? 0 : 0.70;
        const startVol = this.isMuted ? 0 : 0.40;
        this.audioEl.volume = startVol;

        const playPromise = this.audioEl.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                if (this.audioEl.currentTime < 23.5) {
                    try { this.audioEl.currentTime = 24; } catch (err) {}
                }
                this.updateUI();

                // Smoothly ramp volume from 40% up to 70% over 4.0 seconds
                if (!this.isMuted) {
                    if (this._volRampTimer) clearInterval(this._volRampTimer);
                    const durationMs = 4000;
                    const stepMs = 50;
                    const steps = Math.floor(durationMs / stepMs);
                    const volStep = (targetVol - startVol) / steps;
                    let currentStep = 0;

                    this._volRampTimer = setInterval(() => {
                        currentStep++;
                        if (this.audioEl && !this.isMuted && this.isPlaying) {
                            this.audioEl.volume = Math.min(targetVol, startVol + (volStep * currentStep));
                        }
                        if (currentStep >= steps) {
                            clearInterval(this._volRampTimer);
                            this._volRampTimer = null;
                            if (this.audioEl && !this.isMuted) {
                                this.audioEl.volume = targetVol;
                            }
                        }
                    }, stepMs);
                }
            }).catch(err => {
                console.log('Autoplay deferred until user interaction:', err);
                this.isPlaying = false;
                this.updateUI();
            });
        }
    }

    stopMusic() {
        if (this._volRampTimer) {
            clearInterval(this._volRampTimer);
            this._volRampTimer = null;
        }
        if (this.audioEl) {
            this.audioEl.pause();
        }
        this.isPlaying = false;
        this.updateUI();
    }

    togglePlayPause() {
        this.init();
        const landingPortal = document.getElementById('devotional-landing-portal');
        const onLanding = landingPortal && !landingPortal.classList.contains('portal-dismissed');
        
        if (onLanding) {
            if (this.isChakraPlaying) {
                this.pauseChakraAudio(0);
            } else {
                this.playChakraAudio();
            }
            this.updateUI();
            return this.isChakraPlaying;
        }

        if (this.isPlaying) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
        this.updateUI();
        return this.isPlaying;
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.audioEl && !this.isFading) {
            this.audioEl.volume = this.isMuted ? 0 : this.volume;
        }
        if (this.chakraAudio) {
            this.chakraAudio.volume = this.isMuted ? 0 : this.volume;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.audioEl) {
            this.audioEl.volume = this.isMuted ? 0 : this.volume;
        }
        if (this.chakraAudio) {
            this.chakraAudio.volume = this.isMuted ? 0 : this.volume;
        }
        this.updateUI();
        return this.isMuted;
    }

    /**
     * Seamless Ambient Climate Coordinator
     * Smoothly crossfades between:
     * - Morning Nature Airy Freshness (for daytime events)
     * - Calm Night Falling Stars Peace (for Sangeet, Reception, Subha Muhurtham)
     */
    setMood(mood) {
        this.currentMood = mood;
        const isNightMood = (mood === 'night' || mood === 'dawn' || mood === 'dark-night' || mood === 'early-dawn' || mood === 'sangeet');
        const targetTrack = isNightMood ? 'night' : 'morning';

        // Only auto-switch if user is on dynamic tracks (not custom user uploads or manual shehnai/sitar)
        if (this.currentTrackId !== 'morning' && this.currentTrackId !== 'night' && this.currentTrackId !== 'local') {
            return;
        }

        if (this.currentTrackId === targetTrack) return;

        this.transitionToTrack(targetTrack);
    }

    /**
     * Smooth Audio Crossfader
     */
    transitionToTrack(targetTrackId, durationMs = 1200) {
        const track = this.tracks[targetTrackId];
        if (!track) return;

        if (this.isFading) {
            if (this.fadeTimer) clearInterval(this.fadeTimer);
        }

        if (!this.isPlaying) {
            this.currentTrackId = targetTrackId;
            if (this.audioEl) {
                this.audioEl.src = track.src;
                this.audioEl.load();
            }
            this.updateUI();
            return;
        }

        // Active crossfade: Fade Down -> Swap Track -> Fade Up
        this.isFading = true;
        const targetMaxVol = this.isMuted ? 0 : this.volume;
        const stepTime = 40;
        const halfSteps = Math.max(6, Math.floor((durationMs / 2) / stepTime));
        let step = 0;
        const startVol = this.audioEl.volume;

        // 1. Fade Down
        this.fadeTimer = setInterval(() => {
            step++;
            const fraction = Math.max(0, 1.0 - (step / halfSteps));
            if (this.audioEl) {
                this.audioEl.volume = Math.max(0, startVol * fraction);
            }

            if (step >= halfSteps) {
                clearInterval(this.fadeTimer);
                
                // 2. Swap Source & Start Playing Target Track
                this.currentTrackId = targetTrackId;
                if (this.audioEl) {
                    this.audioEl.src = track.src;
                    this.audioEl.load();
                    this.audioEl.play().catch(() => {});
                }
                this.updateUI();

                // 3. Fade Up
                let upStep = 0;
                this.fadeTimer = setInterval(() => {
                    upStep++;
                    const upFraction = Math.min(1.0, upStep / halfSteps);
                    if (this.audioEl) {
                        this.audioEl.volume = this.isMuted ? 0 : (targetMaxVol * upFraction);
                    }

                    if (upStep >= halfSteps) {
                        clearInterval(this.fadeTimer);
                        this.isFading = false;
                        if (this.audioEl) {
                            this.audioEl.volume = this.isMuted ? 0 : targetMaxVol;
                        }
                    }
                }, stepTime);
            }
        }, stepTime);
    }

    switchTrack(trackKey) {
        this.init();
        if (trackKey === 'custom') {
            const fileInput = document.getElementById('music-custom-file');
            if (fileInput) fileInput.click();
            return;
        }

        this.transitionToTrack(trackKey, 800);
    }

    loadCustomFile(file) {
        if (!file) return;
        this.init();
        try {
            const blobUrl = URL.createObjectURL(file);
            this.tracks.custom = {
                titleTe: `🎵 ${file.name.replace(/\.[^/.]+$/, "")}`,
                titleEn: `🎵 ${file.name.replace(/\.[^/.]+$/, "")}`,
                titleHi: `🎵 ${file.name.replace(/\.[^/.]+$/, "")}`,
                src: blobUrl
            };
            this.currentTrackId = 'custom';
            if (this.audioEl) {
                this.audioEl.src = blobUrl;
                this.audioEl.load();
                this.audioEl.play().then(() => {
                    this.isPlaying = true;
                    this.updateUI();
                }).catch(() => {});
            }
        } catch (err) {
            console.error('Failed to load custom audio:', err);
        }
    }

    /**
     * Real-time Falling Stars Twinkle Soundscape (Web Audio)
     * Plays a delicate, crystalline descending sparkle when a shooting star streaks across the dark sky
     */
    playFallingStarSparkle() {
        if (this.isMuted || !this.isPlaying) return;
        const now = Date.now();
        if (now - this.lastSparkleTime < 2400) return; // Gentle throttle
        this.lastSparkleTime = now;

        this.init();
        if (!this.ctx) return;
        
        try {
            const audioNow = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const panNode = (this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null);

            osc.type = 'sine';
            // Descending crystal chime sweep (falling star trail)
            const startFreq = 2600 + Math.random() * 600;
            const endFreq = startFreq * 0.45;
            osc.frequency.setValueAtTime(startFreq, audioNow);
            osc.frequency.exponentialRampToValueAtTime(endFreq, audioNow + 1.4);

            // Shimmering amplitude envelope
            const baseVol = this.volume * 0.08; // Delicate micro-volume
            gain.gain.setValueAtTime(0.0001, audioNow);
            gain.gain.linearRampToValueAtTime(baseVol, audioNow + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 1.4);

            if (panNode) {
                panNode.pan.setValueAtTime((Math.random() - 0.5) * 1.4, audioNow);
                osc.connect(gain);
                gain.connect(panNode);
                panNode.connect(this.ctx.destination);
            } else {
                osc.connect(gain);
                gain.connect(this.ctx.destination);
            }

            osc.start(audioNow);
            osc.stop(audioNow + 1.45);
        } catch (e) {
            // Ignore minor audio context exceptions
        }
    }

    startSpectrumVisualizer() {
        const waveBars = document.getElementById('music-wave-bars');
        if (waveBars) {
            waveBars.classList.add('wave-active');
        }
    }

    stopSpectrumVisualizer() {
        const waveBars = document.getElementById('music-wave-bars');
        if (waveBars) {
            waveBars.classList.remove('wave-active');
        }
    }

    /**
     * Pure Solfeggio 528 Hz Temple Bell Chime
     */
    playTempleBell(pitchMultiplier = 1.0, volume = 0.7) {
        this.init();
        if (!this.ctx) return;
        
        const now = this.ctx.currentTime;
        const freq = 528.0 * pitchMultiplier;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.999, now + 2.8);

        gain.gain.setValueAtTime(volume * this.volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.9);
    }

    /**
     * Auspicious Shankham (Conch Shell) Harmonic Sound
     */
    playShankham(volume = 0.6) {
        this.playTempleBell(0.85, volume);
        setTimeout(() => this.playTempleBell(1.0, volume), 180);
        setTimeout(() => this.playTempleBell(1.33, volume * 0.8), 360);
    }

    updateUI() {
        const titleEl = document.getElementById('music-track-title');
        const playBtn = document.getElementById('music-play-btn');
        const muteBtn = document.getElementById('music-mute-btn');
        const waveBars = document.getElementById('music-wave-bars');

        const lang = (window.weddingI18n && window.weddingI18n.currentLang) || 'en';
        const track = this.tracks[this.currentTrackId] || this.tracks.morning;

        if (titleEl) {
            titleEl.textContent = (lang === 'hi' ? track.titleHi : (lang === 'en' ? track.titleEn : track.titleTe));
        }
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? '❚❚' : '▶';
            playBtn.title = this.isPlaying ? "Pause Music" : "Play Romantic Wedding Music";
        }
        if (muteBtn) {
            muteBtn.innerHTML = this.isMuted ? '🔇' : '🔔';
        }
        if (waveBars) {
            waveBars.classList.toggle('wave-active', this.isPlaying && !this.isMuted);
        }

        // Top HUD Sound Pill
        const soundPill = document.getElementById('hud-sound-toggle');
        if (soundPill) {
            const isActive = (this.isPlaying || this.isChakraPlaying) && !this.isMuted;
            soundPill.classList.toggle('sound-active', isActive);
            const glyph = soundPill.querySelector('.sound-icon-glyph');
            if (glyph) {
                glyph.textContent = isActive ? '🎵' : '🔇';
            }
            soundPill.title = isActive ? "Music: Playing (Click to Pause)" : "Music: Paused (Click to Play)";
        }
    }
}

// Global instances for backwards compatibility
window.royalSound = new RoyalWeddingSoundEngine();
window.modernSoundEngine = window.royalSound;
window.romanticMusicEngine = window.royalSound;
window.divineSound = window.royalSound;
