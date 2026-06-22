/**
 * Compass - Isolated Retell AI Orchestration Layer
 * This script decouples the voice SDK operations from the structural index.html code.
 * If anything breaks or needs to be removed, deleting this file or clearing its content
 * will safely fall back to a non-functional layout state without crashing the UI thread.
 */

window.compassApp = function() {
    return {
        isCalling: false,
        retellClient: null,
        
        init() {
            // Check if Retell library loaded safely from CDN before binding operations
            if (typeof RetellWebClient !== 'undefined') {
                try {
                    this.retellClient = new RetellWebClient();
                    
                    // Listen for call termination events to reset the mobile interface seamlessly
                    this.retellClient.on('call_ended', () => {
                        this.isCalling = false;
                    });
                    this.retellClient.on('error', (err) => {
                        console.error('Retell backend streaming error:', err);
                        this.isCalling = false;
                    });
                } catch (e) {
                    console.error('Failed to instantiate RetellWebClient:', e);
                }
            } else {
                console.warn('RetellWebClient library not detected. Running layout in presentation mode.');
            }
        },
        
        async toggleCall() {
            // Safe conditional guard to ensure interface doesn't crash if SDK is omitted
            if (!this.retellClient) {
                this.isCalling = !this.isCalling;
                if (this.isCalling) {
                    setTimeout(() => { this.isCalling = false; }, 3000);
                }
                return;
            }

            if (this.isCalling) {
                try {
                    this.retellClient.stopCall();
                } catch(e) {
                    console.error('Error stopping call:', e);
                }
                this.isCalling = false;
            } else {
                this.isCalling = true;
                try {
                    /* PRODUCTION PLUG-IN DIRECTIVE:
                      Replace 'YOUR_RETELL_SDK_API_TOKEN' with your transient call token session generated 
                      via your server endpoint. For localized demos, you can also inject your active 
                      agent registration strings directly here.
                    */
                    await this.retellClient.startCall({
                        accessToken: 'YOUR_RETELL_SDK_API_TOKEN',
                        sampleRate: 48000
                    });
                } catch (error) {
                    console.error('Audio negotiation failed:', error);
                    this.isCalling = false;
                }
            }
        }
    };
};
