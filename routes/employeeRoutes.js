import express from 'express';

const router = express.Router();

router.get('/employee-login',(req,res)=>{
    const sql = `SELECT * FROM employee WHERE email = ? and password = ?`;
    con.query(sql,[req.body.email,req.body.password],(error,result)=>{
        if(error){
            return res.status(500).send({
                success:false,
                errorMessage:'could not login emp'
            })
        }
            if (result.length>0) {
                console.log('result is',result)                
            } else {
                return res.status(400).send({
                    success:false,
                    errorMessage:'could not login emp'
                })
            }
    })
})

export {router as employeeRouter};