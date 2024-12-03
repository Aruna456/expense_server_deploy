const model = require('../model/model');
const { Transaction } = require('../model/model'); 

// POST: http://localhost:8080/api/categories
async function create_Categories(req, res) {
    try {
        const newCategory = new model.Categories({
            type: "Investment",
            color: "#FCBE44",
        });

        const savedCategory = await newCategory.save();
        return res.json(savedCategory);
    } catch (error) {
        return res.status(400).json({ message: `Error while creating categories: ${error.message}` });
    }
}

// GET: http://localhost:8080/api/categories
async function get_Categories(req, res) {
    try {
        const data = await model.Categories.find({});
        const filter = data.map(v => ({ type: v.type, color: v.color }));
        return res.json(filter);
    } catch (error) {
        return res.status(400).json({ message: `Error while fetching categories: ${error.message}` });
    }
}

// POST: http://localhost:8080/api/transaction
async function create_Transaction(req, res) {
    try {
        if (!req.body) return res.status(400).json("Post HTTP Data not Provided");

        const { name, type, amount } = req.body;
        const newTransaction = new model.Transaction({
            name,
            type,
            amount,
            date: new Date(),
        });

        const savedTransaction = await newTransaction.save();
        return res.json(savedTransaction);
    } catch (error) {
        return res.status(400).json({ message: `Error while creating transaction: ${error.message}` });
    }
}

// GET: http://localhost:8080/api/transaction
async function get_Transaction(req, res) {
    try {
        const data = await model.Transaction.find({});
        return res.json(data);
    } catch (error) {
        return res.status(400).json({ message: `Error while fetching transactions: ${error.message}` });
    }
}

// DELETE: http://localhost:8080/api/transaction
async function delete_Transaction(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "Request body not Found" });

        await model.Transaction.deleteOne(req.body);
        return res.json({ message: "Record Deleted...!" });
    } catch (error) {
        return res.status(400).json({ message: `Error while deleting transaction record: ${error.message}` });
    }
}


// GET: http://localhost:8080/api/labels
// GET: http://localhost:8000/api/labels
async function get_Labels(req, res) {
    try {
        const result = await Transaction.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: 'type',
                    foreignField: "type",
                    as: "categories_info"
                }
            },
            {
                $unwind: "$categories_info"
            }
        ]);

        console.log("Aggregation result:", result); // Log the aggregation result

        if (!result.length) {
            console.log("No matching documents found.");
        }

        const data = result.map(v => ({
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color: v.categories_info['color']
        }));

        res.json(data);
    } catch (error) {
        console.error("Error during aggregation:", error); // Log the error for debugging
        res.status(500).json({ message: "Lookup Collection Error", error: error.message });
    }
}

module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels,
};
