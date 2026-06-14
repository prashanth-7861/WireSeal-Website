document.addEventListener('DOMContentLoaded', () => {
    // Fetch latest release version from GitHub API
    fetchLatestReleaseVersion();
    
    // OS Detection and display
    const userAgent = navigator.userAgent.toLowerCase();
    const isMac = userAgent.includes('mac');
    const isWindows = userAgent.includes('win');
    const isLinux = userAgent.includes('linux') || userAgent.includes('unix') || userAgent.includes('android');
    
    const linuxSec = document.getElementById('linux-section');
    const macosSec = document.getElementById('macos-section');
    const winSec = document.getElementById('windows-section');
    const detectMsg = document.getElementById('detect-msg');
    
    // Hide all first
    linuxSec.classList.remove('active');
    macosSec.classList.remove('active');
    winSec.classList.remove('active');
    
    if (detectMsg) {
        detectMsg.textContent = 'Detecting your system...';
    }
    
    // Show appropriate section with animation
    if (isMac) {
        macosSec.classList.add('active');
        triggerSectionAnimation(macosSec);
    } else if (isWindows) {
        winSec.classList.add('active');
        triggerSectionAnimation(winSec);
    } else if (isLinux) {
        linuxSec.classList.add('active');
        triggerSectionAnimation(linuxSec);
    } else {
        // Show all for unknown (fallback when no other-section exists)
        linuxSec.classList.add('active');
        macosSec.classList.add('active');
        winSec.classList.add('active');
        if (detectMsg) {
            detectMsg.textContent = 'Select your platform above:';
        }
        
        // Trigger animation for all visible sections
        triggerSectionAnimation(linuxSec);
        triggerSectionAnimation(macosSec);
        triggerSectionAnimation(winSec);
    }
    
    // Also show all sections on mobile for selection
    if (window.innerWidth < 600) {
        linuxSec.classList.add('active');
        macosSec.classList.add('active');
        winSec.classList.add('active');
        if (detectMsg) {
            detectMsg.textContent = 'Choose your platform:';
        }
        
        // Trigger animation for all visible sections
        triggerSectionAnimation(linuxSec);
        triggerSectionAnimation(macosSec);
        triggerSectionAnimation(winSec);
    }
    
    /**
     * Fetch latest release version from GitHub API
     * and update all download links dynamically
     */
    async function fetchLatestReleaseVersion() {
        const GITHUB_API_URL = 'https://api.github.com/repos/prashanth-7861/WireSeal/releases/latest';
        
        try {
            const response = await fetch(GITHUB_API_URL);
            if (!response.ok) throw new Error('Failed to fetch latest release');
            
            const data = await response.json();
            const version = data.tag_name.replace('v', ''); // e.g., "0.7.23"
            
            // Update all download links with the latest version
            updateAllDownloadLinks(version);
            
            // Update version display in hero if exists
            const heroTag = document.querySelector('.hero-tag');
            if (heroTag && heroTag.textContent.includes('v')) {
                heroTag.textContent = `v${version}`;
            }
            
            console.log(`[WireSeal] Latest version: ${version}`);
        } catch (error) {
            console.error('[WireSeal] Error fetching latest release:', error);
            // Fallback: use hardcoded version
            updateAllDownloadLinks('0.7.23');
        }
    }
    
    /**
     * Update all download links across both index.html and setup.html
     * @param {string} version - Version string (e.g., "0.7.23")
     */
    function updateAllDownloadLinks(version) {
        const baseUrl = 'https://github.com/prashanth-7861/WireSeal/releases/latest/download/';
        
        // ====== index.html download buttons ======
        const indexLinuxBtn = document.querySelector('#linux-section .download-btn');
        const indexMacosBtn = document.querySelector('#macos-section .download-btn');
        const indexWinBtn = document.querySelector('#windows-section .download-btn');
        
        if (indexLinuxBtn) {
            indexLinuxBtn.href = `${baseUrl}wireseal_${version}_amd64.deb`;
        }
        if (indexMacosBtn) {
            indexMacosBtn.href = `${baseUrl}wireseal-${version}-macos-arm64.pkg`;
        }
        if (indexWinBtn) {
            indexWinBtn.href = `${baseUrl}wireseal-${version}-windows-x86_64-setup.exe`;
        }
        
        // ====== setup.html - Linux ======
        // Desktop App - standalone binary
        const linuxDesktopLink = document.querySelector('#linux .direct-download .download-btn');
        if (linuxDesktopLink) {
            linuxDesktopLink.href = `${baseUrl}WireSeal-linux-x86_64`;
        }
        
        // CLI binary
        const linuxCliLink = document.querySelector('#linux a[href*="wireseal-cli-linux"]');
        if (linuxCliLink) {
            linuxCliLink.href = `${baseUrl}wireseal-cli-linux-x86_64`;
        }
        
        // Install script
        const linuxScriptLink = document.querySelector('#linux a[href*="wireseal-linux.sh"]');
        if (linuxScriptLink) {
            linuxScriptLink.href = `${baseUrl}wireseal-linux.sh`;
        }
        
        // ====== setup.html - macOS ======
        // Desktop App - PKG
        const macosDesktopLink = document.querySelector('#macos .direct-download .download-btn');
        if (macosDesktopLink) {
            macosDesktopLink.href = `${baseUrl}wireseal-${version}-macos-arm64.pkg`;
        }
        
        // CLI binary
        const macosCliLink = document.querySelector('#macos a[href*="wireseal-cli-macos"]');
        if (macosCliLink) {
            macosCliLink.href = `${baseUrl}wireseal-cli-macos-arm64`;
        }
        
        // Install script
        const macosScriptLink = document.querySelector('#macos a[href*="wireseal-macos.sh"]');
        if (macosScriptLink) {
            macosScriptLink.href = `${baseUrl}wireseal-macos.sh`;
        }
        
        // ====== setup.html - Windows ======
        // Desktop App - setup.exe
        const winDesktopLink = document.querySelector('#windows .direct-download .download-btn');
        if (winDesktopLink) {
            winDesktopLink.href = `${baseUrl}wireseal-${version}-windows-x86_64-setup.exe`;
        }
        
        // CLI binary
        const winCliLink = document.querySelector('#windows a[href*="wireseal-cli-windows"]');
        if (winCliLink) {
            winCliLink.href = `${baseUrl}wireseal-cli-windows-x86_64.exe`;
        }
        
        // Install script
        const winScriptLink = document.querySelector('#windows a[href*="wireseal-windows.ps1"]');
        if (winScriptLink) {
            winScriptLink.href = `${baseUrl}wireseal-windows.ps1`;
        }
        
        // Update version text display
        updateVersionDisplays(version);
    }
    
    /**
     * Update version number displays in HTML
     * @param {string} version - Version string
     */
    function updateVersionDisplays(version) {
        // Update any element showing version number
        document.querySelectorAll('[data-version]').forEach(el => {
            el.textContent = version;
        });
        
        // Update code blocks with version
        const linuxSteps = document.querySelectorAll('#linux .code-block code');
        linuxSteps.forEach(code => {
            if (code.textContent.includes('WireSeal')) {
                code.textContent = code.textContent.replace(/WireSeal[-\w.]+/g, `WireSeal-${version}`);
            }
        });
        
        const macosSteps = document.querySelectorAll('#macos .code-block code');
        macosSteps.forEach(code => {
            if (code.textContent.includes('wireseal-') || code.textContent.includes('.pkg')) {
                code.textContent = code.textContent.replace(/wireseal[-\w.]+/g, `wireseal-${version}-macos-arm64.pkg`);
            }
        });
        
        const winSteps = document.querySelectorAll('#windows .code-block code');
        winSteps.forEach(code => {
            if (code.textContent.includes('wireseal-') || code.textContent.includes('.exe')) {
                code.textContent = code.textContent.replace(/wireseal[-\w.]+/g, `wireseal-${version}-windows-x86_64-setup.exe`);
            }
        });
    }
    
    // Add smooth scroll behavior for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Add hover effects to nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
    
    // Add active section highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
    
    function updateActiveNav() {
        let scrollPosition = window.scrollY + 100; // Account for nav height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav items
                navItems.forEach(item => item.classList.remove('active'));
                
                // Add active class to matching nav item
                const matchingNavItem = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (matchingNavItem) {
                    matchingNavItem.classList.add('active');
                }
            }
        });
    }
    
    // Initialize active nav on load
    updateActiveNav();
    
    // Update on scroll with throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Add entrance animations for elements as they come into view
    const animateElements = document.querySelectorAll('.what-card, .safety-card, .step');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }
    
    // Check on load and scroll
    checkIfInView();
    window.addEventListener('scroll', checkIfInView);
    
    // Add 3D tilt effect to hero logo on mouse move (desktop only)
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo && window.innerWidth >= 768) {
        heroLogo.parentElement.addEventListener('mousemove', (e) => {
            const container = heroLogo.parentElement;
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const centerX = container.offsetLeft + containerWidth / 2;
            const centerY = container.offsetTop + containerHeight / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const rotateX = (mouseY - centerY) / containerHeight * 10;
            const rotateY = (centerX - mouseX) / containerWidth * 10;
            
            heroLogo.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            heroLogo.style.transition = 'transform 0.1s ease-out';
        });
        
        heroLogo.parentElement.addEventListener('mouseleave', () => {
            heroLogo.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            heroLogo.style.transition = 'transform 0.5s ease-out';
        });
    }
    
    // Add pulse accent to hero tag
    const heroTag = document.querySelector('.hero-tag');
    if (heroTag) {
        setInterval(() => {
            heroTag.style.opacity = '0.7';
            setTimeout(() => {
                heroTag.style.opacity = '1';
            }, 500);
        }, 2000);
    }
    
    // Add interactive particles to background (simple version)
    createBackgroundParticles();
    
    function triggerSectionAnimation(section) {
        if (section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 50);
        }
    }
    
    function createBackgroundParticles() {
        // Only static particles for desktop
        if (window.innerWidth < 768) return;
        
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg) return;
        
        // Create static floating particles (no animation)
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'bg-particle';
            
            const size = Math.random() * 2 + 1; // 1-3px
            const x = Math.random() * 100; // 0-100%
            const y = Math.random() * 100; // 0-100%
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.backgroundColor = 'var(--accent)';
            particle.style.borderRadius = '50%';
            particle.style.position = 'absolute';
            particle.style.opacity = '0.2';
            
            heroBg.appendChild(particle);
        }
    }
    
    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});