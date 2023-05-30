# face recog
import face_recognition as fr
import os
import cv2
import face_recognition
import numpy as np

#open AI
import openAI


def getEncodedFace():
    """
    Encodes all faces present in 'faces' folder
    return: dictionaries of (name, imageEncoded)
    """
    encoded = {}

    for dirpath, dnames, fnames in os.walk("./faces"):
        for f in fnames:
            if f.endswith(".jpg") or f.endswith(".png"):
                face = fr.load_image_file("faces/" + f)
                encoding = fr.face_encodings(face)[0]
                encoded[f.split(".")[0]] = encoding

    return encoded


def imageEncoded(img):
    """
    :paramaeter: img = file name
    Encode a face 
    return: encoded face
    """
    face = fr.load_image_file("faces/" + img)
    encoding = fr.face_encodings(face)[0]

    return encoding


def classify_face(im):
    """
    classify all faces in a given jpg and label them if find match

    paramaeter: im = file path in string
    return: list of face names
    """
    faces = getEncodedFace()
    faces_encoded = list(faces.values())
    known_face_names = list(faces.keys())

    img = cv2.imread(im, 1)

    face_locations = face_recognition.face_locations(img)
    unknown_face_encodings = face_recognition.face_encodings(img, face_locations)

    face_names = []
    for face_encoding in unknown_face_encodings:
        # See if the face is a match for the known face(s)
        matches = face_recognition.compare_faces(faces_encoded, face_encoding)
        name = "Unknown"

        # use the known face with the smallest distance to the new face
        face_distances = face_recognition.face_distance(faces_encoded, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = known_face_names[best_match_index]
            
        face_names.append(name)
    return face_names


def revImgReport(filename):
    filePath = 'static/uploads/' + filename
    searchResults = classify_face(filePath)
    # print(searchResults)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    }
    # if no face detected
    if not searchResults:
        with open('report.txt', 'w',encoding='utf=8') as fh:
            fh.write('No face detected.')
            fh.close()
        return 0
    # if unknown in database
    elif searchResults[0] == "Unknown":
        with open('report.txt', 'w',encoding='utf=8') as fh:
            fh.write("Person not found in database/More than one person in image.")
            fh.close()
        return 0
    # if more than one person found in image
    elif len(searchResults) >= 2:
        with open('report.txt', 'w',encoding='utf=8') as fh:
            fh.write("Person not found in database/More than one person in image.")
            fh.close()
        return 0
    #open AI
    report  = openAI.OPENAI("write me a 300 words report of" + searchResults[0])
    # create txt file
    try:
        with open('report.txt', 'w',encoding='utf=8') as fh:
            fh.write(report)
            fh.close()
            return 1
            
    except FileNotFoundError:
        with open('report.txt', 'w',encoding='utf=8') as fh:
            fh.write("internal error :(")
            fh.close()
            return 0


    

    
  


