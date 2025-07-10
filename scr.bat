mkdir simple-ecommerce-api
cd simple-ecommerce-api

:: Root files
echo DB_URI=your_db_uri_here> .env
echo node_modules/> .gitignore
echo { } > package.json
echo // server entry > server.js

:: Config
mkdir config
echo // DB connection logic > config\db.js

:: Controllers
mkdir controllers
echo // auth logic > controllers\authController.js
echo // product CRUD logic > controllers\productController.js
echo // cart logic > controllers\cartController.js
echo // order creation logic > controllers\orderController.js

:: Middleware
mkdir middleware
echo // JWT middleware > middleware\authMiddleware.js

:: Models
mkdir models
echo // user schema > models\userModel.js
echo // product schema > models\productModel.js
echo // order schema > models\orderModel.js

:: Routes
mkdir routes
echo // auth routes > routes\authRoutes.js
echo // product routes > routes\productRoutes.js
echo // cart routes > routes\cartRoutes.js
echo // order routes > routes\orderRoutes.js

:: Public frontend (optional)
mkdir public
echo <!DOCTYPE html> > public\index.html
echo // frontend script > public\script.js
