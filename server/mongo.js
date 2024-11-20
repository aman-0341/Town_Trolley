import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { locationData, routesData } from "./mapData.js"

try {
    mongoose.connect("mongodb://localhost:27017/TOWNTROLLEY")
    console.log("Connected To MongoDb")
}
catch (err) {
    console.log("Error connecting to MongoDB" + err)
}

const UserSkeleton = mongoose.Schema({
    userId: Number,
    username: String,
    email: String,
    password: String,
    relation: String,
    location: String,
});
const CustomerOrderDetailsSkeleton = mongoose.Schema({
    Username: String,
    Email: String,
    Orders: [],
    Cart: []
});
const SellerOrderDetailsSkeleton = mongoose.Schema({
    Username: String,
    Email: String,
    No_of_reviews: Number,
    Reviews: [],
    Rating: Number,
    No_of_rating: Number,
    Total_Orders: Number,
    Completed_Orders: Number
});
const SellerProductDetailsSkeleton = mongoose.Schema({
    OrderId: Number,
    username: String,
    email: String,
    ProductName: String,
    Price: String,
    Quantity: String,
    SellerLocation: String,
    Category: String,
    ProductDescription: String,
    HarvestDate: String,
    Status: String
});
const PartnerDetailsSkeleton = mongoose.Schema({
    email: String,
    username: String,
    takenOrders: []
})
const SupportQuery = mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    solved: { type: Boolean, default: false }
})

const User = mongoose.model("User", UserSkeleton);
const CustomerOrderDetails = mongoose.model("OrderDetails", CustomerOrderDetailsSkeleton);
const SellerOrderDetails = mongoose.model("SellerOrderDetails", SellerOrderDetailsSkeleton);
const SellerProductDetails = mongoose.model("SellerProductDetails", SellerProductDetailsSkeleton);
const ParterDetails = mongoose.model("PartnerDetails", PartnerDetailsSkeleton)
const Support = mongoose.model("SupportQuery",SupportQuery)

export async function createUser(username, email, password, relation) {
    const checkUser = await User.findOne({ "email": email });
    if (checkUser) {
        return false;
    } else {
        const highestUserIdUser = await User.findOne().sort('-userId').exec();
        const highestUserId = highestUserIdUser ? highestUserIdUser.userId : 0;
        const newUserId = highestUserId + 1;
        const newUser = new User({
            "userId": newUserId,
            "username": username,
            "email": email,
            "password": password,
            "relation": relation,
            "location": "nill",
        });
        if (relation === "customer") {
            const newCustomerOrderDetails = new CustomerOrderDetails({
                "Username": username,
                "Email": email,
                "Orders": [],
                "Cart": [],
            });
            await newCustomerOrderDetails.save();
        } else if (relation === "seller") {
            const newSellerOrderDetails = new SellerOrderDetails({
                "Username": username,
                "Email": email,
                "No_of_reviews": 0,
                "Reviews": [],
                "Rating": 0,
                "No_of_rating": 0,
                "Total_Orders": 0,
                "Completed_Orders": 0
            });
            await newSellerOrderDetails.save();
        } else {
            const newParterDetails = new ParterDetails({
                "email": email,
                "username": username,
                "takenOrders": []
            })
            await newParterDetails.save()
        }
        await newUser.save();
        return true;
    }
}

export async function loginUser(email, password) {
    try {
        const checkUser = await User.findOne({ "email": email });

        if (checkUser && checkUser.email && checkUser.password) {
            const passwordMatch = checkUser.password;

            if (passwordMatch == password) {
                return { checkUser: true, value: checkUser, message: "Successful Login" };
            } else {
                return { checkUser: false, value: checkUser, message: "Invalid Credentials" };
            }
        } else {
            return ({ checkUser: false, message: "No Accounts Found" });
        }
    } catch (err) {
        console.error('Error during user login:', err);
        return { checkUser: false, message: "An error occurred during login" };
    }
}

export async function findProducts() {
    try {
        const data = await SellerProductDetails.find({}).exec();
        const list = [];
        data.forEach(element => {
            try {
                list.push(element);
            } catch (error) {
                console.error("Error parsing order:", error);
            }
        });
        console.log("Data entry successful");
        return list;
    } catch (error) {
        console.error("Error finding products:", error);
        throw error;
    }
}

