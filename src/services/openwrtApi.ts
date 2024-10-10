declare global {
  interface Window {
    luci: {
      rpc: {
        request: (module: string, method: string, params: any[]) => Promise<any>;
      };
    };
  }
}

const API_URL = import.meta.env.VITE_OPENWRT_API_URL || 'http://192.168.8.1/cgi-bin/luci';
const USERNAME = import.meta.env.VITE_OPENWRT_USERNAME || 'root';
const PASSWORD = import.meta.env.VITE_OPENWRT_PASSWORD || '';

class OpenWRTApi {
  private token: string | null = null;

  private async login(): Promise<void> {
    console.log('OpenWRT API: Attempting login');
    try {
      const response = await window.luci.rpc.request('auth', 'login', [USERNAME, PASSWORD]);
      this.token = response;
      console.log('OpenWRT API: Login successful');
    } catch (error) {
      console.error('OpenWRT API: Login failed:', this.getErrorMessage(error));
      throw new Error('Login failed');
    }
  }

  private async callRPC(module: string, method: string, params: any = {}): Promise<any> {
    if (!this.token) {
      await this.login();
    }

    console.log(`OpenWRT API: Calling ${module}.${method}`, params);
    try {
      const response = await window.luci.rpc.request(module, method, [this.token, ...Object.values(params)]);
      console.log(`OpenWRT API: ${module}.${method} response:`, JSON.stringify(response));
      return response;
    } catch (error) {
      console.error(`OpenWRT API: ${module}.${method} failed:`, this.getErrorMessage(error));
      throw new Error(`${module}.${method} failed`);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  async getDNSSettings(): Promise<{ servers: string[] }> {
    console.log('OpenWRT API: Fetching DNS settings');
    try {
      const result = await this.callRPC('uci', 'get_all', { config: 'network', section: 'lan' });
      const dnsServers = result.dns ? result.dns.split(' ') : [];
      console.log('OpenWRT API: DNS settings fetched:', dnsServers);
      return { servers: dnsServers };
    } catch (error) {
      console.error('OpenWRT API: Failed to fetch DNS settings:', this.getErrorMessage(error));
      throw new Error('Failed to fetch DNS settings');
    }
  }

  async setDNSSettings(servers: string[]): Promise<void> {
    console.log('OpenWRT API: Setting DNS servers:', servers);
    try {
      await this.callRPC('uci', 'set', { config: 'network', section: 'lan', values: { dns: servers.join(' ') } });
      await this.callRPC('uci', 'commit', { config: 'network' });
      await this.callRPC('sys', 'exec', { command: '/etc/init.d/network restart' });
      console.log('OpenWRT API: DNS settings updated successfully');
    } catch (error) {
      console.error('OpenWRT API: Failed to set DNS settings:', this.getErrorMessage(error));
      throw new Error('Failed to set DNS settings');
    }
  }

  async getTailscaleStatus(): Promise<boolean> {
    console.log('OpenWRT API: Fetching Tailscale status');
    try {
      const result = await this.callRPC('sys', 'exec', { command: 'pgrep tailscaled' });
      const isEnabled = result.trim() !== '';
      console.log('OpenWRT API: Tailscale status fetched:', isEnabled);
      return isEnabled;
    } catch (error) {
      console.error('OpenWRT API: Failed to fetch Tailscale status:', this.getErrorMessage(error));
      throw new Error('Failed to fetch Tailscale status');
    }
  }

  async setTailscaleStatus(enable: boolean): Promise<void> {
    console.log('OpenWRT API: Setting Tailscale status:', enable);
    try {
      const command = enable ? '/etc/init.d/tailscale start' : '/etc/init.d/tailscale stop';
      await this.callRPC('sys', 'exec', { command });
      console.log('OpenWRT API: Tailscale status updated successfully');
    } catch (error) {
      console.error('OpenWRT API: Failed to set Tailscale status:', this.getErrorMessage(error));
      throw new Error('Failed to set Tailscale status');
    }
  }

  async getWifiSettings(): Promise<{ ssid: string }> {
    console.log('OpenWRT API: Fetching Wi-Fi settings');
    try {
      const result = await this.callRPC('uci', 'get_all', { config: 'wireless' });
      const ssid = result.default_radio0?.ssid || '';
      console.log('OpenWRT API: Wi-Fi settings fetched:', { ssid });
      return { ssid };
    } catch (error) {
      console.error('OpenWRT API: Failed to fetch Wi-Fi settings:', this.getErrorMessage(error));
      throw new Error('Failed to fetch Wi-Fi settings');
    }
  }
}

export const openwrtApi = new OpenWRTApi();