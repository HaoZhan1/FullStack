import docker
import os
import shutil
import uuid

from docker.errors import APIError
from docker.errors import ContainerError
from docker.errors import ImageNotFound

CURRENT_DIR = os.path.dirname(os.path.relpath(__file__))
IMAGE_NAME = 'blutory/demo'
client = docker.from_env()

TEMP_BUILD_DIR = "%s/tmp/" % CURRENT_DIR
CONTAINER_NAME = "%s:latest" % IMAGE_NAME
SOURCE_FILE_NAMES = {
    "Java": "Example.java",
    "Python": "example.py"
}
BINARY_NAMES = {
    "Java": "Example",
    "Python": "example.py"
}
BUILD_COMMANDS = {
    "Java": "javac",
    "Python": "python3"
}
EXECUTE_COMMANDS = {
    "Java": "java",
    "Python": "python3"
}
def load_image():
    try:
        client.images.get(IMAGE_NAME)
        print('image exist!')
    except ImageNotFound:
        print('image not found locally, loading from docker')
        client.images.pull(IMAGE_NAME)
    except APIError:
        print('docker hub has error!')
        return
    print('image loaded')

#mkdir file
def make_dir(dir):
    try:
        os.mkdir(dir)
    except OSError:
        print("os failed.")

def build_and_run(code, lang):
    result = {'build': None, 'run': None, 'error': None}
    source_file_parent_dir_name = uuid.uuid4()
    source_file_host_dir = "%s/%s" % (TEMP_BUILD_DIR, source_file_parent_dir_name)
    source_file_guest_dir = "/test/%s" % (source_file_parent_dir_name)
    make_dir(source_file_host_dir)
    #write file
    with open("%s/%s" % (source_file_host_dir, SOURCE_FILE_NAMES[lang]), 'w') as source_file:
        source_file.write(code)
    #build
    try:
        client.containers.run(
            image = IMAGE_NAME,
            command = "%s %s" % (BUILD_COMMANDS[lang], SOURCE_FILE_NAMES[lang]),
            volumes = {source_file_host_dir: {'bind':source_file_guest_dir, 'mode':'rw'}},
            working_dir = source_file_guest_dir
        )
        print('source built')
        result['build'] = 'OK'
    except ContainerError as e:
        result['build'] = str(e.stderr, 'utf-8')
        shutil.rmtree(source_file_host_dir)
        return result
    #run
    try:
        log = client.containers.run(
            image = IMAGE_NAME,
            command = '%s %s' % (EXECUTE_COMMANDS[lang], BINARY_NAMES[lang]),
            volumes = {source_file_host_dir:{'bind': source_file_guest_dir, 'mode': 'rw'}},
            working_dir = source_file_guest_dir
        )
        log = str(log, 'utf-8')
        result['run'] = log
    except ContainerError as e:
        result['run'] = str(e.stderr, 'utf-8')
        shutil.rmtree(source_file_host_dir)
        return result
    #everyTime delete host folder
    shutil.rmtree(source_file_host_dir)
    return result
