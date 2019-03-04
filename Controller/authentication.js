function login(req, res) {
    res.send('login')
}

function register(req, res) {
    res.send('register')
}

function confirmEmail(req, res) {
    res.send('confirmEmail')
}

function resetPassword(req, res) {
    res.send('resetPassword')
}

function changePassword(req, res) {
    res.send('changePassword')
}

function deleteAccount(req, res) {
    res.send('deleteAccount')
}

module.exports = {
    login: login,
    register: register,
    resetPassword: resetPassword,
    changePassword: changePassword,
    deleteAccount: deleteAccount,
    confirmEmail: confirmEmail
}