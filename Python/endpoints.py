from flask_restful import Resource
import secrets
from flask_restful import request
from flask_restful import reqparse
import json
from swen_344_db_utils import *
from hashlib import sha256
import requests
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

parser = reqparse.RequestParser()
parser.add_argument('email')
parser.add_argument('password')
parser.add_argument('name')
parser.add_argument('key')
parser.add_argument('general')


class Users(Resource):
    def put(self):
        args = parser.parse_args()
        hashedWord = sha256(args['password'].encode('utf-8')).hexdigest()
        result = exec_get_one("SELECT upload_key FROM users WHERE email = %s AND password = %s AND verified=true",
                              (args['email'], hashedWord))
        try:
            return result[0]
        except:
            return ""

    def post(self):
        args = parser.parse_args()
        hashedWord = sha256(args['password'].encode('utf-8')).hexdigest()
        email = args['email']
        name = args['name']
        results = exec_get_one("SELECT id FROM users WHERE email=%s OR name=%s", (email, name))
        try:
            print(results[0])
            return "Account with that information already exists!"
        except:
            pass
        if name == "General":
            return ""
        new_upload_key = hex(secrets.randbits(256))
        verified = False
        new_verification_code = hex(secrets.randbits(128))
        exec_commit("INSERT INTO users (email,password,name,upload_key,verified,verification_code) VALUES(%s,%s,%s,%s,%s,%s)",
                    (email, hashedWord, name, new_upload_key,verified,new_verification_code))
        # json_dict = {'name': name, 'new_key': new_upload_key}
        # res = requests.post('http://127.0.0.1:8080/softsort/addcompany', json=json_dict)

        sender = "softsortverify@gmail.com"
        sender_password = "A$Lj#72DxLh$MRxn$t3q&djy"
        subject = "Verify your Softsort account!"
        html = "<html><head></head><body><h2>Hello, thanks for signing up for a Softsort account!  Click on the link below to verify your new account.</h2><br> <a href=\"http://www.softsort.org/verify/"+new_verification_code+"\">Verify!</a> </body></html>"
        msg = MIMEMultipart('alternative')
        msg['From'] = sender
        msg['To'] = email
        msg['Subject'] = subject
        part1 = MIMEText(html,'html')
        msg.attach(part1)
        server = smtplib.SMTP_SSL('smtp.gmail.com',465)
        server.ehlo()
        server.login(sender,sender_password)
        server.sendmail(sender,email,msg.as_string())
        server.close()


        return "Account created! Check your email to verify."


class ChangeKey(Resource):
    def put(self):
        args = parser.parse_args()
        hashedWord = sha256(args['password'].encode('utf-8')).hexdigest()
        email = args['email']
        new_upload_key = hex(secrets.randbits(256))
        exec_commit("UPDATE users SET upload_key=%s", (new_upload_key,))
        result = exec_get_one("SELECT name FROM users WHERE email = %s AND password = %s  AND verified=true",
                              (args['email'], hashedWord))
        try:
            print(result[0])
            pass
        except:
            return "No account found!"
        company = result[0]
        json_dict = {'name': company, 'new_key': new_upload_key}
        res = requests.put('http://127.0.0.1:8080/softsort/changekey', json=json_dict)

        return new_upload_key


class EmailValidate(Resource):
    def get(self, email):
        result = exec_get_one("SELECT id FROM users WHERE email=%s", (email,))
        try:
            print(result[0])
            return False
        except:
            return True


class CompanyValidate(Resource):
    def get(self, company):
        if company == "General":
            return False
        result = exec_get_one("SELECT id FROM users WHERE name=%s", (company,))
        try:
            print(result[0])
            return False
        except:
            return True


