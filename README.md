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
### Step 0: Preparation  
1. Clone the project.  
2. Create a new branch and name it after yourself.  
3. Run `npm install` to install the necessary dependencies.  
4. After installation is complete, run `npm run dev`.

### Step 1: Adding General Logs
To improve observability, add Winston logs to track API calls. Each request to the API (add server, remove server, etc.) should log its details to the console using Winston's `Console` transport.
Choose the relevant log level, and **set different color to each log level** when printing the logs.

### Step 2: Logging Server Stability to a File
Enhance the system by ensuring that every time the dashboard checks the status of the servers, it logs the results to a file. Use Winston's `File` transport.
Each log entry should be stored in JSON format and must include:

-   The timestamp of when the check was performed.
    
-   The status of each server at that time.
    

This will create a historical record of server status checks, making it easier to analyze trends and diagnose issues.

### Step 3: Sending Logs to an External API

In this step, you will configure Winston to send logs to an external API.

1.  Add an  `Http` transport to Winston that will send log data to the following API endpoint:  **https://winston-workshop-2025-api.vercel.app/api/log**.
    
2.  Modify the log format to include a  `label`  containing your name. This will help distinguish your logs from others.
    
3.  Once this setup is complete, navigate to the  **[Log Viewer](https://winston-workshop-2025-api.vercel.app)**, where logs from all users are displayed. Look for your name to find and review your logs.

###  Step 4: Supporting Exception Handling  

Add support for logging **exceptions** and **promise rejections** to ensure that all critical errors are recorded.  
You can choose to log these errors to a `File` transport for persistent storage or to the `Console` for real-time monitoring.
If you want to test it, modify the `checkServerStatus` function in `/api/servers` so that it randomly throws an error from time to time.

### Step 5: Expanding Exception Handling  
Implement a Custom Transport that will send the exceptions and rejections from Step 4 to a database of your choice. 
While you can use one of the pre-built Winston transporters, it's recommended to implement your own custom transporter. For example, there isn't a pre-built transporter for Microsoft SQL, so you'll need to create one that handles sending logs to the SQL server.

### Step 6: If You Have Extra Time...  
Improve the servers stability calculation mechanism by implementing the following changes:  
- Store all logs, including those sent to the API, in the same database where the exceptions and rejections are being logged. This way, you will have a complete record of all logs in one place.  
- Create a new function that will run whenever server stability information is needed. This function should retrieve only the logs that are marked with the `info` level (excluding the `error` level of the exceptions and rejections). It will then use this information to calculate the server stability by analyzing the relevant logs stored in the database.