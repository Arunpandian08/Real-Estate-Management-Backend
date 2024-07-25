import mongoose from "mongoose";

const propertiesSchema = new mongoose.Schema({
    property_type: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['sold', 'available'],
        default: 'available',
    },
    description: {
        type: String,
        required: true,
    }
})

const Properties = mongoose.model('Properties',propertiesSchema)
export default Properties; 