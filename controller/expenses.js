const Expense = require('../model/expense')
const S3Service = require('../services/s3bucket.js')
const ListOfUrl = require('../model/url');

exports.addExpense = async(req, res, next)=>{
    try{
        user=req.user;
        // console.log('>>>>',user);
        const amount = req.body.expense;
        const description = req.body.description;
        const category = req.body.option;
        const data = await user.createExpense({
            expense : amount,
            description : description,
            option : category
        })
        res.status(200).json({newExpense:data})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err})
    }
}

exports.getExpense = async (req, res, next)=>{
    
    try{
        user=req.user;
        page=req.query.page||1;
        // console.log(page);

        const itemPerPage = parseInt(req.header("page")||2);
        // console.log("page>>>",itemPerPage)
        const totalExpenseList = await user.countExpenses();        
        const data = await user.getExpenses({
            offset: ((page-1)*itemPerPage),
            limit:  itemPerPage
        });
        const urlData = await ListOfUrl.findAll({where:{userId:user.id}});
        // console.log('url>>>',data1);
        res.status(200).json({allExpense:data, 
            listOfUrls: urlData,
            hasNextPage: totalExpenseList>page*itemPerPage,            
            nextPage: parseInt(page)+1,
            currentPage: parseInt(page),
            hasPreviousPage: page>1,
            previousPage: parseInt(page)-1,
            lastPage: Math.ceil(totalExpenseList/itemPerPage)
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err})
    }
}

exports.deleteExpense = async(req,res,next)=>{
    try{
        user=req.user;
        const objId = req.params.id;
        const data=await user.getExpenses()
        data[0].destroy({where:{id:objId}});
        res.sendStatus(201);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err})
    }
}

exports.updateExpense = async(req, res, next)=>{
    try{
        const editId = req.params.id;
        const amount = req.body.expense;
        const description = req.body.description;
        const category = req.body.option;
        const data = await Expense.update({
            expense : amount,
            description : description,
            option : category
        }, {where:{id:editId}})
        res.sendStatus(201)
    }
    catch(err){
        res.status(500).json({error:err})
    }
}

exports.downloadExpense = async(req, res, next)=>{
    try {
        const expenses = await req.user.getExpenses();
        const stringifiedExpense = JSON.stringify(expenses);
        const fileName = `Expense${req.user.id}/${new Date() }.txt`
        const fileURL =  await S3Service.uploadToS3(stringifiedExpense, fileName);
        // console.log(fileURL, req.user.name);
        await ListOfUrl.create({url: fileURL, userId: req.user.id})
        
        res.status(201).json({success: true, URL: fileURL });
    }
    catch(err){
        res.status(500).json({success:false, err})
    }
   
}

