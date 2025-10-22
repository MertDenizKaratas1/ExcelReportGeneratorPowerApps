/**
 * Environment detection and configuration service
 * Determines if the app is running in Power Apps or local development
 */
export class EnvironmentService {
  private static _isInitialized = false;
  private static _isPowerApps = false;
  private static _isDevelopment = false;

  /**
   * Initialize the environment detection
   */
  static initialize(): void {
    if (this._isInitialized) return;

    // Check if we're in Power Apps environment
    this._isPowerApps = this.detectPowerAppsEnvironment();
    
    // Check if we're in development mode
    this._isDevelopment = process.env.NODE_ENV === 'development';

    this._isInitialized = true;

    console.log('Environment detected:', {
      isPowerApps: this._isPowerApps,
      isDevelopment: this._isDevelopment,
      hasXrm: typeof (window as any).Xrm !== 'undefined',
      hasParent: window.parent !== window,
      hostname: window.location.hostname
    });
  }

  /**
   * Check if we're running inside Power Apps/Dynamics 365
   */
  static isPowerApps(): boolean {
    if (!this._isInitialized) this.initialize();
    return this._isPowerApps;
  }

  /**
   * Check if we're in development mode
   */
  static isDevelopment(): boolean {
    if (!this._isInitialized) this.initialize();
    return this._isDevelopment;
  }

  /**
   * Check if we're in local development mode (not Power Apps)
   */
  static isLocalDevelopment(): boolean {
    return this.isDevelopment() && !this.isPowerApps();
  }

  /**
   * Get the current environment type as a string
   */
  static getEnvironmentType(): 'power-apps' | 'local-dev' | 'production' {
    if (this.isPowerApps()) return 'power-apps';
    if (this.isDevelopment()) return 'local-dev';
    return 'production';
  }

  /**
   * Detect if we're running inside Power Apps
   */
  private static detectPowerAppsEnvironment(): boolean {
    // Check for Xrm global object
    if (typeof (window as any).Xrm !== 'undefined') {
      return true;
    }

    // Check if we're in an iframe (common for Power Apps web resources)
    if (window.parent !== window) {
      // Additional checks for Power Apps specific context
      try {
        // Check for Power Apps specific hostnames or domains
        const hostname = window.location.hostname;
        if (hostname.includes('dynamics.com') || 
            hostname.includes('crm.dynamics.com') ||
            hostname.includes('powerapps.com') ||
            hostname.includes('.crm')) {
          return true;
        }

        // Check parent window for Xrm
        if (typeof (window.parent as any).Xrm !== 'undefined') {
          return true;
        }
      } catch (error) {
        // Cross-origin restrictions - likely in iframe
        console.log('Cross-origin detection - assuming Power Apps environment');
        return true;
      }
    }

    // Check URL parameters that might indicate Power Apps
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('data') || urlParams.has('entityId') || urlParams.has('orgname')) {
      return true;
    }

    return false;
  }

  /**
   * Get Xrm object if available
   */
  static getXrm(): any {
    if (typeof (window as any).Xrm !== 'undefined') {
      return (window as any).Xrm;
    }
    
    // Try to get from parent window
    try {
      if (window.parent && typeof (window.parent as any).Xrm !== 'undefined') {
        return (window.parent as any).Xrm;
      }
    } catch (error) {
      // Cross-origin restrictions
    }

    return null;
  }

  /**
   * Get current user context from Power Apps
   */
  static getCurrentUser(): any {
    const xrm = this.getXrm();
    if (xrm && xrm.Utility && xrm.Utility.getGlobalContext) {
      try {
        const context = xrm.Utility.getGlobalContext();
        return {
          userId: context.getUserId(),
          userName: context.getUserName(),
          orgId: context.getOrgId(),
          orgName: context.getOrgUniqueName(),
          lcid: context.getUserLcid()
        };
      } catch (error) {
        console.error('Error getting user context:', error);
      }
    }
    return null;
  }

  /**
   * Get organization context from Power Apps
   */
  static getOrganizationContext(): any {
    const xrm = this.getXrm();
    if (xrm && xrm.Utility && xrm.Utility.getGlobalContext) {
      try {
        const context = xrm.Utility.getGlobalContext();
        return {
          orgId: context.getOrgId(),
          orgName: context.getOrgUniqueName(),
          orgDisplayName: context.getOrgDisplayName(),
          version: context.getVersion(),
          lcid: context.getOrgLcid()
        };
      } catch (error) {
        console.error('Error getting organization context:', error);
      }
    }
    return null;
  }

  /**
   * Check if we can make Web API calls
   */
  static canMakeWebApiCalls(): boolean {
    const xrm = this.getXrm();
    return !!(xrm && xrm.WebApi);
  }

  /**
   * Get the Web API base URL
   */
  static getWebApiUrl(): string | null {
    const xrm = this.getXrm();
    if (xrm && xrm.Utility && xrm.Utility.getGlobalContext) {
      try {
        const context = xrm.Utility.getGlobalContext();
        return context.getClientUrl() + '/api/data/v9.0/';
      } catch (error) {
        console.error('Error getting Web API URL:', error);
      }
    }
    return null;
  }
}