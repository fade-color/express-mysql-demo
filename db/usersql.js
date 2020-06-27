var UserSQL = {
    insert: 'INSERT INTO user(user_id, username, sex) VALUES(?,?,?)',
    queryAll: 'SELECT * FROM user',
    getUserById: 'SELECT * FROM user WHERE user_id = ?'
}

module.exports = UserSQL