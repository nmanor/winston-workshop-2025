# Server Monitor
## Winston Workshop - Dev team


A modern, real-time server monitoring dashboard built with Next.js that tracks server uptime and stability.

## Usage

### Adding a Server

1. Enter the server name and URL in the form at the top of the dashboard
2. Click "Add Server" to begin monitoring

### Monitoring

- Each server card shows:
  - Server name
  - URL
  - Stability percentage based on the last 10 status checks
  - Visual stability indicator
- Cards are color-coded based on stability:
  - Green: 90-100% uptime
  - Yellow: 75-89% uptime
  - Red: Below 75% uptime

### Auto-Refresh

The dashboard automatically updates every 10 seconds to provide real-time monitoring.

## Challenges
### Step 1: Adding General Logs
To improve observability, add Winston logs to track API calls. Each request to the API (add server, remove server, etc.) should log its details to the console using Winston's `Console` transport.
Choose the relevant log level, and **set different color to each log level** when printing the logs.

### Step 2: Logging Server Status to a File
Enhance the system by ensuring that every time the dashboard checks the status of the servers, it logs the results to a file. Use Winston's `File` transport.
Each log entry should be stored in JSON format and must include:

-   The timestamp of when the check was performed.
    
-   The status of each server at that time.
    

This will create a historical record of server status checks, making it easier to analyze trends and diagnose issues.