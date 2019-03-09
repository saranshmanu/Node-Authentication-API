var express = require('express')
var promise = require('bluebird')
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
            } else if (result != null) {
                let userPassword = result['password']
                if (password == userPassword) {
                    resolve(JSON.stringify({
                        "success": true,
                        "message": "Successfull login"
                    }))
                } else {
                    reject(JSON.stringify({
                        "success": false,
                        "message": "Password doesn't match"
                    }))
                }
            } else {
                reject(JSON.stringify({
                    "success": false,
                    "message": "Error - User doesn't exists"
                }))
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
                let user = new userModel({
                    email: email,
                    password: password,
                    name: name,
                    registeredDate: today.toISOString(),
                    verifiedEmail: false,
                    banned: false,
                    passwordHistory: []
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