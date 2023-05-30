# COMP2019_CW
User Manual for Software Engineering Group Project Group B.

## Introduction
This user manual provides instructions on how to use the application.
This application is built using Python for the backend, Flask for the API, and React for the frontend. 
The application provides users with a platform to preform face recognition to generate a report about the subject.

## Prerequisites
Before using the application, make sure that you have the following software installed on your machine:<br />
*Python <br />
*Node.js<br />
*npm (Node Package Manager)<br />
<br />
Note that we are using OpenAI's GPT-3 API which requires an API key. Please follow these instructions to generate your own API key.
1) Create an account in [OpenAI](https://chat.openai.com/auth/login).
2) Create new secret key at this [link](https://platform.openai.com/account/api-keys).
3) Replace the current key in openAI.py located in front-end/back-end folder.

## Getting Started
To get started with the application, follow these steps:
1) Clone the repository to your local machine. <br />
2) Navigate to the project directory. <br />
3) Install the necessary dependencies for the backend by running pip install -r requirements.txt in your terminal. <br />
4) Navigate to the frontend directory and install the necessary dependencies for the frontend by running npm install. <br />
5) Start the backend server by running "python app.py" in your terminal. <br />
6) Start the frontend server by running "npm start" in a separate terminal window. <br />
Or just follow the below instructions for more detailed information <br />


## Installing python requirements.txt <br />
1) Make sure you have Python ver 3.10 or above and pip installed on your machine.<br /> 
2) If you do not have cmake, please install that too from this [link](https://cmake.org/download/).<br />
3) Navigate to the directory where your Python project is located. <br />
4) Run the following command to install the packages listed in your requirements file: <br />
```
pip install -r requirements.txt <br />
```
This will install all the packages listed in your requirements.txt file, along with their respective versions. <br />
<br />
## Troubleshooting face_recognition package
Please go to the following [link](https://stackoverflow.com/questions/52332268/pip-install-face-recognition-giving-error) for help if encounter any issue with installing face_recognition package<br />


## Setting up a React and Flask project

## How to run
Step 1 <br />
```
npm create vite@latest
```
Step 2 <br />
use the following command to get into main folder(front-end)<br />
```
cd .\your_folder\
```
Step 3<br />
```
npm install
```

Step 4 <br />
Finally, start your React and Flask applications by running the following commands in separate terminal windows:

run the following line in back-end directory<br />
```
flask run
```
run the following line in front-end directory<br />
```
npm run dev
```

