const express = require('express');
const { getUsers, saveUsers } = require('../utils/userUtils');

const router = express.Router();

router.post('/update-profile', (req, res) => {
    const { email, newName, newEmail } = req.body;
    let users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found!' });
    }

    users[userIndex].name = newName || users[userIndex].name;
    users[userIndex].email = newEmail || users[userIndex].email;
    saveUsers(users);

    res.json({ message: 'Profile updated successfully!', user: users[userIndex] });
});

module.exports = router;
