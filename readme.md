# telegram js contest

<!-- > [enable-experimental-web-platform-features in chrome](chrome://flags/#enable-experimental-web-platform-features
) -->

### html -> UI

h1, h2

avatar-edit -> app-avatar

### DOM-Tree
```
body
  |> layout-loading
  |
  |> layout-login
  |   |> screen-login
  |   |> screen-confirm
  |   |> screen-register
  |   |> screen-password
  |
  |> layout-messenger
      |> layout-main
      |   |> layout-loading
      |   |
      |   |> layout-settings
      |   |   |> app-header
      |   |   |> screen-settings
      |   |   |> screen-general
      |   |   |> screen-preferences
      |   |   |> screen-notifications
      |   |   |> screen-security
      |   |   |> screen-language
      |   |
      |   |> layout-conversations
      |       |> app-header
      |       |> screen-conversations
      |       |   |> ui-list > app-conversation * n
      |       |   |> ui-drop > ui-fab + ui-menu
      |       |
      |       |> screen-contacts ?
      |       |   |> ui-list > app-contact * n
      |       |   |> ui-drop > ui-fab + ui-menu
      |       |
      |       |> screen-...
      |
      |> layout-conversation
          |> screen-empty
          |> screen-conversation
          |   |> app-header
          |   |> ui-list
          |   |   |> app-message * n
          |   |
          |   |> screen-field
          |       |> app-field
          |
          |> layout-sidebar
              |> layout-loading
              |> screen-sidebar
                  |> app-header
                  ...
          ...search
```

> в `layout-conversation/screen-conversation` нет `layout-loading` и не должно быть

### Router - роутинг дочерних компонент (todo: надо бы улучшить его)
```javascript
import Router from './script/ui/Router.js';

const router = new Router();

// добавить роуты компонент
router
  .route({
    name: 'layout-login',
    check: (route, location) => location === 'login'
  })
  .route({
    name: 'layout-loading',
    default: true
  });
// ...
// доп параметры
handler(...args) // если нужно создать компонент "ручками"
callback(element, ...args) // вызывается после перехода на роут

// запуск проверки и перехода на роут
router.check('login', ...args);

// всякое
Router.nameCheck(route, location)
Router.constructorHandler(constructor, skip = 1)
Router.callbackSkip(callback, skip = 2)

// @TODO:
// router.history
// .back(), .forward()
```

### Services (DI / Service Locator)

```javascript
import locator from './script/app/locator.js';

locator fields:
  config
  telegram
  channel
  storage
```

### Telegram
```javascript
// const Telegram = new Telegram(config);
const {telegram} = locator;

await telegram.init(); //result: telegram.connected === true

// методы
await telegram.method(name, data);
// data = {...primitives, constructive: {_: constructPredictate, ...args}}
// @exemple
data = {phone_number, api_id, api_hash, settings: {_: 'codeSettings'}};
const {phone_code_hash} = await telegram.method('auth.sendCode', data);

// события (как в channel, см ниже)
.on
.filter
.off
.once
// .update(type, filter, callback)

```

### Channel - шина событий / данных
```javascript
const {channel} = locator;

// dispatch
channel.send('event.name', {...args}); // обработка мгновенная
channel.async('event.name', {...args}, 100) // обработка в ближайшем task после cooldown

// handling
listener = channel.on('event.name', ({...args}) => {...});
listener = channel.filter('event.name', e => e.id === 1, ({...args}) => {...});
channel.off('event.name', listener);
channel.once('event.name', ({...args}) => {...});
// .onceFilter?
```

### Client - информация об окне браузера и тд
todo
