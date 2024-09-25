# thanks chatgpt

import http.server
import socketserver

# Define the port you want to serve on
PORT = 8000

# Define the directory to serve (can be absolute or relative)
DIRECTORY = "./site/"

# Create a custom handler that serves files from the specified directory
class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

# Create an HTTP server and bind it to the specified port
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving static site at http://localhost:{PORT}")
    httpd.serve_forever()