document.addEventListener('DOMContentLoaded', function() {
    
    // Fetch latest release version from GitHub API
    fetchLatestReleaseVersionAndUpdateLinks();
    
    // OS Tabs
    setupTabs('.os-tab', '.os-content', 'data-os');
    
    // Method Tabs (Desktop, CLI, Script)
    setupTabs('.method-tab', '.method-content', 'data-method');
    
    // Auto-detect OS and show appropriate tab
    detectAndShowOS();
    
    /**
     * Fetch latest release version and update all download links
     */
    async function fetchLatestReleaseVersionAndUpdateLinks() {
        const GITHUB_API_URL = 'https://api.github.com/repos/prashanth-7861/WireSeal/releases/latest';
        
        try {
            const response = await fetch(GITHUB_API_URL);
            if (!response.ok) throw new Error('Failed to fetch latest release');
            
            const data = await response.json();
            const version = data.tag_name.replace('v', ''); // e.g., "0.7.23"
            
            updateSetupDownloadLinks(version);
            
            console.log(`[WireSeal Setup] Latest version: ${version}`);
        } catch (error) {
            console.error('[WireSeal Setup] Error fetching latest release:', error);
            updateSetupDownloadLinks('0.7.23');
        }
    }
    
    /**
     * Update all download links in setup.html
     * @param {string} version - Version string (e.g., "0.7.23")
     */
    function updateSetupDownloadLinks(version) {
        const baseUrl = 'https://github.com/prashanth-7861/WireSeal/releases/latest/download/';
        
        // ====== Linux ======
        // Desktop App - standalone
        const linuxDesktop = document.querySelector('#linux a[href*="WireSeal-linux"]');
        if (linuxDesktop) {
            linuxDesktop.href = `${baseUrl}WireSeal-linux-x86_64`;
        }
        
        // Desktop App - DEB
        const linuxDeb = document.querySelector('#linux a[href*=".deb"]');
        if (linuxDeb) {
            linuxDeb.href = `${baseUrl}wireseal_${version}_amd64.deb`;
        }
        
        // Desktop App - RPM
        const linuxRpm = document.querySelector('#linux a[href*=".rpm"]');
        if (linuxRpm) {
            linuxRpm.href = `${baseUrl}wireseal-${version}-1.x86_64.rpm`;
        }
        
        // CLI binary
        const linuxCli = document.querySelector('#linux a[href*="wireseal-cli-linux"]');
        if (linuxCli) {
            linuxCli.href = `${baseUrl}wireseal-cli-linux-x86_64`;
        }
        
        // Install script
        const linuxScript = document.querySelector('#linux a[href*="wireseal-linux.sh"]');
        if (linuxScript) {
            linuxScript.href = `${baseUrl}wireseal-linux.sh`;
        }
        
        // ====== macOS ======
        // Desktop App - PKG
        const macosDesktop = document.querySelector('#macos a[href*="macos"]');
        if (macosDesktop) {
            macosDesktop.href = `${baseUrl}wireseal-${version}-macos-arm64.pkg`;
        }
        
        // CLI binary
        const macosCli = document.querySelector('#macos a[href*="wireseal-cli-macos"]');
        if (macosCli) {
            macosCli.href = `${baseUrl}wireseal-cli-macos-arm64`;
        }
        
        // Install script
        const macosScript = document.querySelector('#macos a[href*="wireseal-macos.sh"]');
        if (macosScript) {
            macosScript.href = `${baseUrl}wireseal-macos.sh`;
        }
        
        // ====== Windows ======
        // Desktop App - setup.exe
        const winDesktop = document.querySelector('#windows a[href*="windows-x86_64-setup"]');
        if (winDesktop) {
            winDesktop.href = `${baseUrl}wireseal-${version}-windows-x86_64-setup.exe`;
        }
        
        // Desktop App - ZIP
        const winZip = document.querySelector('#windows a[href*="windows-x86_64.zip"]');
        if (winZip) {
            winZip.href = `${baseUrl}wireseal-${version}-windows-x86_64.zip`;
        }
        
        // CLI binary
        const winCli = document.querySelector('#windows a[href*="wireseal-cli-windows"]');
        if (winCli) {
            winCli.href = `${baseUrl}wireseal-cli-windows-x86_64.exe`;
        }
        
        // Install script
        const winScript = document.querySelector('#windows a[href*="wireseal-windows.ps1"]');
        if (winScript) {
            winScript.href = `${baseUrl}wireseal-windows.ps1`;
        }
    }
    
    function setupTabs(tabButtonSelector, contentSelector, dataAttribute) {
        const buttons = document.querySelectorAll(tabButtonSelector);
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const target = this.getAttribute(dataAttribute);
                
                // Update active button
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update content
                const contents = document.querySelectorAll(contentSelector);
                contents.forEach(content => {
                    if (content.id === target) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }
    
    function detectAndShowOS() {
        const userAgent = navigator.userAgent.toLowerCase();
        const osTabs = document.querySelectorAll('.os-tab');
        const osContents = document.querySelectorAll('.os-content');
        
        let detectedOS = 'linux';
        
        if (userAgent.indexOf('win') > -1) {
            detectedOS = 'windows';
        } else if (userAgent.indexOf('mac') > -1) {
            detectedOS = 'macos';
        } else if (userAgent.indexOf('linux') > -1 || userAgent.indexOf('android') > -1) {
            detectedOS = 'linux';
        }
        
        osTabs.forEach(tab => tab.classList.remove('active'));
        osContents.forEach(content => content.classList.remove('active'));
        
        const activeTab = document.querySelector('.os-tab[data-os="' + detectedOS + '"]');
        const activeContent = document.getElementById(detectedOS);
        
        if (activeTab) activeTab.classList.add('active');
        if (activeContent) activeContent.classList.add('active');
    }
    
    // Copy code buttons
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('.code-block');
        
        codeBlocks.forEach(block => {
            const code = block.querySelector('code');
            if (!code) return;
            
            if (block.querySelector('.copy-btn')) return;
            
            block.style.position = 'relative';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
            copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
            
            block.addEventListener('mouseenter', function() {
                copyBtn.style.opacity = '1';
            });
            block.addEventListener('mouseleave', function() {
                copyBtn.style.opacity = '0';
            });
            
            copyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const text = code.textContent;
                
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(function() {
                        showCopiedSuccess(copyBtn);
                    }).catch(function() {
                        fallbackCopy(text);
                    });
                } else {
                    fallbackCopy(text);
                }
            });
            
            function showCopiedSuccess(btn) {
                btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
                btn.classList.add('copied');
                
                setTimeout(function() {
                    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
                    btn.classList.remove('copied');
                }, 2000);
            }
            
            function fallbackCopy(text) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    document.execCommand('copy');
                    showCopiedSuccess(copyBtn);
                } catch (err) {
                    console.error('Copy failed:', err);
                }
                
                document.body.removeChild(textarea);
            }
            
            block.appendChild(copyBtn);
        });
    }
    
    addCopyButtons();
    
    // Keyboard accessibility
    document.querySelectorAll('.os-tab, .method-tab').forEach(function(tab) {
        tab.setAttribute('tabindex', '0');
        tab.setAttribute('role', 'button');
        
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
        });
    });
});