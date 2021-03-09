# markdown-editor

## What is this?

This is, obviously, a markdown editor. It converts markdown notation to HTML.  
Its useful for writing markdown files like this README.md file as it will show how it actually gets rendered.

## But why?

I started working on this project while trying to get familiar with `nodejs`, back in 2013.

## How to run it?

If you want so, I would suggest to only use `docker`, with some help from `docker-compose`.
So you will need both installed on your machine.

You should also have cloned this repository and be in its root directory.

Then run:

```
docker-compose up
```

Use your browser to browse to `localhost` and you will then see the editor!

## How does it work

The "front-end" and "back-end" applications, utilize `WebSockets` to communicate.

Back then, WebSockets were not supported by all browsers and those who did, had versions widely used
that didn't. So, I created a "fallback" functionality that uses `AJAX` for the two applications to communicate.

For educational purposes, it was created to also spawn a `MongoDB` instance for storing the logs.

Have fun!

