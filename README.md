![image](https://user-images.githubusercontent.com/9319710/50050249-ba8df900-00c3-11e9-99d1-e058f4eaa4d2.png)

# 663

> persisted nestable todo list with live-updating data

- Create a new top level item using the "new parent" button
- All items are clickable to reveal options to complete, edit, remove, change highlight color or add a child item
- Currently supports a single undo level using the button at the top of the page
- Supports real-time collaborative editing using [socket.io](https://socket.io/)

## Setup

```shell
$ npm install
```

```shell
$ docker-compose up
```

## Running

```shell
$ npm start
```

## License

[MIT](./LICENSE)

