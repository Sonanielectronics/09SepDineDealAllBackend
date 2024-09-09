var {
  restaurants,
  Message,
  AdminAccount,
  Order,
  customer,
  customizeModel,
  orderModel,
  productModel,
  SMSCheckModel,
  EmployeeModel,
  RestaurantReviewModel,
  EmployeeReviewModel,
  categoryModel,
  TemplateModel,
} = require("../model/schema");
const HTTP = require("../../constant/response.constant");

var jwt = require("jsonwebtoken");
var path = require("path");
var bcrypt = require("bcryptjs");

require("dotenv").config();

var SECRET_KEY = process.env.SECRET_KEY || "YOURSECRETKEYGOESHERE";
var PUSHDATALOCATION =
  process.env.PUSHDATALOCATION || "https://wevalet.s3.amazonaws.com";

const os = require("os");

if (os.hostname() == "DESKTOP-796LHPC") {
  var Ip = process.env.IpAddress;
} else {
  var Ip = "http://13.200.187.159";
}

const multer = require("multer");

// const admin = require('firebase-admin');
// const serviceAccount = require('../../Fcm/valet-user-app-firebase-adminsdk-ecf3t-2f1bf6948a.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// const fcm = admin.messaging();

// const AWS = require("aws-sdk");
// const { Console } = require("console");
// require("aws-sdk/lib/maintenance_mode_message").suppress = true;

const mongoose = require("mongoose");

const {
  toTitleCase,
  emailCheckInDatabase,
  phoneNumberCheckInDatabase,
  loginCheck,
  isAuth,
  isAdmin,
} = require("../Function/Function");

var braintree = require("braintree");

const fs = require("fs");

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
const uploadToS3 = async (file, Directory) => {
  try {
    const params = {
      Bucket: "dinedeal",
      Key: `${Directory}/${Date.now()}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: "inline",
    };

    let uploadResponse = await s3.upload(params).promise();

    // const bucketRegion = process.env.AWS_REGION;
    // const bucketName = process.env.AWS_BUCKET_NAME;
    // const uploadedFileKey = uploadResponse.Key;
    // uploadResponse.fullUrl = `https://s3.${bucketRegion}.amazonaws.com/${bucketName}/${uploadedFileKey}`;
    return uploadResponse;
  } catch (error) {
    console.log("Error in uploadToS3NEW: ", error);
    throw error;
  }
};

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_live_lkuqq6mCeVxpCU",
  key_secret: "mzdi9VlZdM10Sei6j5baVcDN",
});

const axios = require("axios");

