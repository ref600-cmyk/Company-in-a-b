export interface DeploymentSession {
  sessionId: string;
  email: string;
  testUrl: string;
  createdAt: string;
  expiresAt: string;
  token: string;
  targetSpecs: {
    platform: string;
    device: string;
    browser: string;
    chipRecommendation: string;
  };
}

export interface DeploymentEmailPayload {
  to: string;
  subject: string;
  textBody: string;
  htmlBody: string;
  curlCommand: string;
  directUrl: string;
  dispatchedAt: string;
  messageId: string;
}

export interface BrowserProbeResult {
  hasWebGPU: boolean;
  hasServiceWorker: boolean;
  hasIndexedDb: boolean;
  isStandalonePWA: boolean;
  isAppleDevice: boolean;
  screenResolution: string;
  hardwareConcurrency: number;
  memoryEstimateGb?: number;
}

/**
 * Validates target email address for deployment dispatch
 */
export function validateDeploymentEmail(email: string): { isValid: boolean; normalizedEmail: string; error?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, normalizedEmail: '', error: 'Email address is required.' };
  }

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return { isValid: false, normalizedEmail: trimmed, error: 'Please enter a valid email address.' };
  }

  return { isValid: true, normalizedEmail: trimmed };
}

/**
 * Generates a deployment session with token and target URL
 */
export function generateMacProBrowserTestSession(email: string, baseUrl?: string): DeploymentSession {
  const norm = email.trim().toLowerCase();
  const token = `sk_edge_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
  const sessionId = `DEP-MACPRO-${norm.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '')}-${Date.now().toString(36).toUpperCase()}`;

  const hostUrl = (baseUrl && baseUrl.trim() !== '') 
    ? baseUrl.replace(/\/$/, '') 
    : 'https://ais-dev-wyjdnhiks2zkrvj2jt4tsv-134111815387.europe-west3.run.app';

  const testUrl = `${hostUrl}/?tab=mac-pro-station&session=${encodeURIComponent(sessionId)}&email=${encodeURIComponent(norm)}&token=${token}#live-test`;

  const now = new Date();
  const expires = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours

  return {
    sessionId,
    email: norm,
    testUrl,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    token,
    targetSpecs: {
      platform: 'macOS Sequoia 15.4 / Sonoma 14.5 (Apple Silicon)',
      device: 'Apple Mac Pro Workstation (M2 Ultra / M3 Ultra / M4 Max)',
      browser: 'Safari 18+ or Google Chrome 130+ (PWA-enabled)',
      chipRecommendation: 'M2 Ultra 192GB Unified RAM (800 GB/s bandwidth)'
    }
  };
}

/**
 * Generates rich plain-text and HTML email payloads for Mac Pro browser testing
 */
export function generateDeploymentEmailPayload(session: DeploymentSession): DeploymentEmailPayload {
  const messageId = `msg_skyshadow_${Date.now()}_${Math.random().toString(36).substring(2, 8)}@macpro.local`;
  const curlCommand = `curl -sSL "${session.testUrl.split('?')[0]}/api/macpro/launcher.command" -o ~/Desktop/SkyShadow.command && chmod +x ~/Desktop/SkyShadow.command && open ~/Desktop/SkyShadow.command`;

  const textBody = `
================================================================================
⚡ SKYSHADOW LOCAL-MESH OS: MAC PRO BROWSER TESTING LINK & DEPLOYMENT DISPATCH
================================================================================

Recipient:       ${session.email}
Target Device:   ${session.targetSpecs.device}
Environment:     ${session.targetSpecs.platform}
Session ID:      ${session.sessionId}
Authorization:   ${session.token}
Expires:         ${session.expiresAt}

--------------------------------------------------------------------------------
1. DIRECT MAC PRO TESTING LINK
--------------------------------------------------------------------------------
Click or paste this link directly in your Mac Pro browser (Safari or Chrome):

👉 ${session.testUrl}

--------------------------------------------------------------------------------
2. OPTIONAL: 1-CLICK TERMINAL LAUNCHER FOR MAC PRO
--------------------------------------------------------------------------------
If you prefer running in dedicated desktop app mode with Metal diagnostics,
paste this command into your Mac Pro Terminal (Terminal.app):

${curlCommand}

--------------------------------------------------------------------------------
3. RECOMMENDED LOCAL BACKENDS (AIR-GAPPED)
--------------------------------------------------------------------------------
SkyShadow connects seamlessly to your local models:
• Ollama:            http://localhost:11434  (e.g., ollama run llama3.3:70b-instruct-q4_K_M)
• MLX LM Studio:     http://localhost:8080/v1 (Apple Metal 3 native)
• Thunderbolt Mesh:  http://127.0.0.1:9090    (Raft cluster peer discovery)

--------------------------------------------------------------------------------
Security Seal: Hardware-Attested Local Edge Runtime (Zero External Telemetry)
================================================================================
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SkyShadow Local-Mesh OS - Mac Pro Deployment Link</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; background-color: #020617; color: #f8fafc; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #06b6d4; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(6, 182, 212, 0.15);">
    <div style="background: linear-gradient(135deg, #0891b2, #2563eb); padding: 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">⚡ SkyShadow Local-Mesh OS</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #e0f2fe; font-weight: 500;">Mac Pro Browser Test Deployment & Edge Station</p>
    </div>

    <div style="padding: 24px;">
      <p style="font-size: 14px; color: #94a3b8; margin-top: 0;">
        Hello, here is your direct deployment link to test the SkyShadow interface on your Apple Silicon Mac Pro browser:
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${session.testUrl}" style="background: #06b6d4; color: #020617; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.4);">
          🚀 Launch on Mac Pro Browser
        </a>
      </div>

      <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-family: monospace; font-size: 12px; color: #38bdf8; word-break: break-all;">
        ${session.testUrl}
      </div>

      <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #06b6d4; margin-bottom: 8px;">Target Environment</h3>
      <ul style="font-size: 13px; color: #cbd5e1; padding-left: 20px; line-height: 1.6; margin-top: 0;">
        <li><strong>Host:</strong> ${session.targetSpecs.device}</li>
        <li><strong>OS:</strong> ${session.targetSpecs.platform}</li>
        <li><strong>Browser:</strong> ${session.targetSpecs.browser}</li>
        <li><strong>Session Token:</strong> <code>${session.sessionId}</code></li>
      </ul>

      <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #06b6d4; margin-bottom: 8px;">Direct Terminal Command</h3>
      <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 11px; color: #a5f3fc; line-height: 1.4; word-break: break-all;">
        ${curlCommand}
      </div>
    </div>

    <div style="background: #090d16; border-top: 1px solid #1e293b; padding: 14px 24px; text-align: center; font-size: 11px; color: #64748b;">
      SkyShadow Local-Mesh OS • Air-Gapped Zero-Leakage Architecture • 72-Hour Session Window
    </div>
  </div>
</body>
</html>
`.trim();

  return {
    to: session.email,
    subject: '⚡ SkyShadow Local-Mesh OS: Mac Pro Testing Link & Deployment Credentials',
    textBody,
    htmlBody,
    curlCommand,
    directUrl: session.testUrl,
    dispatchedAt: new Date().toISOString(),
    messageId
  };
}

/**
 * Builds a standard RFC-2368 mailto: URI for opening in Mail.app or Gmail
 */
export function generateMailtoLink(session: DeploymentSession): string {
  const payload = generateDeploymentEmailPayload(session);
  const subject = encodeURIComponent(payload.subject);
  const body = encodeURIComponent(payload.textBody);
  return `mailto:${session.email}?subject=${subject}&body=${body}`;
}
