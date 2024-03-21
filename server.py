
import os, json, base64
import cherrypy
from time import sleep
from threading import Thread
from utillc import *
import requests
from xml.etree import ElementTree
from urllib.parse import urlparse

EKO()
class Task(object):
    def __init__(self, interval=1):
        self.interval = interval
        thread = Thread(target=self.run, args=())
        thread.daemon = True                            # Daemonize thread
        thread.start()                                  # Start the execution

    def run(self):
        """ Method that runs forever """
        while True:
            # Do something
            sleep(self.interval)

class HelloWorld(object):

    def __init__(self) :
        self.out = open("test.webm", "ab")
    
    @cherrypy.expose
    def read_chunk() :
        EKO()
        return json.dumps({"a" : 1})
    
    @cherrypy.expose
    def chunk(self, data=None) :
        #EKOX(data);
        try :
            body = cherrypy.request.body.read()
            #EKOX(body);
            c = json.loads(body)
            d = c["chunk"]
            EKOX(len(d))
            e = base64.b64decode(d)
            self.out.write(e)
        except Exception as e :
            EKOX(e)
        return json.dumps({"a" : 1})
        
    
    @cherrypy.expose
    def log(self, data=None) :
        p = urlparse(data);
        rp = os.path.relpath(p.path, start = "/")
        print(rp)

        
    @cherrypy.expose
    def index(self):
        return "Hello World!"

            
task = Task()

def ff() :
    PATH = os.path.abspath(os.path.dirname(__file__))
    class Root(object): pass
    
    conf = {
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.on': True,
            'tools.staticdir.dir': PATH,
            'tools.staticdir.index': 'server.html'
        }
    }


    #cherrypy.config.update({'server.socket_host': '192.168.1.27'})
    #cherrypy.config.update({ "server.logToScreen" : False })
    #cherrypy.config.update({'log.screen': False})
    cherrypy.config.update({'server.socket_port': 9696})
    cherrypy.quickstart(HelloWorld(), "/", conf)

if __name__ == "__main__" :
    ff()