class AddDataset(Resource):
    def post(self):
        args = parser.parse_args()
        key = args['key']
        user_id_result = exec_get_one("SELECT id FROM users WHERE upload_key=%s  AND verified=true", (key,))
        user_id = -1
        try:
            print(user_id_result[0])
            user_id = user_id_result[0]
            pass
        except:
            return False
        password = sha256(args['password'].encode('utf-8')).hexdigest()
        name = args['name']
        name = re.sub("[^a-zA-Z0-9]+", "", name)
        general = args['general']
        already_exists = exec_get_one("SELECT id FROM datasets WHERE user_id=%s AND name=%s AND general=%s", (user_id, name,general))
        found = False
        try:
            print(already_exists[0])
            found = True
        except:
            found = False

        if found:
            exec_commit("UPDATE datasets SET password=%s WHERE id = %s", (password,already_exists[0]))
            return True

        password = sha256(args['password'].encode('utf-8')).hexdigest()

        exec_commit("INSERT INTO datasets (name,user_id,password,general ) VALUES (%s,%s,%s,%s)", (name, user_id, password,general))
        return True

    def delete(self):
        args = parser.parse_args()
        key = args['key']
        name = args['name']
        general = args['general']
        if general=="General":
            general = True
        else:
            general = False
        result = exec_get_one("SELECT datasets.id FROM datasets INNER JOIN users on datasets.user_id = users.id WHERE users.upload_key=%s AND datasets.name=%s AND datasets.general=%s", (key, name,general))
        print(result[0])
        try:
            exec_commit("DELETE FROM datasets WHERE id=%s",(result[0],))
        except:
            return


class IsPrivate(Resource):
    def get(self, company, topic):
        print("Called isPrivate!")
        user_id_result = exec_get_one("SELECT id FROM users WHERE name=%s", (company,))
        user_id = -1
        try:
            print(user_id_result[0])
            user_id = user_id_result[0]
            pass
        except:
            return False
        dataset_result = exec_get_one("SELECT password FROM datasets WHERE user_id=%s AND name=%s", (user_id, topic))
        try:
            print(dataset_result[0])
            if dataset_result[0] == sha256("".encode('utf-8')).hexdigest():
                return False
            return True
        except:
            return False


class DatasetLogin(Resource):
    def get(self, company, topic, password):
        company = company.replace("~", " ")
        topic = topic.replace("~", " ")
        password = password.replace("~", " ")
        if password == "$":
            password = ""
        user_id_result = exec_get_one("SELECT id FROM users WHERE name=%s", (company,))
        user_id = -1
        try:
            print(user_id_result[0])
            user_id = user_id_result[0]
            pass
        except:
            return False
        if not IsPrivate.get(self, company, topic):
            return True
        company_loaded_result = exec_get_one("SELECT id FROM datasets WHERE user_id=%s AND name=%s", (user_id, topic))
        try:
            print(company_loaded_result[0])
            pass
        except:
            print("This account has not been finalized yet!")
            return True
        hashed_pass = sha256(password.encode('utf-8')).hexdigest()
        found_result = exec_get_one("SELECT id FROM datasets WHERE user_id=%s AND name=%s AND password=%s",
                                    (user_id, topic, hashed_pass))
        try:
            print(found_result[0])
            return True
        except:

            return False

class SetSize(Resource):
    def get(self,company,topic,general,size):
        company = company.replace("~", " ")
        topic = topic.replace("~", " ")
        result = exec_get_one("SELECT datasets.id FROM datasets INNER JOIN users ON datasets.user_id=users.id WHERE users.name = %s AND datasets.name = %s AND datasets.general=%s",(company,topic,general))
        try:
            exec_commit("UPDATE datasets SET rows=%s WHERE id = %s",(size,result[0]))
        except:
            return


class GetSizes(Resource):
    def get(self,key):
        result = exec_get_all("SELECT datasets.name,datasets.rows,datasets.general FROM datasets INNER JOIN users ON datasets.user_id=users.id WHERE users.upload_key=%s",(key,))
        return result

class VerifyEmail(Resource):
    def get(self,code):
        verified = False
        result = exec_get_one("SELECT id,name,upload_key FROM users WHERE verification_code=%s AND verified=%s",(code,verified))
        try:
            print(result[0])
            verified = True
            exec_commit("UPDATE users SET verified=%s WHERE id=%s",(verified,result[0]))
            json_dict = {'name': result[1], 'new_key': result[2]}
            res = requests.post('http://127.0.0.1:8080/softsort/addcompany', json=json_dict)
            return True
        except:
            new_result = exec_get_one("SELECT id FROM users WHERE verification_code=%s",(code,))
            try:
                print(new_result[0])
                return True
            except:
                return False

class SimpleTest(Resource):
    def get(self):
        print("Got")
        return "Hello, world!"

