# ticketswap-watch
This script check Ticketswap periodically for new ticket available on sale and gives notification on your computer.

This works with tickets that have variations in their ticket.

# How to use

- Pull the script
- Change your event url in the script.
- Run `node app.js`
- Profit!

# Optional stuff:

You can also change the check interval in the end of the file, currently this script run every `200000ms`. You can change this number but any lower number is not recomended since ticketswap has a anti robot system to prevent fetching. In this case you will have to visit their webpage and click `I am not a robot` for the script to work again.

# Contribution:

You are more than welcome to creat a PR if there's anything you want to add to this script.
