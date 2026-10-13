#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Serve this folder over HTTP — required because browsers block ES modules
and WebGL texture loading from file://.

Usage:
    python serve.py            # http://localhost:8080
    PORT=9000 python serve.py  # custom port

Open http://localhost:8080 on this computer, or http://<this-computer-ip>:8080
from a phone on the same Wi-Fi (that is the H5 test).
"""
import http.server
import os
import socketserver

PORT = int(os.environ.get('PORT', '8080'))


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'text/javascript',
        '.mjs': 'text/javascript',
        '.wasm': 'application/wasm',
        '.glb': 'model/gltf-binary',
        '.bin': 'application/octet-stream',
        '.woff2': 'font/woff2',
    }

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    import socket

    with Server(('0.0.0.0', PORT), Handler) as httpd:
        try:
            ip = socket.gethostbyname(socket.gethostname())
        except OSError:
            ip = '<this-computer-ip>'
        print('Serving this folder at:')
        print('  this computer : http://localhost:%d' % PORT)
        print('  phone / LAN   : http://%s:%d  (same Wi-Fi)' % (ip, PORT))
        print('Ctrl+C to stop.')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nStopped.')
