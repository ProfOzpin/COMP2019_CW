from flask import Flask, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from flask_cors import CORS
from flask_cors import cross_origin
import os
import face_rec
import time


app = Flask(__name__)
cors = CORS(app)

UPLOAD_FOLDER = 'static/uploads/'

app.secret_key = "webscrapemaster"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Validate uploaded file type
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Save user image upload into specified folder
@app.route('/api/upload', methods=['POST'])
@cross_origin()
def upload_image():
    file = request.files['file']
    if file and allowed_file(file.filename):
        file = request.files['file']
        filename = secure_filename(file.filename)
        basedir = os.path.abspath(os.path.dirname(__file__))
        file.save(os.path.join(basedir, app.config['UPLOAD_FOLDER'], filename))

        # Switch function to warn user that the picture entered is invalid (more than 1 person/no matching person) or no faces is detected is found
        switch = face_rec.revImgReport(filename)
        match switch:
            case 0:
                with open('report.txt', 'r', encoding='utf=8') as f:
                    content = f.read()
                    return render_template('result.html', filename=filename, content=content)
            case 1:
                time.sleep(5)
                with open('report.txt', 'r', encoding='utf=8') as f:
                    content = f.read()
                    return render_template('result.html', filename=filename, content=content)
    else:
        with open('report.txt', 'w+', encoding='utf=8') as f:
            f.write("Wrong file type! Please only input images.")
            content = f.read()
            return render_template('result.html', content=content)

@app.route('/display/<filename>')
def display_image(filename):
    return redirect(url_for('static', filename='uploads/' + filename), code=301)


if __name__ == "__main__":
    app.run(debug=True)
