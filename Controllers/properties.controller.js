import Properties from "../model/propertiesSchema/properties.schema.js";
import User from "../model/userSchema/user.schema.js";

export const fetchPropertiesData = async (request, response) => {
    try {
        const getAllProperties = await Properties.find()
        response.status(200).json({ message: "Properties data fetched successful", properties: getAllProperties })
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}


export const addProperty = async (request, response) => {
    const propertyData = request.body;

    try {
        const userId = request.userId;

        // Find the user first
        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).json({ message: 'User Not Found!' });
        }

        // Insert the property data
        const insertedProperty = await Properties.create(propertyData);

        response.status(200).json({ message: "Property Posted", property: insertedProperty });
    } catch (error) {
        console.error("Error adding property:", error);
        response.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export const updateProperty = async (request, response) => {
    const { id } = request.params; // Extract the id correctly
    const newPropertyData = request.body; // Extract the new data to update

    try {
        const userId = request.userId;

        // Find the user first
        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).json({ message: 'User Not Found!' });
        }

        const property = await Properties.findById({ _id: id })
        if (!property) {
            return response.status(404).json({ message: 'Property Not Found !' })
        }

        const updatedProperty = await Properties.updateOne(
            { _id: id },
            { $set: newPropertyData }
        )

        if (updatedProperty.matchedCount === 0) {
            response.status(404).json({ message: 'Property Not Found for Update!' })
        }

        const updatedPropertyDetails = await Properties.findById({ _id: id })

        response.status(200).json({ message: "Property Updated", property: updatedPropertyDetails });
    } catch (error) {
        console.error("Error updating property:", error);
        response.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export const deleteProperty = async (request, response) => {
    const { id } = request.params; // Extract the ID from request params

    try {
        const userId = request.userId;

        // Find the user first
        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).json({ message: 'User Not Found!' });
        }

        // Use findByIdAndDelete with the Properties model
        const deletedProperty = await Properties.findByIdAndDelete({_id: id});

        if (!deletedProperty) {
            return response.status(404).json({ message: "Property Not Found!" });
        }

        return response.status(200).json({ message: 'Property Deleted Successfully!' });
    } catch (error) {
        console.error("Error deleting property:", error);
        response.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};