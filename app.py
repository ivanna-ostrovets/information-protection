from flask import Flask, request, render_template
from lab_1 import *

app = Flask(__name__)

default_key = 9
default_input = "OSTROVETSIVANNAANATOLIIVNA"
default_data = {
    'additive_key': default_key,
    'multiplicative_key': default_key,
    'affine_key_1': default_key,
    'affine_key_2': default_key + 3,
    'additive_input': default_input,
    'multiplicative_input': default_input,
    'affine_input': default_input,
}

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/labs/1", methods=["GET", "POST"])
def lab_1():
    return render_template("lab_1.html", data=default_data)


@app.route("/ciphers/additive", methods=["POST"])
def additive():
    data = request.form

    if data["cipher_mode"] == "encrypt":
        output = additive_cipher_encrypt(int(data["key"]), data["input"])
    elif data["cipher_mode"] == "decrypt":
        output = additive_cipher_decrypt(int(data["key"]), data["input"])
    
    form_data = dict(
        default_data,
        additive_key=data["key"],
        additive_input=data["input"],
        additive_output=output,
    )

    return render_template("lab_1.html", data=form_data)


@app.route("/ciphers/multiplicative", methods=["POST"])
def multiplicative():
    data = request.form

    if data["cipher_mode"] == "encrypt":
        output = multiplicative_cipher_encrypt(int(data["key"]), data["input"])
    elif data["cipher_mode"] == "decrypt":
        output = multiplicative_cipher_decrypt(int(data["key"]), data["input"])
    
    form_data = dict(
        default_data,
        multiplicative_key=data["key"],
        multiplicative_input=data["input"],
        multiplicative_output=output,
    )

    return render_template("lab_1.html", data=form_data)


@app.route("/ciphers/affine", methods=["POST"])
def affine():
    data = request.form

    if data["cipher_mode"] == "encrypt":
        output = affine_cipher_encrypt(int(data["key_1"]), int(data["key_2"]), data["input"])
    elif data["cipher_mode"] == "decrypt":
        output = affine_cipher_decrypt(int(data["key_1"]), int(data["key_2"]), data["input"])
    
    form_data = dict(
        default_data,
        affine_key_1=data["key_1"],
        affine_key_2=data["key_2"],
        affine_input=data["input"],
        affine_output=output,
    )
    
    return render_template("lab_1.html", data=form_data)


if __name__ == "__main__":
    app.run(port=3000, debug=True)