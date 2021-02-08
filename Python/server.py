from flask_restful import Resource, Api
from flask_cors import CORS
from swen_344_db_utils import *
from endpoints import *
from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__)
CORS(app)


api = Api(app) #api router

api.add_resource(Users,'/users')
api.add_resource(ChangeKey,'/change')
api.add_resource(EmailValidate,'/emailvalidate/<email>')
api.add_resource(CompanyValidate,'/companyvalidate/<company>')
api.add_resource(SimpleTest,'/test')
api.add_resource(AddDataset,'/adddataset')
api.add_resource(IsPrivate,'/isprivate/<company>/<topic>')
api.add_resource(DatasetLogin,'/datasetlogin/<company>/<topic>/<password>')
api.add_resource(SetSize,'/setsize/<company>/<topic>/<general>/<size>')
api.add_resource(GetSizes,'/getsizes/<key>')
api.add_resource(VerifyEmail,'/verifyemail/<code>')



if __name__ == '__main__':
    print("Loading db")
    print("Starting flask")
    app.run(host='0.0.0.0')



    