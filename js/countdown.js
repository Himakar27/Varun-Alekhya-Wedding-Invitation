/**
 * Sacred Muhurtham Countdown & Calendar Integration
 * Target: 20th December at 03:53 AM (Brahma Muhurtham / Subha Lagnam)
 * Crafted for Varun & Alekhya's Kalyana Mahotsavam
 */

class MuhurthamCountdown {
    constructor() {
        // Target: 20th December at 03:53:00 AM IST
        // Calculate appropriate target year (current year or next based on current date)
        const now = new Date();
        let targetYear = now.getFullYear();
        let targetDate = new Date(`${targetYear}-12-20T03:53:00+05:30`);
        
        // If current date has passed December 20th this year, advance to next occurrence
        if (now.getTime() > targetDate.getTime()) {
            targetYear += 1;
            targetDate = new Date(`${targetYear}-12-20T03:53:00+05:30`);
        }

        this.targetTime = targetDate.getTime();
        this.daysEl = document.getElementById('count-days');
        this.hoursEl = document.getElementById('count-hours');
        this.minutesEl = document.getElementById('count-minutes');
        this.secondsEl = document.getElementById('count-seconds');
        this.statusBadgeEl = document.getElementById('muhurtham-status');

        this.start();
        this.initCalendarButtons(targetDate);
    }

    start() {
        this.update();
        setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date().getTime();
        const difference = this.targetTime - now;

        if (difference <= 0) {
            if (this.daysEl) this.daysEl.textContent = '00';
            if (this.hoursEl) this.hoursEl.textContent = '00';
            if (this.minutesEl) this.minutesEl.textContent = '00';
            if (this.secondsEl) this.secondsEl.textContent = '00';
            if (this.statusBadgeEl) {
                this.statusBadgeEl.innerHTML = '✨ శుభ ముహూర్తం నెరవేరినది • Blessed Forever ✨';
            }
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        this.animateDigit(this.daysEl, days);
        this.animateDigit(this.hoursEl, hours);
        this.animateDigit(this.minutesEl, minutes);
        this.animateDigit(this.secondsEl, seconds);
    }

    animateDigit(element, value) {
        if (!element) return;
        const formatted = String(value).padStart(2, '0');
        if (element.textContent !== formatted) {
            element.textContent = formatted;
            element.classList.add('digit-pulse');
            setTimeout(() => element.classList.remove('digit-pulse'), 300);
        }
    }

    initCalendarButtons(targetDate) {
        const googleBtn = document.getElementById('btn-add-google');
        const icsBtn = document.getElementById('btn-download-ics');

        const title = encodeURIComponent("Varun & Alekhya's Sacred Wedding (Subha Muhurtham)");
        const details = encodeURIComponent(
            "With the divine blessings of Lord Venkateswara Swamy, we cordially invite you to celebrate the sacred wedding ceremony of Varun & Alekhya.\n\n" +
            "Subha Muhurtham: 20th December at 3:53 AM (Brahma Muhurtham)\n" +
            "Satyanarayana Swamy Varatham: 20th December at 10:00 AM\n\n" +
            "Join us to shower your sacred blessings (Akshantalu)!"
        );
        const location = encodeURIComponent("Raaga Convention (Main Venue) & Home Residence");

        // Format for Google Calendar: YYYYMMDDTHHmmssZ
        // 20th Dec 3:53 AM IST = 19th Dec 22:23:00 UTC
        const startTimeUTC = new Date(targetDate.getTime()).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endTimeDate = new Date(targetDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
        const endTimeUTC = endTimeDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimeUTC}/${endTimeUTC}&details=${details}&location=${location}`;

        if (googleBtn) {
            googleBtn.href = googleUrl;
            googleBtn.target = "_blank";
        }

        if (icsBtn) {
            icsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadICS(title, details, location, startTimeUTC, endTimeUTC);
            });
        }
    }

    downloadICS(title, details, location, startUTC, endUTC) {
        const decodedTitle = decodeURIComponent(title);
        const decodedDetails = decodeURIComponent(details);
        const decodedLocation = decodeURIComponent(location);

        const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Varun & Alekhya Wedding//Temple Invitation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${decodedTitle}
DESCRIPTION:${decodedDetails.replace(/\n/g, '\\n')}
LOCATION:${decodedLocation}
DTSTART:${startUTC}
DTEND:${endUTC}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Reminder: Varun & Alekhya Wedding Muhurtham Tomorrow
END:VALARM
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'Varun_Alekhya_Wedding_Muhurtham.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

window.MuhurthamCountdown = MuhurthamCountdown;
