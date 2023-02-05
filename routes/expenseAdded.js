const express = require('express');
const router = express.Router();
const getexpenseController = require('../controller/expenses');
const userAuthenticate = require('../middleware/setUser')

router.get('/getexpense',userAuthenticate.authenticate, getexpenseController.getExpense);
router.post('/addexpense',userAuthenticate.authenticate, getexpenseController.addExpense);
router.delete('/delete/:id', userAuthenticate.authenticate,getexpenseController.deleteExpense);
router.put('/edit/:id',getexpenseController.updateExpense)
router.get('/download', userAuthenticate.authenticate,getexpenseController.downloadExpense);

module.exports = router