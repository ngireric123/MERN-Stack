const User = require('../models/Users')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//GET USERS
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users ?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

//CREATE A NEW USER
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicated username' })
    }

    //hashing the user password
    const hashPwd = await bcrypt.hash(password, 10) //salt round

    const userObject = { username, "password": hashPwd, roles }
    //create and store new user
    const user = await User.create(userObject)

    if (user) { //created
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }

})

//UPDATE A USER
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body
    //confirm data

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // check for deplicate

    const duplicate = await User.findOne({ username }).lean().exec()
    //allow update to the original user
    if (duplicate && duplicate ?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    // if we update password
    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()// update user

    res.json({ message: `${updatedUser.username} updated` })

})

// DELETE A USER
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)


})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}