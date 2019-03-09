var Promise = require('bluebird')
var crypto = require('crypto')
var userModel = require('../Models/user')

function testRoute(req, res) {
    console.log(req.body)
    console.log(req.headers)
    console.log(req.connection.remoteAddress)
    res.send(JSON.stringify(req.body))
}

function login(email, password) {
    return new Promise((resolve, reject) => {
        userModel.findOne({ 
            email: email 
        }, (error, result) => {
            if (error) {
                reject(JSON.stringify({
                    "success": false,
                    "message": "Error in querying the database"
                }))
            } else if (result == null) {
                reject(JSON.stringify({
                    "success": false,
                    "message": "Error - User doesn't exists"
                }))
            } else {
                let emailConfirmation = result['verifiedEmail']
                let userBanned = result['banned']
                let userPasswordHash = result['password']
                let givenPasswordHash = crypto.createHash('sha256').update(password).digest('base64')
                if (emailConfirmation == false) {
                    reject(JSON.stringify({
                        "success": false,
                        "message": "Error - Email not yet confirmed"
                    }))
                } else if (userBanned == true) {
                    reject(JSON.stringify({
                        "success": false,
                        "message": "Error - User is banned from using the service"
                    }))
                } else if (givenPasswordHash != userPasswordHash) {
                    reject(JSON.stringify({
                        "success": false,
                        "message": "Error - Password doesn't match"
                    }))
                } else {
                    resolve(JSON.stringify({
                        "success": true,
                        "message": "Successfull login"
                    }))
                }
            }
        })
    })
}

function register(email, password, name) {
    return new Promise((resolve, reject) => {
        userModel.findOne({ 
            email: email 
        }, (error, result) => {
            if (error) {
                reject(JSON.stringify({
                    "success": false,
                    "message": "Error in querying the database"
                }))
            } else if (result != null) {
                reject(JSON.stringify({
                    "success": false,
                    "message": "Error - User already exists"
                }))
            } else {
                let today = new Date();
                let passwordHash = crypto.createHash('sha256').update(password).digest('base64')
                let user = new userModel({
                    email: email,
                    password: passwordHash,
                    name: name,
                    registeredDate: today.toISOString(),
                    verifiedEmail: false,
                    banned: false,
                    passwordHistory: [passwordHash]
                })
                user.save(function (error) {
                    if (error) {
                        reject(JSON.stringify({
                            "success": false,
                            "message": "Error in querying the database"
                        }))
                    } else {
                        resolve(JSON.stringify({
                            "success": true,
                            "message": "User created successfully"
                        }))
                    }
                })
            }
        })
    })
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
    confirmEmail: confirmEmail,
    testRoute: testRoute
}