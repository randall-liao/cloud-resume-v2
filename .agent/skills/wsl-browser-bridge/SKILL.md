---
name: WSL Browser Bridge
description: Setup and diagnosis for connecting Google Antigravity in WSL to Chrome on Windows (Mirrored Networking).
---

# WSL Browser Bridge

This skill provides scripts and instructions to enable seamless browser automation between a WSL2 environment (where the Antigravity agent runs) and the Windows host (where Chrome runs).

## Why is this needed?

Google Antigravity runs inside WSL, but typically needs to control a browser running on the Windows host for UI testing and verification. By default, WSL cannot easily access `localhost` on Windows due to network isolation. This skill bridges that gap using **Mirrored Networking** or port forwarding.

## Prerequisites

1.  **WSL2**: Ensure you are running WSL version 2.
2.  **Chrome**: Google Chrome installed on Windows.
3.  **PowerShell**: Access to PowerShell (Administrator recommended for initial setup).

## Installation

The scripts are located in `.agent/skills/wsl-browser-bridge/scripts/`.

1.  **Windows Side**: Copy `setup-windows.ps1` to your Windows file system (e.g., `C:\Users\YourUser\Downloads`).
2.  **WSL Side**: The `diagnose-wsl.sh` script is ready to run from within the project.

## Windows Setup (Host)

The `setup-windows.ps1` script performs the following critical tasks:
-   **Firewall**: Creates an inbound rule allowing TCP traffic on port `9222` for all profiles.
-   **Chrome Launch**: Starts Chrome with remote debugging enabled on port `9222`, listening on `localhost` (which is accessible via Mirrored Mode).
-   **Verification**: Checks if Chrome is reachable via `localhost` immediately after launch.

### Usage

Open PowerShell as **Administrator** and run:

```powershell
# Navigate to where you saved the script
cd C:\Users\YourUser\Downloads
.\setup-windows.ps1
```

*Note: If you cannot run scripts due to execution policy, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` first.*

## WSL Diagnosis & Setup (Guest)

The `diagnose-wsl.sh` script checks:
-   **Connectivity**: Can WSL reach the Windows host's Chrome instance?
-   **Mirrored Mode**: Verifies if `localhost` mapping is working correctly.
-   **Port Conflicts**: Ensures port `9222` is free for use.

### Usage

Run inside your WSL terminal from the project root:

```bash
./.agent/skills/wsl-browser-bridge/scripts/diagnose-wsl.sh
```

## Mirrored Networking (Recommended)

For the best experience, enable **Mirrored Networking** in WSL. This allows `localhost` in WSL to map directly to `localhost` in Windows.

1.  Create/Edit `.wslconfig` in your Windows User Profile (`C:\Users\<User>\.wslconfig`).
2.  Add the following content:

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

3.  Restart WSL: `wsl --shutdown` in PowerShell.

## Troubleshooting

If connection fails:
1.  **Firewall**: Run `setup-windows.ps1` as Administrator again to reset rules.
2.  **Chrome**: Ensure **ALL** Chrome instances (including background processes) were closed before launching the debug instance.
3.  **Connection Timed Out (`curl: (28) Failed to connect to localhost port 9222`)**:
    If you see this error when running `diagnose-wsl.sh`:
    *   **Cause**: The bridge is not configured properly on the Windows host, Chrome is not running with the correct flags, or WSL Mirrored Networking is not active.
    *   **Fix**: 
        1. On your Windows host, open PowerShell as **Administrator**.
        2. Run the setup script: `.\.agent\skills\wsl-browser-bridge\scripts\setup-windows.ps1`
        3. This configures the Windows firewall and launches a fresh Chrome window listening on port `9222`.
        4. Keep that Chrome window open.
        5. Re-run `./.agent/skills/wsl-browser-bridge/scripts/diagnose-wsl.sh` in WSL.
4.  **Fallback**: If Mirrored Mode is not an option, use `socat` to forward the Windows LAN IP (found via `ipconfig`) to WSL `localhost`.
    ```bash
    # Find Windows IP
    WIN_IP=$(grep -m 1 nameserver /etc/resolv.conf | awk '{print $2}')
    # Forward
    socat TCP-LISTEN:9222,fork,reuseaddr TCP:$WIN_IP:9222 &
    ```
