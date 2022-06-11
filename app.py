"""
@author: Lauro Ribeiro
"""
from chatbot_function import *
import flask
import time
from flask import Flask, render_template, request
import tempfile  
import speech_recognition as sr

global emotion_array
emotion_array = []

app = Flask(__name__)
app.static_folder = 'static'

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    return str(chatbot_response(userText))

@app.route("/transcriptaudio", methods=["POST"])
def get_audio_transcription():
    if 'audio' not in request.files:
        return 'missing audio file'
    
    audioBlob = request.files['audio']

    # storing uploaded data on a temp file to use as AudioFile
    fp = tempfile.TemporaryFile()
    audioBlob.save(fp)
    fp.seek(0)

    # use the audio file as the audio source
    r = sr.Recognizer()
    with sr.AudioFile(fp) as source:
        audio = r.record(source)  # read the entire audio file

    audio_transcription = ''
    
    # recognize speech using Google Speech Recognition
    try:
        # for testing purposes, we're just using the default API key
        # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
        # instead of `r.recognize_google(audio)`
        audio_transcription = r.recognize_google(audio)
    
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
        audio_transcription = '(didn\'t understand)'
        
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
        audio_transcription = '(transcription failed)'
 
    
        return None
    return chatbot_response(audio_transcription)
 

@app.route("/getsentiment")
def get_bot_sentiment():
    time.sleep(2)
    userText = request.args.get('msg')
    sent_msg = [userText]
    emotion_pred = sentiment_response(sent_msg)
    emotion_array.append(emotion_pred)
    mood = mood_state(emotion_array)

    if emotion_pred=="joy":
        emotion_cond = "Joy 😄"
    elif emotion_pred=="fear":
        emotion_cond = "Fear 😰"
    elif emotion_pred=="anger":
        emotion_cond = "Angry 😡"
    elif emotion_pred=="sadness":
        emotion_cond = "Sadness 😢"
    elif emotion_pred=="neutral":
        emotion_cond = "Neutral 😐"
    else:
        emotion_cond = "Neutral 😐"

    return str('Based on my sentiment calculation you are currently feeling: <br><br> <i>Emotion:</i> <b>"'+emotion_cond+'"</b>  <br> <i>Mood State:</i> <b>"'+mood+'"<b>')

if __name__ == "__main__":
    app.debug = True
    app.run()
    
    