// ============================================
// Custom Logger Middleware
// ============================================
// Demonstrates the request lifecycle for academic purposes
// Logs: method, URL, status code, response time

export const loggerMiddleware = (req, res, next) => {
    // Record start time
    const startTime = Date.now();

    // Log incoming request
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    console.log(`\n📨 [${timestamp}] ${req.method} ${req.originalUrl}`);
    console.log(`   ├── IP: ${req.ip}`);
    console.log(`   ├── User-Agent: ${req.get('User-Agent')?.substring(0, 60) || 'N/A'}`);

    if (req.body && Object.keys(req.body).length > 0) {
        // Log body but mask sensitive fields
        const safeBody = { ...req.body };
        if (safeBody.password) safeBody.password = '***HIDDEN***';
        console.log(`   ├── Body: ${JSON.stringify(safeBody).substring(0, 200)}`);
    }

    // Override res.end to capture response info
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
        const duration = Date.now() - startTime;
        const statusIcon = res.statusCode < 400 ? '✅' : '❌';
        console.log(`   └── ${statusIcon} Response: ${res.statusCode} (${duration}ms)`);

        // Call original end
        originalEnd.call(this, chunk, encoding);
    };

    next();
};
