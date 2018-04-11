# How to open your local application globally using ngrok

* Run your app as usual:

    npm run dev

* Download ngrok here:

    https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-windows-386.zip

* Extract ngrok.exe anywhere, run it and type:

    ngrok http --host-header=rewrite 8080

    or (if it doesn't work)

    ngrok http 8080 -host-header="localhost:8080"

* You'll see something like this:

Session Status                online
Version                       2.2.8
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://01411e8a.ngrok.io -> localhost:8080
Forwarding                    https://01411e8a.ngrok.io -> localhost:8080

Use the forwarding HTTPS URL to access your machine from anywhere :-)