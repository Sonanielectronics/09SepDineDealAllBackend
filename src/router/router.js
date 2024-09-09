var express = require("express");
const router = express.Router();

var { class1 } = require('../controller/controller');

var jwt = require("jsonwebtoken");
var path = require("path");

var { upload, upload2, upload3 } = require("../middleware/middleware");

const HTTP = require("../../constant/response.constant");

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(HTTP.FORBIDDEN).json({ message: 'Token not provided', "status": `${HTTP.FORBIDDEN}` });
  }

  var SECRET_KEY = process.env.SECRET_KEY || "YOURSECRETKEYGOESHERE";
                                              
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(HTTP.UNAUTHORIZED).json({ message: 'Invalid token', "status": `${HTTP.UNAUTHORIZED}` });
    }

    req.UserName = decoded.UserName;
    req.Phone = decoded.Phone;
    next();
  });
}

const { toTitleCase, validateEmail, emailCheckInDatabase, phoneNumberCheckInDatabase, loginCheck, isAuth, isAdmin } = require("../Function/Function");

router.post("/api/customer/sendRegistrationOTP",class1.sendRegistrationOTP);
router.post("/api/customer/verifyRegistrationOTP",class1.verifyRegistrationOTP);
router.post("/api/customer/login",class1.customerlogin);
router.get("/api/restaurants/getEmployees/:id",class1.getEmployees);
router.get("/api/restaurants/:id",class1.getRestaurant);
router.post("/api/customer/addEmployeeReviews/:id",class1.addEmployeeReviews);
router.post("/api/customer/register", class1.AddRestaurant);
router.post("/api/customer/updateProfile", class1.updateProfile);
router.post("/api/restaurants/update/:id", class1.updateRestaurants);
router.post("/api/customer/addRestaurantReviews/:id", class1.addRestaurantReviews);
router.get("/AllRestaurant", class1.AllRestaurant);
router.post("/EditRestaurant", class1.EditRestaurant);
router.post("/DeleteRestaurant", class1.DeleteRestaurant);
router.post("/RestaurantSendingMessages", class1.RestaurantSendingMessages);
router.get("/AllMessage", class1.AllMessage);
router.post("/AddMessage", class1.AddMessage); 
router.post("/Login", class1.Login);
router.post("/AdminLogin", class1.AdminLogin);
router.post("/FilterData", class1.FilterData);
router.post("/AdminMainData", class1.AdminMainData);

router.post("/AddTemplate",upload.any("pImage"), class1.AddTemplate);
router.get("/api/restaurants/whatsapp/getTemplates/:id", class1.GetTemplateGet);
router.post("/api/restaurants/whatsapp/sendMessage", class1.sendMessage);
router.get("/whatsappMarketingCompaign", class1.whatsappMarketingCompaign);

router.post("/isadmin", class1.isAdmin);
router.post("/signup", class1.postSignup);
router.post("/signin", class1.postSignin);
router.post("/user", loginCheck, isAuth, isAdmin, class1.allUser);
router.post("/api/braintree/get-token", class1.ganerateToken);
router.post("/braintree/payment", class1.paymentProcess);
router.get("/api/category/Filter-category/:id", class1.FilterCategory);
router.get("/api/category/all-category", class1.getAllCategory);
router.get("/api/category/getRestaurantAllCategory", class1.getRestaurantAllCategory);
router.get("/getAllCategoryFilterByName", class1.getAllCategoryFilterByName);
router.post(
  "/api/category/add-category",
  upload.single("cImage"),
  class1.postAddCategory
);
router.post("/api/category/edit-category", loginCheck, class1.postEditCategory);
router.post(
  "/api/category/delete-category",
  loginCheck,
  class1.getDeleteCategory
);
router.get("/api/customize/get-slide-image", class1.getImages);
router.post("/delete-slide-image", class1.deleteSlideImage);
router.post(
  "/upload-slide-image",
  upload.single("image"),
  class1.uploadSlideImage
);
router.post("/dashboard-data", class1.getAllData);
router.get("/get-all-orders", class1.getAllOrders);
router.post("/order-by-user", class1.getOrderByUser);
router.post("/create-order", class1.postCreateOrder);
router.post("/postRozerpayCreateOrder", class1.postRozerpayCreateOrder);
router.post("/capture-payment", class1.capturepayment);
router.post("/update-order", class1.postUpdateOrder);
router.post("/delete-order", class1.postDeleteOrder);
router.get("/api/product/all-product", class1.getAllProduct);
router.post("/api/product/product-by-category", class1.getProductByCategory);
router.post("/product-by-price", class1.getProductByPrice);
router.post("/wish-product", class1.getWishProduct);
router.post("/api/product/cart-product", class1.getCartProduct);
router.post("/api/product/add-product", upload.any("pImage"), class1.postAddProduct);
router.post("/api/product/edit-product", upload.any("pImage"), class1.postEditProduct);
router.post("/api/product/delete-product", class1.getDeleteProduct);
router.post("/single-product", class1.getSingleProduct);
router.post("/add-review", class1.postAddReview);
router.post("/delete-review", class1.deleteReview);
router.get("/all-restaurant", class1.getAllRestaurant);
router.get("/restaurant/:id", class1.getRestaurantById);
router.post(
  "/add-restaurant",
  upload.single("restaurantImage"),
  class1.postAddRestaurant
);
router.get("/all-user", class1.getAllUser);
router.post("/signle-user", class1.getSingleUser);
router.post("/add-user", class1.postAddUser);
router.post("/edit-user", class1.postEditUser);
router.post("/delete-user", class1.getDeleteUser);
router.post("/change-password", class1.changePassword);

router.post("/api/restaurants/myDashboard", class1.myDashboard);
router.post("/api/restaurants/userInsight", class1.userInsight);
router.post("/api/restaurants/reviewInsight", class1.reviewInsight);
router.post("/api/restaurants/competitorAnalysis", class1.competitor);
router.get("/Invoice/:id", class1.Invoice);

router.post("/Dummy", class1.Dummy);
router.post("/Dummy2", class1.Dummy2);

module.exports = router;