# coding=utf-8

import os
import json
import testdata

from flask import (
    Flask,
    abort,
    jsonify,
    make_response,
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

@app.route('/jst')
def jst():
    templates = {}
    for root, dirs, files in os.walk('templates/jst'):
        for file in (f for f in files if f.endswith('.html')):
            with open(os.path.join(root, file)) as fp:
                key = os.path.join(root[14:], os.path.splitext(file)[0])
                templates[key] = json.dumps(fp.read())
    resp = make_response(render_template('jst.js', templates=templates))
    resp.headers['Content-type'] = 'application/javascript'
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

@app.route('/groups',
           methods=['GET', 'POST'])
def groups():
    if request.method == 'GET':
        return jsonify(groups=testdata.groups['list'])
    elif request.method == 'POST':
        resp = jsonify(**request.json)
        resp.status_code = 200
        return resp

@app.route('/groups/<groupid>',
           methods=['GET', 'PUT', 'DELETE'])
def group(groupid):
    if not int(groupid) in map(ids, testdata.groups['list']):
        return error('Group does not exist')
    if request.method == 'GET':
        return jsonify(group=testdata.groups['list'][int(groupid)-1])
    elif request.method == 'DELETE':
        return '', 200
    elif request.method == 'PUT':
        resp = jsonify(**request.json)
        resp.status_code = 200
        return resp

def ids(object):
    return object['id']

if __name__ == '__main__':
    app.run(debug=True)


