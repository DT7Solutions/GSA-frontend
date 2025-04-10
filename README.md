# -gowrishankar-frontend


# github page for front end 

npm install gh-pages --save-dev
git init 
git add .
git status

******************************************

package.json changes:

"homepage": "https://(github username).github.io/(repo name)"
https://DT7Solutions.github.io/GSA-frontend
"predeploy": "npm run build"
"deploy": "gh-pages -d build"

npm run deploy

<!-- alert  -->
Swal.fire({
        title: "Login Success",
        text: "Login Successful!",
        icon: "success, error, warning, info",
        confirmButtonText: "OK",
    });


 <!-- deployed     -->
 1. npm run build
 >> cp -r build/* /var/www/html