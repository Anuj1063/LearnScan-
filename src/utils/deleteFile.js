const path=require('path')
const fs=require('fs')


const deleteFile=(folderName,fileName)=>{

    if(!fileName)return 
    

    const filePath= path.join(__dirname,'..',folderName,fileName)

    fs.unlink(filePath,(err)=>{
        if(err){
            console.log(`Failed to Delete (${fileName}) :`,err);
            
        }else{
            console.log(`file ${fileName} Deleted Sucessfully`)
        }
    })

}
module.exports=deleteFile;