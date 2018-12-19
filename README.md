# ticketswap-watch
This script check Ticketswap periodically for new ticket available on sale and gives notification on your computer.

This works with tickets that have variations in their ticket.

# How to use

- Pull the script
- Change your event url in the script.
- Install the required packages: `npm install co co-request cheerio lodash node-notifier child_process`
- Run `node app.js`
- Profit!

# You may also change:

**Windows users:**

Change `open` by `start` line 48: ```exec(`start ${url}`);```

**Linux users:**

Change `open` by `xdg-open` line 48: ```exec(`xdg-open ${url}`);```

This isn’t always installed, so make sure the `xdg-utils` package is installed (the name of the package is xdg-utils on at least Fedora, Debian, and Ubuntu; it may have a different name on some other distributions).

# Optional stuff:

You can also change the check interval in the end of the file, currently this script run every `600000ms`. You can change this number but any lower number is not recomended since ticketswap has a anti robot system to prevent fetching. In this case you will have to visit their webpage and click `I am not a robot` for the script to work again.

# Contribution:

You are more than welcome to creat a PR if there's anything you want to add to this script.
