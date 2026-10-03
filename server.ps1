Add-Type -TypeDefinition @"
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

public class TinyServer {
    public static void Start(int port, string rootDir) {
        var listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:" + port + "/");
        listener.Start();
        Console.WriteLine("Native .NET Async Server running on http://localhost:" + port + "/");

        while (listener.IsListening) {
            try {
                var ctx = listener.GetContext();
                Task.Run(() => HandleRequest(ctx, rootDir));
            } catch {
                // Continue listening
            }
        }
    }

    private static void HandleRequest(HttpListenerContext ctx, string rootDir) {
        try {
            string raw = ctx.Request.RawUrl ?? "";
            if (string.IsNullOrWhiteSpace(raw) || raw == "/") raw = "/index.html";
            if (raw.Contains("?")) raw = raw.Substring(0, raw.IndexOf("?"));
            if (raw.Contains("#")) raw = raw.Substring(0, raw.IndexOf("#"));

            string clean = raw.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            string filePath = Path.Combine(rootDir, clean);

            if (!File.Exists(filePath)) {
                if (File.Exists(filePath + ".html")) {
                    filePath = filePath + ".html";
                } else {
                    filePath = Path.Combine(rootDir, "index.html");
                }
            }

            if (File.Exists(filePath)) {
                string ext = Path.GetExtension(filePath).ToLower();
                string mime = "text/plain; charset=utf-8";
                if (ext == ".html") mime = "text/html; charset=utf-8";
                else if (ext == ".css") mime = "text/css; charset=utf-8";
                else if (ext == ".js") mime = "application/javascript; charset=utf-8";
                else if (ext == ".png") mime = "image/png";
                else if (ext == ".jpg" || ext == ".jpeg") mime = "image/jpeg";
                else if (ext == ".svg") mime = "image/svg+xml";
                else if (ext == ".ico") mime = "image/x-icon";

                byte[] bytes = File.ReadAllBytes(filePath);
                ctx.Response.ContentType = mime;
                ctx.Response.ContentLength64 = bytes.Length;
                ctx.Response.StatusCode = 200;
                ctx.Response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                ctx.Response.OutputStream.Write(bytes, 0, bytes.Length);
            } else {
                ctx.Response.StatusCode = 404;
            }
        } catch {
        } finally {
            try { ctx.Response.Close(); } catch { }
        }
    }
}
"@

$port = 5000
$root = "C:\Users\vikas\.gemini\antigravity\scratch\digital-growth-agency"
[TinyServer]::Start($port, $root)
