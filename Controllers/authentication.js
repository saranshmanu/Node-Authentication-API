var Promise = require('bluebird')
var Crypto = require('crypto')
var UserModel = require('../Models/user')
var Configuration = require('../Constants/configuration')
var Utils = require('./utils')
var jwt = require('jsonwebtoken')

function testRoute(req, res) {
    console.log(req.body)
    console.log(req.headers)
    console.log(req.connection.remoteAddress)
    res.send(JSON.stringify(req.body))
}

function errorMessage(success, message) {
    return JSON.stringify({
        "success": success,
        "message": message
    })
}

function checkForUserByEmail(email) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ 
            email: email 
        }, (error, result) => {
            if (error) {
                reject(errorMessage(false, "Error in querying the database"))
            } else if (result == null) {
                reject(errorMessage(false, "Error - User doesn't exists"))
            } else {
                resolve(result)
            }
        })
    })
}

function login(email, password) {
    return new Promise((resolve, reject) => {
        checkForUserByEmail(email).then(result => {
            let emailConfirmation = result['verifiedEmail']
            let userBanned = result['banned']
            let userPasswordHash = result['password']
            let givenPasswordHash = Crypto.createHash('sha256').update(password).digest('base64')
            if (emailConfirmation == false) {
                reject(errorMessage(false, "Error - Email not yet confirmed"))
            } else if (userBanned == true) {
                reject(errorMessage(false, "Error - User is banned from using the service"))
            } else if (givenPasswordHash != userPasswordHash) {
                reject(errorMessage(false, "Error - Password doesn't match"))
            } else {
                resolve(JSON.stringify({
                    "success": true,
                    "message": "Successfull login"
                }))
            }
        }).catch(err => reject(err))
    })
}

function register(email, password, name) {
    return new Promise((resolve, reject) => {
        checkForUserByEmail(email).then(() => {
            reject(errorMessage(false, "User already registered before"))
        }).catch(() => {
            let today = new Date();
            let passwordHash = Crypto.createHash('sha256').update(password).digest('base64')
            let user = new UserModel({
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
                    reject(errorMessage(false, "Error in querying the database"))
                } else {
                    resolve(JSON.stringify({
                        "success": true,
                        "message": "User created successfully"
                    }))
                }
            })
        })
    })
}

function changePassword(email, currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
        checkForUserByEmail(email).then(result => {
            let passwordHash = Crypto.createHash('sha256').update(currentPassword).digest('base64')
            let newPasswordHash = Crypto.createHash('sha256').update(newPassword).digest('base64')
            if(passwordHash != result['password']) {
                reject(errorMessage(false, "Error - Password doesn't match"))
            } else if(passwordHash == newPasswordHash) {
                reject(errorMessage(false, "Error - Password similar to the new password"))
            } else {
                UserModel.updateOne({
                    email: email
                }, {password: newPasswordHash, $push: { passwordHistory: newPasswordHash }}, {upsert:true}, function (error) {
                    if (error) {
                        reject(errorMessage(false, "Error in querying the database"))
                    } else {
                        resolve(JSON.stringify({
                            "success": true,
                            "message": "Password updated successfully"
                        }))
                    }
                })
            }
        }).catch(err => reject(err))
    })
}

function deleteAccount(email, password) {
    return new Promise((resolve, reject) => {
        checkForUserByEmail(email).then(result => {
            let passwordHash = Crypto.createHash('sha256').update(password).digest('base64')
            if(passwordHash != result['password']) {
                reject(errorMessage(false, "Error - Password doesn't match"))
            } else {
                UserModel.deleteOne({
                    email: email
                }, function (error) {
                    if (error) {
                        reject(errorMessage(false, "Error in querying the database"))
                    } else {
                        resolve(JSON.stringify({
                            "success": true,
                            "message": "User data successfully deleted"
                        }))
                    }
                })
            }
        }).catch(err => reject(err))
    })
}

function sendConfirmEmail(confirmEmail) {
    return new Promise((resolve, reject) => {
        checkForUserByEmail(email).then(result => {
            var token = jwt.sign({
                email: confirmEmail
            }, Configuration.JWT_SECRET, { expiresIn: 60 * 60 });
            var confirmationLink = '<a href = "localhost:8888/user/auth/confirmEmail/' + token + '">Confirm</a>'
            Utils.sendEmail(confirmEmail, "Confirm to access your account", "Confirmation Link", confirmationLink)
            resolve(JSON.stringify({
                "success": true,
                "message": "Confirm mail sent to the user"
            }))
        }).catch(err => reject(err))
    })
}

function confirmEmail(token) {
    jwt.verify(token, Configuration.JWT_SECRET, function(err, decoded) {
        if(err) {
            reject(errorMessage(false, "Email not confirmed"))
        } else {
            let email = decoded['email']
            UserModel.updateOne({
                email: email
            }, {verifiedEmail: true}, function (error) {
                if (error) {
                    reject(errorMessage(false, "Error in querying the database"))
                } else {
                    Utils.sendEmail(email, "Welcome Sir", "Hello, World!", "")
                    resolve(JSON.stringify({
                        "success": true,
                        "message": "Email successfully confirmed"
                    }))
                }
            })
        }
    });
}

function forgetPassword(email) {
    res.send('forgetPassword')
}

function forgetPasswordMail(req, res) {
    res.send('forgetPassword')
}

module.exports = {
    login: login,
    register: register,
    forgetPassword: forgetPassword,
    forgetPasswordMail: forgetPasswordMail,
    changePassword: changePassword,
    deleteAccount: deleteAccount,
    sendConfirmEmail: sendConfirmEmail,
    confirmEmail: confirmEmail,
    testRoute: testRoute
}