class class1 {
  static sendRegistrationOTP = async (req, res) => {
    try {
      if (req.body.whatsappNumber) {
        function generateRandomNumber() {
          return Math.floor(10000 + Math.random() * 90000);
        }

        const randomNumber = generateRandomNumber();

        var User = await SMSCheckModel.findOne({
          whatsappNumber: req.body.whatsappNumber,
        });

        if (User) {
          User.randomNumber = randomNumber;
          User.save();
        } else {
          let data = new SMSCheckModel({
            whatsappNumber: req.body.whatsappNumber,
            randomNumber: randomNumber,
          });

          await data.save();
        }

        var a = {
          code: `${randomNumber}`,
          message: "Account Create Successfully",
          status: `${HTTP.SUCCESS}`,
        };
        res.status(HTTP.SUCCESS).json(a);
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);

      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static verifyRegistrationOTP = async (req, res) => {
    try {
      if (req.body.whatsappNumber && req.body.code) {
        var User = await SMSCheckModel.findOne({
          whatsappNumber: req.body.whatsappNumber,
        });

        if (User) {
          if (User.randomNumber == req.body.code) {
            var a = {
              message: "User Verify Successfully",
              status: `${HTTP.SUCCESS}`,
            };
            res.status(HTTP.SUCCESS).json(a);
          } else {
            var a = {
              message: "Wrong Otp",
              status: `${HTTP.NOT_VERIFIED}`,
            };
            res.status(HTTP.SUCCESS).json(a);
          }
        } else {
          var a = {
            message: "First Send Otp & Then After Verify",
            status: `${HTTP.NOT_FOUND}`,
          };
          res.status(HTTP.SUCCESS).json(a);
        }
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static customerlogin = async (req, res) => {
    try {
      if (req.body.whatsappNumber && req.body.restaurantID) {
        var User = await customer.findOne({
          whatsappNumber: req.body.whatsappNumber,
        });

        if (User) {
          if (User.randomNumber == req.body.code) {
            var a = {
              data: User,
              message: "User Verify Successfully",
              status: `${HTTP.SUCCESS}`,
            };
            res.status(HTTP.SUCCESS).json(a);
          } else {
            var a = {
              message: "Wrong Otp",
              status: `${HTTP.NOT_VERIFIED}`,
            };
            res.status(HTTP.SUCCESS).json(a);
          }
        } else {
          var a = {
            message: "User Signup Successfully",
            status: `${HTTP.NOT_FOUND}`,
          };
          res.status(HTTP.SUCCESS).json(a);
        }
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static getEmployees = async (req, res) => {
    try {
      var Employees = await EmployeeModel.find({
        restaurantID: req.params.id,
      });

      var a = {
        data: Employees,
        message: "User Verify Successfully",
        status: `${HTTP.SUCCESS}`,
      };
      res.status(HTTP.SUCCESS).json(a);
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static getRestaurant = async (req, res) => {
    try {
      var Restaurant = await restaurants.find({
        _id: req.params.id,
      });

      var a = {
        data: Restaurant,
        message: "User Verify Successfully",
        status: `${HTTP.SUCCESS}`,
      };
      res.status(HTTP.SUCCESS).json(a);
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static addEmployeeReviews = async (req, res) => {
    try {
      if (req.body.EmployeeID && req.body.service && req.body.comment) {
        let data = new EmployeeReviewModel({
          EmployeeID: req.body.EmployeeID,
          RestaurantID: req.body.id,
          service: req.body.service,
          comment: req.body.comment,
        });

        await data.save();

        var a = {
          message: "Employee Review Successfully",
          status: `${HTTP.SUCCESS}`,
        };
        res.status(HTTP.SUCCESS).json(a);
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static AddRestaurant = async (req, res) => {
    try {
      if (
        req.body.restaurantID &&
        req.body.whatsappNumber &&
        req.body.googleSignInToken &&
        req.body.name &&
        req.body.area &&
        req.body.gender &&
        req.body.dateOfBirth
      ) {
        var User = await customer.findOne({
          whatsappNumber: req.body.whatsappNumber,
        });

        if (!User) {
          let data = new customer({
            restaurantID: req.body.restaurantID,
            whatsappNumber: req.body.whatsappNumber,
            googleSignInToken: req.body.googleSignInToken,
            name: req.body.name,
            area: req.body.area,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            updateCount: 1,
          });

          await data.save();

          const token = jwt.sign(
            { whatsappNumber: req.body.whatsappNumber },
            process.env.JWT_SECRET
          );

          var a = {
            data: {
              token: token,
            },
            message: "Account Create Successfully",
            status: `${HTTP.SUCCESS}`,
          };
          res.status(HTTP.SUCCESS).json(a);
        } else {
        }
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      if (req.body.restaurantID && req.body.whatsappNumber) {
        var User = await customer.findOne({
          whatsappNumber: req.body.whatsappNumber,
        });

        if (req.body.googleSignInToken) {
          User.googleSignInToken = req.body.googleSignInToken;
        }

        if (req.body.name) {
          User.name = req.body.name;
        }

        if (req.body.area) {
          User.area = req.body.area;
        }

        if (req.body.gender) {
          User.gender = req.body.gender;
        }

        if (req.body.dateOfBirth) {
          User.dateOfBirth = req.body.dateOfBirth;
        }

        if (req.body.relationShipStatus) {
          User.relationShipStatus = req.body.relationShipStatus;
        }

        if (req.body.gender) {
          User.gender = req.body.gender;
        }

        if (req.body.anniversary) {
          User.anniversary = req.body.anniversary;
        }

        if (req.body.ageGroup) {
          User.ageGroup = req.body.ageGroup;
        }

        if (req.body.dateOfBirth) {
          User.dateOfBirth = req.body.dateOfBirth;
        }

        if (req.body.haveFoodDeliveryApp) {
          User.haveFoodDeliveryApp = req.body.haveFoodDeliveryApp;
        }

        if (req.body.percentage) {
          User.percentage = req.body.percentage;
        }

        User.updateCount = User.updateCount + 1;
        await User.save();

        const token = jwt.sign(
          { whatsappNumber: req.body.whatsappNumber },
          process.env.JWT_SECRET
        );

        var a = {
          data: {
            token: token,
          },
          message: "Account update Successfully",
          status: `${HTTP.SUCCESS}`,
        };
        res.status(HTTP.SUCCESS).json(a);
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static updateRestaurants = async (req, res) => {
    try {
      var Restaurant = await restaurants.findOne({
        _id: req.params.id,
      });

      if (
        req.body.businessName &&
        req.body.personalName &&
        req.body.email &&
        req.body.pinCode &&
        req.body.city &&
        req.body.panNumber &&
        req.body.gstNumber &&
        req.body.wpBusinessAPINumber &&
        req.body.facebookManagerId &&
        req.body.bankDetails.holderName &&
        req.body.bankDetails.accountNumber &&
        req.body.bankDetails.ifscCode &&
        req.body.bankDetails.pinCode &&
        req.body.phone && 
        req.body.GeoLocation 
      ) {
        if (req.body.businessName) {
          Restaurant.businessName = req.body.businessName;
        }

        if (req.body.personalName) {
          Restaurant.personalName = req.body.personalName;
        }

        if (req.body.email) {
          Restaurant.email = req.body.email;
        }

        if (req.body.pinCode) {
          Restaurant.pinCode = req.body.pinCode;
        }

        if (req.body.city) {
          Restaurant.city = req.body.city;
        }

        if (req.body.panNumber) {
          Restaurant.panNumber = req.body.panNumber;
        }

        if (req.body.gstNumber) {
          Restaurant.gstNumber = req.body.gstNumber;
        }

        if (req.body.wpBusinessAPINumber) {
          Restaurant.wpBusinessAPINumber = req.body.wpBusinessAPINumber;
        }

        if (req.body.facebookManagerId) {
          Restaurant.facebookManagerId = req.body.facebookManagerId;
        }

        if (req.body.bankDetails.holderName) {
          Restaurant.bankDetails.holderName = req.body.bankDetails.holderName;
        }

        if (req.body.bankDetails.accountNumber) {
          Restaurant.bankDetails.accountNumber =
            req.body.bankDetails.accountNumber;
        }

        if (req.body.bankDetails.ifscCode) {
          Restaurant.bankDetails.ifscCode = req.body.bankDetails.ifscCode;
        }

        if (req.body.bankDetails.pinCode) {
          Restaurant.bankDetails.pinCode = req.body.bankDetails.pinCode;
        }

        if (req.body.phone) {
          Restaurant.phone = req.body.phone;
        }

        if (req.body.GeoLocation) {
          Restaurant.GeoLocation = req.body.GeoLocation;
        }

        if (req.body.percentage) {
          Restaurant.percentage = req.body.percentage;
        }
        
        await Restaurant.save();

        var a = {
          message: "Account update Successfully",
          status: `${HTTP.SUCCESS}`,
        };
        res.status(HTTP.SUCCESS).json(a);
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static addRestaurantReviews = async (req, res) => {
    try {
      if (req.body.ambience && req.body.costing && req.body.food) {
        let data = new RestaurantReviewModel({
          RestaurantID: req.params.id,
          Ambience: req.body.ambience,
          Costing: req.body.costing,
          Food: req.body.food,
        });

        await data.save();

        var a = {
          message: "Restaurant Review Successfully",
          status: `${HTTP.SUCCESS}`,
        };
        res.status(HTTP.SUCCESS).json(a);
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static AllRestaurant = async (req, res) => {
    try {
      var AllRestaurant = await restaurants.find({ userRole: 1 });

      for (let i = 0; i < AllRestaurant.length; i++) {

        AllRestaurant[i].Status = "Active"

      }

      var newarray = await AllRestaurant;

      var message = { data: newarray, status: `${HTTP.SUCCESS}` };
      res.status(HTTP.SUCCESS).json({ message });
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static EditRestaurant = async (req, res) => {
    try {
      var Restaurant = await restaurants.findOne({});
      Restaurant.email = req.body.email;
      Restaurant.password = await bcrypt.hash(req.body.password, 12);
      await Restaurant.save();

      var message = {
        message: "Restaurant Updated",
        status: `${HTTP.SUCCESS}`,
      };
      res.status(HTTP.SUCCESS).json(message);
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static DeleteRestaurant = async (req, res) => {
    try {
      await restaurants.find({ email: req.body.email }).deleteOne();

      var message = {
        message: "Restaurant Deleted",
        status: `${HTTP.SUCCESS}`,
      };
      res.status(HTTP.SUCCESS).json(message);
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static RestaurantSendingMessages = async (req, res) => {
    try {
      await restaurants.find({ email: req.body.email }).deleteOne();

      var message = {
        message: "Restaurant Deleted",
        status: `${HTTP.SUCCESS}`,
      };
      res.status(HTTP.SUCCESS).json(message);
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static AllMessage = async (req, res) => {
    try {
      var AllMessage = await Message.find({});

      var message = { data: AllMessage, status: `${HTTP.SUCCESS}` };
      res.status(HTTP.SUCCESS).json({ message });
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static AddMessage = async (req, res) => {
    try {
      var AllMessage = await Message.find({});

      var message = { data: AllMessage, status: `${HTTP.SUCCESS}` };
      res.status(HTTP.SUCCESS).json({ message });
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static Login = async (req, res) => {
    try {
      var User1 = await AdminAccount.findOne({ userName: req.body.userName });
      var User2 = await restaurants.findOne({ email: req.body.userName });

      if (!User1 && !User2) {
        var a = { message: "Account Not Exist", status: `${HTTP.NOT_FOUND}` };
        res.status(HTTP.NOT_FOUND).json(a);
      } else {
        var User = [];
        var RoleArray = [];
        if (User1 == null) {
          User.push(User2);
          RoleArray.push("Restaurant");
        } else {
          User.push(User1);
          RoleArray.push("SuperAdmin");
        }

        var Passwordmatch = await bcrypt.compare(
          req.body.password,
          User[0].password
        );

        if (Passwordmatch) {
          var message2 = {
            message: "Login Successfully",
            Role: RoleArray[0],
            data: User[0],
            status: `${HTTP.SUCCESS}`,
            error: false,
          };
          res.status(HTTP.SUCCESS).json(message2);
        } else {
          var a = { message: "Wrong PassWord", status: `${HTTP.UNAUTHORIZED}` };
          res.status(HTTP.UNAUTHORIZED).json(a);
        }
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static AdminLogin = async (req, res) => {
    try {
      var User1 = await restaurants.findOne({ email: req.body.userName });

      if (!User1) {
        var a = { message: "Account Not Exist", status: `${HTTP.NOT_FOUND}` };
        res.status(HTTP.NOT_FOUND).json(a);
      } else {
        var Passwordmatch = await bcrypt.compare(
          req.body.password,
          User1.password
        );

        if (Passwordmatch) {
          const token = jwt.sign(
            { email: req.body.userName },
            process.env.JWT_SECRET
          );

          var message2 = {
            message: "Login Successfully",
            token: token,
            data: User1,
            status: `${HTTP.SUCCESS}`,
            error: false,
          };
          res.status(HTTP.SUCCESS).json(message2);
        } else {
          var a = { message: "Wrong PassWord", status: `${HTTP.UNAUTHORIZED}` };
          res.status(HTTP.UNAUTHORIZED).json(a);
        }
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static FilterData = async (req, res) => {
    try {
      if (
        req.body.Id &&
        req.body.StartDate &&
        req.body.EndDate &&
        req.body.StartDate !== " " &&
        req.body.EndDate !== " "
      ) {
        var Restaurant = await restaurants.findOne({ _id: req.body.Id });

        var RestaurantName = "";
        if (Restaurant !== null) {
          RestaurantName = Restaurant.userName;
        }

        var TotleOrder = await Order.find({
          restaurantID: req.body.Id,
        });

        var UpdatedTotleOrder = [];

        function isDateInRange(dateToCheck, startDate, endDate) {
          // Convert the dates to timestamps for comparison
          const timestampToCheck = new Date(dateToCheck).getTime();
          const timestampStart = new Date(startDate).getTime();
          const timestampEnd = new Date(endDate).getTime();

          // Check if the dateToCheck is between startDate and endDate
          return (
            timestampToCheck >= timestampStart &&
            timestampToCheck <= timestampEnd
          );
        }

        for (var i = 0; i < TotleOrder.length; i++) {
          const dateOnly = new Date(TotleOrder[i].createdAt);

          const year = dateOnly.getUTCFullYear();
          const month = String(dateOnly.getUTCMonth() + 1).padStart(2, "0");
          const day = String(dateOnly.getUTCDate()).padStart(2, "0");

          const formattedDate = `${year}-${month}-${day}`;

          if (
            isDateInRange(formattedDate, req.body.StartDate, req.body.EndDate)
          ) {
            await UpdatedTotleOrder.push(TotleOrder[i]);
          }
        }

        var TotleOrderSum = 0;

        for (var i = 0; i < UpdatedTotleOrder.length; i++) {
          TotleOrderSum =
            TotleOrderSum + UpdatedTotleOrder[i].orderMetaData.payableAmount;
        }

        var Data = {
          RestaurantName: `${RestaurantName}`,
          TotleOrderSum: `${TotleOrderSum}`,
          TotleOrder: `${UpdatedTotleOrder.length}`,
          status: `${HTTP.SUCCESS}`,
        };

        res.status(HTTP.SUCCESS).json(Data);
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static AdminMainData = async (req, res) => {
    try {
      if (req.body.period && req.body.id) {
        let today = new Date();

        var day = today.getDate().toString().padStart(2, "0");
        var month = (today.getMonth() + 1).toString().padStart(2, "0");
        var year = today.getFullYear();

        var StartDate = `${year}-${month}-${day}`;
        var EndDate = "";

        function getDateSevenDaysAgo(date) {
          let newDate = new Date(date);
          newDate.setDate(newDate.getDate() - 6);
          return newDate;
        }

        function isValidDate(dateString) {
          // Check the format using a regular expression
          const regex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateString.match(regex)) {
            return false;
          }

          // Parse the date parts to integers
          const parts = dateString.split("-");
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Note: months are 0-based in JavaScript
          const day = parseInt(parts[2], 10);

          // Check the ranges of year, month, and day
          if (year < 1000 || year > 9999 || month < 0 || month > 11) {
            return false;
          }

          // Create a date object with the parsed parts
          const date = new Date(year, month, day);

          // Check if the date object matches the parsed parts (to avoid invalid dates like 2024-02-30)
          return (
            date.getFullYear() === year &&
            date.getMonth() === month &&
            date.getDate() === day
          );
        }

        function getNextDay(dateString) {
          // Parse the input date string
          const date = new Date(dateString);

          // Increment the date by one day
          date.setDate(date.getDate() + 1);

          // Get the components of the new date
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          // Return the new date in YYYY-MM-DD format
          return `${year}-${month}-${day}`;
        }

        function getTwoMonthsAgo(day, month, year, period) {
          const date = new Date(year, month - 1, day);

          const originalDay = date.getDate();

          date.setMonth(date.getMonth() - period);

          if (date.getDate() !== originalDay) {
            date.setDate(0);
          }

          const newDay = String(date.getDate()).padStart(2, "0");
          const newMonth = String(date.getMonth() + 1).padStart(2, "0");
          const newYear = date.getFullYear();

          return `${newDay}/${newMonth}/${newYear}`;
        }

        function addDaysToDate(dateStr, days) {
          // Parse the input date string in the format "dd/mm/yyyy"
          const [day, month, year] = dateStr.split("/").map(Number);

          // Create a new Date object using the parsed date
          const date = new Date(year, month - 1, day);

          // Add the specified number of days to the date
          date.setDate(date.getDate() + days);

          // Format the future date back to "dd/mm/yyyy"
          const futureDay = String(date.getDate()).padStart(2, "0");
          const futureMonth = String(date.getMonth() + 1).padStart(2, "0");
          const futureYear = date.getFullYear();

          return `${futureYear}-${futureMonth}-${futureDay}`;
        }

        function getDatesInRange(startDate, endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const dateArray = [];

          while (start <= end) {
            dateArray.push(formatDate(start));
            start.setDate(start.getDate() + 1);
          }

          return dateArray;
        }

        function formatDate(date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }

        let initialDate = new Date(`${StartDate}`);

        if (req.body.period == "today") {
          EndDate = StartDate;
        } else if (req.body.period == "thisWeek") {
          let sevenDaysAgoDate = getDateSevenDaysAgo(initialDate);

          let dd = String(sevenDaysAgoDate.getDate()).padStart(2, "0");
          let mm = String(sevenDaysAgoDate.getMonth() + 1).padStart(2, "0");
          let yyyy = sevenDaysAgoDate.getFullYear();

          var EndDate = `${yyyy}-${mm}-${dd}`;
        } else if (req.body.period == "last3Months") {
          var givenDate = `${day}-${month}-${year}`;

          var ThreeMonthAgo = await getTwoMonthsAgo(day, month, year, 3);
          var EndDate = await addDaysToDate(ThreeMonthAgo, 1);
        } else if (req.body.period == "last6Months") {
          var givenDate = `${day}-${month}-${year}`;

          var SixMonthAgo = await getTwoMonthsAgo(day, month, year, 6);
          var EndDate = await addDaysToDate(SixMonthAgo, 1);
        } else {
          var EndDate = `${year - 1}-${month}-${day}`;

          if (isValidDate(`${EndDate}`)) {
            var EndDate = getNextDay(EndDate);
          } else {
            var EndDate = `${year - 1}-${month}-${day - 1}`;

            var EndDate = getNextDay(EndDate);
          }
        }

        var dateArray = getDatesInRange(EndDate, StartDate);

        var TotleRevenueSum = 0;
        var TotlePerDayRevenueSumArray = [];

        var TotleCustomer = 0;
        var TotlePerDayCustomerArray = [];
        for (var i = 0; i < dateArray.length; i++) {
          const startOfDay = new Date(`${dateArray[i]}T00:00:00Z`);
          const endOfDay = new Date(`${dateArray[i]}T23:59:59Z`);

          var AddConditionStatus = await AdminAccount.findOne({
            _id: req.body.id,
          });

          if (AddConditionStatus == null) {
            var OrderInPeriodTime = await Order.find({
              createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
              },
              restaurantID: req.body.id,
            });

            var NewCustomerInPeriodTime = await customer.find({
              createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
              },
              restaurantID: req.body.id,
            });
          } else {
            var OrderInPeriodTime = await Order.find({
              createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
              },
            });

            var NewCustomerInPeriodTime = await customer.find({
              createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
              },
            });
          }

          var TotlePerDayRevenueSum = 0;
          for (var j = 0; j < OrderInPeriodTime.length; j++) {
            TotlePerDayRevenueSum =
              TotlePerDayRevenueSum +
              OrderInPeriodTime[j].orderMetaData.payableAmount;
          }

          TotleRevenueSum = TotleRevenueSum + TotlePerDayRevenueSum;
          TotlePerDayRevenueSumArray.push(TotlePerDayRevenueSum);

          TotlePerDayCustomerArray.push(NewCustomerInPeriodTime.length);
          TotleCustomer = TotleCustomer + NewCustomerInPeriodTime.length;
        }

        var Data = {
          data: {
            Header: {
              TotleRevenueSum: TotleRevenueSum,
              Customer: TotleCustomer,
              MoneyFrom3Party:"0",
              SendMessage:"0",
            },
            TotleRevenueGraph: TotlePerDayRevenueSumArray,
            CustomerGraph: TotlePerDayCustomerArray,
            DateArray: dateArray,
          },
          code: 200,
        };

        res.status(HTTP.SUCCESS).json(Data);
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static AddTemplate = async (req, res) => {
    try {
      
      if (
        !req.body.description ||
        !req.body.Id ||
        !req.body.templateType
      ) {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      } else {

        const result = await uploadToS3(req.files[0], "Template");
        
        let data = new TemplateModel({
          RestaurantID:req.body.Id,
          description:req.body.description,
          Type:req.body.templateType,
          image:result.Location
        });

        await data.save();
          
        var a = {
          message: "Template Add Successfully",
          code: `${HTTP.SUCCESS}`,
        };
        res.status(HTTP.SUCCESS).json(a);

      }

    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static GetTemplateGet = async (req, res) => {
    try {
      var FilterJson = {
        RestaurantID: req.params.id,
      };

      if (req.query.Type) {
        FilterJson.Type = req.query.Type;
      }

      var Templates = await TemplateModel.find(FilterJson);

      var a = {
        data: Templates,
        status: `${HTTP.SUCCESS}`,
      };
      res.status(HTTP.SUCCESS).json(a);
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static sendMessage = async (req, res) => {
    try {

      var FilterJson = {};

      var startDate;
      var endDate;

      function getMonthDateRange(year, month) {
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)); // Start of the month in UTC
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); // End of the month in UTC

        return {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };
      }

      if (req.body.dateofbirth !== null) {
        if (req.body.dateofbirth == "January") {
          var { startDate, endDate } = getMonthDateRange(1999, 1);
        } else if (req.body.dateofbirth == "February") {
          var { startDate, endDate } = getMonthDateRange(1999, 2);
        } else if (req.body.dateofbirth == "March") {
          var { startDate, endDate } = getMonthDateRange(1999, 3);
        } else if (req.body.dateofbirth == "April") {
          var { startDate, endDate } = getMonthDateRange(1999, 4);
        } else if (req.body.dateofbirth == "May") {
          var { startDate, endDate } = getMonthDateRange(1999, 5);
        } else if (req.body.dateofbirth == "June") {
          var { startDate, endDate } = getMonthDateRange(1999, 6);
        } else if (req.body.dateofbirth == "July") {
          var { startDate, endDate } = getMonthDateRange(1999, 7);
        } else if (req.body.dateofbirth == "August") {
          var { startDate, endDate } = getMonthDateRange(1999, 8);
        } else if (req.body.dateofbirth == "September") {
          var { startDate, endDate } = getMonthDateRange(1999, 9);
        } else if (req.body.dateofbirth == "October") {
          var { startDate, endDate } = getMonthDateRange(1999, 10);
        } else if (req.body.dateofbirth == "November") {
          var { startDate, endDate } = getMonthDateRange(1999, 11);
        } else {
          var { startDate, endDate } = getMonthDateRange(1999, 12);
        }

        const formattedstartDate = startDate.replace("Z", "+00:00");
        const formattedendDate = endDate.replace("Z", "+00:00");

        FilterJson.dateOfBirth = {
          $gte: formattedstartDate,
          $lte: formattedendDate,
        };
      }

      if (req.body.gender !== null) {
        FilterJson.gender = req.body.gender;
      }

      if (req.body.relationshipstatus !== null) {
        if (req.body.relationshipstatus == "Married") {
          FilterJson.relationShipStatus = 2;
        } else {
          FilterJson.relationShipStatus = 1;
        }
      }

      if (req.body.agegroup !== null) {
        if (req.body.agegroup == "20 or Below") {
          FilterJson.ageGroup = 1;
        } else if (req.body.agegroup == "21-30") {
          FilterJson.ageGroup = 2;
        } else if (req.body.agegroup == "31-40") {
          FilterJson.ageGroup = 3;
        } else if (req.body.agegroup == "41-50") {
          FilterJson.ageGroup = 4;
        } else {
          FilterJson.ageGroup = 5;
        }
      }

      if (req.body.proffesion !== null) {
        FilterJson.profession = req.body.proffesion;
      }

      var Data = [];

      if (req.body.callApi == "restaurant") {

        FilterJson.restaurantID = req.body._id;

        var User = await customer.find(FilterJson);

        var Data = User;

      } else {
        FilterJson.userRole = 1;

        var Restaurant = await restaurants.find(FilterJson);
        var Data = Restaurant;
      }

      function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = deg2rad(lat2 - lat1); // Convert latitude difference to radians
        const dLon = deg2rad(lon2 - lon1); // Convert longitude difference to radians
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
      }
      
      // Helper function to convert degrees to radians
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }

      for (var i = 0; i < Data.length; i++) {

        if (Data[i].whatsappNumber) {

          var WhatsappNumber = Data[i].whatsappNumber;
          var Image = req.body.image ;
          var WhMessage = req.body.description ;

          var Restaurants = await restaurants.findOne({_id:req.body._id}); 

          const distance = getDistanceFromLatLon(Data[i].area.latLng.lat, Data[i].area.latLng.lng, Restaurants.GeoLocation.Latitude, Restaurants.GeoLocation.Longitude);

          var Range = req.body.distance // 2 , 4 , 6 , 8 , 10;

          // console.log(Range);
          // console.log(distance);

          if(distance <= Range){
            
            const url = `http://bhashsms.com/api/sendmsg.php?user=GOANNYBWA&pass=123456&sender=BUZWAP&phone=${WhatsappNumber}&text=de_goany03&priority=wa&stype=normal&Params=${Restaurants.userName},${WhMessage}&htype=image&url=${Image}`;

            console.log(WhatsappNumber,"Hii");
            
            axios
              .get(url)
              .then(async (response) => {

                let data = new Message({
                  TemplatePicture: Image,
                  TemplateDescription: req.body.description,
                  phone: WhatsappNumber
                });

                await data.save();

              })
              .catch((error) => {
                console.error("Error: " + error.message);
              });

          }

        }

        if (Data[i].wpBusinessAPINumber) {

          console.log(Data[i].wpBusinessAPINumber);

          const url = `http://bhashsms.com/api/sendmsg.php?user=GOANNYBWA&pass=123456&sender=BUZWAP&phone=7410774108&text=de_goany03&priority=wa&stype=normal&Params=Goanny%20Technology,we%20are%20Hire%20Senior%20Full%20Stack%20Develoeper&htype=image&url=https://content.jdmagicbox.com/comp/pune/i7/020pxx20.xx20.190109190905.u6i7/catalogue/goanny-technologies-rahatani-pune-computer-repair-and-services-bmypbveysf-250.jpg`;

          axios
            .get(url)
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error("Error: " + error.message);
            });

        }

      }

      var a = {
        message: "Whatsapp Message Send Successfully",
        code: `${HTTP.SUCCESS}`,
      };
      res.status(HTTP.SUCCESS).json(a);

    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static whatsappMarketingCompaign = async (req, res) => {
    try {
      const shapeLine1 = {
        series: [
          {
            data: [800, 600, 1000, 800, 600, 1000, 800, 900],
          },
        ],
        options: {
          chart: {
            toolbar: {
              autoSelected: "pan",
              show: false,
            },
            offsetX: 0,
            offsetY: 0,
            zoom: {
              enabled: false,
            },
            sparkline: {
              enabled: true,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
            width: 2,
          },
          colors: ["#00EBFF"],
          tooltip: {
            theme: "light",
          },
          grid: {
            show: false,
            padding: {
              left: 0,
              right: 0,
            },
          },
          yaxis: {
            show: false,
          },
          fill: {
            type: "solid",
            opacity: [0.1],
          },
          legend: {
            show: false,
          },
          xaxis: {
            low: 0,
            offsetX: 0,
            offsetY: 0,
            show: false,
            labels: {
              low: 0,
              offsetX: 0,
              show: false,
            },
            axisBorder: {
              low: 0,
              offsetX: 0,
              show: false,
            },
          },
        },
      };
      const shapeLine2 = {
        series: [
          {
            data: [800, 600, 1000, 800, 600, 1000, 800, 900],
          },
        ],
        options: {
          chart: {
            toolbar: {
              autoSelected: "pan",
              show: false,
            },
            offsetX: 0,
            offsetY: 0,
            zoom: {
              enabled: false,
            },
            sparkline: {
              enabled: true,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
            width: 2,
          },
          colors: ["#FB8F65"],
          tooltip: {
            theme: "light",
          },
          grid: {
            show: false,
            padding: {
              left: 0,
              right: 0,
            },
          },
          yaxis: {
            show: false,
          },
          fill: {
            type: "solid",
            opacity: [0.1],
          },
          legend: {
            show: false,
          },
          xaxis: {
            low: 0,
            offsetX: 0,
            offsetY: 0,
            show: false,
            labels: {
              low: 0,
              offsetX: 0,
              show: false,
            },
            axisBorder: {
              low: 0,
              offsetX: 0,
              show: false,
            },
          },
        },
      };
      const shapeLine3 = {
        series: [
          {
            data: [800, 600, 1000, 800, 600, 1000, 800, 900],
          },
        ],
        options: {
          chart: {
            toolbar: {
              autoSelected: "pan",
              show: false,
            },
            offsetX: 0,
            offsetY: 0,
            zoom: {
              enabled: false,
            },
            sparkline: {
              enabled: true,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
            width: 2,
          },
          colors: ["#5743BE"],
          tooltip: {
            theme: "light",
          },
          grid: {
            show: false,
            padding: {
              left: 0,
              right: 0,
            },
          },
          yaxis: {
            show: false,
          },
          fill: {
            type: "solid",
            opacity: [0.1],
          },
          legend: {
            show: false,
          },
          xaxis: {
            low: 0,
            offsetX: 0,
            offsetY: 0,
            show: false,
            labels: {
              low: 0,
              offsetX: 0,
              show: false,
            },
            axisBorder: {
              low: 0,
              offsetX: 0,
              show: false,
            },
          },
        },
      };

      var SendData = [
        {
          name: shapeLine1,
          title: "Totel revenue",
          count: "3,564",
          bg: "bg-[#E5F9FF] dark:bg-slate-900	",
          text: "text-info-500",
          icon: "heroicons:shopping-cart",
        },
        {
          name: shapeLine2,
          title: "Products sold",
          count: "564",
          bg: "bg-[#FFEDE6] dark:bg-slate-900	",
          text: "text-warning-500",
          icon: "heroicons:cube",
        },
        {
          name: shapeLine3,
          title: "Growth",
          count: "+5.0%",
          bg: "bg-[#EAE6FF] dark:bg-slate-900	",
          text: "text-[#5743BE]",
          icon: "heroicons:arrow-trending-up-solid",
        },
      ];

      var a = {
        data: SendData,
        code: `${HTTP.SUCCESS}`,
      };
      res.status(HTTP.SUCCESS).json(a);
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static isAdmin = async (req, res) => {
    let { loggedInUserId } = req.body;
    try {
      let loggedInUserRole = await userModel.findById(loggedInUserId);
      res.json({ role: loggedInUserRole.userRole });
    } catch {
      res.status(404);
    }
  };
  static allUser = async (req, res) => {
    try {
      let allUser = await userModel.find({});
      res.json({ users: allUser });
    } catch {
      res.status(404);
    }
  };
  static postSignup = async (req, res) => {
    try {
      if (
        req.body.userName &&
        req.body.confirmPassword &&
        req.body.email &&
        req.body.password
      ) {
        var EmailWithRemoveBlankSpace = req.body.email.trim();

        var User = await restaurants.findOne({
          email: EmailWithRemoveBlankSpace,
        });

        if (!User) {
          var hashpassword = bcrypt.hashSync(req.body.password, 10);

          let newUser = new restaurants({
            userName: req.body.userName,
            email: EmailWithRemoveBlankSpace,
            password: hashpassword,
            percentage: 80,
            Status: "",
            userRole: 1,
          });
          
          newUser.save()
          .then((savedUser) => {
            let categories = [
              {
                restaurantId: savedUser._id,
                cName: "Category 1",
                cDescription: "Description 1",
                cStatus: "Active 1",
                cImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4lrlJCwHP_tOta2qs_hVKFN08Bnsn5QxY5A&s"
              },
              {
                restaurantId: savedUser._id,
                cName: "Category 2",
                cDescription: "Description 2",
                cStatus: "Active 2",
                cImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt3w5-5GWlPXFU7GUHMX6m7nc5DFjVDcV4Aw&s"
              }
            ];
        
            // Create an array of promises to save each category
            const savePromises = categories.map((category) => {
              const newCategory = new categoryModel(category);
              return newCategory.save();
            });
        
            // Wait for all promises to resolve
            Promise.all(savePromises)
              .then((savedCategories) => {
                savedCategories.forEach((savedCategory, index) => {

                  let products = [
                    [
                      {
                        restaurantId: savedUser._id,
                        categoriesId: savedCategory._id,
                        pCategory: savedCategory._id,
                        pSold: 1,
                        pQuantity: 2,
                        pPrice: 3,
                        pImages: [
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-vrgd5fsmqp1ei4i9i3FQfB-V11PM9XJITg&s"
                        ],
                        pOffer: "Poffer 1",
                        pName: "pName 1",
                        pDescription: "pDescription 1",
                        pStatus: "Active 3",
                        pRatingsReviews: [],
                      },
                      {
                        restaurantId: savedUser._id,
                        categoriesId: savedCategory._id,
                        pCategory: savedCategory._id,
                        pSold: 4,
                        pQuantity: 5,
                        pPrice: 6,
                        pImages: [
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoY8itxFlspDDXtDTtle8U2J6Afd98S8j-0g&s"
                        ],
                        pOffer: "Poffer 2",
                        pName: "pName 2",
                        pDescription: "pDescription 2",
                        pStatus: "Active 4",
                        pRatingsReviews: [],
                      }
                    ],
                    [
                      // {
                      //   restaurantId: savedUser._id,
                      //   categoriesId: savedCategory._id,
                      //   pCategory: savedCategory._id,
                      //   pSold: 4,
                      //   pQuantity: 5,
                      //   pPrice: 6,
                      //   pImages: [
                      //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoY8itxFlspDDXtDTtle8U2J6Afd98S8j-0g&s"
                      //   ],
                      //   pOffer: "Poffer 2",
                      //   pName: "pName 2",
                      //   pDescription: "pDescription 2",
                      //   pStatus: "Active 4",
                      //   pRatingsReviews: [],
                      // }
                    ]
                  ]
                  
                  productModel.insertMany(products[index], (err, docs) => {});

                });
              })
              .catch((err) => {
                console.error('Error saving categories:', err);
              });
          })
          .catch((err) => {
            console.error('Error saving user:', err);
          });

          var a = {
            message: "Account Create Successfully",
            code: `${HTTP.SUCCESS}`,
          };
          res.status(HTTP.SUCCESS).json(a);

        } else {
          var a = {
            message: "Account Already Exist",
            code: `${HTTP.CONFLICT}`,
          };
          res.status(HTTP.CONFLICT).json(a);
        }
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);
      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static postSignin = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        error: "Fields must not be empty",
      });
    }
    try {
      const data = await restaurants.findOne({ email: email });
      if (!data) {
        return res.json({
          error: "Invalid email or password",
        });
      } else {
        const login = await bcrypt.compare(password, data.password);
        if (login) {
          const token = jwt.sign(
            { _id: data._id, role: data.userRole },
            process.env.JWT_SECRET
          );
          const encode = jwt.verify(token, process.env.JWT_SECRET);
          return res.json({
            token: token,
            user: encode,
          });
        } else {
          return res.json({
            error: "Invalid email or password",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  static ganerateToken = async (req, res) => {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        return res.json(err);
      }
      return res.json(response);
    });
  };
  static paymentProcess = async (req, res) => {
    let { amountTotal, paymentMethod } = req.body;
    gateway.transaction.sale(
      {
        amount: amountTotal,
        paymentMethodNonce: paymentMethod,
        options: {
          submitForSettlement: true,
        },
      },
      (err, result) => {
        if (err) {
          console.error(err);
          return res.json(err);
        }

        if (result.success) {
          console.log("Transaction ID: " + result.transaction.id);
          return res.json(result);
        } else {
          console.error(result.message);
        }
      }
    );
  };
  static FilterCategory = async (req, res) => {
    try {
      let Categories = await categoryModel
        .find({ restaurantId: req.params.id })
        .sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static getAllCategory = async (req, res) => {
    try {
      let Categories = await categoryModel.find({}).sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static getRestaurantAllCategory = async (req, res) => {
    try {
      const headers = req.headers;

      let Categories = await categoryModel
        .find({ restaurantId: headers.userid })
        .sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static getAllCategoryFilterByName = async (req, res) => {
    try {
      let Categories = await categoryModel.find({}).sort({ _id: -1 });

      let uniqueCategories = Categories.reduce((acc, current) => {
        // Check if the category name already exists in the accumulator
        const x = acc.find((item) => item.cName === current.cName);
        if (!x) {
          // If not, add the current category to the accumulator
          acc.push(current);
        }
        return acc;
      }, []);

      if (uniqueCategories) {
        return res.json({ Categories: uniqueCategories });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static postAddCategory = async (req, res) => {
    let { restaurantId, cName, cDescription, cStatus } = req.body;

    if (!restaurantId || !cName || !cDescription || !cStatus || !req.file) {
      return res.json({ error: "All filled must be required" });
    } else {
      const result = await uploadToS3(req.file, "caretory");
      let cImage = result.Location;

      cName = toTitleCase(cName);
      try {
        let newCategory = new categoryModel({
          restaurantId,
          cName,
          cDescription,
          cStatus,
          cImage,
        });
        await newCategory.save((err) => {
          if (!err) {
            return res.json({ success: "Category created successfully" });
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  static postEditCategory = async (req, res) => {
    let { cId, cDescription, cStatus } = req.body;
    if (!cId || !cDescription || !cStatus) {
      return res.json({ error: "All filled must be required" });
    }
    try {
      let editCategory = categoryModel.findByIdAndUpdate(cId, {
        cDescription,
        cStatus,
        updatedAt: Date.now(),
      });
      let edit = await editCategory.exec();
      if (edit) {
        return res.json({ success: "Category edit successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static getDeleteCategory = async (req, res) => {
    let { cId } = req.body;
    if (!cId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deletedCategoryFile = await categoryModel.findById(cId);
        const filePath = deletedCategoryFile.cImage.split("/").pop();

        let deleteCategory = await categoryModel.findByIdAndDelete(cId);
        if (deleteCategory) {
          await s3
            .deleteObject({ Bucket: "dinedeal", Key: `caretory/${filePath}` })
            .promise();

          return res.json({ success: "Category deleted successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  static getImages = async (req, res) => {
    try {
      let Images = await customizeModel.find({});
      if (Images) {
        return res.json({ Images });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static uploadSlideImage = async (req, res) => {
    let image = req.file.filename;
    if (!image) {
      return res.json({ error: "All field required" });
    }
    try {
      let newCustomzie = new customizeModel({
        slideImage: image,
      });
      let save = await newCustomzie.save();
      if (save) {
        return res.json({ success: "Image upload successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static deleteSlideImage = async (req, res) => {
    let { id } = req.body;
    if (!id) {
      return res.json({ error: "All field required" });
    } else {
      try {
        let deletedSlideImage = await customizeModel.findById(id);
        const filePath = `../server/public/${deletedSlideImage.slideImage}`;

        let deleteImage = await customizeModel.findByIdAndDelete(id);
        if (deleteImage) {
          // Delete Image from uploads -> customizes folder
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            }
            return res.json({ success: "Image deleted successfully" });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  static getAllData = async (req, res) => {
    try {
      let Categories = await categoryModel.find({}).count();
      let Products = await productModel.find({}).count();
      let Orders = await orderModel.find({}).count();
      let Users = await userModel.find({}).count();
      if (Categories && Products && Orders) {
        return res.json({ Categories, Products, Orders, Users });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static getAllOrders = async (req, res) => {
    try {
      let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Orders) {
        return res.json({ Orders });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static getOrderByUser = async (req, res) => {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let Order = await orderModel
          .find({ user: uId })
          .populate("allProduct.id", "pName pImages pPrice")
          .populate("user", "name email")
          .sort({ _id: -1 });
        if (Order) {
          return res.json({ Order });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  static postCreateOrder = async (req, res) => {
    let { allProduct, user, amount, transactionId, address, phone } = req.body;
    if (
      !allProduct ||
      !user ||
      !amount ||
      !transactionId ||
      !address ||
      !phone
    ) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let newOrder = new orderModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
        });
        let save = await newOrder.save();
        if (save) {
          return res.json({ success: "Order created successfully" });
        }
      } catch (err) {
        return res.json({ error: error });
      }
    }
  };
  static postRozerpayCreateOrder = async (req, res) => {
    const options = {
      amount: req.body.amount, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 0, // 1 for automatic capture, 0 for manual
    };

    try {
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  };

  static capturepayment = async (req, res) => {
    const paymentId = req.body.paymentId;
    const amount = req.body.amount;
    
    var Restaurant = await restaurants.find({
      _id: req.body.id,
    });

    var RestaurantPercentage = Restaurant[0].percentage; 
    var AdminPercentage = 100 - RestaurantPercentage ;

    const Adminamount = (amount * AdminPercentage) / 100;
    const Restaurantamount = (amount * RestaurantPercentage) / 100;

    console.log(Adminamount,"Adminamount");
    console.log(Restaurantamount,"Restaurantamount")

    try {
      const payment = await razorpay.payments.fetch(paymentId);

      const capturedPayment = await razorpay.payments.capture(
        paymentId,
        amount,
        {
          account_id: "acc_OrSg2qF1Z9BrVE",
        }
      );

      const routeRule = {
        transfers: [
          {
            account: "acc_OrSg2qF1Z9BrVE", // Replace with actual account ID
            amount: Math.round(Adminamount), // 60% of the total amount
            currency: "INR",
          },
          {
            account: "acc_OrSTRWnIrD3vtd", // Replace with actual account ID
            amount: Math.round(Restaurantamount), // 40% of the total amount
            currency: "INR",
          },
        ],
      };

      const transferResponse = await razorpay.payments.transfer(
        paymentId,
        routeRule
      );

      res.json(capturedPayment);
    } catch (error) {
      res.status(500).send("Payment capture failed");
    }
  };

  static postUpdateOrder = async (req, res) => {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentOrder = orderModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentOrder.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "Order updated successfully" });
      });
    }
  };
  static postDeleteOrder = async (req, res) => {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        if (deleteOrder) {
          return res.json({ success: "Order deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  static deleteImages(images, mode) {
    var basePath = path.resolve(__dirname + "../../") + "/public/";
    for (var i = 0; i < images.length; i++) {
      let filePath = "";
      if (mode == "file") {
        filePath = basePath + `${images[i].filename}`;
      } else {
        filePath = basePath + `${images[i]}`;
      }
      if (fs.existsSync(filePath)) {
        console.log("Exists image");
      }
      fs.unlink(filePath, (err) => {
        if (err) {
          return err;
        }
      });
    }
  }
  static getAllProduct = async (req, res) => {
    try {
      let Products = await productModel
        .find({})
        .populate("pCategory", "_id cName")
        .sort({ _id: -1 });
      if (Products) {
        return res.json({ Products });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static postAddProduct = async (req, res) => {
    let { pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus } =
      req.body;
    let images = req.files;

    if (
      !pName |
      !pDescription |
      !pPrice |
      !pQuantity |
      !pCategory |
      !pOffer |
      !pStatus |
      !images
    ) {
      return res.json({ error: "All filled must be required" });
    }

    // Validate Name and description
    else if (pName.length > 255 || pDescription.length > 3000) {
      return res.json({
        error: "Name 255 & Description must not be 3000 charecter long",
      });
    }

    // Validate Images
    else if (images.length !== 1) {
      return res.json({ error: "Please Select Single Image" });
    } else {
      try {
        const result = await uploadToS3(req.files[0], "Product");

        let newProduct = new productModel({
          pImages: result.Location,
          pName,
          pDescription,
          pPrice,
          pQuantity,
          pCategory,
          pOffer,
          pStatus,
        });
        let save = await newProduct.save();
        if (save) {
          return res.json({ success: "Product created successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  static postEditProduct = async (req, res) => {
    let {
      pId,
      pName,
      pDescription,
      pPrice,
      pQuantity,
      pCategory,
      pOffer,
      pStatus,
      pImages,
    } = req.body;
    let editImages = req.files;

    // Validate other fileds
    if (
      !pId |
      !pName |
      !pDescription |
      !pPrice |
      !pQuantity |
      !pCategory |
      !pOffer |
      !pStatus |
      !editImages
    ) {
      return res.json({ error: "All filled must be required" });
    }
    // Validate Name and description
    else if (pName.length > 255 || pDescription.length > 3000) {
      return res.json({
        error: "Name 255 & Description must not be 3000 charecter long",
      });
    } else {
      let editData = {
        pName,
        pDescription,
        pPrice,
        pQuantity,
        pCategory,
        pOffer,
        pStatus,
      };
      if (editImages.length == 1) {
        const result = await uploadToS3(editImages[0], "Product");
        let cImage = result.Location;
        editData = { ...editData, pImages: cImage };

        let DeleteProductFile = await productModel.findById(pId);
        const filePath = DeleteProductFile.pImages[0].split("/").pop();

        await s3
          .deleteObject({ Bucket: "dinedeal", Key: `Product/${filePath}` })
          .promise();
      }
      try {
        let editProduct = productModel.findByIdAndUpdate(pId, editData);
        editProduct.exec((err) => {
          if (err) console.log(err);
          return res.json({ success: "Product edit successfully" });
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  static getDeleteProduct = async (req, res) => {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let DeleteProductFile = await productModel.findById(pId);
        let deleteProduct = await productModel.findByIdAndDelete(pId);
        if (deleteProduct) {
          const filePath = DeleteProductFile.pImages[0].split("/").pop();

          await s3
            .deleteObject({ Bucket: "dinedeal", Key: `Product/${filePath}` })
            .promise();

          return res.json({ success: "Product deleted successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  static getSingleProduct = async (req, res) => {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let singleProduct = await productModel
          .findById(pId)
          .populate("pCategory", "cName")
          .populate("pRatingsReviews.user", "name email userImage");
        if (singleProduct) {
          return res.json({ Product: singleProduct });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  static getProductByCategory = async (req, res) => {
    let { catId } = req.body;

    if (!catId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let products = await productModel
          .find({ pCategory: catId })
          .populate("pCategory", "cName");

        console.log(products);
        console.log(catId);

        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Search product wrong" });
      }
    }
  };
  static getProductByPrice = async (req, res) => {
    let { price } = req.body;
    if (!price) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let products = await productModel
          .find({ pPrice: { $lt: price } })
          .populate("pCategory", "cName")
          .sort({ pPrice: -1 });
        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Filter product wrong" });
      }
    }
  };
  static getWishProduct = async (req, res) => {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let wishProducts = await productModel.find({
          _id: { $in: productArray },
        });
        if (wishProducts) {
          return res.json({ Products: wishProducts });
        }
      } catch (err) {
        return res.json({ error: "Filter product wrong" });
      }
    }
  };
  static getCartProduct = async (req, res) => {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let cartProducts = await productModel.find({
          _id: { $in: productArray },
        });
        if (cartProducts) {
          return res.json({ Products: cartProducts });
        }
      } catch (err) {
        return res.json({ error: "Cart product wrong" });
      }
    }
  };
  static postAddReview = async (req, res) => {
    let { pId, uId, rating, review } = req.body;
    if (!pId || !rating || !review || !uId) {
      return res.json({ error: "All filled must be required" });
    } else {
      let checkReviewRatingExists = await productModel.findOne({ _id: pId });
      if (checkReviewRatingExists.pRatingsReviews.length > 0) {
        checkReviewRatingExists.pRatingsReviews.map((item) => {
          if (item.user === uId) {
            return res.json({ error: "Your already reviewd the product" });
          } else {
            try {
              let newRatingReview = productModel.findByIdAndUpdate(pId, {
                $push: {
                  pRatingsReviews: {
                    review: review,
                    user: uId,
                    rating: rating,
                  },
                },
              });
              newRatingReview.exec((err, result) => {
                if (err) {
                  console.log(err);
                }
                return res.json({ success: "Thanks for your review" });
              });
            } catch (err) {
              return res.json({ error: "Cart product wrong" });
            }
          }
        });
      } else {
        try {
          let newRatingReview = productModel.findByIdAndUpdate(pId, {
            $push: {
              pRatingsReviews: { review: review, user: uId, rating: rating },
            },
          });
          newRatingReview.exec((err, result) => {
            if (err) {
              console.log(err);
            }
            return res.json({ success: "Thanks for your review" });
          });
        } catch (err) {
          return res.json({ error: "Cart product wrong" });
        }
      }
    }
  };
  static deleteReview = async (req, res) => {
    let { rId, pId } = req.body;
    if (!rId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let reviewDelete = productModel.findByIdAndUpdate(pId, {
          $pull: { pRatingsReviews: { _id: rId } },
        });
        reviewDelete.exec((err, result) => {
          if (err) {
            console.log(err);
          }
          return res.json({ success: "Your review is deleted" });
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  static getAllRestaurant = async (req, res) => {
    try {
      let Restaurants = await restaurants.find({});
      if (Restaurants) {
        return res.json({ Restaurants });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static getRestaurantById = async (req, res) => {
    try {
      if (req.params.id) {
        let Restaurants = await restaurants.findOne({ _id: req.params.id });
        if (Restaurants) {
          return res.json({ Restaurants });
        }
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (err) {
      console.log(err);
    }
  };
  static postAddRestaurant = async (req, res) => {
    let { restaurantName } = req.body;
    let restaurantImage = req.file.filename;
    const filePath = `../server/public/${restaurantImage}`;
    if (!restaurantName || !restaurantImage) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
        return res.json({ error: "All filled must be required" });
      });
    } else {
      restaurantName = toTitleCase(restaurantName);
      try {
        let newRestaurant = new restaurants({
          restaurantName: restaurantName,
          restaurantImage: restaurantImage,
        });
        await newRestaurant.save((err) => {
          if (!err) {
            return res.json({ success: "Restaurant created successfully" });
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  static getAllUser = async (req, res) => {
    try {
      let Users = await userModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Users) {
        return res.json({ Users });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static getSingleUser = async (req, res) => {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let User = await userModel
          .findById(uId)
          .select("name email phoneNumber userImage updatedAt createdAt");
        if (User) {
          return res.json({ User });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  static postAddUser = async (req, res) => {
    let { allProduct, user, amount, transactionId, address, phone } = req.body;
    if (
      !allProduct ||
      !user ||
      !amount ||
      !transactionId ||
      !address ||
      !phone
    ) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let newUser = new userModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
        });
        let save = await newUser.save();
        if (save) {
          return res.json({ success: "User created successfully" });
        }
      } catch (err) {
        return res.json({ error: error });
      }
    }
  };
  static postEditUser = async (req, res) => {
    let { uId, name, phoneNumber } = req.body;
    if (!uId || !name || !phoneNumber) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentUser = userModel.findByIdAndUpdate(uId, {
        name: name,
        phoneNumber: phoneNumber,
        updatedAt: Date.now(),
      });
      currentUser.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "User updated successfully" });
      });
    }
  };
  static getDeleteUser = async (req, res) => {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentUser = userModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentUser.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "User updated successfully" });
      });
    }
  };
  static changePassword = async (req, res) => {
    let { uId, oldPassword, newPassword } = req.body;
    if (!uId || !oldPassword || !newPassword) {
      return res.json({ message: "All filled must be required" });
    } else {
      const data = await userModel.findOne({ _id: uId });
      if (!data) {
        return res.json({
          error: "Invalid user",
        });
      } else {
        const oldPassCheck = await bcrypt.compare(oldPassword, data.password);
        if (oldPassCheck) {
          newPassword = bcrypt.hashSync(newPassword, 10);
          let passChange = userModel.findByIdAndUpdate(uId, {
            password: newPassword,
          });
          passChange.exec((err, result) => {
            if (err) console.log(err);
            return res.json({ success: "Password updated successfully" });
          });
        } else {
          return res.json({
            error: "Your old password is wrong!!",
          });
        }
      }
    }
  };
  static myDashboard = async (req, res) => {
    try {
      if (req.body.period && req.body.id) {
        var SendData = {
          topStats: {
            totalRevenue: "1",
            totalMoneyFrom3rdParty: "2",
            totalCustomers: "3",
            totalOrders: "4",
            totalRevenueChange: "5",
            totalMoneyFrom3rdPartyChange: "6",
            totalCustomersChange: "7",
            totalOrdersChange: "8",
          },
          graphData: [
            {
              totalRevenue: "Jan 1",
              totalOrders: 8,
            },
            {
              totalRevenue: "Jan 2",
              totalOrders: 9,
            },
          ],
          roas: {
            expense: "10",
            profit: "11",
          },
          ra: {
            overAllRating: "12",
            totalReviews: "13",
            positiveReviews: "14",
            negativeReviews: "15",
            averageReviews: "16",
          },
          kyc: {
            popularLocation: "17",
            popularAgeGroup: "18",
            popularProfession: "19",
            popularDayTime: [20, 21],
          },
        };

        var a = {
          data: SendData,
          message: "Account Create Successfully",
          code: `${HTTP.SUCCESS}`,
        };
        res.status(HTTP.SUCCESS).json(a);
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);

      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static userInsight = async (req, res) => {
    if (req.body.period && req.body.id) {
      var User = await customer.find({
        restaurantID: req.body.id,
      });

      var BirthdaysData = [
        [0, "jan"],
        [0, "Frb"],
        [0, "Mar"],
        [0, "Apr"],
        [0, "May"],
        [0, "Jun"],
        [0, "jul"],
        [0, "Aug"],
        [0, "Sep"],
        [0, "Oct"],
        [0, "Nov"],
        [0, "Dec"],
      ];
      var AnniversariesData = [
        [0, "jan"],
        [0, "Frb"],
        [0, "Mar"],
        [0, "Apr"],
        [0, "May"],
        [0, "Jun"],
        [0, "jul"],
        [0, "Aug"],
        [0, "Sep"],
        [0, "Oct"],
        [0, "Nov"],
        [0, "Dec"],
      ];

      for (var i = 0; i < User.length; i++) {
        console.log(i);

        BirthdaysData[User[i].dateOfBirth.getMonth()][0] =
          BirthdaysData[User[i].dateOfBirth.getMonth()][0] + 1;

        if (User[i].anniversary !== null) {
          AnniversariesData[User[i].anniversary.getMonth()][0] =
            AnniversariesData[User[i].anniversary.getMonth()][0] + 1;
        }
      }

      var SendData = {
        topStats: {
          totalCustomers: 22,
          totalRepeatCustomers: 23,
          totalBirthdays: 24,
          totalAnniversaries: 25,
          totalCustomersChange: 26,
          totalRepeatCustomersChange: 27,
          totalBirthdaysChange: 28,
          totalAnniversariesChange: 29,
        },

        customerTrafficAnalysis: [
          {
            x: 18.564,
            y: 73.7798,
            circleRadius: 30,
            popup: "Baner",
          },
        ],
        customerDetails: {
          Age: [
            {
              key: "20 Or below",
              value: "31",
            },
            {
              key: "21-30",
              value: "32",
            },
            {
              key: "31-40",
              value: "33",
            },
            {
              key: "41-50",
              value: "34",
            },
            {
              key: "50 & Above",
              value: "35",
            },
          ],
          Gender: [
            {
              key: "Male",
              value: "36",
            },
            {
              key: "Female",
              value: "37",
            },
          ],
          Profession: [
            {
              key: "Business",
              value: "38",
            },
            {
              key: "Job",
              value: "39",
            },
            {
              key: "Student",
              value: "40",
            },
            {
              key: "Other",
              value: "41",
            },
          ],
        },
        occasions: {
          birthdays: BirthdaysData,
          anniversaries: AnniversariesData,
        },
        graph: [
          {
            key: "jan 3",
            value: "66",
          },
          {
            key: "jan 4",
            value: "67",
          },
        ],
        Table: [
          {
            item: 68,
            qty: 69,
            price: 70,
          },
          {
            item: 71,
            qty: 72,
            price: 73,
          },
          {
            item: 74,
            qty: 75,
            price: 76,
          },
          {
            item: 77,
            qty: 78,
            price: 79,
          },
          {
            item: 80,
            qty: 81,
            price: 82,
          },
        ],
      };

      var a = {
        data: SendData,
        message: "Account Create Successfully",
        code: `${HTTP.SUCCESS}`,
      };
      res.status(HTTP.SUCCESS).json(a);
    } else {
      var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
      res.status(HTTP.BAD_REQUEST).json(a);
    }
  };
  static reviewInsight = async (req, res) => {
    try {
      if (req.body.period && req.body.id) {
        var SendData = {
          reviews: {
            recentReviews: [
              {
                name: "83",
                rating: "84",
                review: "85",
              },
              {
                name: "86",
                rating: "87",
                review: "88",
              },
              {
                name: "89",
                rating: "90",
                review: "91",
              },
              {
                name: "92",
                rating: "93",
                review: "94",
              },
            ],
            topPositiveReviews: [
              {
                name: "95",
                rating: "96",
                review: "97",
              },
              {
                name: "98",
                rating: "99",
                review: "100",
              },
              {
                name: "101",
                rating: "102",
                review: "103",
              },
              {
                name: "104",
                rating: "105",
                review: "106",
              },
            ],
            topNegativeReviews: [
              {
                name: "107",
                rating: "108",
                review: "109",
              },
              {
                name: "110",
                rating: "111",
                review: "112",
              },
              {
                name: "113",
                rating: "114",
                review: "115",
              },
              {
                name: "116",
                rating: "117",
                review: "118",
              },
            ],
          },
          employeeLast10Reviews: [
            {
              _id: "119",
              employee: {
                name: "120",
                iimag: "https://picsum.photos/536/354",
              },
              review: {
                service: "121",
              },
              employeeID: "122",
              comment: "123",
              bg: "124",
              count: "125",
              count2: "126",
              title: "Average Rating",
              iimag: "https://picsum.photos/536/354",
            },
            {
              _id: "127",
              employee: {
                name: "128",
                iimag: "https://picsum.photos/536/354",
              },
              review: {
                service: "129",
              },
              employeeID: "130",
              comment: "131",
              bg: "132",
              count: "133",
              count2: "134",
              title: "Total Reviews",
              iimag: "https://picsum.photos/536/354",
            },
            {
              _id: "135",
              employee: {
                name: "136",
                iimag: "https://picsum.photos/536/354",
              },
              review: {
                service: "137",
              },
              employeeID: "138",
              comment: "139",
              bg: "140",
              count: "141",
              count2: "142",
              title: "Response Rate",
              iimag: "https://picsum.photos/536/354",
            },
          ],
          ratings: {
            ratings: [
              {
                rating: "143",
                count: "144",
              },
              {
                rating: "145",
                count: "146",
              },
              {
                rating: "147",
                count: "148",
              },
              {
                rating: "149",
                count: "150",
              },
              {
                rating: "151",
                count: "152",
              },
            ],
            averageRating: "153",
            totalReviews: "154",
          },
          topStats: [
            {
              key: "jan 5",
              value: "155",
            },
            {
              key: "jan 6",
              value: "156",
            },
          ],
          percentageData: "157",
        };

        var a = {
          data: SendData,
          message: "Account Create Successfully",
          code: `${HTTP.SUCCESS}`,
        };
        res.status(HTTP.SUCCESS).json(a);
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);

      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static competitor = async (req, res) => {
    try {
      var SendData = {
        data: {
          myRestaurant: {
            averageRating: "4.83",
            totalReviews: "210",
          },
          competitorsRestaurant: {
            averageRating: "3.83",
            totalReviews: "110",
          },
          ratingComparison: {
            Overall: {
              myRestaurant: 10,
              competitorsRestaurant: 20,
            },
            Food: {
              myRestaurant: 30,
              competitorsRestaurant: 40,
            },
            Ambience: {
              myRestaurant: 50,
              competitorsRestaurant: 60,
            },
            Costing: {
              myRestaurant: 70,
              competitorsRestaurant: 80,
            },
            Service: {
              myRestaurant: 90,
              competitorsRestaurant: 85,
            },
            Reviews: {
              myRestaurant: 75,
              competitorsRestaurant: 65,
            },
            Revenuevalues: {
              myRestaurant: 55,
              competitorsRestaurant: 45,
            },
            CustomerDataValues: {
              myRestaurant: 35,
              competitorsRestaurant: 25,
            },
            MarketingDataValueds: {
              myRestaurant: 15,
              competitorsRestaurant: 5,
            },
          },
        },
        message: "Account Create Successfully",
        code: `${HTTP.SUCCESS}`,
      };

      res.status(HTTP.SUCCESS).json(SendData);
    } catch (e) {
      console.log(e);

      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static Invoice = async (req, res) => {
    try {
      if (req.params.id) {
        var Restaurant = await restaurants.findOne({
          _id: req.params.id,
        });

        var SendData = {
          Balance: Restaurant.Balance,
          History: [
            {
              Date: "06 March 2023",
              Time: "15:02",
              Amount: 400,
              AmountType: "In",
            },
            {
              Date: "06 March 2023",
              Time: "15:02",
              Amount: 500,
              AmountType: "Out",
            },
          ],
        };

        var a = {
          data: SendData,
          message: "Account Create Successfully",
          code: `${HTTP.SUCCESS}`,
        };
        res.status(HTTP.SUCCESS).json(a);
      } else {
        var a = { message: "Insufficient Data", status: `${HTTP.BAD_REQUEST}` };
        res.status(HTTP.BAD_REQUEST).json(a);
      }
    } catch (e) {
      console.log(e);

      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static Dummy = async (req, res) => {
    try {
      const routeRule = {
        transfers: [
          {
            account: "acc_OrSg2qF1Z9BrVE", // Replace with actual account ID
            amount: Math.round(100), // 60% of the total amount
            currency: "INR",
          },
          {
            account: "acc_OrSTRWnIrD3vtd", // Replace with actual account ID
            amount: Math.round(100), // 40% of the total amount
            currency: "INR",
          },
        ],
      };

      const transferResponse = await razorpay.payments.transfer(
        "pay_OsIQVNROKueaR5",
        routeRule
      );
      console.log(transferResponse.items);
    } catch (e) {
      console.log(e);

      var a = { message: `${e}`, status: `${HTTP.INTERNAL_SERVER_ERROR}` };
      res.status(HTTP.INTERNAL_SERVER_ERROR).json(a);
    }
  };
  static Dummy2 = async (req, res) => {
    var amount = 200;
    var payment_id = "pay_OsIQVNROKueaR5";

    if (!payment_id || !amount) {
      return res
        .status(400)
        .json({ error: "Payment ID and amount are required" });
    }

    try {
      const response = await axios.post(
        "https://api.razorpay.com/v1/settlements/instant",
        { payment_id, amount },
        {
          auth: {
            username: "rzp_live_lkuqq6mCeVxpCU",
            password: "mzdi9VlZdM10Sei6j5baVcDN",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Send the response from Razorpay back to the client
      res.status(200).json(response.data);
    } catch (error) {
      // Handle errors appropriately
      console.error(
        "Error initiating instant settlement:",
        error.response.data
      );
      res.status(500).json({ error: "Failed to initiate instant settlement" });
    }
  };
}

module.exports = { class1 };
