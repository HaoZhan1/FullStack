import json
from flask import Flask
app = Flask(__name__)
from flask import jsonify
from flask import request
import executor_utils as eu

@app.route('/')
def hello():
    return 'hello world'

@app.route('/result', methods=['POST'])
def build_and_run():
    data = request.get_json()
    if 'usercode' not in data or 'language' not in data:
       return 'You should provide "code" and "language"'
    code = data['usercode']
    lang = data['language']
    print("API get called with code: %s in %s" % (code, lang))
    result = eu.build_and_run(code, lang)
    return jsonify(result)


if __name__ == '__main__':
    import sys
    port = int(sys.argv[1])
    eu.load_image()
    app.run(port = port)