export class LoadingScreen {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'loading-screen';
        this.container.className = 'loading-screen-container';

        this.container.innerHTML = `
            <div class="loading-content">
                <div class="logo-container">
                    <img src="/assets/logo.svg" alt="Life" class="loading-logo" onerror="this.src='https://via.placeholder.com/400x150?text=LIFE';">
                    <div class="logo-glow"></div>
                </div>
                
                <div class="loader-wrapper">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" id="loading-progress-bar"></div>
                        <div class="progress-bar-glow"></div>
                    </div>
                    
                    <div class="loading-info">
                        <span id="loading-status">INITIALIZING SYSTEMS...</span>
                        <span id="loading-percentage">0%</span>
                    </div>
                </div>
                
                <div id="loading-errors" class="loading-errors hidden">
                    <div class="error-header">
                        <span class="error-icon">⚠️</span>
                        <span class="error-title">SYSTEM ANOMALY DETECTED</span>
                    </div>
                    <div id="error-list" class="error-list"></div>
                </div>
                
                <div class="loading-footer">
                    <div class="system-logs" id="system-logs">
                        <div class="log-entry">> Initializing Engine...</div>
                        <div class="log-entry">> Connecting to Neural Network...</div>
                    </div>
                    <div class="version-tag">VER 0.1.0-ALFA</div>
                </div>
            </div>
            <div class="loading-background">
                <div class="grid-overlay"></div>
                <div class="vignette"></div>
            </div>
        `;

        document.body.appendChild(this.container);

        this.progressBar = document.getElementById('loading-progress-bar');
        this.percentageText = document.getElementById('loading-percentage');
        this.statusText = document.getElementById('loading-status');
        this.errorContainer = document.getElementById('loading-errors');
        this.errorList = document.getElementById('error-list');
        this.logsContainer = document.getElementById('system-logs');

        this.isComplete = false;
    }

    updateProgress(percentage, url) {
        if (this.isComplete) return;

        const p = Math.floor(percentage);
        this.progressBar.style.width = `${p}%`;
        this.percentageText.innerText = `${p}%`;

        if (url) {
            const fileName = url.split('/').pop();
            this.statusText.innerText = `LOADING: ${fileName.toUpperCase()}`;
            this.addLog(`> Loaded asset: ${fileName}`);
        }
    }

    addLog(message) {
        const log = document.createElement('div');
        log.className = 'log-entry';
        log.innerText = message;
        this.logsContainer.appendChild(log);
        this.logsContainer.scrollTop = this.logsContainer.scrollHeight;

        // Keep only last 5 logs
        while (this.logsContainer.children.length > 5) {
            this.logsContainer.removeChild(this.logsContainer.firstChild);
        }
    }

    reportError(url) {
        this.errorContainer.classList.remove('hidden');
        const errorItem = document.createElement('div');
        errorItem.className = 'error-item';
        errorItem.innerText = `[CRITICAL] Failed to load: ${url}`;
        this.errorList.appendChild(errorItem);
        this.addLog(`> ERROR: Failed to load ${url}`);
    }

    complete(onDone) {
        this.isComplete = true;
        this.statusText.innerText = 'SYSTEM READY';
        this.progressBar.style.width = '100%';
        this.percentageText.innerText = '100%';
        this.addLog('> All systems operational.');
        this.addLog('> Launching Experience...');

        setTimeout(() => {
            this.container.classList.add('fade-out');
            setTimeout(() => {
                this.container.remove();
                if (onDone) onDone();
            }, 1000);
        }, 1500);
    }
}
