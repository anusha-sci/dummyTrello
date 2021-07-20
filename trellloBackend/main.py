from app import app, mongo
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash


@app.route("/companies")
def companies():
    companies = mongo.db.company.find()
    resp = dumps(companies)
    return resp


@app.route("/addCompany", methods=["POST"])
def add_company():
    _json = request.json
    _companyName = _json["companyName"]

    if _companyName and request.method == "POST":
        id = mongo.db.company.insert_one(
            {
                "companyName": _companyName,
                "PhoneScreen": [],
                "Interview1": [],
                "Interview2": [],
                "Onsite": [],
                "Decision": [],
            }
        )
        resp = jsonify("Company added successfully!")
        resp.status_code = 200
        return resp
    else:
        return not_found()


@app.route("/addEmployee", methods=["PUT"])
def add_employee():
    _json = request.json
    _candidateName = _json["candidateName"]
    _stepName = _json["stepName"]
    _companyName = _json["companyName"]
    _jobProfile = _json["jobProfile"]

    # validate the received values
    if _companyName and _stepName and _candidateName and request.method == "PUT":
        id = mongo.db.company.update(
            {"companyName": _companyName},
            {
                "$push": {
                    _stepName: {
                        "candidateName": _candidateName,
                        "jobProfile": _jobProfile,
                    }
                }
            },
        )
        resp = jsonify("Candidate added successfully!")
        resp.status_code = 200
        return resp
    else:
        return not_found()


@app.route("/saveMovement", methods=["PUT"])
def save_movement():
    _json = request.json
    _companyName = _json["companyName"]
    _PhoneScreen = _json["PhoneScreen"]
    _Interview1 = _json["Interview1"]
    _Interview2 = _json["Interview2"]
    _Onsite = _json["Onsite"]
    _Decision = _json["Decision"]

    if _companyName and _PhoneScreen and _Interview1 and request.method == "PUT":
        id = mongo.db.company.update(
            {"companyName": _companyName},
            {
                "$set": {
                    "PhoneScreen": _PhoneScreen,
                    "Interview1": _Interview1,
                    "Interview2": _Interview2,
                    "Onsite": _Onsite,
                    "Decision": _Decision,
                }
            },
        )
        resp = jsonify("Moved successfully!")
        resp.status_code = 200
        return resp
    else:
        return not_found()


@app.errorhandler(404)
def not_found(error=None):
    message = {
        "status": 404,
        "message": "Not Found: " + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404

    return resp


if __name__ == "__main__":
    app.run()
