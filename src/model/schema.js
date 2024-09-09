var mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema({
    holderName: { type: String, default: null },
    accountNumber: { type: String, default: null },
    ifscCode: { type: String, default: null },
    pinCode: { type: String, default: null }
  });

const GeoLocationSchema = new mongoose.Schema({
  Address: { type: String, default: null },
  Latitude: { type: String, default: null },
  Longitude: { type: String, default: null }
});

const restaurantSchema = new mongoose.Schema({

  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String , required: true },
  businessName: { type: String },
  personalName: { type: String },
  pinCode: { type: String },
  city: { type: String },
  phone: { type: String },
  panNumber: { type: String },
  gstNumber: { type: String },
  wpBusinessAPINumber: { type: String },
  facebookManagerId: { type: String },
  bankDetails: { type: bankDetailsSchema, default: {} },
  userRole: { type: Number },
  Balance: {type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  GeoLocation : {
    type: GeoLocationSchema, default: {}
  },
  Status:{
    type: String
  },
  percentage:{
    type: String
  }
  // phoneNumber: { type: Number } ,
  // userImage: { type: String, default: "user.png" } ,
  // restaurantImage: { type: String } ,
  // name: { type: String , maxlength: 32 },
  // restaurantName: { type: String } ,

});

var restaurants = mongoose.model('restaurant', restaurantSchema);

const MessageSchema = new mongoose.Schema({
  TemplatePicture: { type: String, default: null },
  TemplateDescription: { type: String, required: true },
  phone: { type: String, required: true },
},{ timestamps: true });

var Message = mongoose.model('Message', MessageSchema);

const AdminSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
},{ timestamps: true });

var AdminAccount = mongoose.model('AdminAccount', AdminSchema);

const OrderSchema = new mongoose.Schema({
  restaurantID: {
    type: mongoose.Schema.Types.ObjectId
  },
  whatsappNumber: {
    type: String
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId
  },
  orderID: {
    type: String
  },
  orderMetaData: {
    billAmount: {
      type: Number
    },
    promoCode: {
      type: String
    },
    useCoins: {
      type: String,
      enum : [false, true]
    },
    promoDiscount: {
      type: Number,
    },
    coinsDiscount: {
      type: Number,
    },
    payableAmount: {
      type: Number,
    }
  },
  paymentIds: {
    type: Array
  },
  paymentStatus: {
    type: String
  },
  createdAt: {
    type: Date
  }
},{ timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

const UserSchema = new mongoose.Schema({
  restaurantID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  whatsappNumber: {
    type: String,
  },
  name: {
    type: String,
  },
  area: {
    address: {
      type: String
    },
    latLng: {
      lat: {
        type: String
      },
      lng: {
        type: String
      }
    }
  },
  googleSignInToken: {
    type: String
  },
  relationShipStatus: {
    type: String,
    default: null
  },
  gender: {
    type: Number
  },
  anniversary: {
    type: Date,
    default: null
  },
  haveFoodDeliveryApp: {
    type: Boolean,
    default: null
  },
  ageGroup: {
    type: Number,
    default: null
  },
  profession: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date
  },
  updateCount: {
    type: Number
  }
},{ timestamps: true });

const customer = mongoose.model('customer', UserSchema);

const categorySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId
    },
    cName: {
      type: String,
      required: true,
    },
    cDescription: {
      type: String,
      required: true,
    },
    cImage: {
      type: String,
    },
    cStatus: {
      type: String,
      required: true,
    },
  },{ timestamps: true });

const categoryModel = mongoose.model("categories", categorySchema);

const customizeSchema = new mongoose.Schema(
  {
    slideImage: {
      type: String,
    },
    firstShow: {
      type: Number,
      default: 0,
    },
  },{ timestamps: true });

const customizeModel = mongoose.model("customizes", customizeSchema);

const OnlineorderSchema = new mongoose.Schema(
  {
    allProduct: [
      {
        id: { type: mongoose.Schema.Types, ref: "products" },
        quantitiy: Number,
      },
    ],
    user: {
      type: mongoose.Schema.Types,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },{ timestamps: true });

const orderModel = mongoose.model("orders", OnlineorderSchema);

const UserproductSchema = new mongoose.Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    pDescription: {
      type: String,
      required: true,
    },
    pPrice: {
      type: Number,
      required: true,
    },
    pSold: {
      type: Number,
      default: 0,
    },
    pQuantity: {
      type: Number,
      default: 0,
    },
    restaurantId:{
      type: String
    },
    categoriesId:{
      type: mongoose.Schema.Types,
      ref: "categories",
    },
    pCategory: {
      type: mongoose.Schema.Types,
      ref: "categories",
    },
    pImages: {
      type: Array,
      required: true,
    },
    pOffer: {
      type: String,
      default: null,
    },
    pRatingsReviews: [
      {
        review: String,
        user: { type: mongoose.Schema.Types, ref: "users" },
        rating: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    pStatus: {
      type: String,
      required: true,
    },
  },{ timestamps: true });

const productModel = mongoose.model("products", UserproductSchema);

const SMSCheckSchema = new mongoose.Schema(
  {
    whatsappNumber: {
      type: String
    },
    randomNumber: {
      type: String,

    },
  },{ timestamps: true });

const SMSCheckModel = mongoose.model("SMSCheck", SMSCheckSchema);

const EmployeeSchema = new mongoose.Schema(
  {
    restaurantID: {
      type: String
    },
    Name: {
      type: String,
    }
  },{ timestamps: true });

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

const RestaurantReviewSchema = new mongoose.Schema(
  {
    RestaurantID: {
      type: String
    },
    Ambience: {
      type: String
    },
    Costing: {
      type: String,
    },
    Food: {
      type: String,
    }
  },{ timestamps: true });

const RestaurantReviewModel = mongoose.model("RestaurantReview", RestaurantReviewSchema);

const EmployeeReviewSchema = new mongoose.Schema(
  {
    EmployeeID: {
      type: String
    },
    RestaurantID: {
      type: String
    },
    service: {
      type: String,
    },
    comment: {
      type: String,
    }
  },{ timestamps: true });

const EmployeeReviewModel = mongoose.model("EmployeeReview", EmployeeReviewSchema);

const TemplateSchema = new mongoose.Schema(
  {
    RestaurantID: {
      type: String
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    Type:{
      type: String
    }
  },{ timestamps: true });

const TemplateModel = mongoose.model("Template", TemplateSchema);

module.exports = { restaurants , Message , AdminAccount , Order , customer , categoryModel , categoryModel , orderModel , productModel  , SMSCheckModel , EmployeeModel , RestaurantReviewModel , EmployeeReviewModel , customizeModel , TemplateModel };