export async function AddProduct(email, productName, category, price, quantity, harvestDate, location, address, description) {
    try {
        const orderIdInfo = await SellerProductDetails.findOne().sort('-OrderId').exec();
        const oldHighestId = orderIdInfo ? orderIdInfo.OrderId : 0;
        const OrderId = oldHighestId + 1;
        const userInfo = await User.findOne({ "email": email });
        const username = userInfo.username;
        console.log(category);
        const newData = new SellerProductDetails({
            OrderId: OrderId,
            username: username,
            email: email,
            ProductName: productName,
            Price: price,
            Quantity: quantity,
            SellerLocation: location,
            Address: address,
            Category: category,
            ProductDescription: description,
            HarvestDate: harvestDate,
            Status: "pending"
        });
        await newData.save();
        console.log("Added Product Successfully");
        return true;
    } catch (error) {
        console.log("Error While Adding" + error);
        return false;
    }
}

export async function SellerProfile(email) {
    try {
        const ReviewData = await SellerOrderDetails.findOne({ "Email": email }).exec();
        const OrdersData = await SellerProductDetails.find({ "email": email }).exec();
        const UserData = await User.findOne({ "email": email }).exec();
        const username = UserData.username;
        return { "ReviewData": ReviewData, "OrdersData": OrdersData, "username": username };

    } catch (err) {
        console.log(err);
    }
}

export async function AddOrder(cartData, cartTotal, name, phone, address, email) {
    try {
        const date = new Date();
        const UserOrderDetails = await CustomerOrderDetails.findOne({ "Email": email }).exec();

        for (const item of cartData) {
            const product = await SellerProductDetails.findOne({ "OrderId": item.id }).exec();
            const profile = await SellerOrderDetailsSkeleton.findOne({ "Email": email }).exec();
            console.log(product)
            if (product) {
                product.Quantity = (parseInt(product.Quantity) - item.quantity).toString();
                profile.Total_Orders = profile.Total_Orders + 1
                await product.save();
            }
        }

        const newData = {
            "Name": name,
            "Phone": phone,
            "Address": address,
            "CartData": cartData,
            "CartTotal": cartTotal,
            "Pending": true,
            "Date": date
        };

        UserOrderDetails.Orders.push(newData);
        await UserOrderDetails.save();
        console.log("Order added successfully");
    } catch (error) {
        console.error("Error while adding order: ", error);
        throw error;
    }
}

export async function getCustomerProfile(email) {
    const userData = await User.findOne({ "email": email }).exec();
    const orderDetails = await CustomerOrderDetails.findOne({ "Email": email }).exec();
    return { "userData": userData, "orderDetails": orderDetails };
}

export async function getSellerProfile(email) {
    const userData = await User.findOne({ "email": email }).exec();
    return { "userData": userData }
}

export async function getPartnerProfile(email) {
    const userData = await ParterDetails.findOne({ "email": email })
    return { "userData": userData, "locations": locationData, "routes": routesData };
}
export async function partnerProfile(email) {
    const userData = await User.findOne({ "email": email })
    return { "userData": userData };
}
export async function setPartnerOrder(email, data) {
    try {
        const partnerData = await ParterDetails.findOne({ "email": email }).exec();
        partnerData.takenOrders.push({
            "routeNo": data.routeNo,
            "fromName": data.fromName,
            "toName": data.toName,
            "from": data.from,
            "to": data.to,
            "fromStatus": false,
            "toStatus": false,
            "status": false
        });
        const updatedPartnerData = await partnerData.save();
        return updatedPartnerData;
    } catch (error) {
        console.error("Error while setting partner order: ", error);
        throw error;
    }
}

export async function setquery(name, email, subject, message) {
    try {
        const newdata = new Support({
            name: name,
            email: email,
            subject: subject,
            message: message,
        })
        newdata.save()
        console.log("Query sent to DB")
        return true;
    }
    catch (err) {
        console.log("Error while wrirint mongoDB",err)
        return false;
    }
}
export async function fetchquery() {
    try {
        const queries = await Support.find({}).exec();
        console.log("Queries fetched from DB:", queries);
        return queries;
    } catch (error) {
        console.error("Error fetching queries from DB:", error);
        throw error;
    }
}

export const markQueryAsSolved = async (req, res) => {
    try {
        const { id } = req.params;
        const query = await Support.findByIdAndUpdate(id, { solved: true }, { new: true });
        if (!query) {
            return res.status(404).json({ error: 'Query not found' });
        }
        res.status(200).send('Query marked as solved');
    } catch (error) {
        console.error('Error marking query as solved:', error);
        res.status(500).json({ error: 'Failed to mark query as solved' });
    }
};
// Remove a query
export const removeQuery = async (req, res) => {
    try {
        const { id } = req.params;
        const query = await Support.findByIdAndDelete(id);
        if (!query) {
            return res.status(404).json({ error: 'Query not found' });
        }
        res.status(200).send('Query removed');
    } catch (error) {
        console.error('Error removing query:', error);
        res.status(500).json({ error: 'Failed to remove query' });
    }
};