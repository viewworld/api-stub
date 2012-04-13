# coding=utf-8

import json
import testdata

from flask import (
    Flask,
    abort,
    jsonify,
    render_template,
    request,
)
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test/app/')
@app.route('/test/app/<path:page>')
def test_app(page=None):
    return render_template('selleo/app.html'.format(page))

def error(msg, code=404):
    resp = jsonify(error=msg)
    resp.status_code = code
    return resp


@app.route('/forms',
           methods=['GET', 'POST', 'DELETE'])
def forms():
    if request.method == 'GET':
        return jsonify(forms=testdata.forms['list']) 
    elif request.method == 'POST':
        resp = jsonify(form=testdata.forms['single'])
        resp.status_code = 201
        return resp
    elif request.method == 'DELETE':
        # TODO: Delete multiple
        return '', 501

@app.route('/forms/<formid>',
           methods=['GET', 'PUT', 'DELETE'])
def form(formid):
    if formid != testdata.forms['single']['id']:
        return error('Form does not exist')

    if request.method == 'GET':
        return jsonify(**testdata.forms['single']) 
    elif request.method == 'PUT':
        return jsonify(**request.json)
    elif request.method == 'DELETE':
        return '', 204

@app.route('/forms/<formid>/reports',
           methods=['GET', 'POST', 'PUT', 'DELETE'])
def reports(formid):
    if formid != testdata.forms['single']['id']:
        return error('Form does not exist')

    if request.method == 'GET':
        return jsonify(reports=testdata.reports) 
    elif request.method == 'POST':
        resp = jsonify(**testdata.new_report)
        resp.status_code = 201
        return resp
    elif request.method == 'PUT':
        return '', 501
    elif request.method == 'DELETE':
        return '', 501

@app.route('/forms/<formid>/reports/<reportid>',
           methods=['GET', 'PUT', 'DELETE'])
def report(formid, reportid):
    if formid != testdata.forms['single']['id']:
        return error('Form does not exist')
    if reportid not in (r['id'] for r in testdata.reports):
        return error('Report does not exist')

    if request.method == 'GET':
        return jsonify(**[r for r in testdata.reports if r['id'] == reportid][0]) 
    elif request.method == 'PUT':
        return jsonify(**request.json)
    elif request.method == 'DELETE':
        return '', 204

@app.route('/collections',
           methods=['GET', 'POST'])
def collections():
    if request.method == 'GET':
        return jsonify(collections=testdata.collections['list']) 
    elif request.method == 'POST':
        resp = jsonify(**request.json)
        resp.status_code = 201
        return resp

@app.route('/collections/<collectionid>',
           methods=['GET', 'POST'])
def collection(collectionid):
    if collectionid != testdata.collections['single']['id']:
        return error('Collection does not exist')
    if request.method == 'GET':
        return jsonify(**testdata.collections['single']) 
    elif request.method == 'POST':
        return '', 501



if __name__ == '__main__':
    app.run(debug=True)


