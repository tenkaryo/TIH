// Deployment health check script
const https = require('https');

const PRODUCTION_URL = 'https://tih-sigma.vercel.app';
const API_TOKEN = 'onthisday-secure-token-2024';

async function checkEndpoint(path, description) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'tih-sigma.vercel.app',
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'User-Agent': 'OnThisDay-HealthCheck/1.0'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const status = res.statusCode === 200 ? '✅' : '❌';
                console.log(`${status} ${description}: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        if (path.includes('history') && json.data) {
                            console.log(`   📊 Events: ${json.total?.events || 0}, Birthdays: ${json.total?.birthdays || 0}, Deaths: ${json.total?.deaths || 0}`);
                        }
                    } catch (e) {
                        // Not JSON, that's fine
                    }
                }
                resolve(res.statusCode === 200);
            });
        });

        req.on('error', (error) => {
            console.log(`❌ ${description}: ERROR - ${error.message}`);
            resolve(false);
        });

        req.setTimeout(10000, () => {
            console.log(`❌ ${description}: TIMEOUT`);
            req.abort();
            resolve(false);
        });

        req.end();
    });
}

async function runHealthCheck() {
    console.log('🚀 OnThisDay Deployment Health Check');
    console.log('=====================================');
    
    const checks = [
        ['/api/health', 'API Health Check'],
        ['/api/history/08-20', 'Historical Data (08-20)'],
        ['/api/history/01-01', 'Historical Data (01-01)'],
        ['/', 'Main Website']
    ];

    let allPassed = true;
    
    for (const [path, description] of checks) {
        const success = await checkEndpoint(path, description);
        if (!success) allPassed = false;
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait between requests
    }
    
    console.log('=====================================');
    if (allPassed) {
        console.log('🎉 All checks passed! Deployment is healthy.');
    } else {
        console.log('⚠️  Some checks failed. Please review the deployment.');
    }
    
    console.log(`🌐 Visit: ${PRODUCTION_URL}`);
}

runHealthCheck();