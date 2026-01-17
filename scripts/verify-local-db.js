require('dotenv').config();
const mysql = require('mysql2/promise');

const railwayUrl = 'mysql://root:uFmkZtcqVPimfZMCsTblEJojVjjpSpXq@ballast.proxy.rlwy.net:33503/railway';
console.log('Checking connection with Railway URL:', railwayUrl);

try {
    const connection = await mysql.createConnection(railwayUrl);
    console.log('✅ Connected to Railway database successfully!');

    const [rows] = await connection.query('SELECT 1 as val');
    console.log('   Query test result:', rows);

    await connection.end();
    process.exit(0);
} catch (error) {
    console.error('❌ Connection failed:', error);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    process.exit(1);
}
}

verifyLocalDatabase();
