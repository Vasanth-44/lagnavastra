import http.server
import socket
import os
import sys

PORT = 3000

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse path to strip query params and fragments
        clean_path = self.path.split('?')[0].split('#')[0]
        
        # Translate the URL path to a local file system path
        translated = self.translate_path(clean_path)
        
        # If the exact path does not exist and does not have an extension,
        # check if appending '.html' matches an existing file.
        if not os.path.exists(translated) and not os.path.splitext(clean_path)[1]:
            html_path = clean_path + '.html'
            translated_html = self.translate_path(html_path)
            if os.path.exists(translated_html):
                self.path = html_path + self.path[len(clean_path):]
                
        return super().do_GET()

class DualStackHTTPServer(http.server.HTTPServer):
    address_family = socket.AF_INET6
    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except Exception:
            pass
        super().server_bind()

# Ensure we print and flush so logs are available instantly
print(f"Starting server on port {PORT} with Clean URL support...", flush=True)
sys.stdout.flush()

try:
    with DualStackHTTPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}/", flush=True)
        sys.stdout.flush()
        httpd.serve_forever()
except Exception as e:
    print(f"Error starting server: {e}", file=sys.stderr, flush=True)
    sys.exit(1)
