import mysql from 'mysql2/promise'

const dba = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password : 'xxl123456',
        database: 'ccls',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })

export async function query(sql) {
    return await dba.query(sql)
}

export async function insert(sql) {
    return await dba.execute(sql)
}