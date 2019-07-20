import mysql from 'mysql2/promise'

const dba = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password : '87654321',
        database: 'ccls',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })

export async function query(sql,param) {
    return await dba.query(sql,param)
}

export async function insert(sql,param) {
    return await dba.execute(sql,param)
}

export async function update(sql,param) {
    return await dba.query(sql,param)
}
