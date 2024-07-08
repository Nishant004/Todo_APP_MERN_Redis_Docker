const mongoose =require("mongoose")

const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },

    tags:{
        type:[String],
        default:[],
    },
    isPinned:{
        type:Boolean,
        default:false,
    },
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}
,
{timestamps:true});

module.exports = mongoose.model('todo',todoSchema);




